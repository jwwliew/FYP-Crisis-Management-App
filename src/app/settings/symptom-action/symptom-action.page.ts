import { SettingService } from './../../services/setting.service';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';

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

  selection:boolean = false;

  pressed() {
    console.log("pressed");
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
  }

  selectedSymptom(id) {
    console.log(`this selected ${this.selectedTab} id = ${id}`);
    this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + id); //routing start from root level
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
            console.log("ok name1 = " + alertData.name1);
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
