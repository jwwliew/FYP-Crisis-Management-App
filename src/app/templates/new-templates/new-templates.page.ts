import { Component, OnInit, NgZone } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, Events, PopoverController } from '@ionic/angular';
import {v4 as uuid} from 'uuid';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';
import { TemplatePopComponent } from '../template-pop/template-pop.component';
import { SettingService } from 'src/app/services/setting.service';
import { Setting, SettingAction } from 'src/app/models/setting';

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

  settingObj: Setting[] = [
    {
      id: uuid(),
      enName: "Fever from pdf",
      chName: "发烧",
      myName: "fever malay",
      tmName: "fever tamil",
      icon: "assets/pdfcough.png",
    },
    {
      id: uuid(),
      enName: "No breath from pdf",
      chName: "没有气息",
      myName: "no breadth malay",
      tmName: "no breadth tamil",
      icon: "assets/pdfnobreath.png"
    },
    {
      id: uuid(),
      enName: "Got breath",
      chName: "有呼吸",
      myName: "got breath malay",
      tmName: "got breath tamil",
      icon: "assets/pdfgotbreath.png"
    }
  ]
  actionObj: SettingAction[] = [
    {
      id: uuid(),
      enName: "Call 995",
      chName: "呼叫995",
      myName: "call 995 malay",
      tmName: "call 995 tamil",
      icon: "assets/pdfcall995.png",
    },
    {
      id: uuid(),
      enName: "Continue regular medications",
      chName: "继续定期服用中药",
      myName: "continue regular med malay",
      tmName: "continue regular med tamil",
      icon: "assets/pdfcontinuemed.png"
    },
    {
      id: uuid(),
      enName: "Maintain usual activities/exercise levels",
      chName: "保持通常的活动/运动水平",
      myName: "maintain usual activities malay",
      tmName: "maintain usual activities tamil",
      icon: "assets/pdfmaintain.png"
    }
  ]

  settingSymptom:Setting[] = [];
  settingAction = [];

  globalLanguage = [[0, "English"], [1, "中文"], [2, "Malay"], [3, "Tamil"]];
  defaultLanguage = 0;

  selectRadio() {
    console.error("selected " + this.defaultLanguage);
  }

  constructor(private actionSheetCtrl: ActionSheetController, private router: Router, private templateStorage: TemplateService, private alertCtrl: AlertController, 
    private toastCtrl: ToastController, private event: Events, private popoverCtrl: PopoverController, private settingStorage: SettingService, private zone: NgZone) {
      console.error("CONSTURCTOR CALLlED")
      this.event.subscribe("view", item => { //or services https://stackoverflow.com/questions/54304481/ionic-4-angular-7-passing-object-data-to-another-page
        this.viewPage = true;
        console.log("view page = " + this.viewPage + " edit page = " + this.editPage);
        this.templateName = item.name;
        this.templateID = item.id;
        console.warn("item received --- " + JSON.stringify(item, null, 2));
        console.log(item.template);
        this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
        this.warningArray = item.template.filter(element => element.name == "warningArray");
        console.log("this critical array = " + JSON.stringify(this.criticalArray, null, 2))
      })
  
      let promises = [this.settingStorage.getType("Symptom"), this.settingStorage.getType("Action")];
      Promise.all(promises).then(data => {
        this.settingSymptom = data[0] ? [...this.settingObj, ...data[0]] : [...this.settingObj];
        this.settingAction = data[1] ? [...this.actionObj, ...data[1]] : [...this.actionObj];
        console.error("setting symptom data[0] " + JSON.stringify(this.settingSymptom, null, 2));
      })
    }

  ngOnInit() {
  }
  criticalArray = [];
  warningArray = [];

  checked = [];

  pressEvent(type, thisObject, arrayID) {
    if (this.checked.length == 0) {
      let dynamicObj = type == "Symptom" ? thisObject.combined : [thisObject];
      console.error("dynamic obj = " + JSON.stringify(dynamicObj,null, 2));
      dynamicObj.forEach(element => {
        element.whatsapp = true;
        element.arrayID = arrayID;
        this.checked.push(element);
      });
    }
    console.error("this.checked after pressed = " + JSON.stringify(this.checked, null, 2));
  }

  clickEvent(type, wholeItem, arrayID) {
    console.log("pressed clicked" + JSON.stringify(wholeItem,null,2));
    console.error("whole checked array before anything = " + JSON.stringify(this.checked, null, 2));
    let itemConverted = type == "Symptom" ? wholeItem.combined[0] : wholeItem
    itemConverted.whatsapp = !itemConverted.whatsapp;
    console.warn("item index = " + itemConverted.id);
    //let itemIndex = this.checked.indexOf(itemConverted.id);
    let itemIndex = this.checked.findIndex(x => x.id == itemConverted.id);

    if (itemIndex !== -1) {
      this.checked.splice(itemIndex, 1);
      console.error("spliced!!!");
    }
    else {
      // this.checked.push(itemConverted.id);
      itemConverted.arrayID = arrayID;
      this.checked.push(itemConverted);
      console.error("pusheddd!!!");
    }
    console.error("spliced finish checked array = " + JSON.stringify(this.checked, null, 2));
  }

  clearArray() {
    console.error("clicked clear");
    this.checked.forEach(element => {
      console.error("element == " + JSON.stringify(element, null, 2));
      element.whatsapp = false;
    });
    this.checked.length = 0;
  }

  deleteArray() {
    this.checked.forEach(element => {
      console.error("deleting this element === " + JSON.stringify(element,null,2));
      let thisArray = this.getArray(element.arrayID);
      console.error("this array retrieved = " + JSON.stringify(thisArray,null,2));
      console.warn(thisArray[0].combined[0])
      // let index = thisArray[0].combined.findIndex(x => x.id == element.id);
      // let index = thisArray.findIndex(x => x.combined.findIndex(y => y.id == element.id));
      let index;
      thisArray.map((x, keyIndex) => {
        var found = x.combined.some(y => y.id == element.id)
        if (found) index = keyIndex;
      });
      console.error("index === " + index);
      let arrayIndex = thisArray[index].combined.findIndex(y => y.id == element.id);
      console.error("array index ---- " + arrayIndex);
      thisArray[index].combined.splice(arrayIndex, 1);
    });
    this.criticalArray = this.criticalArray.filter(x => x.combined.length !== 0);
    this.warningArray = this.warningArray.filter(x => x.combined.length !== 0);
    console.error("after del critical array = " + JSON.stringify(this.criticalArray,null, 2));
    console.error("after del warning array = " + JSON.stringify(this.warningArray,null, 2));
    this.checked.length = 0;
  }

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
    typeToCall.forEach((element: Setting, index) => {
      let style = document.createElement('style'); //https://github.com/ionic-team/ionic/issues/6589
      style.type = "text/css";
      style.innerHTML = ".customCSSClass" + index + '{background: url('+ "'" + element.icon + "'" + ') no-repeat !important; padding: 40px 20% 40px 25% !important; margin-top:25px !important; background-size:80px 80px !important; margin-left: 30px !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);

      let elementArray = [element.enName, element.chName, element.myName, element.tmName];
      let nameLanguage = elementArray[this.defaultLanguage] || element.enName;

      let button = {
        // text: element.enName,
        text: nameLanguage,
        //icon: "assets/icon/cough.png",
        cssClass: 'customCSSClass'+ index,
        handler: () => {
          console.log(`${element.enName} clicked`);
          console.log(itemToUpdate)
      //put zone here
          this.zone.run(() => {
            if (type == "Symptom") {
              itemToUpdate.symptom.text = nameLanguage;
              itemToUpdate.symptom.img = element.icon;
            }
            else {
              console.log("update action?");
              itemToUpdate.text = nameLanguage;
              itemToUpdate.img = element.icon;
            }
          })
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
        id: uuid(),
        text: "Symptom",
        type: "Symptom",
        img: "assets/empty.svg",
        description: ""
      },
      combined: [
        {
          id: uuid(),
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
      eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
      eachArr.map(x => {
        x.combined = x.combined.filter(thisAction => thisAction.text !== "Action");
        x.combined.forEach(element => {
          delete element.whatsapp;
          delete element.arrayID; 
        });
        x.id = uuid(); 
        x.name = name[index];
      });
      return eachArr;
      // eachArr.forEach((x,xIndex) => {
      //   if (x.symptom.text == "Symptom") {
      //     eachArr.splice(xIndex, 1);
      //   }
      //   else {
      //     x.combined.forEach((element,elementIndex) => {
      //       if (element.text == "Action") {
      //         x.combined.splice(elementIndex, 1);
      //       }
      //       else {
      //         delete element.whatsapp;
      //         delete element.arrayID;
      //       }
      //       x.id = uuid();
      //       x.name = name[index];
      //     });
      //   }
      // })
      // return eachArr;
    })
    
    console.warn("in middle watar" + JSON.stringify(completedArray[0]))
    console.error(JSON.stringify(maparr, null, 2));
    // this.criticalArray = this.criticalArray.filter(data => data.symptom.text !== "Symptom");
    // this.criticalArray.forEach(x => x.id = uuid());
    this.templateStorage.createTemplate(maparr, templateNameFromInput, addOrUpdate, this.templateID, this.templateName).then((val) => {
      // this.event.publish("created", this.criticalArray);
      console.error("VAL " + JSON.stringify(val,null,2))
      if (addOrUpdate == "add") {
        this.router.navigateByUrl('/tabs/templates'); //routing start from root level
      }
      else {
        console.warn("criticla array view page true = " + JSON.stringify(this.criticalArray, null, 2));
        console.error("VAL [0] " + JSON.stringify(val[0].templates,null,2));
        // this.criticalArray.filter(x => x.symptom.text !== "Symptom").forEach((x,index) => {
        //   console.log("X === " + JSON.stringify(x,null,2))
        //   if (x.combined.text == "Action") {
        //     console.error("SPLICE");
        //     x.combined.splice(index, 1)
        //   }
        // });
        val.forEach(element => {
          console.log("finally elmeent ?? " + JSON.stringify(element.id,null,2))
        });
        this.criticalArray = val.find(x => x.id == this.templateID).templates[0];
        this.warningArray = val.find(x => x.id == this.templateID).templates[1];
        console.warn("after filter " + JSON.stringify(this.criticalArray,null,2))
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
              console.warn("this arr = " + JSON.stringify(thisArr, null, 2))
              if (alertData === undefined) {
                this.presentToastWithOptions();
                return false; //https://stackoverflow.com/questions/45969821/alert-controller-input-box-validation
              }
              else {
                let x = thisArr.find(x => x.symptom.id == alertData);
                console.error("X + " + JSON.stringify(x,null,2));
                let newAction = {
                  id: uuid(),
                  text: "Action",
                  type: "Action",
                  img: "assets/empty.svg",
                  description: ""
                }
                x.combined.push(newAction);
                this.presentActionSheet("updateAction", newAction)
                // console.error("pushed after " + JSON.stringify(this.criticalArray));
                console.error("pushed after " + JSON.stringify(thisArr));
              }
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
        // value: element.symptom.text
        value: element.symptom.id
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
    let newAction = {
      id: uuid(),
      text: "Action",
      type: "Action",
      img: "assets/empty.svg",
      description: ""
    }
    this.backUpCriticalArray = JSON.parse(JSON.stringify(this.criticalArray)); //need to deep copy to remove reference
    // this.backUpCriticalArray = [...this.criticalArray];
    // this.backUpCriticalArray = this.criticalArray.slice(0);
    // this.backUpCriticalArray = this.criticalArray.map(object => { return [...object]})
    this.backUpWarningArray = this.warningArray.slice();
    console.log("critical array === " + JSON.stringify(this.backUpCriticalArray, null, 2))
    let totalArray = [this.criticalArray, this.warningArray]
    totalArray.forEach(element => {
      element.forEach(array => {
        if (array.combined.length == 0) {
          array.combined.push(newAction);
        }
      });
    })
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
