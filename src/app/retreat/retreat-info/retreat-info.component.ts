import { Component, OnInit } from '@angular/core';
import { basicRouteNames, leadersRouteNames } from 'src/app/app-routing.module';
import { retreatRouteNames } from '../retreat-routing.module';
import { RockService, Info, Grade } from 'src/app/rock.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retreat-info',
  templateUrl: './retreat-info.component.html',
  styleUrls: ['./retreat-info.component.css']
})
export class RetreatInfoComponent implements OnInit {

  
  public get routes() {
    return this.isLeader ? basicRouteNames.concat(retreatRouteNames) : basicRouteNames.concat(retreatRouteNames, leadersRouteNames);
  }

  readonly info: Observable<Info>;
  loggedIn: boolean;
  isLeader = false;
  already = this._service.retreatRegistered;
  readonly dayTimes = [
    { period: '참석 여부', first: 'D1', second: 'D2', third: 'D3' },
  ];

  constructor(private _service: RockService, private _router: Router) {
    this.info = _service.MyInfo.pipe(tap(info => {
      if(!environment.production) console.log(JSON.stringify(info));
      this.isLeader = info.grade != Grade.member;
    }));
    this._service.loggedIn.subscribe((val) => this.loggedIn = val);
  }

  isOnDay(dayTimes: string[], day: string) {
    return dayTimes.some(d => d.includes(day));
  }

  ngOnInit() {}

  logout() { this._service.logout(); this._router.navigateByUrl('/login'); }

  register() { this._router.navigateByUrl("/retreat/register"); }

  nonNull = (obj) => RockService.nonNull(obj);

}
