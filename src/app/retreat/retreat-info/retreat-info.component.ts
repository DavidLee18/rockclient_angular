import { Component, OnInit } from '@angular/core';
import { routeNames } from 'src/app/app-routing.module';
import { retreatRouteNames } from '../retreat-routing.module';
import { RockService, Info } from 'src/app/rock.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retreat-info',
  templateUrl: './retreat-info.component.html',
  styleUrls: ['./retreat-info.component.css']
})
export class RetreatInfoComponent implements OnInit {

  readonly routes = routeNames.concat(retreatRouteNames);

  readonly info: Observable<Info>;
  loggedIn: boolean

  constructor(private _service: RockService, private _router: Router) {
    this.info = _service.MyInfo;
    this._service.loggedIn.subscribe((val) => this.loggedIn = val);
  }

  ngOnInit() {}

  logout() { this._service.logout(); this._router.navigateByUrl('/login'); }

  register() { this._router.navigateByUrl("/retreat/register"); }

}
