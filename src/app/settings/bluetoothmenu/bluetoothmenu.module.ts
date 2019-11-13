import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BluetoothmenuPage } from './bluetoothmenu.page';

const routes: Routes = [
  {
    path: '',
    component: BluetoothmenuPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BluetoothmenuPage]
})
export class BluetoothmenuPageModule {}
