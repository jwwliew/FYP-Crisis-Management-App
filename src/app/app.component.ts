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
      setTimeout(() => {
          this.splashScreen.hide();
      }, 400); //https://stackoverflow.com/questions/54620514/why-white-screen-stuck-after-splash-screen-in-ionic-4
      // this.splashScreen.hide();
      //https://forum.ionicframework.com/t/after-splash-screen-display-white-screen-long-time/80162/20
      //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/#preferences
      this.storage.length().then(length => {
        length == 0 && (this.storage.set("settingStorageKey", this.globalSettingObj), this.storage.set("actionKey", this.globalActionObj))
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
      enName: "Cough",
      chName: "咳嗽",
      myName: "batuk",
      tmName: "இருமல்",
      icon: "assets/pdfredcough.png"
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
    // {
    //   id: uuid(),
    //   enName: "High Blood Pressure",
    //   chName: "高血压",
    //   myName: "tekanan darah tinggi",
    //   tmName: "உயர் இரத்த அழுத்தம்",
    //   icon: "assets/pdfhighblood.png"
    // }
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
  
}