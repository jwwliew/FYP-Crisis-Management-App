import { Component, OnInit, NgZone } from '@angular/core';
import { BLE} from '@ionic-native/ble/ngx';
import { Router } from '@angular/router';
import { ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {  ToastController } from '@ionic/angular';
import { PlanService } from './../../services/plan.service';

import {Nav} from 'src/app/nav';
import { BluetoothdetailPage } from '../bluetoothdetail/bluetoothdetail.page';

declare var blePeripheral: any;
declare var addressimpl: any;
var messagecheck= "";
var storageb;
var requestcheck= "";
var statechange;
@Component({
  selector: 'app-bluetoothmenu',
  templateUrl: './bluetoothmenu.page.html',
  styleUrls: ['./bluetoothmenu.page.scss'],
})
export class BluetoothmenuPage implements OnInit {
  dataReceive: string = "";
  bluetoothscanString:string ="Tap the button to scan for devices!";
  peripheral: any= {};
  messageb: string = "Pending connection...";
  deviceID: any;
  message123:string = "asd";
  devices: any[] = [];
  statusMessage: string;

  constructor(  
    private storage: Storage,
    private planService: PlanService,
    public modalController: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone:NgZone,
    private myparam: Nav ) { }

  ngOnInit() {

    
    
    var SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
var TX_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
var RX_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

var property = blePeripheral.properties;
var permission = blePeripheral.permissions;

var uartService = {
  uuid: SERVICE_UUID,
  characteristics: [
      {
          uuid: TX_UUID,
          properties: property.WRITE,
          permissions: permission.WRITEABLE,
          descriptors: [
              {
                  uuid: '2901',
                  value: 'Transmit'
              }
          ]
      },
      {
          uuid: RX_UUID,
          properties: property.READ | property.NOTIFY,
          permissions: permission.READABLE,
          descriptors: [
              {
                  uuid: '2901',
                  value: 'Receive'
              }
          ]
      }
  ]
};
Promise.all([
  blePeripheral.onWriteRequest(this.didReceiveWriteRequest),
  blePeripheral.onBluetoothStateChange(this.onBluetoothStateChange),

  blePeripheral.createServiceFromJSON(uartService),
  blePeripheral.startAdvertising(SERVICE_UUID, 'UART')
]).then(
function(){
  console.log ('Created UART Service')

  }  )

  }
  
  async deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.myparam.myParam= {device};
    this.myparam.myPlan="allPlan";
    const modal = await this.modalController.create({
      component: BluetoothdetailPage,
      componentProps: { 
      }
      
    });
    return await modal.present();
 
  }
 scan (){
   if (statechange== "off"){

alert("Your bluetooth is currently turned off. Please switch it on to scan for devices!")

   }
   else{
  this.bluetoothscanString= "Scanning for devices!"
  this.devices= []; //clear list

  this.ble.scan([], 5).subscribe(
    device => this.onDeviceDiscovered(device),
    error => this.scanError(error)
  );
  setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');

}


}
onDeviceDiscovered(device){
  console.log('Discovered '+ JSON.stringify(device, null, 2));
  this.ngZone.run(() =>{
    this.devices.push(device);
  });
}
scanComplete(){
  
  this.bluetoothscanString = "Scan complete!";
}
async Receive(){

  try{
if (messagecheck== ""){
alert("No data plan available.")


}
else {


  console.log(JSON.parse(messagecheck))

  let data = JSON.parse(messagecheck);

  
  if (data.length >= 1 ){

  for (let i = 0; i < data.length; i++) {
   
      await this.planService.addNewPlan(data[i]).then((items)=>
      
      
      {
        
      this.storage.set("plan", items)
      }
      
      )
    }
  
alert(data.length+ " plans are successfully added!");

document.getElementById("checkrequest").innerHTML= "Waiting for data..";
  }
  else if (typeof data.length === "undefined"){
console.log("this code is being run");
    await this.planService.addNewPlan(data).then((items)=>
      
      
    {
      
    this.storage.set("plan", items)
    }
    
    )

alert("Your plan is successfully added !");
  }
  
      // this.storage.get("plan").then((items) =>{
    
      //   // items.push(details);
      //   items.push(data[i]);
      //   console.log("run");
      //   // storageb = items;
     
  //})
    
  }
}
catch(err){
alert("There was an error retrieving the plan. Let the central know, to send it again!")
}
  finally{
messagecheck = "";

document.getElementById("checkrequest").innerHTML= "Waiting for data..";
}
      
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

  setStatus(message) {
    console.log(message);
    
  this.bluetoothscanString = "Scan complete!";
  console.log("Bluetoothscanstring:"+this.bluetoothscanString);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  onBluetoothStateChange(state) {
console.log("Bluetooth state is" + state);
statechange = state;
console.log("statechange is"+statechange)

  }

  didReceiveWriteRequest (request){

   

  document.getElementById("checkrequest").innerHTML= "Data is currently being received!";

    console.log(request.value);
    var messageVar =  String.fromCharCode.apply(null, new Uint16Array(request.value));
    messagecheck= messagecheck + messageVar


   console.log(messageVar)




   console.log(messagecheck)


  

  

   
  }
  
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint16Array(buffer));
}






}
