import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
import { Setting } from '../models/symptomaction';
import { SymptomActionService } from './symptomaction.service';
import { ActionSheetController, ToastController, AlertController, PopoverController, ModalController, Platform } from '@ionic/angular';
import { TemplatePopComponent } from '.././templates/template-pop/template-pop.component';
import { computeStackId, isTabSwitch } from '@ionic/angular/dist/directives/navigation/stack-utils';

// import { AnyMxRecord } from 'dns';

const ALL_KEY = "allKey";
@Injectable({
  providedIn: 'root'
})
export class TemplateService {
public ite;
public image;
public titlea:number;
public language1;
public aa=[1];
public tx1=[];
public it; //设置重新复制1，2，3，4
public def;
public planid;
public setcgiditem:any;
public dxkz; //单选框值
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

  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    let element = type == "Symptom" ? wholeItem.combined[0] : wholeItem
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
    console.log("editPageUpdateArray=");
    this.criticalArray = val.find(x => x.id == templateID).templates[0];
    this.warningArray = val.find(x => x.id == templateID).templates[1];
    this.goodArray = val.find(x => x.id == templateID).templates[2];
    [this.criticalArray, this.warningArray, this.goodArray].forEach(eachArray => {
      eachArray.forEach(element => {
        //设置id 图
        console.log("element.symptom.symptomID="+element.symptom.symptomID);
        this.settingStorage.getOneImage("glo", element.symptom.symptomID).then(oneImg => {
          // console.log("element.symptom.img");
          // console.log(element.symptom.img);
          console.log("oneImg="+oneImg);
          element.symptom.img = oneImg;
          console.log("element.symptom.img="+element.symptom.img);
        });
        element.combined.forEach(oneCombined => {
          this.settingStorage.getOneImage("glo", oneCombined.actionID).then(actionImg => {
            oneCombined.img = actionImg;
          })
        })
      })
    })
  }
 
 //分别设置值


//获取plan的数据id
setcgid(item){
  this.setcgiditem=null;
  this.setcgiditem=item;
 
}
setplanid(id){
  this.planid=null;
  this.planid=id;
}
getplanid(){
  return this.planid;
  
}
getcgid(){
  return this.setcgiditem;
  this.setcgiditem=null;
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
    this.def=defaultLanguage;
    console.log("this.def="+this.def);
    this.aa.push(defaultLanguage);
    symptomOrAction = symptomOrAction == "updateAction" ? "Action" : symptomOrAction
    console.log("symptomOrAction="+symptomOrAction);
    if(symptomOrAction=="Symptom"){
     console.log("1+1");
      
     
        // callModal.present();
        this.language1=defaultLanguage;
        console.log("www="+this.language1);
      
      

    }
    if(symptomOrAction=="Action"){
      console.log("1+1");
       
      
         // callModal.present();
         this.language1=defaultLanguage;
         console.log("www="+this.language1);
       
       
 
     }
 
    // if(symptomOrAction=='Action'){
    //   let typeToCall = symptomOrAction == "Symptom" ? this.settingSymptom:this.settingAction;
    //   this.popOverController('modal','',typeToCall,defaultLanguage,symptomOrAction).then(callModal =>{
    //     callModal.present();
    //     callModal.onDidDismiss().then(data=>{
    //     console.log("检测到是Action");
    //     item.text = this.returnLanguage(data.data,defaultLanguage);
    //     item.img = data.data.icon;
    //     item.actionID = data.data.id;
    //   })
    //   })
     
      
    // }

      
      
      // if(defaultLanguage==1){
      //   console.log(this.aa[0]);
        
      //   // this.language1=this.aa[0];
      //   // defaultLanguage=this.aa[0];
      //   console.log("------------121--------------");
      // }
   
    

    console.log("--------------------------");
    console.log(defaultLanguage)
    console.log("--------------------------");
    this.ite=item;
    console.log("--------------------------");
    console.log(defaultLanguage)
    console.log("--------------------------");
    
   
    let typeToCall = symptomOrAction == 'Symptom' ? this.settingSymptom: this.settingAction;
    if(this.aa[0]!=defaultLanguage){
      console.log(this.aa[0]);
      this.language1=defaultLanguage;
      console.log("运行了嘛？？运行了！！！！");
      // defaultLanguage=this.aa[0];
       
    }
    else{
      defaultLanguage=this.aa[0]; //不执行
    }
    if(symptomOrAction=='Symptom'||symptomOrAction=='Action'){
      console.log("露露="+this.def);
      this.def=defaultLanguage;
      console.log("露露2="+this.aa[0]);
    this.popOverController('modal', '', typeToCall,  this.language1, symptomOrAction).then(callModal => {
      callModal.present();
    
    })}
    
    // const actionSheet = await this.actionSheetCtrl.create({
    //   header: "Select a " + symptomOrAction.toLowerCase() + " from below",
    //   cssClass: "wholeActionSheet",
    //   buttons: this.createButtons(item, symptomOrAction, defaultLanguage),
    //   mode: "ios"
    // });
    // await actionSheet.present();
  }
