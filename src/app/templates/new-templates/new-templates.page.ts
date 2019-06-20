import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, Events, PopoverController } from '@ionic/angular';
import {v4 as uuid} from 'uuid';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';
import { TemplatePopComponent } from '../template-pop/template-pop.component';
import { SettingService } from 'src/app/services/setting.service';
import { Setting } from 'src/app/models/setting';

@Component({
  selector: 'app-new-templates',
  templateUrl: './new-templates.page.html',
  styleUrls: ['./new-templates.page.scss'],
})
export class NewTemplatesPage implements OnInit {

  viewPage = false;
  templateName = "Create new template";
  templateID: any;
  editPage = false;

  settingObj = [
    {
      id: uuid(),
      enName: "Fever from pdf",
      icon: "assets/pdfcough.png"
    },
    {
      id: uuid(),
      enName: "No breath from pdf",
      icon: "assets/pdfnobreath.png"
    },
    {
      id: uuid(),
      enName: "Got breath",
      icon: "assets/pdfgotbreath.png"
    }
  ]
  actionObj = [
    {
      id: uuid(),
      enName: "call 995",
      icon: "assets/pdfcall995.png"
    },
    {
      id: uuid(),
      enName: "Continue regular medications",
      icon: "assets/pdfcontinuemed.png"
    },
    {
      id: uuid(),
      enName: "Maintain usual activities/exercise levels",
      icon: "assets/pdfmaintain.png"
    }
  ]

  settingSymptom:Setting[] = [];
  settingAction = [];

  constructor(private actionSheetCtrl: ActionSheetController, private router: Router, private templateStorage: TemplateService, private alertCtrl: AlertController, private toastCtrl: ToastController, private event: Events, private popoverCtrl: PopoverController, private settingStorage: SettingService) {
    this.event.subscribe("view", item => { //or services https://stackoverflow.com/questions/54304481/ionic-4-angular-7-passing-object-data-to-another-page
      this.viewPage = true;
      this.templateName = item.name;
      this.templateID = item.id;
      console.warn("item received --- " + JSON.stringify(item, null, 2));
      console.log(item.template);
      this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
      this.warningArray = item.template.filter(element => element.name == "warningArray");
      console.log("this critical array = " + JSON.stringify(this.criticalArray, null, 2))
    })

    this.settingStorage.getType("Symptom").then(symptoms => {
      this.settingSymptom = symptoms ? [...this.settingObj, ...symptoms] : [...this.settingObj];
      // this.settingSymptom = [...this.settingObj, ...symptoms];
    });
    this.settingStorage.getType("Action").then(actions => {
      this.settingAction = actions ? [...this.actionObj, ...actions] : [...this.actionObj];
      // this.settingAction = [...this.actionObj, ...actions];
    })
  }

  ngOnInit() {

  }

