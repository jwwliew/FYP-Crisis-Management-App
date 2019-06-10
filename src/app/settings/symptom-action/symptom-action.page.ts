import { SettingService } from './../../services/setting.service';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';

@Component({
  selector: 'app-symptom-action',
  templateUrl: './symptom-action.page.html',
  styleUrls: ['./symptom-action.page.scss'],
})
export class SymptomActionPage implements OnInit {

  selectedTab = "Symptom";
  //symptomList = ["ok", "hi"];
  symptomList: Promise<any>;
  //actionList = ["action", "action2"];
  actionList: Promise<any>;

  constructor(private alertCtrl: AlertController, private settingService: SettingService, private ngzone: NgZone, public event: Events) {
    this.event.subscribe('name', (data) => {
      console.log("received data == " + data);
      this.event.unsubscribe('name');
    })
    // event.subscribe('update', loading => {
    //   this.symptomList = loading;
    // })
  }

  ngOnInit() {
    // this.symptomList = this.settingService.getAllSetting();
    // console.log("symptom list = " + this.symptomList);
    // this.actionList = this.settingService.getAllAction();
    this.symptomList = this.settingService.getType("Symptom");
    this.actionList = this.settingService.getType("Action");
    // this.settingService.getType("Symptom").then(items => {
    //   this.symptomList = items;
    // })
    // this.settingService.getType("Action").then(items => {
    //   this.actionList = items;
    // })
    //this.settingService.clearStorage();
  }

  newSymptomAction() {

  }

  goToSymptom() {
    this.selectedTab = "Symptom";
    console.log("selected symptom tab");
  }
  goToAction() {
    this.selectedTab = "Action";
    console.log("selected action tab");
  }

  goToType(type) {
    this.selectedTab = type;
  }
  selectedSymptom(id) {
    //console.log("this selected symptom id = " + id);
    console.log(`this selected ${this.selectedTab} id = ${id}`);
  }

  checkSelected() {
    var returnValue = true;
    if (this.selectedTab == "Action") {
      returnValue = false;
    }
    return returnValue;
  }

  async addNew() {
    console.log("clicked added new");
    let alert = await this.alertCtrl.create({
      header: "Add a " + this.selectedTab,
      inputs: [
        {
          name: 'name1',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("confirm cancel");
          }
        },
        {
          text: 'Ok',
          handler: (alertData => {
            console.log("ok name1 = " + alertData.name1);
            // // if (this.selectedTab == "Symptom") {
            // //   await this.settingService.addSetting(alertData.name1);
            // // }
            // // else {
            // //   await this.settingService.addAction(alertData.name1);
            // // }
            this.ngzone.run(() => { //method 1 ngZone() https://stackoverflow.com/questions/43871690/ionic-2-popup-handler-function-not-updating-variable
              this.settingService.addReusable(alertData.name1, this.selectedTab).then(() => {
                this.ngOnInit();
              })
            })
          })
        }
      ]
    });
    // alert.onDidDismiss().then((data) => { //method 2 ngOnInIt inside onDidDismiss()
    //   console.log(data);
    //   if (data.role !== "cancel") {
    //     this.settingService.addReusable(data.data.values.name1, this.selectedTab).then(() => {
    //       this.ngOnInit();
    //     })
    //   }
    // })
    await alert.present();
  }
}
