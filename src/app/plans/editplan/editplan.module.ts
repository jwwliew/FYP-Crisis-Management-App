import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditplanPage } from './editplan.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

const routes: Routes = [
  {
    path: '',
    component: EditplanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModuleModule
  ],
  declarations: [EditplanPage]
})
export class EditplanPageModule {}
