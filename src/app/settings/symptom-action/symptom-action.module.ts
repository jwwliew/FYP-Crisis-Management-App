import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SymptomActionPage } from './symptom-action.page';

const routes: Routes = [
  {
    path: '',
    component: SymptomActionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SymptomActionPage]
})
export class SymptomActionPageModule {}
