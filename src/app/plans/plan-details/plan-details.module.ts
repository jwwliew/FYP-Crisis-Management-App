import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlanDetailsPage } from './plan-details.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

const routes: Routes = [
  {
    path: '',
    component: PlanDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModuleModule
  ],
  declarations: [PlanDetailsPage]
})
export class PlanDetailsPageModule {}
