import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YouthRoutingModule } from './youth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { YouthComponent } from './youth/youth.component';
import { DiscardChangeDialog } from "../discard-change.guard";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [SignUpComponent, YouthComponent],
  imports: [
    CommonModule,
    YouthRoutingModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  entryComponents: [DiscardChangeDialog],
})
export class YouthModule { }
