import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YouthComponent } from './youth/youth.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DiscardChangeGuard } from "../discard-change.guard";
import { AuthGuard } from "../auth.guard";

const youthRoutes: Routes = [
  { path: 'youth', component: YouthComponent, children: [
    { path: 'login', component: LoginComponent, },
    { path: 'sign-up', component: SignUpComponent, canDeactivate: [DiscardChangeGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  ] },
];

export const youthRouteNames = [
  { path: '/youth/login', icon: 'account_circle', label: '청년부 로그인' },
  { path: '/youth/sign-up', icon: '', label: '청년부 회원가입' },
];

@NgModule({
  imports: [RouterModule.forChild(youthRoutes)],
  exports: [RouterModule]
})
export class YouthRoutingModule { }