  criticalArray = [];
  warningArray = [];

//https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  async presentActionSheet(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    symptomOrAction = symptomOrAction == "updateAction" ? "action" : symptomOrAction
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select a " + symptomOrAction.toLowerCase() + " from below",
      cssClass: "wholeActionSheet",
      buttons: this.createButtons(item, symptomOrAction),
      mode: "ios"
    });
    await actionSheet.present();
  }

  createButtons(itemToUpdate, type) {
    let buttons = [];
    let typeToCall = type == "Symptom" ? this.settingSymptom : this.settingAction
    typeToCall.forEach((element, index) => {
      let style = document.createElement('style'); //https://github.com/ionic-team/ionic/issues/6589
      style.type = "text/css";
      style.innerHTML = ".customCSSClass" + index + '{background: url('+ "'" + element.icon + "'" + ') no-repeat !important; padding: 40px 20% 40px 25% !important; margin-top:25px !important; background-size:80px 80px !important; margin-left: 30px !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      
      let button = {
        text: element.enName,
        //icon: "assets/icon/cough.png",
        cssClass: 'customCSSClass'+ index,
        handler: () => {
          console.log(`${element.enName} clicked`);
          console.log(itemToUpdate)
          if (type == "Symptom") {
            itemToUpdate.symptom.text = element.enName;
            itemToUpdate.symptom.img = element.icon;
          }
          else {
            console.log("update action?");
            itemToUpdate.text = element.enName;
            itemToUpdate.img = element.icon;
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
        img: "assets/temperature.svg",
        description: ""
      },
      combined: [
        {
          text: "Action",
          type: "Action",
          img: "assets/empty.svg",
          description: ""
        }
      ]
    }
    thisArr.push(newPair); //double push
    console.log(thisArr);
  }

  addTemplate(templateNameFromInput, addOrUpdate) {
    let completedArray = [this.criticalArray, this.warningArray];
    let name = ["criticalArray", "warningArray"];
    console.log("critical array = " + JSON.stringify(this.criticalArray));
    console.log("warning array = " + JSON.stringify(this.warningArray));
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      console.warn("before filter + " + JSON.stringify(eachArr, null, 2));
      eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
      // eachArr.forEach(x => x.id = uuid());
      eachArr.map(x => {x.id = uuid(); x.name = name[index]});
      console.error("after filter " + JSON.stringify(eachArr, null, 2));
      return eachArr;
    })
    console.warn("in middle watar" + JSON.stringify(completedArray[0]))
    console.error(JSON.stringify(maparr, null, 2));
    // this.criticalArray = this.criticalArray.filter(data => data.symptom.text !== "Symptom");
    // this.criticalArray.forEach(x => x.id = uuid());
    this.templateStorage.createTemplate(maparr, templateNameFromInput, addOrUpdate, this.templateID, this.templateName).then((val) => {
      // this.event.publish("created", this.criticalArray);
      if (addOrUpdate == "add") {
        this.router.navigateByUrl('/tabs/templates'); //routing start from root level
      }
      else {
        this.editPage = false;
        this.viewPage = true;
        // console.log("val -- " + JSON.stringify(val, null, 2));
        // let convertArr = val.map((element, index) => {
        //   let obj = {
        //     template: [].concat(...element.templates)
        //   }
        //   return obj;
        // })
        // console.warn("convert arr template = " + JSON.stringify(convertArr, null, 2))
        // this.criticalArray = convertArr[0].template.filter(element =>  element.name == "criticalArray")
        // this.warningArray = convertArr[0].template.filter(element =>  element.name == "warningArray")
        // console.log("critical array val filtered == " + JSON.stringify(this.criticalArray, null, 2));
        // console.log("warning array val filtered == " + JSON.stringify(this.warningArray, null, 2));
      }
    })
  }
  goToViewPageFromEdit() {
    this.criticalArray = [...this.backUpCriticalArray];
    this.warningArray = [...this.backUpWarningArray];
    console.log("going back to view page ... " + JSON.stringify(this.backUpCriticalArray,null,2));
    this.editPage = false;
    this.viewPage = true;
  }
  async askForName(typeOfAction) {
    //templateName = templateName ? "Rename " + templateName : "Enter template name";
    let templateName = (typeOfAction == "rename") ? "Rename " + this.templateName : (typeOfAction == "duplicate") ? "Enter duplicated templated name " : "Enter template name";
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
            //if (templateName == "Enter template name") {
            if (typeOfAction == "rename") {
              this.templateStorage.renameTemplate(alertData.nameInput, this.templateID).then((val) => {
                console.warn("rename val = " + JSON.stringify(val, null, 2));
                this.templateName = alertData.nameInput;
              });
            }
            else if (typeOfAction == "duplicate") {
              this.templateStorage.duplicateTemplate(alertData.nameInput, this.templateID).then(() => {
                this.router.navigate(["/tabs/templates"], {replaceUrl: true});
              })
            }
            else {
              this.addTemplate(alertData.nameInput, "add");
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
                img: "assets/empty.svg",
                description: ""
              }
              x.combined.push(newAction);
              this.presentActionSheet("updateAction", newAction)
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
      textCard: "Get Help Now"
    },
    {
      id: 1,
      type: "Warning",
      colorCard: "warning",
      colorBtn: "warning",
      toggle: false,
      textCard: "Caution: Symptom Management"
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
      this.callAction(data.data);
    })
    return await popover.present();
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var call = {
      'Edit': () => this.callEdit(),
      'Rename': () => this.askForName('rename'),
      'Duplicate': () => this.askForName('duplicate'),
      "Delete": () => this.delete(),
      "": () => ""
    };
    (call[type] || call[""])();
  }
  backUpCriticalArray = [];
  backUpWarningArray = [];
  callEdit() {
    console.log("edit is called " + this.templateID);
    this.backUpCriticalArray = JSON.parse(JSON.stringify(this.criticalArray)); //need to deep copy to remove reference
    // this.backUpCriticalArray = [...this.criticalArray];
    // this.backUpCriticalArray = this.criticalArray.slice(0);
    // this.backUpCriticalArray = this.criticalArray.map(object => { return [...object]})
    this.backUpWarningArray = this.warningArray.slice();
    console.log("critical array === " + JSON.stringify(this.backUpCriticalArray, null, 2))
    this.editPage = true;
    return "hello"
  }

  delete() {
    this.alertCtrl.create({
      header: 'Are you sure you want to delete this template?',
      message: 'Once deleted, there is no retrieving back!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.templateStorage.deleteTemplate(this.templateID).then(() => {
              this.router.navigate(["/tabs/templates"], {replaceUrl: true});
            })
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

}
