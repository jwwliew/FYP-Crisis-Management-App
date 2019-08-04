import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewTemplatesPage } from './new-templates.page';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';

const routes: Routes = [
  {
    path: '',
    component: NewTemplatesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModuleModule
  ],
  declarations: [NewTemplatesPage]
})
export class NewTemplatesPageModule {}
