import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const key = "appSetting"

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private storage: Storage) { }

  //problem here, not getting set
  exportToggleDontAskAgain(){
    var newSetting
    return new Promise((res) => {
      this.storage.get(key).then((setting) => {
        if(setting[0].userConfirmation.export === false){
          newSetting = true
          setting[0].userConfirmation.export = newSetting
          this.storage.set(key, setting)
          res()
        }
        else if(setting[0].userConfirmation.export === true){
          newSetting = false
          setting[0].userConfirmation.export = newSetting
          this.storage.set(key, setting)
          res()
        }
      })
    })
  }

  importToggleDontAskAgain(){
    var newSetting
    return new Promise((res) => {
      this.storage.get(key).then((setting) => {
        if(setting[0].userConfirmation.import === false){
          newSetting = true
          setting[0].userConfirmation.import = newSetting
          this.storage.set(key, setting)
          res()
        }
        else if(setting[0].userConfirmation.import === true){
          newSetting = false
          setting[0].userConfirmation.import = newSetting
          this.storage.set(key, setting)
          res()
        }
      })
    })
  }

  exportCheckToggle(){
    var toggle = false
    return new Promise((res) => {
      this.storage.get(key).then((setting) => {
        if(setting[0].userConfirmation.export === false){
          res(toggle)
        }
        if(setting[0].userConfirmation.export === true){
          toggle = true
          res(toggle)
        }
      })
    })
  }

  importCheckToggle(){
    var toggle = false
    return new Promise((res) => {
      this.storage.get(key).then((setting) => {
        if(setting[0].userConfirmation.import === false){
          res(toggle)
        }
        if(setting[0].userConfirmation.import === true){
          toggle = true
          res(toggle)
        }
      })
    })
  }
}
