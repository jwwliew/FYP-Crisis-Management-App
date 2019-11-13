import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { saveConfig } from '@ionic/core';
import { Router } from '@angular/router';
import { ModalController} from '@ionic/angular';
import { Nav} from 'src/app/nav';
import {  ToastController } from '@ionic/angular';

import { PlanService } from 'src/app/services/plan.service';
import { BluetoothdetailPage } from 'src/app/settings/bluetoothdetail/bluetoothdetail.page';

declare var blePeripheral:any;
@Component({
  selector: 'app-bluetooth-modal',
  templateUrl: './bluetooth-modal.page.html',
  styleUrls: ['./bluetooth-modal.page.scss'],
})
export class BluetoothModalPage implements OnInit {
  item;
  sdf
  devices: any[] = [];
  statusMessage: string;
  constructor( 
    private PlanService: PlanService,
    private ModalController: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    private ble: BLE,
    private myparam: Nav ,
    private ngZone:NgZone,) { }

  ngOnInit() {
    console.log(this.item+"this is the item's id");
 

    this.scan();
  }
  async deviceSelected(device) {
    
    console.log(JSON.stringify(device) + ' selected');
    this.myparam.myParam= {device};
    this.myparam.myPlan="onePlan";
    const modal = await this.ModalController.create({
      component: BluetoothdetailPage,
      componentProps: { 
        item: this.item
      }
      
    });
    return await modal.present();
 
  }
 CloseModal(){
   this.ModalController.dismiss();
  }
scan (){

  this.setStatus('Scannin for Bluetooth le devices');
  this.devices= []; //clear list

  this.ble.scan([], 5).subscribe(
    device => this.onDeviceDiscovered(device),
    error => this.scanError(error)
  );
  setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');


}
onDeviceDiscovered(device){
  console.log('Discovered '+ JSON.stringify(device, null, 2));
  this.ngZone.run(() =>{
    this.devices.push(device);
  });
}


  // If location permission is denied, you'll end up here
  async scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
      
    });
    (await toast).present();
  }
testdata(){

  this.PlanService.getEditDetails(this.item).then(
    (data)=>{
      console.log(JSON.stringify(data)+"full data plan")
    }



  )
}
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}
