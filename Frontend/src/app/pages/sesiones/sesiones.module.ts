import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SesionesRoutingModule } from './sesiones-routing.module';
import { SesionesComponent } from './sesiones.component';

@NgModule({
  declarations: [
    SesionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    SesionesRoutingModule
  ]
})
export class SesionesModule { }
