import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { basicRouteNames } from '../app-routing.module';
import { RockService } from '../rock.service';

@Component({
  selector: 'app-semi-sign-up',
  templateUrl: './semi-sign-up.component.html',
  styleUrls: ['./semi-sign-up.component.css']
})
export class SemiSignUpComponent {
  nameForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  mobileForm = new FormGroup({
    mobile: new FormControl('', [Validators.required, Validators.pattern(/^\d{9,11}$/)]),
  });

  campusForm = new FormGroup({
    campus: new FormControl('', [Validators.required]),
  });

  loggedIn = false;
  signedUp = false;

  readonly campuses = [
    '강변', '강북', '강원', 
    '남서울', '대학로', '서바다', 
    '신촌', '인성경', '인천', 
    '천안', '필레오', '해외캠퍼스', 
    '새내기', '예배당', '중등부',
  ];

  readonly routes = basicRouteNames;

  constructor(private _service: RockService) {}

  logout() { this._service.logout(); }

  signUp() {
    if(this.nameForm.invalid || this.mobileForm.invalid || this.campusForm.invalid) return;
    if(!environment.production) return;
    this._service.semiSignUp({
      name: this.nameForm.get('name').value,
      mobile: this.mobileForm.get('mobile').value,
      campus: this.campusForm.get('campus').value,
    }).subscribe(done => { this.signedUp = done; });
  }
}
