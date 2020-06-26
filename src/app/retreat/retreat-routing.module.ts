import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';
import { RetreatComponent } from './retreat.component';
import { canActivate, redirectUnauthorizedTo } from "@angular/fire/auth-guard";
import { RetreatInfoComponent } from './retreat-info/retreat-info.component';
import { RetreatStatisticsComponent } from './retreat-statistics/retreat-statistics.component';
import { RetreatRegisterComponent } from './retreat-register/retreat-register.component';

const retreatRoutes: Routes = [{
  path: 'retreat', component: RetreatComponent, ...canActivate(redirectUnauthorizedTo(['login'])),
  children: [
    { path: '', component: RetreatInfoComponent, },
    { path: 'statistics', component: RetreatStatisticsComponent, },
    { path: 'register', component: RetreatRegisterComponent, },
  ]
}];

export const retreatRouteNames = [
  { path: '/retreat', label: '수련회 정보', icon: 'info' },
  { path: '/retreat/statistics', label: '수련회 통계', icon: 'analytics' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(retreatRoutes)
  ],
  exports: [RouterModule]
})
export class RetreatRoutingModule { }
