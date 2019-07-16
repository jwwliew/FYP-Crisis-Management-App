import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Setting, SettingAction } from '../models/symptomaction';

import {v4 as uuid} from 'uuid';

const STORAGE_KEY = "settingStorageKey";
const ACTION_KEY = "actionKey";

@Injectable({
  providedIn: 'root'
})
export class SymptomActionService {

  thisKey: any;

  constructor(private storage: Storage) { }

  getType(type) {
    this.thisKey = type == "Symptom" ? STORAGE_KEY : ACTION_KEY
    console.log("this key is " + this.thisKey);
    return this.storage.get(this.thisKey);
  }
  
  iconArray = ["assets/cough.svg", "assets/ambulance.svg", "assets/medication.svg", "assets/noshortness.svg", "assets/temperature.svg"]

  readImage(icon) {
    return new Promise(resolve => {
      var reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(icon);
    });
  }
  convertToBlob(base64Image) { 
    return fetch(base64Image).then(res => res.blob()) //https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  }


  async addReusable(type, item) {
    if (type == "Symptom") {
      var settingObj: Setting = {
        id: uuid(),
        enName: item.enName,
        chName: item.chName,
        myName: item.myName,
        tmName: item.tmName,
        icon: item.icon
      };
    }
    else {
      var settingObj: SettingAction = {
        id: uuid(),
        enName: item.enName,
        chName: item.chName,
        myName: item.myName,
        tmName: item.tmName,
        icon: item.icon
      }
    }
    console.log("adding reusable item = " + JSON.stringify(item));
    console.error(settingObj);
    return this.getType(type).then(result => {
      result = result || [];
      result.push(settingObj);
      return this.storage.set(this.thisKey, result);
    })
  }

  clearStorage() {
    this.storage.clear();
  }

  getOneSetting(type, id) {
    console.log("type = " + type);
    return this.getType(type).then((items: Setting[]) => {
      console.error("items = " + JSON.stringify(items, null, 2));
      return items.find(item => item.id == id) //previously used filter returns array need [0] to access in editSettings page
    })
  }

  updateOneSetting(type, newValues) {
    return this.getType(type).then(async (items: Setting[]) => {
      let itemIndex = items.findIndex(item => item.id === newValues.id);
      console.log("item index to update = " + itemIndex);
      console.log("this key in update = " + this.thisKey);
      console.log("this type to update = " + type);
      items[itemIndex] = newValues;
      return this.storage.set(this.thisKey, items);
    })
  }
  
  deleteSetting(type, checkedArray) {
    return this.getType(type).then((items: Setting[]) => {
      checkedArray.forEach(element => {
        console.log('eleemtn = ' + element);
        items.splice(items.findIndex(item => item.id === element.id), 1);
      });
      return this.storage.set(this.thisKey, items);
    })
  }
  
  deleteIOS(type, thisItem) {
    return this.getType(type).then((items: Setting[]) => {
      items.splice(items.findIndex(item => item.id === thisItem.id), 1);
      return this.storage.set(this.thisKey, items);
    })
  }

  getOneImage(type, id) {
    return this.getType(type).then((items: Setting[]) => {
      let img = items.find(item => item.id === id).icon;
      return img;
    })
  }

}
