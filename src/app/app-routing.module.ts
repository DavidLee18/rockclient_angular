import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LeadersComponent } from './leaders/leaders.component';
import { AuthGuard } from "src/app/auth.guard";
import { DiscardChangeGuard } from './discard-change.guard';
import { SemiSignUpComponent } from './semi-sign-up/semi-sign-up.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canDeactivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canDeactivate: [DiscardChangeGuard] },
  { path: 'semi-sign-up', component: SemiSignUpComponent, canDeactivate: [DiscardChangeGuard] },
  { path: 'leaders', component: LeadersComponent, canActivate: [AuthGuard], data: {names: ['나진환', '이재현', '김다인', '유상건', '김진석']} },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

export const basicRouteNames = [
  { path: '/login', label: '로그인', icon: 'account_circle' },
  { path: '/semi-sign-up', label: '준회원 등록', icon: 'person_add' }, //TODO: 안먹힘...
];

export const leadersRouteNames = [
  { path: '/leaders', label: '리더 관리', icon: 'people' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
