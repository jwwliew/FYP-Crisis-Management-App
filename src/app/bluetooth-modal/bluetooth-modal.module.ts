import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BluetoothModalPage } from './bluetooth-modal.page';

const routes: Routes = [
  {
    path: 'bluetooth',
    component: BluetoothModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BluetoothModalPage]
})
export class BluetoothModalPageModule {}
