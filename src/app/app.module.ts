import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent, LoginBottomSheet } from './login/login.component';
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from '@angular/material/form-field';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NotFoundComponent } from './not-found/not-found.component';
import { RetreatModule } from './retreat/retreat.module';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { DatePipe, registerLocaleData } from '@angular/common';
import * as ko from '@angular/common/locales/ko';
import * as koExtra from '@angular/common/locales/extra/ko';
import { LeadersComponent, MemberSearchBottomSheet } from './leaders/leaders.component';
import { DiscardChangeDialog } from "src/app/discard-change.guard";
import { MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { LogInDialog } from './auth.guard';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { YouthModule } from "./youth/youth.module";
import { SemiSignUpComponent } from './semi-sign-up/semi-sign-up.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatExpansionModule } from "@angular/material/expansion";

registerLocaleData(ko.default, 'ko', koExtra.default);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginBottomSheet,
    SignUpComponent,
    NotFoundComponent,
    LeadersComponent,
    DiscardChangeDialog,
    LogInDialog,
    MemberSearchBottomSheet,
    SemiSignUpComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RetreatModule,
    YouthModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthGuardModule,
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
    MatMomentDateModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    A11yModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatExpansionModule,
  ],
  entryComponents: [
    LoginBottomSheet,
    DiscardChangeDialog,
    LogInDialog,
    MemberSearchBottomSheet,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
    { provide: LOCALE_ID, useValue: 'ko' },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
