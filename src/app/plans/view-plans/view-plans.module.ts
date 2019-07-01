import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from '@ionic/angular';

import { ViewPlansPage } from './view-plans.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPlansPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewPlansPage]
})
export class ViewPlansPageModule {}
