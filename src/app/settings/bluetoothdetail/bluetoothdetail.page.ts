import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Nav } from 'src/app/nav';
import { ModalController} from '@ionic/angular';

import { PlanService } from './../../services/plan.service';
import { Router} from '@angular/router';
import { Alert } from 'selenium-webdriver';

declare var ble:any;
@Component({
  selector: 'app-bluetoothdetail',
  templateUrl: './bluetoothdetail.page.html',
  styleUrls: ['./bluetoothdetail.page.scss'],
})
export class BluetoothdetailPage implements OnInit {
  item;
connection: string= "Waiting to receive connection from device..";

  peripheral: any= {};
  statusMessage: string;
  dataReceive: string = "";
  MessageData: string = "";
  
  
dataSend: string = "Hello";

  constructor(public navCtrl: NavController,

    private modalController: ModalController,
    private router: Router,
    private ble: BLE,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private myparam: Nav,
    private planService: PlanService)
    
    {    
       
      let device= this.myparam.myParam;

    
      this.setStatus('Connecting to ' +  device.device.id);
      
      this.ble.connect(device.device.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral)
        
      
      );
 
  
     }

GoBack(){
  
  let device= this.myparam.myParam;
  
  console.log("going back")
  this.ble.disconnect(device.device.id)
  this.modalController.dismiss();
}

     onConnected(peripheral){
      this.ngZone.run(()=>{
        this.setStatus('Connected to'+peripheral.id+"!");
        this.connection = "Connected to device!"
        this.peripheral = peripheral;
      })
    }

    stringToBytes(string) {
      var array = new Uint16Array(string.length);
      for (var i = 0, l = string.length; i < l; i++) {
          array[i] = string.charCodeAt(i);
      }
      return array.buffer as ArrayBuffer
  }
  chunkString (str, len) {
    const size = Math.ceil(str.length/len)
    const r = Array(size)
    let offset = 0
    
    for (let i = 0; i < size; i++) {
      r[i] = str.substr(offset, len)
      offset += len
    }
    
    return r
  }
    WriteData(){
      //var buf = new ArrayBuffer(this.dataSend.length );
      //let bufView = new Uint8Array(buf);
   // for (var i = 0, strLen = this.dataSend.length; i < strLen; i++) {
   //   bufView[i] = this.dataSend.charCodeAt(i);
  //  }

if ( this.myparam.myPlan =="allPlan"){
  document.getElementById("loader").style.display="block";
  this.MessageData= "Sending data!";
  this.planService.getAllPlan().then(
(data)=>
{
 const result =  this.chunkString(JSON.stringify(data),9)

  console.log(result)

var bleCounter = 0;
  var bar = new Promise((resolve, reject) => {

    result.forEach((item,index,array) => {
console.log(array.length);
      let bufView = this.stringToBytes(item);
        this.ble.write(this.peripheral.id, "6E400001-B5A3-F393-E0A9-E50E24DCCA9E", "6E400002-B5A3-F393-E0A9-E50E24DCCA9E", bufView).then(
          success => {
            bleCounter = bleCounter + 1;
            console.log("writing data to ble, data buffer is "+ bufView);

            console.log(bleCounter);
            
        if (bleCounter == array.length ) resolve();

        },
  
          
          err => console.log('Unexpected Error', 'Error updating power switch')
        )
        console.log(item)
      
        
        
        
      })
});

bar.then(() => {
  console.log("complete!")
  setTimeout(this.DataComplete, 1000);
});








}




  );
  
  
            
    
}
else if( this.myparam.myPlan =="onePlan"){
  document.getElementById("loader").style.display="block";
  this.MessageData= "Sending data!";
  this.planService.getEditDetails(this.item).then(
    (data)=>{
      var bleCounter = 0;
      const result =  this.chunkString(JSON.stringify(data),9)

      console.log(result)
      var bar = new Promise((resolve, reject) => {


        result.forEach((item,index,array) => {console.log(item)

  
          let bufView = this.stringToBytes(item);
            this.ble.write(this.peripheral.id, "6E400001-B5A3-F393-E0A9-E50E24DCCA9E", "6E400002-B5A3-F393-E0A9-E50E24DCCA9E", bufView).then(
              success => {
                
                bleCounter = bleCounter + 1;
                console.log("writing data to ble, data buffer is "+ bufView);
    
                console.log(bleCounter);
                
            if (bleCounter == array.length ) resolve();
              
            },
              err => console.log('Unexpected Error', 'Error updating power switch')
            )
          
            
            
            
          })
      });
      bar.then(() => {
        console.log("complete!")
        setTimeout(this.DataComplete, 1000);
      });
        

        
  



      
    }
  )
}




}
DataComplete(){

  document.getElementById("loader").style.display="none";
 
  document.getElementById("data").innerHTML= "Data successfully sent!";
}



    
    async onDeviceDisconnected(peripheral) {

      this.connection = "Device unexpectedly disconnected!"
      let toast = this.toastCtrl.create({
        message: 'The peripheral unexpectedly disconnected',
        duration: 3000,
        position: 'middle'
      });
      (await toast).present();
    }
    ionViewWillLeave(){
      console.log('ionViewWillLeave disconnecting blutooth');
      this.ble.disconnect(this.peripheral.id).then(
        () => console.log('Disconnected'),
        () => console.log('Error disconnecting')
      )
    }
    setStatus(message) {
      console.log(message);
      this.ngZone.run(() => {
        this.statusMessage = message;
      });
    }
  ngOnInit() {

    
  }
  
  ReceiveData(){
 
    this.ble.read(this.peripheral.id, '6E400001-B5A3-F393-E0A9-E50E24DCCA9E', '6E400003-B5A3-F393-E0A9-E50E24DCCA9E').then(
      buffer => {

        let string  =String.fromCharCode.apply(null, new Uint16Array(buffer));
        let data = new Uint8Array(buffer);
        console.log('data shown ' + data[0]+ data[1]+data[2]);
        console.log(JSON.stringify(data)+ string);
     
        
      }
    )
 


  }


}
