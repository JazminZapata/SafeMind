import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SesionesComponent } from './sesiones.component';

const routes: Routes = [
  { path: '', component: SesionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SesionesRoutingModule { }
