import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
import { Setting } from '../models/symptomaction';
import { SymptomActionService } from './symptomaction.service';
import { ActionSheetController, ToastController, AlertController, PopoverController, ModalController, Platform } from '@ionic/angular';
import { TemplatePopComponent } from './../templates/template-pop/template-pop.component';

const ALL_KEY = "allKey";
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage, private settingStorage: SymptomActionService, private actionSheetCtrl: ActionSheetController, private zone: NgZone, 
    private toastCtrl: ToastController, private alertCtrl: AlertController, private popoverCtrl: PopoverController, private modalCtrl: ModalController, private plt: Platform) { }

  createTemplate(finalArray, templateNameFromInput, templateID, templateNameUpdate, defaultLanguage) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      data = data || [];
      var result = {templates: finalArray, id: templateID || uuid(), name: templateNameFromInput || templateNameUpdate, language: defaultLanguage}; //https://stackoverflow.com/questions/42120358/change-property-in-array-with-spread-operator-returns-object-instead-of-array
      templateNameFromInput ? data.push(result) 
        : data[data.findIndex(item => item.id === templateID)] = result
      return this.storage.set(ALL_KEY, data)
    })
  } 

  getAllTemplate(type) {
    return this.storage.get(type);
  }
  
  getOneTemplate(id) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      return data.find(item => item.id == id);
    })
  }

  renameTemplate(name, templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      data.find(item => item.id === templateID).name = name;
      return this.storage.set(ALL_KEY, data);
    })
  }
  
  duplicateTemplate(name, templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      let itemFound = data.find(item => item.id === templateID);
      let duplicatedItem = {...itemFound, id: uuid(), name: name}
      data.push(duplicatedItem);
      return this.storage.set(ALL_KEY, data);
    })
  }

  deleteTemplate(templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      data.splice(data.findIndex(item => item.id === templateID), 1);
      return this.storage.set(ALL_KEY, data);
    })
  }

  criticalArray = [];
  warningArray = [];
  goodArray = [];
  checked = [];
  appointment = [];

  getApptArray = () => this.appointment;
  newAppt() {
    let apptObj = {
      id: uuid(),
      clinicName: "",
      appTime: "",
    }
    this.appointment.push(apptObj);
  }

  pressEvent(type, thisObject, arrayID, combinedIndex) {
    if (this.checked.length == 0) {
      let dynamicObj = type == "Symptom" ? thisObject.combined : [thisObject];
      dynamicObj.forEach(element => {
        element.whatsapp = true;
        this.checked.push({element, arrayID, combinedIndex});
      });
    }
  }

  //JW PLS TAKE NOTE
  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    let element = type == "Symptom" ? wholeItem.combined[0] : wholeItem     //if wholeItem is type is not symptom, element set to wholeItem
    element.whatsapp = !element.whatsapp;
    let itemIndex = this.checked.findIndex(x => x.element.id == element.id);
    if (itemIndex !== -1) {
      this.checked.splice(itemIndex, 1);
    }
    else {
      this.checked.push({element, arrayID, combinedIndex});
    }
  }

  clearArray() {
    this.checked.forEach(element => element.element.whatsapp = false);
    this.checked.length = 0;
  }

  deleteArray() {
    this.checked.forEach(element => {
      if (element.arrayID == 4) {
        let dynamicIndex = this.appointment.findIndex(x => x.id == element.element.id);
        this.appointment.splice(dynamicIndex, 1);
      } else {
        let thisArray = this.getArray(element.arrayID);
        let dynamicCombinedIndex = thisArray.findIndex(x => x.symptom.id == element.combinedIndex);
        let arrayIndex = thisArray[dynamicCombinedIndex].combined.findIndex(y => y.id == element.id);
        thisArray[dynamicCombinedIndex].combined.splice(arrayIndex, 1);
        thisArray[dynamicCombinedIndex].combined.length == 0 && thisArray.splice(dynamicCombinedIndex, 1);
      }
    });
    this.checked.length = 0;
  }

  deleteIOS(thisItem, arrayID, mainID, combinedID) {
    let thisArray = this.getArray(arrayID);
    thisArray[mainID].combined.splice(combinedID, 1);
    thisArray[mainID].combined.length === 0 && thisArray.splice(mainID, 1);
  }
  
  deleteIOSAppointment(thisItem) {
    this.appointment.splice(this.appointment.findIndex(x => x.id == thisItem.id), 1);
  }
  // getArray(id) { //return array type
  //   return [this.criticalArray, this.warningArray, this.goodArray][id];
  // }
  getArray = id => [this.criticalArray, this.warningArray, this.goodArray][id];
  getCompletedArray = () => [this.criticalArray, this.warningArray, this.goodArray];

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
    },
    {
      id: 2,
      type: "Good",
      colorCard: "success",
      colorBtn: "success",
      toggle: false,
      textCard: "I'm feeling well"
    }
  ]

  settingSymptom:Setting[] = [];
  settingAction = [];

  setGlobalSettings() {
    let promises = [this.settingStorage.getType("Symptom"), this.settingStorage.getType("Action")];
    Promise.all(promises).then(data => {
      this.settingSymptom = data[0];
      this.settingAction = data[1];
    });
  }

  globalLanguage = [[0, "English"], [1, "中文"], [2, "Malay"], [3, "Tamil"]];
  globalSymptom = ["Symptom", "症状", "gejala", "அறிகுறி"];
  globalAction = ["Action", "行动", "tindakan", "நடவடிக்கை"];

  selectRadio(defaultLanguage) {
    let completedArray = this.getAllArray();

    completedArray.forEach(eachArr => {

      eachArr.forEach(x => {

        let oneSetting = this.settingSymptom.find(thisSetting => thisSetting.id == x.symptom.symptomID);
        oneSetting ? 
          x.symptom.text = [oneSetting.enName, oneSetting.chName, oneSetting.myName, oneSetting.tmName][defaultLanguage] || oneSetting.enName
          : x.symptom.text = this.globalSymptom[defaultLanguage];
        x.combined.forEach(element => {
          let oneAction = this.settingAction.find(thisSetting => thisSetting.id == element.actionID);
          oneAction ?
            element.text = [oneAction.enName, oneAction.chName, oneAction.myName, oneAction.tmName][defaultLanguage] || oneAction.enName
            : element.text = this.globalAction[defaultLanguage];
        });
      })
    })
  }

  filterArray(item) {
    this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
    this.warningArray = item.template.filter(element => element.name == "warningArray");
    this.goodArray = item.template.filter(element => element.name =="goodArray");
  }

  resetArray() {
    this.criticalArray.length = 0;
    this.warningArray.length = 0;
    this.goodArray.length = 0;
    this.checked.length = 0;
    this.appointment.length = 0;
  }

  editPageUpdateArray(val, templateID) {
    this.criticalArray = val.find(x => x.id == templateID).templates[0];
    this.warningArray = val.find(x => x.id == templateID).templates[1];
    this.goodArray = val.find(x => x.id == templateID).templates[2];
    [this.criticalArray, this.warningArray, this.goodArray].forEach(eachArray => {
      eachArray.forEach(element => {
        this.settingStorage.getOneImage("Symptom", element.symptom.symptomID).then(oneImg => {
          element.symptom.img = oneImg;
        });
        element.combined.forEach(oneCombined => {
          this.settingStorage.getOneImage("Action", oneCombined.actionID).then(actionImg => {
            oneCombined.img = actionImg;
          })
        })
      })
    })
  }

  getAllArray() {
    return [this.criticalArray, this.warningArray, this.goodArray];
  }

  backUpCriticalArray = [];
  backUpWarningArray = [];
  backUpGoodArray = [];
  backUpAppointment = [];

  callEdit(defaultLanguage) {
    this.backUpCriticalArray = JSON.parse(JSON.stringify(this.criticalArray)); //need to deep copy to remove reference
    this.backUpWarningArray = JSON.parse(JSON.stringify(this.warningArray));
    this.backUpGoodArray = JSON.parse(JSON.stringify(this.goodArray));
    this.backUpAppointment = JSON.parse(JSON.stringify(this.appointment));
    let completedArray = this.getAllArray();
    completedArray.forEach(element => {
      element.forEach(array => {
        if (array.combined.length == 0) {
          let newAction = {
            id: uuid(),
            // text: "Action",
            text: this.globalAction[defaultLanguage],
            type: "Action",
            img: "assets/empty.svg",
            description: "",
            actionID: ""
          }
          array.combined.push(newAction);
        }
      });
    })
  }
  
  goToViewPageFromEdit() {
    this.criticalArray = [...this.backUpCriticalArray];
    this.warningArray = [...this.backUpWarningArray];
    this.goodArray = [...this.backUpGoodArray];
    this.appointment = [...this.backUpAppointment];
  }


  alertInput(templateName) {
    return new Promise(async (resolve, reject) => {
      let alert = await this.alertCtrl.create({
        header: templateName,
        message: "",
        cssClass: "testCSS",
        inputs: [
          {
            name: 'nameInput',
            type: 'text'
          }
        ],
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            cssClass: 'cancelBlueBtn',
            handler: () => reject(false)
          },
          {
            text: 'OK',
            cssClass: 'okBlueBtn',
            handler: (alertData) => {
              if (alertData.nameInput.trim() === "") {
                alert.message = "Name is required!"; //https://stackoverflow.com/questions/45969821/alert-controller-input-box-validation
                this.presentToastWithOptions("Name is required!");
                return false;
              }
              else if (alertData.nameInput.trim().length > 35) {
                alert.message = "Name too long!";
                this.presentToastWithOptions("Name too long!");
                return false;
              }
              resolve(alertData.nameInput.trim());
            }
          }
        ]
      })
      await alert.present().then(() => {
        let x:any= document.querySelector('ion-alert input'); //https://forum.ionicframework.com/t/set-focus-on-input-inside-alert-prompt/51885/6
        x.focus();
        return;
      });
    })
  }

  //https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
   presentActionSheet(symptomOrAction, item, defaultLanguage) { //https://ionicframework.com/docs/api/action-sheet
    symptomOrAction = symptomOrAction == "updateAction" ? "Action" : symptomOrAction
    if (this.checkSymptomOrActionEmpty(symptomOrAction)) {
      return false;
    }
    let typeToCall = symptomOrAction == 'Symptom' ? this.settingSymptom: this.settingAction;
    this.popOverController('modal', '', typeToCall, defaultLanguage, symptomOrAction).then(callModal => {
      callModal.present();
      callModal.onDidDismiss().then(data => {
        if (!data.data) return false;
        if (symptomOrAction == "Symptom") {
          item.symptom.text = this.returnLanguage(data.data, defaultLanguage);
          item.symptom.img = data.data.icon;
          item.symptom.symptomID = data.data.id;
        }
        else {
          item.text = this.returnLanguage(data.data, defaultLanguage);
          item.img = data.data.icon;
          item.actionID = data.data.id;
        }
      })
    })
    // const actionSheet = await this.actionSheetCtrl.create({
    //   header: "Select a " + symptomOrAction.toLowerCase() + " from below",
    //   cssClass: "wholeActionSheet",
    //   buttons: this.createButtons(item, symptomOrAction, defaultLanguage),
    //   mode: "ios"
    // });
    // await actionSheet.present();
  }

  returnLanguage(element, defaultLanguage) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[defaultLanguage] || element.enName;
  }

  createButtons(itemToUpdate, type, defaultLanguage) {
    let buttons = [];
    let typeToCall = type == "Symptom" ? this.settingSymptom : this.settingAction
    typeToCall.forEach((element: Setting, index) => {
      let style = document.createElement('style'); //https://github.com/ionic-team/ionic/issues/6589
      style.type = "text/css";
      style.innerHTML = ".customCSSClass" + index + '{background: url('+ "'" + element.icon + "'" + ') no-repeat !important; padding: 40px 20% 40px 25% !important; margin-top:25px !important; background-size:80px 80px !important; margin-left: 30px !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);

      let elementArray = [element.enName, element.chName, element.myName, element.tmName];
      let nameLanguage = elementArray[defaultLanguage] || element.enName;

      let button = {
        // text: element.enName,
        text: nameLanguage,
        //icon: "assets/icon/cough.png",
        cssClass: 'customCSSClass'+ index,
        handler: () => {
          console.log(`${element.enName} clicked and full element --> ` + JSON.stringify(element, null, 2));
          console.log("item to update ==> " + JSON.stringify(itemToUpdate, null, 2));
      //put zone here
          this.zone.run(() => {
            if (type == "Symptom") {
              itemToUpdate.symptom.text = nameLanguage;
              itemToUpdate.symptom.img = element.icon;
              itemToUpdate.symptom.symptomID = element.id;
            }
            else {
              console.log("update action?");
              itemToUpdate.text = nameLanguage;
              itemToUpdate.img = element.icon;
              itemToUpdate.actionID = element.id;
            }
          })
          console.warn("item to update " + JSON.stringify(itemToUpdate, null, 2));
          // console.log("whole array = " + JSON.stringify(this.criticalArray));
        }
      }
      buttons.push(button);
    });
    buttons.push({
      text: "CANCEL",
      icon: "close",
      role: "selected"
    })
    return buttons;
  }

  addNewCriticalArray(type, id, defaultLanguage) {
    // console.log("clicked " + type); //critical or caution or good
    let thisArray = this.getArray(id);
    let newPair = {
      symptom: {
        id: uuid(),
        // text: "Symptom",
        text: this.globalSymptom[defaultLanguage],
        type: "Symptom",
        img: "assets/empty.svg",
        description: "",
        symptomID: "",
      },
      combined: [
        {
          id: uuid(),
          // text: "Action",
          text: this.globalAction[defaultLanguage],
          type: "Action",
          img: "assets/empty.svg",
          description: "",
          actionID: ""
        }
      ]
    }
    thisArray.push(newPair); //double push
  }

  
  popUp(id, defaultLanguage) {
    let thisArray = this.getArray(id);
    if (thisArray.every(a => this.globalSymptom.includes(a.symptom.text))) {
      this.presentToastWithOptions("Actions are allowed only when symptoms have been selected!");
      return false;
    }
    this.alertCtrl.create({
      header: "Select a symptom",
      inputs: this.createRadios(id),
      mode:'ios',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'cancelBlueBtn'
        },
        {
          text: 'OK',
          handler: (alertData => {
            let x = thisArray.find(x => x.symptom.id == alertData);
            let newAction = {
              id: uuid(),
              // text: "Action",
              text: this.globalAction[defaultLanguage],
              type: "Action",
              img: "assets/empty.svg",
              description: "",
              actionID: ""
            }
            x.combined.push(newAction);
            this.presentActionSheet("updateAction", newAction, defaultLanguage)
          })
        }
      ]}).then(alert => {
        alert.present()
      });
  }

  createRadios(id) {
    let thisArray = this.getArray(id);
    let radioBtns = [];
    // this.criticalArray.filter(word => word.symptom.text !== "Symptom").forEach(element => {
    thisArray.filter(word => !this.globalSymptom.includes(word.symptom.text)).forEach((element, index) => {
      let radioBtn = {
        type: "radio",
        label: (index + 1) + ". " + element.symptom.text,
        // value: element.symptom.text
        value: element.symptom.id
      }
      radioBtns.push(radioBtn);
    })
    radioBtns[0].checked = true;
    return radioBtns;
  }

  async presentToastWithOptions(text) {
    const toast = await this.toastCtrl.create({
      header: text,
      duration: 3000,
      position: 'bottom',
      buttons: [{
        text: 'CLOSE',
        role: 'cancel'
      }]
    });
    toast.present();
  }

  cleansedArray() {
    let completedArray = this.getAllArray();    //getAllArray returns 3 arrays: critical, warning, good
    let name = ["criticalArray", "warningArray", "goodArray"];
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      //  eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");

      //eachArr is either critical, warning, good
      //data is object within the array
      //data contains an object named symptom, an array named combined
      eachArr = eachArr.filter(data => !this.globalSymptom.includes(data.symptom.text));
      eachArr.map(x => {
        x.symptom.img = null;
        //  x.combined = x.combined.filter(thisAction => thisAction.text !== "Action");
        x.combined = x.combined.filter(thisAction => !this.globalAction.includes(thisAction.text));
        x.combined.forEach(element => {
          delete element.whatsapp;
          element.img = null;
        });
        x.id = uuid(); 
        x.name = name[index];
      });
      return eachArr;
    });
    return maparr;
  }

  checkAllArrayEmpty(text) {
    let returnValue = false;
    if (!this.getAllArray().some(x => x.some(y => !this.globalSymptom.includes(y.symptom.text)))) {
      this.presentToastWithOptions("Please select at least one symptom before " + text);
      returnValue = true;
    } // https://stackoverflow.com/a/50475787
    return returnValue;
  }

  checkAppointmentEmpty() {
    let returnValue = false;
    this.appointment.forEach(x => {
      if (!x.clinicName.trim() && !x.appTime) {this.presentToastWithOptions("Please ensure both clinic name and time for appointment is filled up"); returnValue=true;return false}
      else if (!x.clinicName.trim()) { this.presentToastWithOptions("Please ensure all the clinic name for appointment is filled up"); returnValue=true;return false}
      else if (!x.appTime) {this.presentToastWithOptions("Please ensure all the appointment time is filled up"); returnValue=true;return false}
    })
    return returnValue;
  }

  checkSymptomOrActionEmpty(type) {
    let thisList = type == "Action" ? this.settingAction : this.settingSymptom;
    thisList.length == 0 && this.presentToastWithOptions(`No ${type} found. Please add ${type} in settings!`);
    return thisList.length == 0
  }

  delete(headerMsg) {
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        header: headerMsg,
        message: 'Once deleted, there is no retrieving back!',
        buttons: [
          {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'cancelBlueBtn',
          handler: () => reject(false)
        },
        {
          text: 'DELETE',
          cssClass: 'deleteRedBtn',
          handler: () => resolve(true)
        }
        ]
      }).then(alert => {
        alert.present();
      })
    })
  }

  popOverController(type, x, menuOptions, defaultLanguage?, symptomOrAction?) {
    let obj = {component: TemplatePopComponent, componentProps: {menuOptions, type, defaultLanguage, symptomOrAction}};
    return type == 'modal' ? this.modalCtrl.create(obj) : this.popoverCtrl.create({...obj, event: x});
  }
  
  checkPlatformAndroid() {
    return this.plt.is("android")
  }
  
} //end of class




  /*
  // get one template by id
  getTemplateItemById(id): Promise<TemplateRecord> {
    return this.storage.get(TEMPLATETABLE_KEY).then(result => {
      return result.filter(item => item.id === id);
    });
  }

  // get all templates
  getAllTemplateItems(): Promise<TemplateRecord[]> {
    return this.storage.get(TEMPLATETABLE_KEY);
  }

  // add a new template info into templatetable, return a promise to indicate the status of creating a key-values pair
  addTemplateItem(newitem: TemplateRecord): Promise<any> {
    return this.storage.get(TEMPLATETABLE_KEY).then((items: TemplateRecord[]) => {
      if (items) {
        items.push(newitem);
        return this.storage.set(TEMPLATETABLE_KEY, items);
      } else {
        return this.storage.set(TEMPLATETABLE_KEY, [newitem]);
      }
    });
  }

  // update one template record
  updateTemplateItem(item: TemplateRecord): Promise<any> {
    return this.storage.get(TEMPLATETABLE_KEY).then((items: TemplateRecord[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      // tslint:disable-next-line:prefer-const
      let newItems: TemplateRecord[] = [];

      // tslint:disable-next-line:prefer-const
      for (let indexitem of items) {
        if (indexitem.id === item.id) {
          newItems.push(item);
        } else {
            newItems.push(indexitem);
        }

      }
      return this.storage.set(TEMPLATETABLE_KEY, newItems);
    });
  }

  // delete one template record by id
  deleteTemplateItemById(id: string): Promise<TemplateRecord> {
    return this.storage.get(TEMPLATETABLE_KEY).then((items: TemplateRecord[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      // tslint:disable-next-line:prefer-const
      let toKeepItems: TemplateRecord[] = [];

      // tslint:disable-next-line:prefer-const
      for (let indexitem of items) {
        if (indexitem.id !== id) {
          toKeepItems.push(indexitem);
        }
      }
      return this.storage.set(TEMPLATETABLE_KEY, toKeepItems);
    });
  }

}
*/
