import { SettingAction, Setting } from './models/symptomaction';
import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';

import { File } from '@ionic-native/file/ngx';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {


  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private file: File,
  ) {
    // for(let i = 100; i--;) {
      // let globalPlanObj = {
          // id: uuid(),
          // ccontact: "100000" + i,
          // cname: "cname" + i,
          // createdDate: new Date().toLocaleString('en-GB', {hour12: true}), //https://angular.io/api/common/DatePipe
          // https://stackoverflow.com/a/32301169, https://stackoverflow.com/a/13136778, looping backwards date working on browser/emulator not on my device for some reason?
          // createdDate: new Date(Date.now() - (864e5 * (100-i))).toLocaleString(), 
          // language: 0,
          // name: "nameplan" + i,
          // nric: "S1234567Z" + i,
          // planName: "planName" + i,
          // appointment: [],
          // templates: []
      // }
      // this.globalPlan.push(globalPlanObj)
      // for (let i = 0; i < 50; i++) {
      //   let planObj = {
      //     id: uuid(),
      //     ccontact: this.listOfContact[i],
      //     cname: "Brandon Tan",
      //     createdDate: new Date(Date.now() - (864e5 * (50-i))).toLocaleString('en-US'),
      //     language: 0,
      //     name: this.listOfNameFirstLine[i],
      //     nric: this.listOfNric[i],
      //     planName: this.listOfPlanName[i],
      //     appointment: [],
      //     templates: []
      //   }
      //   this.globalPlanObj.unshift(planObj)
      // }
      // JW COMMENTED THIS PART TO STOP LOADING PLACEHOLDER DATA ON INITIALIZE :)
    // }
    this.initializeApp();
  }

  globalPlanObj = [];

  //UNUSED, FOR REFERENCE ONLY
  //JW: create persistent txt file to store settings for "dont ask again"
  // dontAskAgain() {
  //   window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {
  //     fs.root.getFile("exportDontAskAgain.txt", { create: true, exclusive: false }, function (fileEntry) {
  //       //console.log(fileEntry.name)
  //       //console.log("path => " + fileEntry.fullPath)
  //       writeFile(fileEntry, "exportDontAskAgain=false")
  //     }, onErrorCreateFile)
  //   }, onErrorLoadFs)

  //   window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {
  //     fs.root.getFile("importDontAskAgain.txt", { create: true, exclusive: false }, function (fileEntry) {
  //       //console.log(fileEntry.name)
  //       //console.log("path => " + fileEntry.fullPath)
  //       writeFile(fileEntry, "importDontAskAgain=false")
  //     }, onErrorCreateFile)
  //   }, onErrorLoadFs)

  //   function onErrorCreateFile() {
  //     console.log("Error creating persistent file")
  //   }

  //   function onErrorLoadFs() {
  //     console.log("Error requesting file system")
  //   }

  //   function writeFile(fileEntry, data) {
  //     fileEntry.createWriter(function (fileWriter) {
  //       fileWriter.onwriteend = function () {
  //         //console.log("Successful file write...");
  //       };
  
  //       fileWriter.onerror = function (e) {
  //         console.log("Failed file write: " + e.toString());
  //       };
  //       fileWriter.write(data);
  //     });
  //   }
  // }

  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('');
      this.statusBar.styleDefault();
      setTimeout(() => {
          this.splashScreen.hide();
      }, 400); //https://stackoverflow.com/questions/546100514/why-white-screen-stuck-after-splash-screen-in-ionic-4
      // this.splashScreen.hide();
      //https://forum.ionicframework.com/t/after-splash-screen-display-white-screen-long-time/80162/100
      //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/#preferences
      this.storage.length().then(length => {
        length == 0 && (
          this.storage.set("settingStorageKey", this.globalSettingObj),
          this.storage.set("actionKey", this.globalActionObj),
          this.storage.set("plan", this.globalPlanObj),
          this.storage.set("settingStorageKey1", this.globalSettingObj1),
          this.storage.set("glo",this.glo),
          this.storage.set("appSetting", this.appSetting),
          this.storage.set("newImportedPlans", this.newImportedPlans)
        //添加+++++++++
        );
      })    
    })
  }

  //JW
  appSetting = [
    {
      userConfirmation: {
        export: false,
        import: false
      }
    }
  ]

  newImportedPlans = []

