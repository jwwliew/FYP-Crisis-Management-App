import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Plan } from '../models/plan';
import { v4 as uuid } from 'uuid';

const key = "plan";

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  public items = [];

  constructor(private storage: Storage) {
  }

  getEditDetails(id) {
    return this.storage.get(key).then(result => {
      return result.find(item => item.id == id);
    })
  }


  getAllPlan() {
    return this.storage.get(key);
    console.log(this.items);
  }


  //searchfunction
  getPlanFilter(searchTerm) {
    return this.storage.get(key).then(item => {
      console.log(item);
      console.log(searchTerm);
      //return item.filter(result => result.name === searchTerm);
      return item.filter(result => result.planName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    });
  }


  //insert
  //newitem= pname, Details--->
  addPlanDetails(indexL, date1, planName, pname, pnric, tcsname, tcscontact, maparr, appointment, clinicname) {
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
        template: maparr,
        datemy: appointment,
        clinicName: clinicname
      }
      console.warn(details)
      if (items) {
        items.push(details);
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
  editPlan(iteamid, details) {
    return this.storage.get(key).then((items) => {
      let y = items.findIndex(item => item.id == iteamid)
      items[y] = details;
      console.log(details)
      return this.storage.set(key, items)

    })
  }


  //delete by ID
  deletePlanByID(id: string) {
    return this.storage.get(key).then((items) => {
      items.splice(items.findIndex(x => x.id == id), 1)
      return this.storage.set(key, items);
    })

  }
}
