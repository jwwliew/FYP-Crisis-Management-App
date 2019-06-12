import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const TEMPLATE_KEY = "templateKey";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage) { }

  createTemplate(finalArray) {
    return this.storage.set(TEMPLATE_KEY, finalArray)
  }

  getAllTemplate() {
    return this.storage.get(TEMPLATE_KEY);
  }
  /*
  constructor(private storage: Storage) { }

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
  */
}
