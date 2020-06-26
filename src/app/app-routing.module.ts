import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LeadersComponent } from './leaders/leaders.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInTo(['retreat'])) },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'leaders', component: LeadersComponent, ...canActivate(redirectUnauthorizedTo(['login'])) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

export const routeNames = [
  { path: '/login', label: '로그인', icon: 'account_circle' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
