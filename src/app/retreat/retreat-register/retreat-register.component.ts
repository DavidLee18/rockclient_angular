import { Component, OnInit } from '@angular/core';
import { RockService, RetreatResume } from 'src/app/rock.service';
import { Router } from '@angular/router';
import { routeNames } from 'src/app/app-routing.module';
import { retreatRouteNames } from '../retreat-routing.module';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { map, concatAll, pluck } from 'rxjs/operators';
import { zip, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    lecture: [''],
    attendAll: [false],
    dayTime: this._builder.group({
      D1_T1: [false], D1_T2: [false], D1_T3: [false], D1_T4: [false],
      D2_T1: [false], D2_T2: [false], D2_T3: [false], D2_T4: [false],
      D3_T1: [false], D3_T2: [false], D3_T3: [false], D3_T4: [false],
      D4_T1: [false], D4_T2: [false], D4_T3: [false], D4_T4: [false],
    }),
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
  dayTimes = [
    { period: '아침', first: 'D1_T1', second: 'D2_T1', third: 'D3_T1', fourth: 'D4_T1' },
    { period: '점심', first: 'D1_T2', second: 'D2_T2', third: 'D3_T2', fourth: 'D4_T2' },
    { period: '저녁', first: 'D1_T3', second: 'D2_T3', third: 'D3_T3', fourth: 'D4_T3' },
    { period: '숙박', first: 'D1_T4', second: 'D2_T4', third: 'D3_T4', fourth: 'D4_T4' },
  ];

  constructor(private _service: RockService, private _router: Router, private _snackbar: MatSnackBar, private _builder: FormBuilder) {}
  
  ngOnInit() {
    this._service.MyInfo.subscribe((info) => {
      if(RockService.nonNull(info.gbsInfo) && RockService.nonNull(info.retreatGbsInfo)) {
        this.form.get('position').setValue(info.retreatGbsInfo.position);
        this.form.get('retreat_gbs').setValue(info.retreatGbsInfo.gbs);
        this.form.get('gbs').setValue(info.gbsInfo.gbs);
        this.form.get('gbs').disable();
        this.form.get('attendAll').disable();
        this.form.get('dayTime').disable();
      } else {
        this.form.get('gbs').setValue('');
        this.form.get('gbs').enable();
        this.form.get('attendAll').enable();
        this.form.get('dayTime').enable();
      }
    });
  }

  validify = () => this.form.updateValueAndValidity();

  get ValidateDayTime() : (arg0: AbstractControl) => boolean {
    return (control: AbstractControl) => {
      let dt = control.get('dayTime') as FormGroup;
      let attendAll = control.get('attendAll');
      if (Object.values(dt.controls).some(c => c.value)) {
        attendAll.setErrors(null); return true;
      } else {
        attendAll.setErrors({invalid: true}); return false;
      }
    };
  }

  check(checked: boolean, name: string) {
    let dt = this.form.get('dayTime') as FormGroup;
    const notAll = Object.values(dt.controls).some(c => !c.value);
    const rest = Object.entries(dt.controls).filter(([n, _]) => n != name).every(c => c[1].value);
    if(notAll || !checked) this.form.get('attendAll').setValue(false);
    else if(rest && checked) this.form.get('attendAll').setValue(true);
  }

  onToggled(checked: boolean) {
    let dt = this.form.get('dayTime') as FormGroup;
    Object.values(dt.controls).forEach(c => c.setValue(checked));
  }

  logout() { this._service.logout(); this._router.navigateByUrl('/login'); }

  submit() {
    const registeredOrEdited = zip(this.retreatRegistered, this._uid).pipe(map(([r, uid]) => {
      let dt = this.form.get('dayTime') as FormGroup;
      if(!r) {
        if(!this.ValidateDayTime(this.form)) return of(false);
      }
      else if(this.form.invalid) return of(false);
      const resume: RetreatResume = {
        memberUid: uid,
        retreatGbs: this.form.get('retreat_gbs').value,
        position: this.form.get('position').value,
        originalGbs: r ? undefined : this.form.get('gbs').value,
        lectureHope: r ? undefined : this.form.get('lecture').value,
        attendAll: r ? undefined : Object.values(dt.controls).every(c => c.value),
        dayTimeList: r ? undefined : Object.values(dt.controls).every(c => c.value) ? null
        : Object.entries(dt.controls).reduce((prev, [name, control]) => control.value ? [...prev, name] : prev, []),
      };
      console.log(JSON.stringify(resume));
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
