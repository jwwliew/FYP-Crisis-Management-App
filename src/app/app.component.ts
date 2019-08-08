import { Plan } from './models/plan';
import { SettingAction, Setting } from './models/symptomaction';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {

  listOfContact = ["69741678", "81201934", "95582490", "82676075", "67090093", "81057528", "66998151", "63885988", "90129366", "86504357",
                    "66489100", "85925983", "98852409", "82770593", "68910293", "85003922", "62005100", "64009220", "90119444", "80912345",
                    "69321545", "82910293", "94123412", "86663322", "68881111", "85552221", "69405123", "68493123", "91156425", "84211552",
                    "69218880", "89992134", "95348521", "81425621", "68221455", "81110922", "66603444", "67772333", "92234555", "81119231",
                    "61113333", "84144325", "95552231", "81220099", "68772233", "83252234", "67992214", "68859001", "98425932", "84419922"]
  listOfNameFirstLine = ["Gilberto Lim", "Susan Wong", "Natasha Lee", "Andrew Tan", "Timothy Ong", "Adam Khoo", "Wycliff Lee", "Tyson KM", "Donald Ng", "Lee Kim Huat",
                        "John Tan", "Robert Goh", "Reagan Tay", "Albert Lau", "Billy Ong", "Silvester Chew", "Martin Koh", "Louis Yeo", "Nicole Choo", "Grace Phua",
                        "Jeremy Toh", "Davis Tan", "Jasmine Lau", "Jermaine Chua", "Bryan Wong", "Desmond Lee", "Thierry Lim", "Hazel Lee", "Jackson Png", "Chan Lee",
                        "Kenny Lo", "Augustine Ong", "Jeff Phua", "Kenneth Tay", "Johnson Koh", "Nicolas Ong", "Vincent Tan", "Sean Lee", "David MK", "Jonathan KLW",
                        "Raphael Tan", "Terry Ong", "Tyler Soh", "Victoria Koo", "Wayne Lee", "Wesley Phua", "Amanda Ong", "Ryan Goh", "Raymond Ong", "Isabelle Yap"]
  listOfNric = ["S4323518D", "S3849800B", "S7400310I", "S2062526J", "S9967974C", "S1117255E", "S8934307J", "S9956222F", "S3344529F", "S7329310C", 
                "S4242789F", "S4602401Z", "S5097092B", "S1688952J", "S8918877F", "S4944132J", "S6659589G", "S5273909H", "S7256518E", "S2138435F",
                "S4277286J", "S1968009F", "S9257797Z", "S9693677Z", "S9387804C", "S6885672H", "S9377561I", "S9660876D", "S3747930F", "S5981933Z",
                "S5180294B", "S5024489Z", "S3926971F", "S1322990B", "S8562878Z", "S3351147G", "S9660052F", "S4550617G", "S2166511H", "S3636332J",
                "S9976053B", "S2811635G", "S7711051H", "S8719740I", "S0859994G", "S6260910I", "S2129378D", "S9702694G", "S3725048A", "S3042412C"]
  listOfPlanName = ["Bob Lee", "Ashley Ong", "Alvin Goh", "Cheryl Ng", "Marcus Choo", "Lucas Lim", "Kevin Tan", "Justin Phua", "Emma Lee", "Hazel Wong",
                    "Timothy Tan", "Ryan Lee", "Joshua Wong", "Joseph Lee", "Jayden Ong", "Ivan Goh", "Gordon Tay", "Max Lee", "Eugene Tan", "Adeline Yap", 
                    "Isabelle Ong", "Samuel Tan", "Fiona Goh", "Don Tan", "Desmond Tan", "Derrik Ong", "Darryl Ng", "Daniel Teo", "Caleb Koh", "Malcolom Chia", 
                    "Asher Ong", "Alexendra Lee", "Debbie Goh", "Grace Liew", "Joyce Quek", "Lucy Wong", "Naomi Yap", "Rachel Ho", "Michelle Pang", "Nicole Lam",
                    "Olivia Tan", "Sarah Lee", "Sharon Ng", "Valerie Tan", "Jason Lim", "Esther Ng", "Brandon Loo", "Benjamin Lee", "Angelica Yap", "Ernest Wong"]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
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
      for (let i = 0; i < 50; i++) {
        let planObj = {
          id: uuid(),
          ccontact: this.listOfContact[i],
          cname: "Brandon Tan",
          createdDate: new Date(Date.now() - (864e5 * (50-i))).toLocaleString('en-US'),
          language: 0,
          name: this.listOfNameFirstLine[i],
          nric: this.listOfNric[i],
          planName: this.listOfPlanName[i],
          appointment: [],
          templates: []
        }
        this.globalPlanObj.unshift(planObj)
      }
    // }
    this.initializeApp();
  }

  globalPlanObj = [];

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
          this.splashScreen.hide();
      }, 400); //https://stackoverflow.com/questions/546100514/why-white-screen-stuck-after-splash-screen-in-ionic-4
      // this.splashScreen.hide();
      //https://forum.ionicframework.com/t/after-splash-screen-display-white-screen-long-time/80162/100
      //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/#preferences
      this.storage.length().then(length => {
        length == 0 && (
          this.storage.set("settingStorageKey", this.globalSettingObj), this.storage.set("actionKey", this.globalActionObj),
          this.storage.set("plan", this.globalPlanObj)
        );
      })
    });
  }

  globalSettingObj: Setting[] = [
    {
      id: uuid(),
      enName: "Fever",
      chName: "发烧",
      myName: "demam",
      tmName: "காய்ச்சல்",
      icon: "assets/pdfcough.png",
    },
    {
      id: uuid(),
      enName: "Shortness of breath",
      chName: "呼吸急促",
      myName: "sesak nafas",
      tmName: "மூச்சு திணறல்",
      icon: "assets/pdfnobreath.png"
    },
    {
      id: uuid(),
      enName: "Good health condition",
      chName: "身体状况良好",
      myName: "Keadaan kesihatan yang baik",
      tmName: "நல்ல உடல்நிலை",
      icon: "assets/pdfgotbreath.png"
    },
    {
      id: uuid(),
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
    },
    {
      id: uuid(),
      enName: "High Blood Pressure",
      chName: "高血压",
      myName: "tekanan darah tinggi",
      tmName: "உயர் இரத்த அழுத்தம்",
      icon: "assets/pdfhighblood.png"
    }
  ]
  
  globalActionObj: SettingAction[] = [
    {
      id: uuid(),
      enName: "Call 995",
      chName: "拨打995",
      myName: "Panggil 995",
      tmName: "995 ஐ அழைக்கவும்",
      icon: "assets/pdfcall995.png",
    },
    {
      id: uuid(),
      enName: "Continue regular medications",
      chName: "继续定期服用中药",
      myName: "Teruskan ubat biasa",
      tmName: "வழக்கமான மருந்துகளைத் தொடரவும்",
      icon: "assets/pdfcontinuemed.png"
    },
    {
      id: uuid(),
      enName: "Maintain usual activities/exercise levels",
      chName: "保持通常的活动/运动水平",
      myName: "Mengekalkan aktiviti biasa/tahap senaman",
      tmName: "வழக்கமான நடவடிக்கைகள் / உடற்பயிற்சி நிலைகளை பராமரிக்கவும்",
      icon: "assets/pdfmaintain.png"
    },
    {
      id: uuid(),
      enName: "Use rescue inhalers",
      chName: "使用救援吸入器",
      myName: "Gunakan inhaler penyelamat",
      tmName: "மீட்பு இன்ஹேலரைப் பயன்படுத்தவும்",
      icon: "assets/pdfrescue.png"
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