import { Component, OnInit } from '@angular/core';
import { RockService } from '../../rock.service';
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
    pasture: ['', Validators.required],
    address: ['', Validators.required],
  }, { validators: [this.passAgain] });

  readonly routes = this._service.routeNames;
  passVisible = false; passAgainVisible = false;
  signUpInProgress = false;
  toSubmit = false;

  readonly pastures = [1, 2, 3, 4, 5, 6, 7, 8];

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
      this._service.youthSignUp({
        email: this.form.get('email').value,
        password: this.form.get('pass').value,
        name: this.form.get('name').value,
        mobile: this.form.get('mobile').value,
        birthDate: this.form.get('birthDate').value,
        sex: this.form.get('sex').value,
        address: this.form.get('address').value,
        team: this.form.get('pasture').value,
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
