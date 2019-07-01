import { SymptomActionService } from '../../services/symptomaction.service';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';

import 'hammerjs'; //for gestures
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-symptom-action',
  templateUrl: './symptom-action.page.html',
  styleUrls: ['./symptom-action.page.scss'],
})
export class SymptomActionPage implements OnInit {

  selectedTab = "Symptom";
  //symptomList = ["ok", "hi"];
  symptomList = [];
  //actionList = ["action", "action2"];
  actionList = [];

  checked = []

  pressEvent(x) {
    console.log("pressed " + JSON.stringify(x));
    if (this.checked.length == 0) {
      this.checked.push({
        id: x.id,
        selectedType: this.selectedTab
      });
      x.checked = true;
      console.log("length not == 0 hold");
    }
    console.log("after press checked = " + this.checked);
  } 

  check(item) { //https://forum.ionicframework.com/t/determining-if-checkbox-is-checked/68628/5, https://forum.ionicframework.com/t/how-to-check-if-checkboxes-is-checked-or-unchecked/68799/7
    console.log(item);
    // let itemID = this.checked.indexOf(item.id);
    let itemID = this.checked.findIndex(x => x.id == item.id);
    itemID !== -1 ? this.checked.splice(itemID, 1) : this.checked.push({id: item.id, selectedType: this.selectedTab})
    console.log("Checked == " + this.checked);
  }
  
  deleteSelected() {
    console.log("deleting -- " + this.checked);
    this.settingService.deleteSetting(this.selectedTab, this.checked).then((a) => {
      console.log("delete success");
      console.log(a)
      this.templateService.presentToastWithOptions("Deleted " + this.checked.length + " " + this.selectedTab);
      this.checked.length = 0;
      this.loadItems();
    });
  }

  clearArray() {
    this.checked.forEach(x => {
      let thisArray = x.selectedType == "Symptom" ? this.symptomList : this.actionList
      console.error("this array = " + JSON.stringify(thisArray,null,2))
      let thisElement = thisArray.find(oneItem => oneItem.id == x.id);
      console.error("this leement === " + JSON.stringify(thisElement,null,2));
      thisElement.checked = false;
    })
    this.checked.length = 0;
  }

  constructor(private alertCtrl: AlertController, private settingService: SymptomActionService, private ngzone: NgZone, public event: Events, private router: Router, 
    private templateService: TemplateService) {
  }

  ngOnInit() {
    console.log("ngOnInIt() called");
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  loadItems() {
    let allPromise = [this.settingService.getType("Symptom"), this.settingService.getType("Action")];
    Promise.all(allPromise).then(finalPromises => {
      finalPromises.forEach(eachArr => {
        eachArr && eachArr.forEach(element => {
            if (element.icon instanceof Blob) {
              this.settingService.readImage(element.icon).then(convertedBase64 => {
                element.icon = convertedBase64;
              })
            }
        });
      })
      this.symptomList = finalPromises[0];
      this.actionList = finalPromises[1];
    })
  }

  goToType(type) {
    this.selectedTab = type;
    console.log(`selected ${this.selectedTab} tab`);
    this.clearArray();
  }

  selectedSymptom(id) {
    console.log(`this selected ${this.selectedTab} id = ${id}`);
    if (this.checked.length == 0) {
      this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + id); //routing start from root level
    }
  }
  
  goToAddPage() {
    this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + "add"); //routing start from root level
  }

  //pop up center input for add new symtpom/action
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
