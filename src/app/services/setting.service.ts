import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = "settingStorageKey";
const ACTION_KEY = "actionKey";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  thisKey: any;

  constructor(private storage: Storage) { }

  // getAllSetting() {
  //   return this.storage.get(STORAGE_KEY).then(val => {
  //     console.table(val);
  //     return val;
  //   })
  //   // this.storage.get(STORAGE_KEY).then(val => {
  //   //   console.log("val = " + val);
  //   // })
  //   // console.log(this.storage.driver);
  //   // return this.storage.get(STORAGE_KEY);
  // }

  // getAllAction() {
  //   return this.storage.get(ACTION_KEY).then(val => {
  //     console.table(val);
  //     return val;
  //   })
  // }

  getType(type) {
    if (type == "Symptom") {
      this.thisKey = STORAGE_KEY;
      return this.storage.get(STORAGE_KEY);
    }
    else {
      this.thisKey = ACTION_KEY;
      return this.storage.get(ACTION_KEY);
    }
  }

  getAll() {
    var data = [];
    this.storage.forEach((value:any, key:string, iterationNumber: Number) => {
      data.push(value);
    })
    console.log("data~~ " + data);
    return data;
  }

  // addSetting(item) {
  //   return this.getAllSetting().then(result => {
  //     result = result || [];
  //     result.push(item);
  //     console.log("storage result = " + result);
  //     return this.storage.set(STORAGE_KEY, result);
  //   })
  // }

  // addAction(item) {
  //   return this.getAllAction().then(result => {
  //     result = result || [];
  //     result.push(item);
  //     console.log("storage result = " + result);
  //     return this.storage.set(ACTION_KEY, result);
  //   })
  // }

  addReusable(item, type) {
    return this.getType(type).then(result => {
      result = result || [];
      result.push(item);
      return this.storage.set(this.thisKey, result);
    })
  }

  clearStorage() {
    this.storage.clear();
  }
}