//新增数据+++++++++++++++++++++++++++++
  //刷新方法
  refresh(){
    console.log();
    location.reload();
  }
  chuanhui(symptomOrAction, item, defaultLanguage,data1){
    console.log("--------------------------");
    console.log("--------------------------");
    console.log("--------------------------");
    this.suoding(defaultLanguage)
    
  if(data1.id<=5){
   item=this.ite;
  }
  if(data1.id>5){
   item=this.ite;
   console.log("action item:");
   console.log(item);
  }
 


  
    console.log("--------------------------");
    // console.log(item);
    console.log("--------------------------");
   
    //let typeToCall = symptomOrAction == 'Symptom' ? this.settingSymptom: this.settingAction;
    // this.popOverController('modal', '', typeToCall, defaultLanguage, symptomOrAction).then(callModal => {
      // console.log("callModal")
      // console.log(callModal)
      // console.log("callModal")
      // callModal.present();
      // callModal.onDidDismiss().then(data => {
      //     data=data1;
      
        if (symptomOrAction == "Symptom") {
            if(this.pdzwyw(this.returnLanguage(data1,this.language1))==1){
              item.symptom.text = this.returnLanguage(data1,0)+"\n\t\r"+this.returnLanguage(data1,this.language1);
          
              item.symptom.img = data1.icon;
              this.image = data1.icon;
              console.log("this.image="+this.image);
              console.log("data1.id");
              console.log(data1.id);
              item.symptom.symptomID = data1.id2;
              
            }
        
         else{
              item.symptom.text = this.returnLanguage(data1,this.language1);
              item.symptom.img = data1.icon;
              this.image = data1.icon;
              console.log("this.image="+this.image);
              console.log("data1.id");
              console.log(data1.id);
              item.symptom.symptomID = data1.id2;
            
         }
          
       
        }
        if (symptomOrAction == "Action") {  //在这里 action
          if(this.pdzwyw(this.returnLanguage(data1,this.language1))==1){
            item.text = this.returnLanguage(data1,0)+"\n\t\r"+this.returnLanguage(data1,this.language1);
            item.img = data1.icon;
            item.id = data1.id;
            item.actionID = data1.id2;
          }
          else{
          item.text = this.returnLanguage(data1,this.language1);
          item.img = data1.icon;
          item.id = data1.id;
          item.actionID = data1.id2;}
    }
        //  console.log("item.actionID");
        //  console.log(item.actionID);
        // console.log(item.symptom.img)
        // console.log(data1)

    
      }
      // 设置获取标题
      settitlea(item){
        this.titlea=item;
        console.log("this.titlea");
        console.log(this.titlea);
      }
      gettitlea(){
       console.log("gettitlea this.titlea");
       console.log(this.titlea);
        return this.titlea;
      }
pdzwyw(str){   //判断中文英文
 
    if (/.*[\u4e00-\u9fa5]+.*/.test(str)) {
        return 1;
    } else {
      return 0;
    }

}
      setlanguage(value){   //设置语言
          this.language1=value;
      }
      language(){
        //language1
        return this.language1;
      }
      suoding(item){
        console.log("执行锁定函数");
          const a=item;
          console.log("显示锁定函数");
          console.log(a);
          return a;
      }
    fanhuiyuyan(){
      return this.language1;
    }
    setdanxuankuangzhi(value){
      this.dxkz=value;
    }
    getdanxuankuangzhi(){
     return this.dxkz;
    }
//     zhenglishuju(element,Language){
//     this.tx1=element;
// //     for(let a=1;a<=element.length;a++){
// // console.log("zhenglishuju="+element.length);
// //     this.tx1[a-1].enName=this.returnLanguage(element[a-1],Language);
// //     this.tx1[a-1].icon=element[a-1].icon;
// //     console.log("this.tx1[a-1].icon=",this.tx1[a-1].icon);
  
//   }
//   return this.tx1;
//     }
//新增数据+++++++++++++++++++++++++++++↑

  

  returnLanguage(element, defaultLanguage) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[defaultLanguage];
  }

  createButtons(itemToUpdate, type, defaultLanguage) {
    console.log("执行createButtons");
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
              //itemToUpdate.symptom.img = element.icon; 9.26 14：06分修改
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
    let completedArray = this.getAllArray();
    let name = ["criticalArray", "warningArray", "goodArray"];
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      //  eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
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
  setitem(item){
    //设置item
    this.it=item;
  }
  getitem(){
    //设置item
    return this.it;
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
