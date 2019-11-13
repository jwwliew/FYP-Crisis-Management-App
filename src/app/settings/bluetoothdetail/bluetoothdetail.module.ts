import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalController} from '@ionic/angular';
import { BluetoothdetailPage } from './bluetoothdetail.page';

const routes: Routes = [
  {
    path: '',
    component: BluetoothdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BluetoothdetailPage]
})
export class BluetoothdetailPageModule {}
