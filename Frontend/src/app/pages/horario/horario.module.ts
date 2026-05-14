import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HorarioRoutingModule } from './horario-routing.module';
import { HorarioComponent } from './horario.component';

@NgModule({
  declarations: [
    HorarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    HorarioRoutingModule
  ]
})
export class HorarioModule { }
