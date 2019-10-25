import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';
import { TemplateService } from './template.service';

const key = "plan";

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private storage: Storage, private templateService: TemplateService) {
  }
  
  extras:any;
  detailextras: any;

  setExtras(type, data) {
    type == "extras" ? this.extras = data : this.detailextras = data;
  }
  getExtras(type) {
    return type == "extras" ? this.extras : this.detailextras
  }
  resetExtras() {
    this.extras = null;
    this.detailextras = null;
  }

  getEditDetails(id) {
    return this.storage.get(key).then(result => {
      return result.find(item => item.id == id);
    })
  }


  getAllPlan() {
    return this.storage.get(key);
  }


  //searchfunction
  getPlanFilter(searchTerm) {
    return this.storage.get(key).then(item => {
      //return item.filter(result => result.name === searchTerm);
      return item.filter(result => result.planName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    });
  }


  //insert
  //newitem= pname, Details--->
  addPlanDetails(indexL, date1, planName, pname, pnric, tcsname, tcscontact, maparr, appointment) {
    
    return this.storage.get(key).then((items) => {
      let details = {
        id: uuid(),
        planName: planName,
        name: pname,
        nric: pnric,
        cname: tcsname,
        ccontact: tcscontact,
        createdDate: date1,
        language: indexL,
        templates: maparr,
        appointment: appointment
      }
      if (items) {
        // items.push(details);
        items.unshift(details);
        return this.storage.set(key, items);
      } else {
        return this.storage.set(key, [details]);

      }
    });
  }

  //new plan
  addNewPlan(newitem) {
    return this.storage.get(key).then((items) => {
      if (items) {
        items.push(newitem);
        return this.storage.set(key, items);
      } else {
        return this.storage.set(key, [newitem]);
      }
    });
  }

  //add language
  addLanguage(newitem) {
    return this.storage.get(key).then((items) => {
      if (items) {
        items.push(newitem);
        return this.storage.set(key, items);
      } else {
        return this.storage.set(key, [newitem]);
      }
    });
  }

  //edit
  editPlan(id, details) {
    return this.storage.get(key).then((items) => {
      let y = items.findIndex(item => item.id == id);
      let maparr = this.templateService.cleansedArray();
      details.templates = maparr;
      items[y] = details;
      return this.storage.set(key, items);
    })
  }

  renamePlan(id,planName) {
    return this.getAllPlan().then(data => {
      data.find(item => item.id ===id).planName = planName;
      return this.storage.set(key, data);
    })
  }

  //delete by ID
  deletePlanByID(sortedList) {
    // return this.storage.get(key).then((items) => {
    //   let y = items.findIndex(x => x.id ==id);
    //   console.warn("index value...", y);
    //   console.warn(items);
    //   items.splice(items.findIndex(x => x.id == id), 1);
    //   return this.storage.set(key, items);
    // })
    // sortedList.splice(sortedList.findIndex(x => x.id == id), 1);
    return this.storage.set(key, sortedList);
  }
}
