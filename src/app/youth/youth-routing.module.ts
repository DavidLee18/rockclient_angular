import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YouthComponent } from './youth/youth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DiscardChangeGuard } from "../discard-change.guard";
import { AuthGuard } from "../auth.guard";

const youthRoutes: Routes = [
  { path: 'youth', component: YouthComponent, children: [
    { path: 'sign-up', component: SignUpComponent, canDeactivate: [DiscardChangeGuard] },
    { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(youthRoutes)],
  exports: [RouterModule]
})
export class YouthRoutingModule { }
