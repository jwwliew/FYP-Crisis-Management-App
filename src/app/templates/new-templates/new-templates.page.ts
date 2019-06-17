import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, Events, PopoverController } from '@ionic/angular';
import {v4 as uuid} from 'uuid';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';
import { TemplatePopComponent } from '../template-pop/template-pop.component';

@Component({
  selector: 'app-new-templates',
  templateUrl: './new-templates.page.html',
  styleUrls: ['./new-templates.page.scss'],
})
export class NewTemplatesPage implements OnInit {

  editPage = false;
  templateName = "Create new template";
  templateID: any;

  constructor(private actionSheetCtrl: ActionSheetController, private router: Router, private templateStorage: TemplateService, private alertCtrl: AlertController, private toastCtrl: ToastController, private event: Events, private popoverCtrl: PopoverController) {
    this.event.subscribe("edit", item => {
      this.editPage = true;
      this.templateName = item.name;
      this.templateID = item.id;
      console.warn("item received --- " + JSON.stringify(item, null, 2));
      console.log(item.template);
      this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
      this.warningArray = item.template.filter(element => element.name == "warningArray");
      console.log("this critical array = " + JSON.stringify(this.criticalArray, null, 2))
    })
  }

  ngOnInit() {

  }

  criticalArray = [];
  warningArray = [];

  itemData = [
    {
      "name": "NAME1",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME2",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME3",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Cough",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Cancer",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Dead",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Gtg",
      "icon": "assets/cough.svg"
    },
    {
      "name": "High Blood Pressure",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Watar",
      "icon": "assets/cough.svg"
    },
    
  ]

