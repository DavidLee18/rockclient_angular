import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, zip } from 'rxjs';
import { Grade, Info, Message, RockService } from 'src/app/rock.service';

@Component({
  selector: 'app-retreat-messages',
  templateUrl: './retreat-messages.component.html',
  styleUrls: ['./retreat-messages.component.css']
})
export class RetreatMessagesComponent implements OnInit {

  loggedIn: Observable<boolean>
  messages: Observable<Message[]>
  noties: Observable<Message[]>
  routes: Observable<unknown>

  constructor(private _service: RockService, private _sanitizer: DomSanitizer, private _sheet: MatBottomSheet) {}

  ngOnInit() {
    this.loggedIn = this._service.loggedIn;
    this.messages = this._service.messages;
    this.noties = this._service.noties;
    this.routes = this._service.routeNames;
  }

  linkify(raw: string) : string {
    const urls = raw.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gim);
    urls?.forEach(url => raw = raw.replace(url, `<a href="${url}">${url}</a>`));
    return this._sanitizer.bypassSecurityTrustHtml(raw) as string;
  }

  logout = () => this._service.logout();

  openSend() { this._sheet.open(MessageSendBottomSheet); }
}

@Component({
  selector: 'message-send-bottom-sheet',
  template: `<section>
    <mat-form-field apperance="fill">
      <mat-label>이름</mat-label>
      <input matInput required [(value)]="name">
    </mat-form-field>
    <mat-form-field apperance="fill">
      <mat-label>메세지</mat-label>
      <textarea cdkTextareaAutosize matInput required [(value)]="message"></textarea>
    </mat-form-field>
    <button mat-icon-button [disabled]="name?.length == 0 || message?.length == 0" (click)="send(name, message)"><mat-icon>send</mat-icon></button>
  </section>`
})
export class MessageSendBottomSheet {
  name = '';
  message = '';
  info: Observable<Info>

  constructor(private _sheetRef: MatBottomSheetRef<MessageSendBottomSheet>, private _service: RockService, private date: DatePipe) {
    this.info = _service.MyInfo;
    this.info.subscribe(info => this.name = info.name);
  }

  send(name: string, message: string) {
    this._sheetRef.dismiss();
    this.info.subscribe(info => {
      const resume = {
        author: name,
        message,
        isStaff: RockService.isGradeEqualOrGT(info.grade, Grade.mission) ? '공지' : '',
        time: this.date.transform(new Date(), 'MM-dd HH:mm'),
        uid: info.uid
      };
      console.log(resume);
      //this._service.sendMessage(resume);
    });
  }
}
