import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LeadersComponent } from './leaders/leaders.component';
import { AuthGuard } from "src/app/auth.guard";
import { DiscardChangeGuard } from './discard-change.guard';
import { SemiSignUpComponent } from './semi-sign-up/semi-sign-up.component';
import { Grade } from './rock.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canDeactivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canDeactivate: [DiscardChangeGuard] },
  { path: 'semi-sign-up', component: SemiSignUpComponent, canDeactivate: [DiscardChangeGuard], canActivate: [AuthGuard], data: { grade: Grade.assistant } },
  { path: 'leaders', component: LeadersComponent, canActivate: [AuthGuard], data: {names: ['나진환', '이재현', '김다인', '유상건', '김진석']} },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
