import { Component, OnInit } from '@angular/core';
import { RockService, RetreatResume } from '../../rock.service';
import { Router } from '@angular/router';
import { routeNames } from '../../app-routing.module';
import { retreatRouteNames } from '../retreat-routing.module';
import { FormBuilder, Validators } from '@angular/forms';
import { map, concatAll, pluck } from 'rxjs/operators';
import { zip } from 'rxjs';

@Component({
  selector: 'app-retreat-register',
  templateUrl: './retreat-register.component.html',
  styleUrls: ['./retreat-register.component.css']
})
export class RetreatRegisterComponent implements OnInit {
  readonly routes = routeNames.concat(retreatRouteNames);
  loggedIn = this._service.loggedIn;
  private _uid = this._service.MyInfo.pipe(pluck('uid'));
  form = this._builder.group({
    retreat_gbs: ['', Validators.required],
    position: ['', Validators.required],
    gbs: ['', Validators.required],
    lecture: ['', Validators.required],
  });
  retreatRegistered = this._service.retreatRegistered;
  readonly lectures = [
    "성락교회 캠퍼스 베뢰아의 사명",
    "성장 그리고 사명",
    "베뢰아 운동의 동역자",
    "베뢰아인의 삶과 세상에서의 우리",
  ];
  readonly retreat_gbses = [
    "A", "새내기", "C", "D",
    "E", "F", "J",
    "OJ", "EN", "자모GBS",
    "STAFF",
  ];
  readonly positions = ["조원", "부조장", "조장", "봉사자"];
  readonly gbses = [
    "칼리지베이직", "마태칼리지", "마가칼리지",
    "누가칼리지", "요한칼리지", "바울칼리지",
    "칼리지플러스", "새친구", "예비교사",
    "없음",
  ];

  constructor(private _service: RockService, private _router: Router, private _snackbar: MatSnackBar, private _builder: FormBuilder) {}

  ngOnInit() {
    this._service.MyInfo.subscribe((info) => {
      if(RockService.nonNull(info.gbsInfo) && RockService.nonNull(info.retreatGbsInfo)) {
        this.form.get('position').setValue(info.retreatGbsInfo.position);
        this.form.get('position').disable();
        this.form.get('retreat_gbs').setValue(info.retreatGbsInfo.gbs);
        this.form.get('retreat_gbs').disable();
        this.form.get('gbs').setValue(info.gbsInfo.gbs);
        this.form.get('gbs').disable();
      }
    });
  }

  logout() { this._service.logout(); this._router.navigateByUrl('/login'); }

  submit() {
    const registeredOrEdited = zip(this.retreatRegistered, this._uid).pipe(map(([r, uid]) => {
      const resume: RetreatResume = {
        memberUid: uid,
        retreatGbs: this.form.get('retreat_gbs').value,
        position: this.form.get('position').value,
        originalGbs: r ? undefined : this.form.get('gbs').value,
        lectureHope: r ? undefined : this.form.get('lecture').value,
        attendAll: undefined,
        dayTimeList: undefined,
      };
      return r ? this._service.editRetreat(resume) : this._service.registerRetreat(resume);
    }), concatAll());
    zip(registeredOrEdited, this.retreatRegistered).subscribe(([registered, already]) => {
      if (registered) {
        this._service.openDefault(this._snackbar, `수련회 ${already ? '수정' : '등록'}을 완료했습니다.`);
      } else {
        this._service.openDefault(this._snackbar, `수련회 ${already ? '수정' : '등록'}을 실패했습니다.`);
      }
    });
  }
}
