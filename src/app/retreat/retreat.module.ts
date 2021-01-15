import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RetreatRoutingModule } from './retreat-routing.module';
import { RetreatComponent } from './retreat.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { RetreatInfoComponent } from './retreat-info/retreat-info.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { RetreatStatisticsComponent } from './retreat-statistics/retreat-statistics.component';
import { RetreatRegisterComponent } from './retreat-register/retreat-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialogModule } from '@angular/material/dialog';
import { DiscardChangeDialog } from '../discard-change.guard';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatChipsModule } from '@angular/material/chips';
import { MessageSendBottomSheet, RetreatMessagesComponent } from './retreat-messages/retreat-messages.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    RetreatComponent,
    RetreatInfoComponent,
    RetreatStatisticsComponent,
    RetreatRegisterComponent,
    RetreatMessagesComponent,
    MessageSendBottomSheet,
  ],
  imports: [
    CommonModule,
    RetreatRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthGuardModule,
    MatMenuModule,
    MatTableModule,
    MatTreeModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatBottomSheetModule,
    TextFieldModule,
    MatInputModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'ko-KR' },
    { provide: LOCALE_ID, useValue: 'ko' },
  ],
  entryComponents: [
    DiscardChangeDialog,
    MessageSendBottomSheet,
  ]
})
export class RetreatModule {}
