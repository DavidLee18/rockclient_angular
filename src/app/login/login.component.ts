import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { RockService } from '../rock.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { routeNames } from '../app-routing.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', Validators.required),
  });

  loggedIn: boolean;

  readonly routes = routeNames;

  constructor(private _bSheet: MatBottomSheet, private _service: RockService, private _router: Router) {
    this._service.loggedIn.subscribe((loggedIn) => { this.loggedIn = loggedIn; if(loggedIn) { this._router.navigateByUrl('/retreat'); } });
  }

  openSheet() { this._bSheet.open(LoginBottomSheet); }

  login(email: string, pass: string) { this._service.login(email, pass); }

  logout = () => this._service.logout();
}

@Component({
  template: `
  <h4>
    계정으로 등록한 e-mail을 입력하세요. 입력한 e-mail로 비밀번호 재설정 e-mail이 전송됩니다.
  </h4>
  <mat-form-field appearance="fill">
    <mat-label>e-mail 주소</mat-label>
    <input matInput type="email" #input>
  </mat-form-field>
  <button mat-raised-button (click)="send(input.value)">전송</button>
  `,
  styles: [
    'h4, mat-form-field, button { margin: 8px; }',
  ]
})
export class LoginBottomSheet {
  constructor(private _sheetRef: MatBottomSheetRef<LoginBottomSheet>, private _service: RockService, private _snackBar: MatSnackBar) {}

  send(email: string) {
    this._sheetRef.dismiss();
    this._service.sendEmail(email).then(() =>
      this._snackBar.open('e-mail을 전송했습니다', undefined, {
        duration: 3000,
        horizontalPosition: 'start'
      }));
  }
}
