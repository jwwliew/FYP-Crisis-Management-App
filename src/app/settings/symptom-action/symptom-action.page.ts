import { SettingService } from './../../services/setting.service';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';

import 'hammerjs'; //for gestures

@Component({
  selector: 'app-symptom-action',
  templateUrl: './symptom-action.page.html',
  styleUrls: ['./symptom-action.page.scss'],
})
export class SymptomActionPage implements OnInit {

  selectedTab = "Symptom";
  //symptomList = ["ok", "hi"];
  symptomList: any;
  //actionList = ["action", "action2"];
  actionList: any;

  checked = []

  pressEvent(x) {
    console.log("pressed " + JSON.stringify(x));
    if (this.checked.length == 0) {
      this.checked.push(x.id);
      x.checked = true; 
      console.log("length not == 0 hold");
    }
    console.log("after press checked = " + this.checked);
  } 

  check(x, item) { //https://forum.ionicframework.com/t/determining-if-checkbox-is-checked/68628/5, https://forum.ionicframework.com/t/how-to-check-if-checkboxes-is-checked-or-unchecked/68799/7
    console.log(item);
    console.log(x.currentTarget.checked);
    let itemID = this.checked.indexOf(item.id);
    if (itemID !== -1) {
      this.checked.splice(itemID, 1);
      console.log("splice finished");
    }
    else {
      this.checked.push(item.id);
      console.log("pushed checked")
    }
    console.log("Checked == " + this.checked);
  }
  
  deleteSelected() {
    console.log("deleting -- " + this.checked);
    this.settingService.deleteSetting(this.selectedTab, this.checked).then((a) => {
      console.log("delete success");
      console.log(a)
      this.checked = [];
      this.loadItems();
    });
  }

  constructor(private alertCtrl: AlertController, private settingService: SettingService, private ngzone: NgZone, public event: Events, private router: Router) {
    this.event.subscribe('name', (data) => {
      console.log("received data == " + data);
      this.event.unsubscribe('name');
    })
    // event.subscribe('update', loading => {
    //   this.symptomList = loading;
    // })
  }

  ngOnInit() {
    console.log("ngOnInIt() called");
    // this.settingService.getType("Symptom").then(items => {
    //   this.symptomList = items;
    // })
    // this.settingService.getType("Action").then(items => {
    //   this.actionList = items;
    // })
  }

  ionViewWillEnter() {
    console.log("ion view");
    this.loadItems();
  }

  loadItems() {
    this.symptomList = this.settingService.getType("Symptom");
    this.actionList = this.settingService.getType("Action");
  }

  goToType(type) {
    this.selectedTab = type;
    console.log(`selected ${this.selectedTab} tab`);
    this.checked = [];
  }

  selectedSymptom(id) {
    console.log(`this selected ${this.selectedTab} id = ${id}`);
    if (this.checked.length == 0) {
      this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + id); //routing start from root level
    } 

  }

  async addNew() {
    console.log("clicked added new");
    let alert = await this.alertCtrl.create({
      header: "Add a " + this.selectedTab,
      inputs: [
        {
          name: 'nameInput',
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
            console.log("ok name1 = " + alertData.nameInput);
            // // if (this.selectedTab == "Symptom") {
            // //   await this.settingService.addSetting(alertData.name1);
            // // }
            // // else {
            // //   await this.settingService.addAction(alertData.name1);
            // // }
            this.ngzone.run(() => { //method 1 ngZone() https://stackoverflow.com/questions/43871690/ionic-2-popup-handler-function-not-updating-variable
              this.settingService.addReusable(alertData, this.selectedTab).then(() => {
                this.loadItems();
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
