import { Component, OnInit } from '@angular/core';
import { RockService, RetreatResume } from 'src/app/rock.service';
import { Router } from '@angular/router';
import { routeNames } from 'src/app/app-routing.module';
import { retreatRouteNames } from '../retreat-routing.module';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { map, concatAll, pluck } from 'rxjs/operators';
import { zip, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retreat-register',
  templateUrl: './retreat-register.component.html',
  styleUrls: ['./retreat-register.component.css']
})
export class RetreatRegisterComponent implements OnInit {
  readonly routes = routeNames.concat(retreatRouteNames);
  loggedIn = this._service.loggedIn;
  private _uid = this._service.MyInfo.pipe(pluck('uid'));
  myInfo = this._service.MyInfo;
  form = this._builder.group({
    retreat_gbs: ['', Validators.required],
    position: ['', Validators.required],
    gbs: ['', Validators.required],
    lecture: [''],
    attendAll: [false],
    dayTime: this._builder.group({
      D1: [false], D2: [false], D3: [false]
    }),
  });
  retreatRegistered = this._service.retreatRegistered;
  registerSucceeded = false;
  registerInProgress = false;
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
    { period: '참석 여부', first: 'D1', second: 'D2', third: 'D3' },
  ];

  readonly dayTimeMaps = {
    'D1': ['D1_T1', 'D1_T2', 'D1_T3', 'D1_T4'],
    'D2': ['D2_T1', 'D2_T2', 'D2_T3', 'D2_T4'],
    'D3': ['D3_T1', 'D3_T2', 'D3_T3', 'D3_T4'],
    'D4': ['D4_T1', 'D4_T2', 'D4_T3', 'D4_T4'],
  };

  constructor(private _service: RockService, private _router: Router, private _snackbar: MatSnackBar, private _builder: FormBuilder) {}
  
  ngOnInit() {
    this.myInfo.subscribe((info) => {
      if(RockService.nonNull(info.gbsInfo) && RockService.nonNull(info.retreatInfo)) {
        this.form.get('position').setValue(info.retreatInfo.position);
        this.form.get('retreat_gbs').setValue(info.retreatInfo.gbs);
        this.form.get('gbs').setValue(info.gbsInfo.gbs);
        this.form.get('gbs').disable();
        this.form.get('attendAll').setValue(info.retreatInfo.attendAll);
        let dt = this.form.get('dayTime') as FormGroup;
        let days = info.retreatInfo.dayTimeList.reduce((prev, curr) => Object.keys(this.dayTimeMaps).findIndex(day => curr.includes(day)) != -1 ? [...prev, Object.keys(this.dayTimeMaps).find(day => curr.includes(day))] : prev, []);
        Object.entries(dt.controls).forEach(([name, control]) => { if(days.includes(name) || info.retreatInfo.attendAll) control.setValue(true); });
      } else {
        this.form.get('gbs').setValue('');
        this.form.get('gbs').enable();
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
    if(this.form.valid) {
      this.registerInProgress = true;
      const registeredOrEdited = zip(this.retreatRegistered, this._uid).pipe(map(([r, uid]) => {
        let dt = this.form.get('dayTime') as FormGroup;
        //if(!r && !this.ValidateDayTime(this.form)) return of(false);
        //if(this.form.invalid) return of(false);
        const resume: RetreatResume = {
          memberUid: uid,
          retreatGbs: this.form.get('retreat_gbs').value,
          position: this.form.get('position').value,
          originalGbs: r ? undefined : this.form.get('gbs').value,
          lectureHope: r ? undefined : this.form.get('lecture').value,
          attendType: 'GBS',
          attendAll: Object.values(dt.controls).every(c => c.value),
          dayTimeList: Object.values(dt.controls).every(c => c.value) ? null
          : Object.entries(dt.controls).reduce((prev, [name, control]) => control.value ? [...prev, ...this.dayTimeMaps[name]] : prev, []),
        };
        if(!environment.production) { console.log(JSON.stringify(resume)); }
        return r ? this._service.editRetreat(resume) : this._service.registerRetreat(resume);
      }), concatAll());
      zip(registeredOrEdited, this.retreatRegistered).subscribe(([registered, already]) => {
        this.registerSucceeded = registered;
        if (registered) {
          this._service.openDefault(this._snackbar, `수련회 ${already ? '수정' : '등록'}을 완료했습니다.`);
        } else {
          this._service.openDefault(this._snackbar, `수련회 ${already ? '수정' : '등록'}을 실패했습니다.`);
        }
      });
      this.registerInProgress = false;
    }
  }
}
