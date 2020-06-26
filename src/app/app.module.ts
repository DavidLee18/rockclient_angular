import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent, LoginBottomSheet } from './login/login.component';
import { MatInputModule, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatDividerModule, MatBottomSheetModule, MatSnackBarModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatSelectModule, MatRadioModule } from "@angular/material";
import { MatFormFieldModule } from '@angular/material/form-field';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NotFoundComponent } from './not-found/not-found.component';
import { RetreatModule } from './retreat/retreat.module';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { registerLocaleData } from '@angular/common';
import * as ko from '@angular/common/locales/ko';
import * as koExtra from '@angular/common/locales/extra/ko';
import { LeadersComponent } from './leaders/leaders.component';

registerLocaleData(ko.default, 'ko', koExtra.default);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginBottomSheet,
    SignUpComponent,
    NotFoundComponent,
    LeadersComponent,
  ],
  imports: [
    BrowserModule,
    RetreatModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthGuardModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule,
    AngularFireAuthModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
  ],
  entryComponents: [
    LoginBottomSheet,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
    { provide: LOCALE_ID, useValue: 'ko' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