//要想创建新的数据，需要双向添加 globalSettingObj1  glo 两个数组数据一样enName！！

  globalSettingObj: Setting[] = [
    {
      id: '-10',
      id2: uuid(),
      enName: "Weight",
      chName: "重量",
      myName: "Weight",
      tmName: "Weight",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-9',
      id2: uuid(),
      enName: "Swelling",
      chName: "肿胀",
      myName: "Swelling",
      tmName: "Swelling",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-8',
      id2: uuid(),
      enName: "Sugar",
      chName: "糖",
      myName: "Sugar",
      tmName: "Sugar",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-7',
      id2: uuid(),
      enName: "Pain",
      chName: "疼痛",
      myName: "Pain",
      tmName: "Pain",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-6',
      id2: uuid(),
      enName: "Nutrition",
      chName: "营养",
      myName: "Nutrition",
      tmName: "Nutrition",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-5',
      id2: uuid(),
      enName: "Fever",
      chName: "发烧",
      myName: "Fever",
      tmName: "Fever",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-4',
      id2: uuid(),
      enName: "Dizzy",
      chName: "头晕",
      myName: "Dizzy",
      tmName: "Dizzy",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-3',
      id2: uuid(),
      enName: "Cough",
      chName: "咳嗽",
      myName: "Cough",
      tmName: "Cough",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-2',
      id2: uuid(),
      enName: "Breathing",
      chName: "呼吸",
      myName: "Breathing",
      tmName: "Breathing",
      icon: "assets/pdfcough.png",
    },
    {
      id: '-1',
      id2: uuid(),
      enName: "Bowel",
      chName: "肠",
      myName: "Bowel",
      tmName: "Bowel",
      icon: "assets/pdfcough.png",
    },
    {
      id: '1',
      id2: uuid(),
      enName: "Activity",
      chName: "活动",
      myName: "Activity",
      tmName: "Activity",
      icon: "assets/pdfcough.png",
    },
    {
      id: '2',
      id2: uuid(),
      enName: "Behaviour",
      chName: "行为",
      myName: "Behaviour",
      tmName: "Behaviour",
      icon: "assets/pdfnobreath.png",
      
    },
    {
      id: '3',
      id2: uuid(),
      enName: "Bladder",
      chName: "膀胱",
      myName: "Bladder",
      tmName: "Bladder",
      icon: "assets/pdfgotbreath.png"
    },
    {
      id: '4',
      id2: uuid(),
      enName: "Blood Pressure",
      chName: "血压",
      myName: "Blood Pressure",
      tmName: "Blood Pressure",
      icon: "assets/pdfredcough.png"
    }
 

    
  ]
  glo: Setting[] = [
    {
      id: '1',
      id2: '100',
      enName: "Cannot Lie Flat",
      chName: "无法平躺睡觉",
      myName: "Cannot Lie Flat",
      tmName: "Cannot Lie Flat",
      icon: "assets/icon/sym-activity-cannot-lie-flat-on-the-bed.jpg", 
    },
    {
      id: '1',
      id2: '101',
      enName: "Tired, No Energy",
      chName: "累了，没有能量",
      myName: "Tired, No Energy",
      tmName: "Tired, No Energy",
      icon: "assets/icon/sym-activity-tired-no-energy.jpg",
    },
    
    {
      id: '2',
      id2: '121',
      enName: "Agitation",
      chName: "搅动",
      myName: "Agitation",
      tmName: "Agitation",
      icon: "assets/icon/kb.png"
    },
    {
      id: '2',
      id2: '122',
      enName: "Confused",
      chName: "精神混乱",
      myName: "Confused",
      tmName: "Confused",
      icon: "assets/icon/sym-behavior-confused.jpg"
    }  ,
    {
      id: '2',
      id2: '123',
      enName: "Not sleeping at night",
      chName: "晚上不睡觉",
      myName: "Not sleeping at night",
      tmName: "Not sleeping at night",
      icon: "assets/icon/sym-behavior-not-sleeping-at-night.jpg"
    },
   
    {
      id: '3',
      id2: '135',
      enName: "Urine - Frequently passing",
      chName: "尿液-经常通过",
      myName: "Urine - Frequently passing",
      tmName: "Urine - Frequently passing",
      icon: "assets/icon/kb.png"
    }
  ,

    {
      id: '3',
      id2: '136',
      enName: "Urine - Pain on passing",
      chName: "尿液-经过时疼痛",
      myName: "Urine - Pain on passing",
      tmName: "Urine - Pain on passing",
      icon: "assets/icon/kb.png"
    }
  ,
  {
    id: '3',
    id2: '137',
    enName: "Urine - smell & colour",
    chName: "尿液-气味和颜色",
    myName: "Urine - smell & colour",
    tmName: "Urine - smell & colour",
    icon: "assets/icon/kb.png"
  }
,
{
  id: '3',
  id2: '138',
  enName: "Urine - Unable to pass",
  chName: "尿液-无法通过",
  myName: "Urine - Unable to pass",
  tmName: "Urine - Unable to pass",
  icon: "assets/icon/kb.png"
}
,
  
{
  id: '3',
  id2: '139',
  enName: "Urine - Waking up frequently at night to pass",
  chName: "尿液-晚上经常醒来才能通过",
  myName: "Urine - Waking up frequently at night to pass",
  tmName: "Urine - Waking up frequently at night to pass",
  icon: "assets/icon/kb.png"
}
,
  {
    id: '4',
    id2: '147',
    enName: "Blood Pressure - High",
    chName: "高血压",
    myName: "Blood Pressure - High",
    tmName: "Blood Pressure - High",
    icon: "assets/icon/sym-blood-presure-blood-presure-high.jpg"
  },
  {
     id: '4',
     id2: '148',
      enName: "Blood Pressure - Low",
      chName: "低血压",
      myName: "Blood Pressure - Low",
      tmName: "Blood Pressure - Low",
      icon: "assets/icon/sym-blood-presure-blood-presure-low.jpg"
  }
  ,
  {
    id: '-1',
    id2: '149',
     enName: "Constipated - hard stools",
     chName: "便秘-硬便",
     myName: "Constipated - hard stools",
     tmName: "Constipated - hard stools",
     icon: "assets/icon/kb.png"
 }
 ,
 {
  id: '-1',
  id2: '150',
   enName: "Constipated - no bowel movement for 2 days",
   chName: "便秘-2天无排便",
   myName: "Constipated - no bowel movement for 2 days",
   tmName: "Constipated - no bowel movement for 2 days",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-1',
  id2: '151',
   enName: "Diarrhoea - frequent stools",
   chName: "腹泻-大便频繁",
   myName: "Diarrhoea - frequent stools",
   tmName: "Diarrhoea - frequent stools",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-1',
  id2: '152',
   enName: "Diarrhoea - watery stools",
   chName: "腹泻-水样",
   myName: "Diarrhoea - watery stools",
   tmName: "Diarrhoea - watery stools",
   icon: "assets/icon/kb.png"
}
,

{
  id: '-2',
  id2: '153',
   enName: "Breathing - Normal",
   chName: "没有气喘",
   myName: "Breathing - Normal",
   tmName: "Breathing - Normal",
   icon: "assets/icon/sym-breathing-breathing-normal.jpg"
}
,
{
  id: '-2',
  id2: '154',
   enName: "Breathless",
   chName: "气喘",
   myName: "Breathless",
   tmName: "Breathless",
   icon: "assets/icon/sym-breathing-breathing-normal.jpg"
}
,
{
  id: '-2',
  id2: '155',
   enName: "Breathless - At Rest",
   chName: "休息时也很喘",
   myName: "Breathless - At Rest",
   tmName: "Breathless - At Rest",
   icon: "assets/icon/sym-breathing-breathless-at-rest.jpg"
}
,
{
  id: '-2',
  id2: '156',
   enName: "Breathless - Cannot Speak In Full Sentences",
   chName: "喘的无法说话",
   myName: "Breathless - Cannot Speak In Full Sentences",
   tmName: "Breathless - Cannot Speak In Full Sentences",
   icon: "assets/icon/sym-breathing-breathless-at-rest.jpg"
}
,
{
  id: '-2',
  id2: '157',
   enName: "Breathless - Can't sleep at night",
   chName: "由于呼吸困难而无法入睡",
   myName: "Breathless - Can't sleep at night",
   tmName: "Breathless - Can't sleep at night",
   icon: "assets/icon/sym-breathing-breathless-cannot-sleep-at-night.jpg"
}
,
{
  id: '-2',
  id2: '158',
   enName: "Breathless - Worse with Activity",
   chName: "做日常活动时会喘",
   myName: "Breathless - Worse with Activity",
   tmName: "Breathless - Worse with Activity",
   icon: "assets/icon/sym-breathing-breathless-worse-with-activity.jpg"
}
,
{
  id: '-3',
  id2: '159',
   enName: "Cough",
   chName: "咳嗽",
   myName: "Cough",
   tmName: "Cough",
   icon: "assets/icon/sym-cough-cough.jpg"
}
,
{
  id: '-3',
  id2: '160',
   enName: "Cough - Dry, Hacking",
   chName: "咳嗽-干，乱砍",
   myName: "Cough - Dry, Hacking",
   tmName: "Cough - Dry, Hacking",
   icon: "assets/icon/sym-cough-cough.jpg"
}
,
{
  id: '-3',
  id2: '161',
   enName: "Cough - More Than Usual",
   chName: "咳嗽-比平常多",
   myName: "Cough - More Than Usual",
   tmName: "Cough - More Than Usual",
   icon: "assets/icon/sym-cough-cough-unrelieved-by-inhaler.jpg"
}
,
{
  id: '-3',
  id2: '162',
   enName: "Cough - Not relieved by Inhalers",
   chName: "咳嗽恶化，不受药物舒解",
   myName: "Cough - Not relieved by Inhalers",
   tmName: "Cough - Not relieved by Inhalers",
   icon: "assets/icon/sym-cough-cough-unrelieved-by-inhaler.jpg"
}
,
{
  id: '-3',
  id2: '163',
   enName: "Cough - Worsening over 3 days",
   chName: "咳嗽恶化，超过3天",
   myName: "Cough - Worsening over 3 days",
   tmName: "Cough - Worsening over 3 days",
   icon: "assets/icon/sym-cough-cough-worsening-over-3-days.jpg"
}
,
{
  id: '-3',
  id2: '164',
   enName: "Phlegm",
   chName: "青或黄色的痰",
   myName: "Phlegm",
   tmName: "Phlegm",
   icon: "assets/icon/sym-cough-cough-phlegm.jpg"
}
,
{
  id: '-4',
  id2: '165',
   enName: "Dizziness - At Rest",
   chName: "头晕-休息",
   myName: "Dizziness - At Rest",
   tmName: "Dizziness - At Rest",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-4',
  id2: '166',
   enName: "Dizziness - on Standing Up or Moving",
   chName: "头晕-站立或移动时",
   myName: "Dizziness - on Standing Up or Moving",
   tmName: "Dizziness - on Standing Up or Moving",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-5',
  id2: '167',
   enName: "Fever",
   chName: "发烧",
   myName: "Fever",
   tmName: "Fever",
   icon: "assets/icon/sym-fever-fever.jpg"
}
,
{
  id: '-5',
  id2: '168',
   enName: "Fever with Shaking or Chills",
   chName: "发抖或发冷",
   myName: "Fever with Shaking or Chills",
   tmName: "Fever with Shaking or Chills",
   icon: "assets/icon/sym-fever-fever-with-shaking-chills.jpg"
}
,
{
  id: '-6',
  id2: '169',
   enName: "Appetite - Decreased",
   chName: "没有胃口",
   myName: "Appetite - Decreased",
   tmName: "Appetite - Decreased",
   icon: "assets/icon/sym-nutrition-appetite-decreased.jpg"
}
,
{
  id: '-7',
  id2: '170',
   enName: "Pain - Abdomen",
   chName: "疼痛-腹部",
   myName: "Pain - Abdomen",
   tmName: "Pain - Abdomen",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-7',
  id2: '171',
   enName: "Pain - Chest",
   chName: "疼痛-胸部",
   myName: "Pain - Chest",
   tmName: "Pain - Chest",
   icon: "assets/icon/sym-pain-pain-chest.jpg"
}
,
{
  id: '-7',
  id2: '172',
   enName: "Pain - NEW",
   chName: "疼痛持续增加（新症状）",
   myName: "Pain - NEW",
   tmName: "Pain - NEW",
   icon: "assets/icon/sym-pain-pain-new.jpg"
}
,
{
  id: '-7',
  id2: '173',
   enName: "Pain - OLD, Better with medicine",
   chName: "长期疼痛--没有更加严重",
   myName: "Pain - OLD, Better with medicine",
   tmName: "Pain - OLD, Better with medicine",
   icon: "assets/icon/sym-pain-pain-old-getting-worse.jpg"
}
,
{
  id: '-7',
  id2: '174',
   enName: "Pain - OLD, Not better with medicine",
   chName: "长期疼痛--药物无法缓解",
   myName: "Pain - OLD, Not better with medicine",
   tmName: "Pain - OLD, Not better with medicine",
   icon: "assets/icon/sym-pain-pain-old-not-better-with-medicine.jpg"
}
,
{
  id: '-7',
  id2: '175',
   enName: "Pain - OLD, Getting Worse",
   chName: "疼痛-旧，变得更糟",
   myName: "Pain - OLD, Getting Worse",
   tmName: "Pain - OLD, Getting Worse",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-8',
  id2: '176',
   enName: "Sugar - High",
   chName: "高血糖",
   myName: "Sugar - High",
   tmName: "Sugar - High",
   icon: "assets/icon/sym-sugar-sugar-high.jpg"
}
,
{
  id: '-8',
  id2: '177',
   enName: "Sugar - Low",
   chName: "高血糖",
   myName: "Sugar - Low",
   tmName: "Sugar - Low",
   icon: "assets/icon/sym-sugar-sugar-low.jpg"
}
,
{
  id: '-9',
  id2: '178',
   enName: "Swelling - Abdomen",
   chName: "腹部肿胀或不适",
   myName: "Swelling - Abdomen",
   tmName: "Swelling - Abdomen",
   icon: "assets/icon/sym-swelling-swelling-abdomen.jpg"
}
,
{
  id: '-9',
  id2: '179',
   enName: "Swelling - Leg, Ankle or Feet",
   chName: "腿部更浮肿",
   myName: "Swelling - Leg, Ankle or Feet",
   tmName: "Swelling - Leg, Ankle or Feet",
   icon: "assets/icon/sym-swelling-swelling-leg-ankle-feet.jpg"
}
,
{
  id: '-10',
  id2: '180',
   enName: "Weight - increased",
   chName: "体重增加",
   myName: "Weight - increased",
   tmName: "Weight - increased",
   icon: "assets/icon/sym-weight-weight-increased.jpg"
}
,
{
  id: '-10',
  id2: '181',
   enName: "Weight - reduced",
   chName: "重量减轻",
   myName: "Weight - reduced",
   tmName: "Weight - reduced",
   icon: "assets/icon/sym-weight-weight-increased.jpg"
}
,
  {
    id: '12',
    id2: '201',
    enName: "Call 995",
    chName: "拨打995",
    myName: "Call 995",
    tmName: "Call 995",
    icon: "assets/icon/act-contact-call-995.jpg",
  },
  {
    id: '12',
    id2:  '202',
    enName: "Call CHT Provider",
    chName: "致电",
    myName: "Call CHT Provider",
    tmName: "Call CHT Provider",
    icon: "assets/icon/act-contact-call-CHT-Provider.jpg",
  },
  {
    id: '11',
    id2: '203',
    enName: "Usual activity or exercise level",
    chName: "维持日常活动",
    myName: "Usual activity or exercise level",
    tmName: "Usual activity or exercise level",
    icon: "assets/icon/act-activity-ususal-activity-or-exercise-level.jpg",
  },
  {
    id: '12',
    id2:  '204',
    enName: "Visit Family Doctor/GP/Polyclinic",
    chName: "看家庭医生",
    myName: "Visit Family Doctor/GP/Polyclinic",
    tmName: "Visit Family Doctor/GP/Polyclinic",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  {
    id: '13',
    id2:  '205',
    enName: "Administer Medication",
    chName: "管理药物",
    myName: "Administer Medication",
    tmName: "Administer Medication",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  {
    id: '13',
    id2:  '206',
    enName: "Continue Regular Medications",
    chName: "定时吃药",
    myName: "Continue Regular Medications",
    tmName: "Continue Regular Medications",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  {
    id: '13',
    id2:  '207',
    enName: "Medication Dose - INCREASE",
    chName: "药物剂量-增加",
    myName: "Medication Dose - INCREASE",
    tmName: "Medication Dose - INCREASE",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  
  {
    id: '13',
    id2:  '208',
    enName: "Inhalers - INCREASE",
    chName: "吸入器-增加",
    myName: "Inhalers - INCREASE",
    tmName: "Inhalers - INCREASE",
    icon: "assets/icon/act-medication-inhalers-increase.jpg",
  },
  {
    id: '13',
    id2:  '209',
    enName: "Medication Dose - REDUCE",
    chName: "药物剂量-减少",
    myName: "Medication Dose - REDUCE",
    tmName: "Medication Dose - REDUCE",
    icon: "assets/icon/act-medication-inhalers-increase.jpg",
  },
  {
    id: '13',
    id2:  '210',
    enName: "Start antibiotics",
    chName: "开始抗生素",
    myName: "Start antibiotics",
    tmName: "Start antibiotics",
    icon: "assets/icon/act-medication-start-antibiotics.jpg",
  },
  {
    id: '13',
    id2: '211',
    enName: "Start prednisolone",
    chName: "服用类固醇",
    myName: "Start prednisolone",
    tmName: "Start prednisolone",
    icon: "assets/icon/act-medication-start-prednisolone.jpg",
  },
  {
    id: '13',
    id2:  '212',
    enName: "Start lasix",
    chName: "启动lasix",
    myName: "Start lasix",
    tmName: "Start lasix",
       icon: "assets/icon/kb.png",
  },
  {
    id: '13',
    id2: '213',
    enName: "Medication - STOP",
    chName: "药物剂量-减少",
    myName: "Medication - STOP",
    tmName: "Medication - STOP",
    icon: "assets/icon/act-medication-adminitser-medication.jpg",
  },
  {
    id: '13',
    id2:  '214',
    enName: "Use oxygen",
    chName: "使用氧气",
    myName: "Use oxygen",
    tmName: "Use oxygen",
    icon: "assets/icon/act-medication-adminitser-medication.jpg",
  },
  {
    id: '13',
    id2:  '215',
    enName: "Use quick relief inhaler/nebuliser",
    chName: "更频密地使用快速吸入器或喷雾器",
    myName: "Use quick relief inhaler/nebuliser",
    tmName: "Use quick relief inhaler/nebuliser",
    icon: "assets/icon/act-medication-adminitser-medication.jpg",
  },
  {
    id: '14',
    id2:  '216',
    enName: "Diet - Low Fat",
    chName: "少油",
    myName: "Diet - Low Fat",
    tmName: "Diet - Low Fat",
    icon: "assets/icon/act-nutrition-diet-low-fat.jpg",
  },
  {
    id: '14',
    id2:  '217',
    enName: "Diet - Low Salt",
    chName: "少盐",
    myName: "Diet - Low Salt",
    tmName: "Diet - Low Salt",
    icon: "assets/icon/act-nutrition-diet-low-salt.jpg",
  },
  {
    id: '14',
    id2:  '218',
    enName: "Diet - Low Sugar",
    chName: "饮食-低糖",
    myName: "Diet - Low Sugar",
    tmName: "Diet - Low Sugar",
    icon: "assets/icon/kb.png",
  },
  {
    id: '14',
    id2: '219',
    enName: "Restrict Fluids",
    chName: "限制液体",
    myName: "Restrict Fluids",
    tmName: "Restrict Fluids",
    icon: "assets/icon/kb.png",
  },
    

]
  globalSettingObj1: Setting[] = [
    {
      id: '1',
      id2: '100',
      enName: "Cannot Lie Flat",
      chName: "无法平躺睡觉",
      myName: "Cannot Lie Flat",
      tmName: "Cannot Lie Flat",
      icon: "assets/icon/sym-activity-cannot-lie-flat-on-the-bed.jpg", 
    },
    {
      id: '1',
      id2: '101',
      enName: "Tired, No Energy",
      chName: "累了，没有能量",
      myName: "Tired, No Energy",
      tmName: "Tired, No Energy",
      icon: "assets/icon/sym-activity-tired-no-energy.jpg",
    },
    
    {
      id: '2',
      id2: '121',
      enName: "Agitation",
      chName: "搅动",
      myName: "Agitation",
      tmName: "Agitation",
      icon: "assets/icon/kb.png"
    },
    {
      id: '2',
      id2: '122',
      enName: "Confused",
      chName: "精神混乱",
      myName: "Confused",
      tmName: "Confused",
      icon: "assets/icon/sym-behavior-confused.jpg"
    }  ,
    {
      id: '2',
      id2: '123',
      enName: "Not sleeping at night",
      chName: "晚上不睡觉",
      myName: "Not sleeping at night",
      tmName: "Not sleeping at night",
      icon: "assets/icon/sym-behavior-not-sleeping-at-night.jpg"
    },
   
    {
      id: '3',
      id2: '135',
      enName: "Urine - Frequently passing",
      chName: "尿液-经常通过",
      myName: "Urine - Frequently passing",
      tmName: "Urine - Frequently passing",
      icon: "assets/icon/kb.png"
    }
  ,

    {
      id: '3',
      id2: '136',
      enName: "Urine - Pain on passing",
      chName: "尿液-经过时疼痛",
      myName: "Urine - Pain on passing",
      tmName: "Urine - Pain on passing",
      icon: "assets/icon/kb.png"
    }
  ,
  {
    id: '3',
    id2: '137',
    enName: "Urine - smell & colour",
    chName: "尿液-气味和颜色",
    myName: "Urine - smell & colour",
    tmName: "Urine - smell & colour",
    icon: "assets/icon/kb.png"
  }
,
{
  id: '3',
  id2: '138',
  enName: "Urine - Unable to pass",
  chName: "尿液-无法通过",
  myName: "Urine - Unable to pass",
  tmName: "Urine - Unable to pass",
  icon: "assets/icon/kb.png"
}
,
  
{
  id: '3',
  id2: '139',
  enName: "Urine - Waking up frequently at night to pass",
  chName: "尿液-晚上经常醒来才能通过",
  myName: "Urine - Waking up frequently at night to pass",
  tmName: "Urine - Waking up frequently at night to pass",
  icon: "assets/icon/kb.png"
}
,
  {
    id: '4',
    id2: '147',
    enName: "Blood Pressure - High",
    chName: "高血压",
    myName: "Blood Pressure - High",
    tmName: "Blood Pressure - High",
    icon: "assets/icon/sym-blood-presure-blood-presure-high.jpg"
  },
  {
     id: '4',
     id2: '148',
      enName: "Blood Pressure - Low",
      chName: "低血压",
      myName: "Blood Pressure - Low",
      tmName: "Blood Pressure - Low",
      icon: "assets/icon/sym-blood-presure-blood-presure-low.jpg"
  }
  ,
  {
    id: '-1',
    id2: '149',
     enName: "Constipated - hard stools",
     chName: "便秘-硬便",
     myName: "Constipated - hard stools",
     tmName: "Constipated - hard stools",
     icon: "assets/icon/kb.png"
 }
 ,
 {
  id: '-1',
  id2: '150',
   enName: "Constipated - no bowel movement for 2 days",
   chName: "便秘-2天无排便",
   myName: "Constipated - no bowel movement for 2 days",
   tmName: "Constipated - no bowel movement for 2 days",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-1',
  id2: '151',
   enName: "Diarrhoea - frequent stools",
   chName: "腹泻-大便频繁",
   myName: "Diarrhoea - frequent stools",
   tmName: "Diarrhoea - frequent stools",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-1',
  id2: '152',
   enName: "Diarrhoea - watery stools",
   chName: "腹泻-水样",
   myName: "Diarrhoea - watery stools",
   tmName: "Diarrhoea - watery stools",
   icon: "assets/icon/kb.png"
}
,

{
  id: '-2',
  id2: '153',
   enName: "Breathing - Normal",
   chName: "没有气喘",
   myName: "Breathing - Normal",
   tmName: "Breathing - Normal",
   icon: "assets/icon/sym-breathing-breathing-normal.jpg"
}
,
{
  id: '-2',
  id2: '154',
   enName: "Breathless",
   chName: "气喘",
   myName: "Breathless",
   tmName: "Breathless",
   icon: "assets/icon/sym-breathing-breathing-normal.jpg"
}
,
{
  id: '-2',
  id2: '155',
   enName: "Breathless - At Rest",
   chName: "休息时也很喘",
   myName: "Breathless - At Rest",
   tmName: "Breathless - At Rest",
   icon: "assets/icon/sym-breathing-breathless-at-rest.jpg"
}
,
{
  id: '-2',
  id2: '156',
   enName: "Breathless - Cannot Speak In Full Sentences",
   chName: "喘的无法说话",
   myName: "Breathless - Cannot Speak In Full Sentences",
   tmName: "Breathless - Cannot Speak In Full Sentences",
   icon: "assets/icon/sym-breathing-breathless-at-rest.jpg"
}
,
{
  id: '-2',
  id2: '157',
   enName: "Breathless - Can't sleep at night",
   chName: "由于呼吸困难而无法入睡",
   myName: "Breathless - Can't sleep at night",
   tmName: "Breathless - Can't sleep at night",
   icon: "assets/icon/sym-breathing-breathless-cannot-sleep-at-night.jpg"
}
,
{
  id: '-2',
  id2: '158',
   enName: "Breathless - Worse with Activity",
   chName: "做日常活动时会喘",
   myName: "Breathless - Worse with Activity",
   tmName: "Breathless - Worse with Activity",
   icon: "assets/icon/sym-breathing-breathless-worse-with-activity.jpg"
}
,
{
  id: '-3',
  id2: '159',
   enName: "Cough",
   chName: "咳嗽",
   myName: "Cough",
   tmName: "Cough",
   icon: "assets/icon/sym-cough-cough.jpg"
}
,
{
  id: '-3',
  id2: '160',
   enName: "Cough - Dry, Hacking",
   chName: "咳嗽-干，乱砍",
   myName: "Cough - Dry, Hacking",
   tmName: "Cough - Dry, Hacking",
   icon: "assets/icon/sym-cough-cough.jpg"
}
,
{
  id: '-3',
  id2: '161',
   enName: "Cough - More Than Usual",
   chName: "咳嗽-比平常多",
   myName: "Cough - More Than Usual",
   tmName: "Cough - More Than Usual",
   icon: "assets/icon/sym-cough-cough-unrelieved-by-inhaler.jpg"
}
,
{
  id: '-3',
  id2: '162',
   enName: "Cough - Not relieved by Inhalers",
   chName: "咳嗽恶化，不受药物舒解",
   myName: "Cough - Not relieved by Inhalers",
   tmName: "Cough - Not relieved by Inhalers",
   icon: "assets/icon/sym-cough-cough-unrelieved-by-inhaler.jpg"
}
,
{
  id: '-3',
  id2: '163',
   enName: "Cough - Worsening over 3 days",
   chName: "咳嗽恶化，超过3天",
   myName: "Cough - Worsening over 3 days",
   tmName: "Cough - Worsening over 3 days",
   icon: "assets/icon/sym-cough-cough-worsening-over-3-days.jpg"
}
,
{
  id: '-3',
  id2: '164',
   enName: "Phlegm",
   chName: "青或黄色的痰",
   myName: "Phlegm",
   tmName: "Phlegm",
   icon: "assets/icon/sym-cough-cough-phlegm.jpg"
}
,
{
  id: '-4',
  id2: '165',
   enName: "Dizziness - At Rest",
   chName: "头晕-休息",
   myName: "Dizziness - At Rest",
   tmName: "Dizziness - At Rest",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-4',
  id2: '166',
   enName: "Dizziness - on Standing Up or Moving",
   chName: "头晕-站立或移动时",
   myName: "Dizziness - on Standing Up or Moving",
   tmName: "Dizziness - on Standing Up or Moving",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-5',
  id2: '167',
   enName: "Fever",
   chName: "发烧",
   myName: "Fever",
   tmName: "Fever",
   icon: "assets/icon/sym-fever-fever.jpg"
}
,
{
  id: '-5',
  id2: '168',
   enName: "Fever with Shaking or Chills",
   chName: "发抖或发冷",
   myName: "Fever with Shaking or Chills",
   tmName: "Fever with Shaking or Chills",
   icon: "assets/icon/sym-fever-fever-with-shaking-chills.jpg"
}
,
{
  id: '-6',
  id2: '169',
   enName: "Appetite - Decreased",
   chName: "没有胃口",
   myName: "Appetite - Decreased",
   tmName: "Appetite - Decreased",
   icon: "assets/icon/sym-nutrition-appetite-decreased.jpg"
}
,
{
  id: '-7',
  id2: '170',
   enName: "Pain - Abdomen",
   chName: "疼痛-腹部",
   myName: "Pain - Abdomen",
   tmName: "Pain - Abdomen",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-7',
  id2: '171',
   enName: "Pain - Chest",
   chName: "疼痛-胸部",
   myName: "Pain - Chest",
   tmName: "Pain - Chest",
   icon: "assets/icon/sym-pain-pain-chest.jpg"
}
,
{
  id: '-7',
  id2: '172',
   enName: "Pain - NEW",
   chName: "疼痛持续增加（新症状）",
   myName: "Pain - NEW",
   tmName: "Pain - NEW",
   icon: "assets/icon/sym-pain-pain-new.jpg"
}
,
{
  id: '-7',
  id2: '173',
   enName: "Pain - OLD, Better with medicine",
   chName: "长期疼痛--没有更加严重",
   myName: "Pain - OLD, Better with medicine",
   tmName: "Pain - OLD, Better with medicine",
   icon: "assets/icon/sym-pain-pain-old-getting-worse.jpg"
}
,
{
  id: '-7',
  id2: '174',
   enName: "Pain - OLD, Not better with medicine",
   chName: "长期疼痛--药物无法缓解",
   myName: "Pain - OLD, Not better with medicine",
   tmName: "Pain - OLD, Not better with medicine",
   icon: "assets/icon/sym-pain-pain-old-not-better-with-medicine.jpg"
}
,
{
  id: '-7',
  id2: '175',
   enName: "Pain - OLD, Getting Worse",
   chName: "疼痛-旧，变得更糟",
   myName: "Pain - OLD, Getting Worse",
   tmName: "Pain - OLD, Getting Worse",
   icon: "assets/icon/kb.png"
}
,
{
  id: '-8',
  id2: '176',
   enName: "Sugar - High",
   chName: "高血糖",
   myName: "Sugar - High",
   tmName: "Sugar - High",
   icon: "assets/icon/sym-sugar-sugar-high.jpg"
}
,
{
  id: '-8',
  id2: '177',
   enName: "Sugar - Low",
   chName: "高血糖",
   myName: "Sugar - Low",
   tmName: "Sugar - Low",
   icon: "assets/icon/sym-sugar-sugar-low.jpg"
}
,
{
  id: '-9',
  id2: '178',
   enName: "Swelling - Abdomen",
   chName: "腹部肿胀或不适",
   myName: "Swelling - Abdomen",
   tmName: "Swelling - Abdomen",
   icon: "assets/icon/sym-swelling-swelling-abdomen.jpg"
}
,
{
  id: '-9',
  id2: '179',
   enName: "Swelling - Leg, Ankle or Feet",
   chName: "腿部更浮肿",
   myName: "Swelling - Leg, Ankle or Feet",
   tmName: "Swelling - Leg, Ankle or Feet",
   icon: "assets/icon/sym-swelling-swelling-leg-ankle-feet.jpg"
}
,
{
  id: '-10',
  id2: '180',
   enName: "Weight - increased",
   chName: "体重增加",
   myName: "Weight - increased",
   tmName: "Weight - increased",
   icon: "assets/icon/sym-weight-weight-increased.jpg"
}
,
{
  id: '-10',
  id2: '181',
   enName: "Weight - reduced",
   chName: "重量减轻",
   myName: "Weight - reduced",
   tmName: "Weight - reduced",
   icon: "assets/icon/sym-weight-weight-increased.jpg"
}
,
  {
    id: '12',
    id2: '201',
    enName: "Call 995",
    chName: "拨打995",
    myName: "Call 995",
    tmName: "Call 995",
    icon: "assets/icon/act-contact-call-995.jpg",
  },
  {
    id: '12',
    id2:  '202',
    enName: "Call CHT Provider",
    chName: "致电",
    myName: "Call CHT Provider",
    tmName: "Call CHT Provider",
    icon: "assets/icon/act-contact-call-CHT-Provider.jpg",
  },
  {
    id: '11',
    id2:  '203',
    enName: "Usual activity or exercise level",
    chName: "维持日常活动",
    myName: "Usual activity or exercise level",
    tmName: "Usual activity or exercise level",
    icon: "assets/icon/act-activity-ususal-activity-or-exercise-level.jpg",
  },
  {
    id: '12',
    id2: '204',
    enName: "Visit Family Doctor/GP/Polyclinic",
    chName: "看家庭医生",
    myName: "Visit Family Doctor/GP/Polyclinic",
    tmName: "Visit Family Doctor/GP/Polyclinic",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  {
    id: '13',
    id2:  '205',
    enName: "Administer Medication",
    chName: "管理药物",
    myName: "Administer Medication",
    tmName: "Administer Medication",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  {
    id: '13',
    id2: '206',
    enName: "Continue Regular Medications",
    chName: "定时吃药",
    myName: "Continue Regular Medications",
    tmName: "Continue Regular Medications",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  {
    id: '13',
    id2: '207',
    enName: "Medication Dose - INCREASE",
    chName: "药物剂量-增加",
    myName: "Medication Dose - INCREASE",
    tmName: "Medication Dose - INCREASE",
    icon: "assets/icon/act-contact-visit-family-doctor-GP-Polyclinic.jpg",
  },
  
  {
    id: '13',
    id2:  '208',
    enName: "Inhalers - INCREASE",
    chName: "吸入器-增加",
    myName: "Inhalers - INCREASE",
    tmName: "Inhalers - INCREASE",
    icon: "assets/icon/act-medication-inhalers-increase.jpg",
  },
  {
    id: '13',
    id2: '209',
    enName: "Medication Dose - REDUCE",
    chName: "药物剂量-减少",
    myName: "Medication Dose - REDUCE",
    tmName: "Medication Dose - REDUCE",
    icon: "assets/icon/act-medication-inhalers-increase.jpg",
  },
  {
    id: '13',
    id2:  '210',
    enName: "Start antibiotics",
    chName: "开始抗生素",
    myName: "Start antibiotics",
    tmName: "Start antibiotics",
    icon: "assets/icon/act-medication-start-antibiotics.jpg",
  },
  {
    id: '13',
    id2:  '211',
    enName: "Start prednisolone",
    chName: "服用类固醇",
    myName: "Start prednisolone",
    tmName: "Start prednisolone",
    icon: "assets/icon/act-medication-start-prednisolone.jpg",
  },
  {
    id: '13',
    id2:  '212',
    enName: "Start lasix",
    chName: "启动lasix",
    myName: "Start lasix",
    tmName: "Start lasix",
    icon: "assets/icon/kb.png",
  },
  {
    id: '13',
    id2: '213',
    enName: "Medication - STOP",
    chName: "药物剂量-减少",
    myName: "Medication - STOP",
    tmName: "Medication - STOP",
    icon: "assets/icon/act-medication-adminitser-medication.jpg",
  },
  {
    id: '13',
    id2:  '214',
    enName: "Use oxygen",
    chName: "使用氧气",
    myName: "Use oxygen",
    tmName: "Use oxygen",
    icon: "assets/icon/act-medication-adminitser-medication.jpg",
  },
  {
    id: '13',
    id2:  '215',
    enName: "Use quick relief inhaler/nebuliser",
    chName: "更频密地使用快速吸入器或喷雾器",
    myName: "Use quick relief inhaler/nebuliser",
    tmName: "Use quick relief inhaler/nebuliser",
    icon: "assets/icon/act-medication-adminitser-medication.jpg",
  },
  {
    id: '14',
    id2:  '216',
    enName: "Diet - Low Fat",
    chName: "少油",
    myName: "Diet - Low Fat",
    tmName: "Diet - Low Fat",
    icon: "assets/icon/act-nutrition-diet-low-fat.jpg",
  },
  {
    id: '14',
    id2:  '217',
    enName: "Diet - Low Salt",
    chName: "少盐",
    myName: "Diet - Low Salt",
    tmName: "Diet - Low Salt",
    icon: "assets/icon/act-nutrition-diet-low-salt.jpg",
  },
  {
    id: '14',
    id2: '218',
    enName: "Diet - Low Sugar",
    chName: "饮食-低糖",
    myName: "Diet - Low Sugar",
    tmName: "Diet - Low Sugar",
    icon: "assets/icon/kb.png",
  },
  {
    id: '14',
    id2: '219',
    enName: "Restrict Fluids",
    chName: "限制液体",
    myName: "Restrict Fluids",
    tmName: "Restrict Fluids",
    icon: "assets/icon/kb.png",
  },
  ]
  
  globalActionObj: SettingAction[] = [
    {
      id: '11',
      id2: '11',
      enName: "Activity",
      chName: "活动",
      myName: "Activity",
      tmName: "Activity",
      icon: "assets/icon/kb.png",
    },
    {
      id: '12',
      id2:'12',
      enName: "Contact",
      chName: "联系",
      myName: "Contact",
      tmName: "Contact",
      icon: "assets/icon/kb.png",
    },
    {
      id: '13',
      id2: '13',
      enName: "Medication",
      chName: "用药",
      myName: "Medication",
      tmName: "Medication",
      icon: "assets/icon/kb.png",
    },
    {
      id: '14',
      id2: '14',
      enName: "Nutrition",
      chName: "营养",
      myName: "Nutrition",
      tmName: "Nutrition",
      icon: "assets/icon/kb.png",
    }

  ]

  // globalPlanObj = [
  //   {
  //     id: uuid(),
  //     ccontact: "81201934", //show in plan
  //     cname: "Brandon Tan",
  //     createdDate: new Date(Date.now() - (86400000*10)).toLocaleString('en-US'), //show in plan
  //     language: 0,
  //     name: "Brandon Loo", //show on first line in plan
  //     nric: "S3849800B",
  //     planName: "Malcolm Lee", //show on header plan
  //     appointment: [],
  //     templates: []
  //   },
  //   {
  //     id: uuid(),
  //     ccontact: "95582490",
  //     cname: "Ernest Lee",
  //     createdDate:new Date(Date.now() - (86400000*5)).toLocaleString('en-US'),
  //     language: 0,
  //     name: "Ernest Tan",
  //     nric: "S7400310I",
  //     planName: "Ivan",
  //     appointment: [],
  //     templates: []
  //   },
  //   {
  //     id: uuid(),
  //     ccontact: "82676075",
  //     cname: "Angelica",
  //     createdDate:new Date(Date.now() - (86400000*9)).toLocaleString('en-US'),
  //     language: 0,
  //     name: "Amber Lim",
  //     nric: "S2062526J",
  //     planName: "John Koo",
  //     appointment: [],
  //     templates: []
  //   },
  //   {
  //     id: uuid(),
  //     ccontact: "91057528",
  //     cname: "Zoe Tay",
  //     createdDate: new Date(Date.now() - 86400000).toLocaleString('en-US'),
  //     language: 0,
  //     name: "Esther Zhang",
  //     nric: "S2062526J",
  //     planName: "Samuel Ang",
  //     appointment: [],
  //     templates: []
  //   },
  // ]
}