import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfesionalesRoutingModule } from './profesionales-routing.module';
import { ProfesionalesComponent } from './profesionales.component';

@NgModule({
  declarations: [
    ProfesionalesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    ProfesionalesRoutingModule
  ]
})
export class ProfesionalesModule { }
