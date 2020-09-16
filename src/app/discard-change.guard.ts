import { Injectable, Component } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RockService } from './rock.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscardChangeGuard implements CanDeactivate<unknown> {

  constructor(private _dialog: MatDialog, private _service: RockService) {}

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(nextState?.url == '/login') return this._service.loggedIn.pipe(map(l => !l));
    else if(currentState.url == '/sign-up' && nextState?.url == '/youth/sign-up') return true;
    else return this._dialog.open(DiscardChangeDialog).afterClosed() as Observable<boolean>;
  }
  
}

@Component({
  template: `
  <h1 mat-dialog-title>이 페이지를 나가시겠습니까?</h1>
  <mat-dialog-content>
    지금 이 페이지를 나가면 변경사항이 저장되지 않으며 소멸됩니다. <br> 계속하시겠습니까?
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-raised-button [mat-dialog-close]="true" cdkFocusInitial>계속</button>
    <button mat-button [mat-dialog-close]="false">취소</button>
  </mat-dialog-actions>
  `
})
export class DiscardChangeDialog {

  constructor(private _dialogRef: MatDialogRef<DiscardChangeDialog>) {}

}
