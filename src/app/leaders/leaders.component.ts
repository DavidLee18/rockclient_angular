import { Component, OnInit } from '@angular/core';
import { RockService } from '../rock.service';
import { Router } from '@angular/router';
import { basicRouteNames } from '../app-routing.module';
import { retreatRouteNames } from '../retreat/retreat-routing.module';
import { map, concatAll, startWith, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.css']
})
export class LeadersComponent implements OnInit {
  readonly campuses = [
    "강변", "강북", "강원",
    "남서울", "대학로", "서바다",
    "신촌", "인성경", "인천",
    "천안", "필레오", "해외캠퍼스",
    "예배당", "새내기", "중등부",
  ];
  loggedIn = this._service.loggedIn;
  readonly routes = basicRouteNames.concat(retreatRouteNames);
  leaders = this._service.Leaders.pipe(map(l => l.data));
  selectedCampus = '';

  constructor(private _service: RockService, private _router: Router, private _snackbar: MatSnackBar, private _bSheet: MatBottomSheet) {}

  ngOnInit() {}

  logout() { this._service.logout(); this._router.navigateByUrl('/login'); }

  openBSheet = () => this._bSheet.open(MemberSearchBottomSheet);

  reloadLeaders() { this.leaders = null; this.leaders = this._service.Leaders.pipe(map(l => l.data)); }

  removeCampus(id: number, campusToDelete: string, origin: string[]) {
    const deleted = origin.filter(c => c != campusToDelete);
    this._service.editCampuses(id, deleted).subscribe(removed => {
      if(removed) {
        this._service.openDefault(this._snackbar, `${campusToDelete} 삭제 완료`);
        this.reloadLeaders();
      }
      else this._service.openDefault(this._snackbar, `${campusToDelete} 삭제 실패`);
    });
  }

  addCampus(id: number, toAdd: string, origin: string[]) {
    if(this.campuses.includes(toAdd)) {
      const added = [...origin, toAdd];
      this._service.editCampuses(id, added).subscribe(pushed => {
        if(pushed) {
          this._service.openDefault(this._snackbar, `${toAdd} 추가 완료`);
          this.reloadLeaders();
        }
        else this._service.openDefault(this._snackbar, `${toAdd} 추가 실패`);
      });
    }
  }

  unsetLeader(id: number) {
    this._service.unsetLeader(id).subscribe(unset => {
      if(unset) {
        this._service.openDefault(this._snackbar, '리더 삭제 완료');
        this.reloadLeaders();
      }
      else this._service.openDefault(this._snackbar, '리더 삭제 실패');
    });
  }
}

@Component({
  template: `
    <mat-form-field apperance="fill">
      <mat-label>리더로 추가할 멤버 검색</mat-label>
      <input type="text" matInput [formControl]="form">
    </mat-form-field>
    <mat-card *ngFor="let searched of searchedOnes | async">
      <mat-card-header>
        <mat-card-title>{{searched?.name}}</mat-card-title>
        <mat-card-subtitle>{{searched?.mobile}}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item>멤버 ID: {{searched?.id}}</mat-list-item>
          <mat-list-item>생년월일: {{searched?.dt_birth | date:'longDate'}}</mat-list-item>
          <mat-list-item>캠퍼스: {{searched?.campus}}</mat-list-item>
          <mat-list-item>{{searched?.active ? '활성화됨' : '비활성화됨'}}</mat-list-item>
        </mat-list>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="setLeader(searched.id)">리더로 설정</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class MemberSearchBottomSheet {
  form = new FormControl('');

  constructor(private _service: RockService, private _snackbar: MatSnackBar, private _router: Router, private _bSheetRef: MatBottomSheetRef) {}

  get searchedOnes() {
    return this.form.valueChanges.pipe(map(this._service.members), concatAll(), tap(x => console.log(JSON.stringify(x))));
  }

  setLeader(memId: number) {
    return this._service.setLeader(memId).subscribe(leaderSet => {
      if(leaderSet) {
        this._service.openDefault(this._snackbar, '리더 추가 완료');
        this.reloadLeaders();
      }
      else this._service.openDefault(this._snackbar, '리더 추가 실패');
    });
  }
  reloadLeaders() {
    this._router.onSameUrlNavigation = "reload";
    this._router.navigateByUrl('/leaders');
  }
}