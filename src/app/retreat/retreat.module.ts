import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetreatRoutingModule } from './retreat-routing.module';
import { RetreatComponent } from './retreat.component';
import { MatToolbarModule, MatSidenavModule, MatIconModule, MatButtonModule, MatCardModule, MatListModule, MatMenuModule, MatTableModule, MatTreeModule, MatStepperModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { RetreatInfoComponent } from './retreat-info/retreat-info.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { RetreatStatisticsComponent } from './retreat-statistics/retreat-statistics.component';
import { RetreatRegisterComponent } from './retreat-register/retreat-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RetreatComponent,
    RetreatInfoComponent,
    RetreatStatisticsComponent,
    RetreatRegisterComponent,
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
  ],
})
export class RetreatModule { }
