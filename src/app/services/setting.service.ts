import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Setting } from '../models/setting';

import {v4 as uuid} from 'uuid';

const STORAGE_KEY = "settingStorageKey";
const ACTION_KEY = "actionKey";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  thisKey: any;

  constructor(private storage: Storage) { }

  getType(type) {
    this.thisKey = STORAGE_KEY;
    if (type == "Action") {
      this.thisKey = ACTION_KEY
    }
    console.log("this key is " + this.thisKey);
    return this.storage.get(this.thisKey);
  }

  addReusable(item, type) {
    var settingObj = {
      id: uuid(),
      enName: item.nameInput
    };
    console.log("adding reusable item = " + JSON.stringify(item));
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
      console.log("items = " + items);
      return items.filter(item => item.id == id)
    })
  }

  updateOneSetting(type, newValues) {
    return this.getType(type).then((items: Setting[]) => {
      let itemIndex = items.findIndex(item => item.id === newValues.id);
      console.log("item index to update = " + itemIndex);
      console.log("this key in update = " + this.thisKey);
      console.log("this type to update = " + type);
      items[itemIndex] = newValues;
      return this.storage.set(this.thisKey, items);
    })
  }
  
}
