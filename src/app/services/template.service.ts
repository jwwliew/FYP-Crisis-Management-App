import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
import { Setting } from '../models/symptomaction';
import { SymptomActionService } from './symptomaction.service';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';

const TEMPLATE_KEY = "templateKey";
const WARNING_KEY = "warningKey";
const ALL_KEY = "allKey";
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage, private settingStorage: SymptomActionService, private actionSheetCtrl: ActionSheetController, private zone: NgZone, 
    private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  createTemplate(finalArray, templateNameFromInput, addOrUpdate, templateID, templateNameUpdate, defaultLanguage) {
    let arrKey = [TEMPLATE_KEY, WARNING_KEY];

    let promises = [this.getAllTemplate(TEMPLATE_KEY), this.getAllTemplate(WARNING_KEY)];
    // return Promise.all(promises).then(data => { //https://forum.ionicframework.com/t/localstorage-best-practice-to-set-multiple-keys/130106
    //   console.warn("data == " + JSON.stringify(data));
    //   finalArray.forEach((element, index) => {
    //     console.warn(JSON.stringify(element));
    //     data[index] = data[index] || [];
    //     if (element && element.length > 0) { //https://stackoverflow.com/questions/46022712/how-to-check-if-local-storage-key-does-not-exist
    //       console.log(element[0].combined);
    //       element[0].combined = element[0].combined.filter(item => item.text !== "Action");
    //       // element[0].combined.slice().reverse().forEach((item,index,object) => {
    //       //   if (item.text == "Action") {
    //       //     element[0].combined.splice(object.length - 1 - index, 1) //https://stackoverflow.com/questions/24812930/how-to-remove-element-from-array-in-foreach-loop
    //       //   }
    //       // });
    //       console.log("afetr filter error " + JSON.stringify(element));
    //       data[index].push(element);
    //       console.error("data index == " + JSON.stringify(data[index]));
    //     }
    //     return this.storage.set(arrKey[index], data[index]);
    //   })
    // }) 
    return this.getAllTemplate(ALL_KEY).then(data => {
      console.log("get all key = " + JSON.stringify(data));
      data = data || [];
      let arr = [];
      console.log("final array === " + JSON.stringify(finalArray, null, 2));
      finalArray.forEach((element, index) => {
        // data[index] = data[index] || [];
        // console.warn("data index ---- " + JSON.stringify(data[index]));
        console.warn(`element index --> ${index}` + JSON.stringify(element, null, 2));
        if (element && element.length > 0) {
          console.log("filtered element [0]" + JSON.stringify(element[0], null, 2));
          console.log("element lenggth --> " + element[0].combined.length);
          element[0].combined = element[0].combined.filter(item => item.text !== "Action"); //https://stackoverflow.com/questions/9289/removing-elements-with-array-map-in-javascript need to dynamic
          console.error(`filtered!!! ${index} ` + JSON.stringify(element[index], null, 2));
          // data[index].push(element);
          // arr.push(element);
        }
        element = element || [];
        arr.push(element);
      });
      var result = {templates: [...arr], id: templateID || uuid(), name: templateNameFromInput, language: defaultLanguage}; //https://stackoverflow.com/questions/42120358/change-property-in-array-with-spread-operator-returns-object-instead-of-array
      if (addOrUpdate == "add") {
        data.push(result);
      }
      else {
        result.name = templateNameUpdate;
        console.warn("ELSE DATA FULL ID? === " + JSON.stringify(data, null, 2));
        console.warn("tempalte ID = " + templateID);
        let itemIndex = data.findIndex(item => item.id === templateID);
        console.error("item index = " + itemIndex);
        data[itemIndex] = result;
      }
      console.log("RESULT WATAR " + JSON.stringify(result, null, 2));
      console.warn("final data === " + JSON.stringify(data, null, 2))
      return this.storage.set(ALL_KEY, data)
    })
    // return this.getAllTemplate(TEMPLATE_KEY).then(val => {
    //   val = val || [];
    //   val.push(finalArray);
    //   return this.storage.set(TEMPLATE_KEY, finalArray)
    // })
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
      let itemIndex = data.findIndex(item => item.id === templateID);
      data[itemIndex].name = name;
      return this.storage.set(ALL_KEY, data);
    })
  }
  
  duplicateTemplate(name, templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      let itemFound = data.find(item => item.id === templateID);
      // itemFound.id = uuid();
      // itemFound.name = name;
      let duplicatedItem = {...itemFound, id: uuid(), name: name}
      console.error(duplicatedItem);
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

  getChecked() {
    return this.checked;
  }

  pressEvent(type, thisObject, arrayID) {
    if (this.checked.length == 0) {
      console.error("type === " + type);
      console.error("this object full === " + JSON.stringify(thisObject,null,2));
      let dynamicObj = type == "Symptom" ? thisObject.combined : [thisObject];
      console.error("dynamic obj = " + JSON.stringify(dynamicObj,null, 2));
      dynamicObj.forEach(element => {
        console.error("element == " + JSON.stringify(element,null,2));
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
      console.warn(thisArray[0].combined[0]);
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
    this.goodArray = this.goodArray.filter(x => x.combined.length !== 0);
    console.error("after del critical array = " + JSON.stringify(this.criticalArray,null, 2));
    console.error("after del warning array = " + JSON.stringify(this.warningArray,null, 2));
    this.checked.length = 0;
  }

  getArray(id) { //return array type
    let completedArray = [this.criticalArray, this.warningArray, this.goodArray];
    return completedArray[id];
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

  getFrontViewData() {
    return this.frontViewData;
  }

  settingSymptom:Setting[] = [];
  settingAction = [];

  setGlobalSettings() {
    let promises = [this.settingStorage.getType("Symptom"), this.settingStorage.getType("Action")];
    Promise.all(promises).then(data => {
      // console.error("data promises " + JSON.stringify(data,null,2));
      this.settingSymptom = data[0];
      this.settingAction = data[1];
      // this.settingSymptom = data[0] ? [...this.settingObj, ...data[0]] : [...this.settingObj];
      // this.settingAction = data[1] ? [...this.actionObj, ...data[1]] : [...this.actionObj];
      console.error("setting symptom data[0] " + JSON.stringify(this.settingSymptom, null, 2));
    });
  }

  getGlobalSettings(type) {
    return type == "Symptom" ? this.settingSymptom : this.settingAction
  }

  globalLanguage = [[0, "English"], [1, "中文"], [2, "Malay"], [3, "Tamil"]];
  globalSymptom = ["Symptom", "症状", "gejala", "அறிகுறி"];
  globalAction = ["Action", "行动", "tindakan", "நடவடிக்கை"];
  
  getGlobalLanguage() {
    return this.globalLanguage;
  }

  selectRadio(defaultLanguage) {
    let completedArray = [this.criticalArray, this.warningArray, this.goodArray];
    console.error("selected " + defaultLanguage);
    console.error("this setting symptom === " + JSON.stringify(this.settingSymptom, null, 2));
    console.error("completed array ===== " + JSON.stringify(completedArray, null, 2));
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
    console.error("mapparrr ---> " + JSON.stringify(completedArray, null, 2));
  }

  filterArray(item) {
    this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
    this.warningArray = item.template.filter(element => element.name == "warningArray");
    this.goodArray = item.template.filter(element => element.name =="goodArray");
    console.log("this critical array = " + JSON.stringify(this.criticalArray, null, 2))
  }

  resetArray() {
    this.criticalArray.length = 0;
    this.warningArray.length = 0;
    this.goodArray.length = 0;
    this.checked.length = 0;
  }

  editPageUpdateArray(val, templateID) {
    this.criticalArray = val.find(x => x.id == templateID).templates[0];
    this.warningArray = val.find(x => x.id == templateID).templates[1];
    this.goodArray = val.find(x => x.id == templateID).templates[2];
    console.warn("after filter " + JSON.stringify(this.criticalArray,null,2))
  }

  getAllArray() {
    return [this.criticalArray, this.warningArray, this.goodArray];
  }

  backUpCriticalArray = [];
  backUpWarningArray = [];
  backUpGoodArray = [];

  callEdit(defaultLanguage) {
    this.backUpCriticalArray = JSON.parse(JSON.stringify(this.criticalArray)); //need to deep copy to remove reference
    // this.backUpCriticalArray = [...this.criticalArray];
    // this.backUpCriticalArray = this.criticalArray.slice(0);
    // this.backUpCriticalArray = this.criticalArray.map(object => { return [...object]})
    this.backUpWarningArray = this.warningArray.slice();
    this.backUpGoodArray = [...this.goodArray];

    console.log("critical array === " + JSON.stringify(this.backUpCriticalArray, null, 2));
    let totalArray = [this.criticalArray, this.warningArray, this.goodArray];
    totalArray.forEach(element => {
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
    console.log("going back to view page ... " + JSON.stringify(this.backUpCriticalArray,null,2));
  }


  //https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  async presentActionSheet(symptomOrAction, item, defaultLanguage) { //https://ionicframework.com/docs/api/action-sheet
    symptomOrAction = symptomOrAction == "updateAction" ? "action" : symptomOrAction
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select a " + symptomOrAction.toLowerCase() + " from below",
      cssClass: "wholeActionSheet",
      buttons: this.createButtons(item, symptomOrAction, defaultLanguage),
      mode: "ios"
    });
    await actionSheet.present();
  }

  createButtons(itemToUpdate, type, defaultLanguage) {
    let buttons = [];
    let typeToCall = this.getGlobalSettings(type);
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
      text: "Cancel",
      icon: "close",
      role: "selected"
    })
    return buttons;
  }

  addNewCriticalArray(type, id, defaultLanguage) {
    console.log("clicked " + type); //critical or caution or good
    let thisArr = this.getArray(id);
    let newPair = {
      // 'id': 1,
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
    thisArr.push(newPair); //double push
    console.log(thisArr);
  }

  
  popUp(id, defaultLanguage) {
    console.log("clicked added new");
    let thisArr = this.getArray(id);
    // if (this.criticalArray.every(a => a.symptom.text == "Symptom")) {
    // if (thisArr.every(a => a.symptom.text == "Symptom")) {
    if (thisArr.every(a => this.globalSymptom.includes(a))) {
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
                  // text: "Action",
                  text: this.globalAction[defaultLanguage],
                  type: "Action",
                  img: "assets/empty.svg",
                  description: "",
                  actionID: ""
                }
                x.combined.push(newAction);
                this.presentActionSheet("updateAction", newAction, defaultLanguage)
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

  cleansedArray() {
    let completedArray = [this.criticalArray, this.warningArray, this.goodArray];
    let name = ["criticalArray", "warningArray", "goodArray"];
    console.log("critical array = " + JSON.stringify(this.criticalArray));
    console.log("warning array = " + JSON.stringify(this.warningArray));
    //  console.log("critical array = " + JSON.stringify(this.completedArray[0]));
    //  console.log("warning array = " + JSON.stringify(this.completedArray[1]));
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      //  eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
      eachArr = eachArr.filter(data => !this.globalSymptom.includes(data.symptom.text));
      eachArr.map(x => {
        //  x.combined = x.combined.filter(thisAction => thisAction.text !== "Action");
        x.combined = x.combined.filter(thisAction => !this.globalAction.includes(thisAction.text));
        x.combined.forEach(element => {
          delete element.whatsapp;
          delete element.arrayID; 
        });
        x.id = uuid(); 
        x.name = name[index];
      });
      return eachArr;
    });
    return maparr;
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