  customSelectSheetOptions: any = {
    header: "Select symptom to take",
    // subHeader: "Select symptom to take",
    // message: "Select symptom to take",
    // translucent: true
  }

//https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  async presentActionSheet(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select a symptom from below ' + symptomOrAction,
      cssClass: "wholeActionSheet",
      buttons: this.createButtons(item, symptomOrAction)
    });
    await actionSheet.present();
  }

  createButtons(itemToUpdate, type) {
    let buttons = [];
    this.itemData.forEach(element => {
      let button = {
        text: element.name,
        icon: element.icon,
        handler: () => {
          console.log(`${element.name} clicked`);
          if (type == "Symptom") {
            itemToUpdate.symptom.text = element.name
          }
          else {
            itemToUpdate.text = element.name
          }
          console.log("item to update " + JSON.stringify(itemToUpdate));
          // console.log("whole array = " + JSON.stringify(this.criticalArray));
        }
      }
      buttons.push(button);
    });
    buttons.push({
      text: "Cancel",
      icon: "close",
      role: "selected"
    })
    return buttons;
  }

  addNewCriticalArray(type, id) {
    console.log("clicked " + type); //critical or caution or good
    let thisArr = this.getArray(id);
    let newPair = {
      // 'id': 1,
      symptom: {
        text: "Symptom",
        type: "Symptom",
        img: "assets/temperature.svg"
      },
      combined: [
      ]
    }
    thisArr.push(newPair);
    console.log(thisArr);
  }

  addTemplate(templateNameFromInput) {
    let completedArray = [this.criticalArray, this.warningArray];
    let name = ["criticalArray", "warningArray"];
    console.log("critical array = " + JSON.stringify(this.criticalArray));
    console.log("warning array = " + JSON.stringify(this.warningArray));
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      console.log("before filter + " + JSON.stringify(eachArr));
      eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
      // eachArr.forEach(x => x.id = uuid());
      eachArr.map(x => {x.id = uuid(); x.name = name[index]});
      console.error("after filter " + JSON.stringify(eachArr));
      return eachArr;
    })
    console.warn("in middle watar" + JSON.stringify(completedArray[0]))
    console.log(JSON.stringify(maparr));
    // this.criticalArray = this.criticalArray.filter(data => data.symptom.text !== "Symptom");
    // this.criticalArray.forEach(x => x.id = uuid());
    this.templateStorage.createTemplate(maparr, templateNameFromInput).then(() => {
      // this.event.publish("created", this.criticalArray);
      this.router.navigateByUrl('/tabs/templates'); //routing start from root level
    })
  }

  async askForName(templateName) {
    templateName = templateName ? "Rename " + templateName : "Enter template name";
    let alert = await this.alertCtrl.create({
      header: templateName,
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
            if (templateName == "Enter template name") {
              this.addTemplate(alertData.nameInput);
            }
            else {
              this.renameTemplate(alertData.nameInput);
            }
          })
        }
      ]
    });
    await alert.present();
  }

  
  ionViewWillEnter() {
    console.log("ng init + " + JSON.stringify(this.criticalArray));
  }

  // verify() {
  //   if (this.criticalArray.map(a => a.symptom.text).includes("Symptom")) {
  //     this.presentToastWithOptions();
  //   }
  //   else {
  //     this.popUp();
  //   }
  // }

  popUp(id) {
    console.log("clicked added new");
    let thisArr = this.getArray(id);
    // if (this.criticalArray.every(a => a.symptom.text == "Symptom")) {
    if (thisArr.every(a => a.symptom.text == "Symptom")) {
      this.presentToastWithOptions();
    }
    else {
      this.alertCtrl.create({
        header: "Select a symptom",
        inputs: this.createRadios(id),
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
              console.log("ok name1 = " + alertData);
              // let x = this.criticalArray.find(x => x.symptom.text == alertData);
              let x = thisArr.find(x => x.symptom.text == alertData)
              let newAction = {
                text: "Action",
                type: "Action",
                img: "assets/empty.svg"
              }
              x.combined.push(newAction);
              // console.error("pushed after " + JSON.stringify(this.criticalArray));
              console.error("pushed after " + JSON.stringify(thisArr));
            })
          }
        ]
      }).then(alert => {
        alert.present()
      });
    }
  
  }

  createRadios(id) {
    let thisArr = this.getArray(id);
    let radioBtns = [];
    // this.criticalArray.filter(word => word.symptom.text !== "Symptom").forEach(element => {
    thisArr.filter(word => word.symptom.text !== "Symptom").forEach(element => {
      let radioBtn = {
        type: "radio",
        label: element.symptom.text,
        value: element.symptom.text
      }
      radioBtns.push(radioBtn);
    })
    return radioBtns;
  }

  async presentToastWithOptions() {
    const toast = await this.toastCtrl.create({
      header: 'Toast header',
      message: 'Click to Close',
      duration: 2000,
      position: 'bottom',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  frontViewData = [
    { 
      id: 0,
      type: "Critical",
      colorCard: "danger",
      colorBtn: "redCard",
      toggle: false,
    },
    {
      id: 1,
      type: "Warning",
      colorCard: "warning",
      colorBtn: "warning",
      toggle: false
    }
  ]



  checkType(id) {
    let status = false;
    if (this.getArray(id).length > 0) {
      status = true;
    }
    return status;
  }

  getArray(id) {
    let allArray = [this.criticalArray, this.warningArray]
    return allArray[id];
  }


  async popOverController(x) { 
    const popover = await this.popoverCtrl.create({
      component: TemplatePopComponent,
      event: x, //https://www.youtube.com/watch?v=wMpGiniuZNc
    });
    popover.onDidDismiss().then((data) => { //method 2 ngOnInIt inside onDidDismiss()
      console.log("popup dismiss data = " + data.data);
      //Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete"];
      let x = this.callAction(data.data)
      console.log("x is " + x);
    })
    return await popover.present();
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    const dogSwitch = (x) => ({
      "Edit": this.callEdit(),
      "Rename": this.rename()
    })[x];
    let a = dogSwitch(type)
    return a;
    // var call = {
    //   'Edit': () => this.callEdit(),
    //   'Rename': () => this.rename()
    // }
    // call[type]();
  }

  callEdit() {
    console.log("edit is called");
    return "hello"
  }
  rename() {
    console.log("calle rename")
    this.askForName(this.templateName);
    return "rename";
  }
  renameTemplate(nameToChange) {
    this.templateStorage.renameTemplate(nameToChange, this.templateID).then((val) => {
      console.warn("rename val = " + JSON.stringify(val, null, 2));
      this.templateName = nameToChange;
    });
  }  
}
