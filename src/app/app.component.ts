import { SettingAction, Setting } from './models/setting';
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
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get("settingStorageKey").then(val => {
        if (!val) { //https://forum.ionicframework.com/t/how-to-check-first-run-app-with-ionic-app/117214/2
          console.warn("val not found")
          this.storage.set("settingStorageKey", this.globalSettingObj);
          this.storage.set("actionKey", this.globalActionObj);
        }
        else {
          console.error("VAL FOUND")
        }
      })
    });
  }

  globalSettingObj: Setting[] = [
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
  
  globalActionObj: SettingAction[] = [
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
  
}