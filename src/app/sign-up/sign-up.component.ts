import { Component, OnInit } from '@angular/core';
import { RockService } from '../rock.service';
import { basicRouteNames } from '../app-routing.module';
import { FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form = this._builder.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    pass: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    passAgain: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    name: ['', Validators.required],
    mobile: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{9,11}$/)])],
    birthDate: ['', Validators.required],
    sex: ['', Validators.required],
    campus: ['', Validators.required],
    address: ['', Validators.required],
    school: ['', Validators.required],
    major: ['', Validators.required],
    grade: ['', Validators.required],
    guide: [''],
  }, { validators: [this.passAgain] });

  readonly routes = basicRouteNames;
  passVisible = false; passAgainVisible = false;
  signUpInProgress = false;
  toSubmit = false;

  readonly campuses = [
    '강변', '강북', '강원', 
    '남서울', '대학로', '서바다', 
    '신촌', '인성경', '인천', 
    '천안', '필레오', '해외캠퍼스', 
    '새내기', '예배당', '중등부',
  ];
  readonly grades = [
    '1학년', '2학년', '3학년',
    '4학년', '대학원', '졸업생',
  ];

  constructor(
    private _service: RockService,
    private _builder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router
  ) {}
  
  get passAgain(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.get('pass').value.trim() != "" && control.get('pass').value != control.get('passAgain').value) {
        control.get('passAgain').setErrors({ different: true });
      }
      return null;
    };
  }

  ngOnInit() {}

  signUp() {
    if(this.toSubmit) {
      this.signUpInProgress = true;
      this._service.signUp({
        email: this.form.get('email').value,
        password: this.form.get('pass').value,
        name: this.form.get('name').value,
        mobile: this.form.get('mobile').value,
        birthDate: this.form.get('birthDate').value,
        sex: this.form.get('sex').value,
        campus: this.form.get('campus').value,
        address: this.form.get('address').value,
        school: this.form.get('school').value,
        major: this.form.get('major').value,
        grade: this.form.get('grade').value,
        guide: this.form.get('guide').value,
      }).subscribe(signedUp => {
        if (signedUp) {
          let ref = this._service.openDefault(this._snackBar, '회원가입에 성공했습니다.', '로그인하기');
          ref.onAction().subscribe(() => { this._router.navigateByUrl('/login'); });
        } else this._service.openDefault(this._snackBar, '회원가입에 실패했습니다.');
      });
      this.signUpInProgress = false;
    }
  }

}
