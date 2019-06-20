import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';

const TEMPLATE_KEY = "templateKey";
const WARNING_KEY = "warningKey";
const ALL_KEY = "allKey";
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage) { }

  createTemplate(finalArray, templateNameFromInput, addOrUpdate, templateID, templateNameUpdate) {
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
        console.warn("data index ---- " + JSON.stringify(data[index]));
        if (element && element.length > 0) {
          element[0].combined = element[0].combined.filter(item => item.text !== "Action");
          // data[index].push(element);
          // arr.push(element);
        }
        element = element || [];
        arr.push(element);
      });
      var result = {templates: [...arr], id: templateID || uuid(), name: templateNameFromInput}; //https://stackoverflow.com/questions/42120358/change-property-in-array-with-spread-operator-returns-object-instead-of-array
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
