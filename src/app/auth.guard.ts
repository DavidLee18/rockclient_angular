import { Injectable, Component } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RockService } from './rock.service';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<any>, CanLoad {

  constructor(private _service: RockService, private _router: Router, private _dialog: MatDialog) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(next.data && next.data.names) return this._service.MyInfo.pipe(map(info => next.data.names.includes(info.name)));
    return this._service.loggedIn.pipe(map(l => {
      if(l) return true;
      else {
        this._dialog.open(LogInDialog).afterClosed().subscribe(() => this._router.navigateByUrl('/login'));
        return false;
      }
    }));
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._service.loggedIn;
  }
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(nextState?.url == '/sign-up') { return true; }
    return this._service.loggedIn;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}

@Component({
  template: `
  <h1 mat-dialog-title>로그인 되지 않음</h1>
  <mat-dialog-content>
    이 페이지는 로그인을 해야 이용할 수 있습니다. <br> 로그인 화면으로 이동합니다.
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-raised-button mat-dialog-close cdkFocusInitial>계속</button>
  </mat-dialog-actions>
  `
})
export class LogInDialog {
  constructor(private _dialogRef: MatDialogRef<LogInDialog>) {}
}