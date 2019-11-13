import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';
import { TemplateService } from './template.service';
import { insertView } from '@ionic/angular/dist/directives/navigation/stack-utils';

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
  addPlanDetails(indexL, date1, planName, pname, pnric, tcsname, tcscontact, maparr, appointment, ischecked=false, isnew=false) {
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
        isChecked: ischecked,   //JW
        isNew: isnew,     //JW
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

  //JW: used for my import function, feel free to use it
  //pass in plan id, and it will delete plan by id
  deletePlanById(id){
    return new Promise((res) => {
      this.storage.get(key).then((items) => {
        var itemsToKeep = [];

        if(items.length === 1){
          if(id === items[0].id){
            this.storage.set(key, itemsToKeep)
            res()
          }
        }

        else{
          items.forEach((element, index, arr) => {
            if(element.id !== id){
              itemsToKeep.push(element)
  
              if(index === arr.length-1){
                this.storage.set(key, itemsToKeep)
                res()
              }
            }
            else{
              if(index === arr.length-1){
                this.storage.set(key, itemsToKeep)
                res()
              }
            }
          })
        }             
      })
    })
  }

  //JW
  //add new plan. to add, pass in the new plan
  importAddNewPlan(thePlan){
    return new Promise((res) => {
      this.storage.get(key).then((allPlans) => {
        if (allPlans) {
          allPlans.push(thePlan);
          this.storage.set(key, allPlans);
          res();
        } else {
          this.storage.set(key, [thePlan]);
          res();
        }
      });
    })    
  }

  setIsNewToFalse(thePlan){
    new Promise((res) => {
      this.storage.get(key).then((allPlans) => {
        if(allPlans){
          for(var f = 0; allPlans.length; f++){
            if(allPlans[f].id === thePlan.id){
              allPlans[f].isNew = false
            }
            if(f == allPlans.length-1){
              res(allPlans)
            }
          }
        }
      })
    }).then((allPlans) => {
      this.storage.set(key, allPlans)
    })
  }


  // //for display of newly imported plans
  // addNewlyImportedPlans(onePlan){
  //   var kkey = "newImportedPlans"
  //   return new Promise((res) => {
  //     this.storage.get(kkey).then((newPlans) => {
  //       if (newPlans) {
  //         if(newPlans.length == 0){
  //           newPlans.push(onePlan)
  //           this.storage.set(kkey, newPlans)
  //           res()
  //         }
  //         else if (newPlans.length > 1) {
  //           new Promise((res2) => {
  //             var check = false
  //             for(var z = 0; newPlans.length; z++){
  //               if(newPlans[z].id !== onePlan.id){
  //                 if(z == newPlans.length-1){
  //                   res2(check)
  //                 }
  //               }
  //               else{
  //                 check = true
  //                 res2(check)
  //               }
  //             }
  //           }).then((check) => {
  //             if(check === true){
  //               res()
  //             }
  //             if (check === false) {
  //               newPlans.push(onePlan)
  //               this.storage.set(kkey, newPlans)
  //               res()
  //             }
  //           })
  //         }
  //         else if(newPlans.length == 1 ){
  //           if(newPlans[0].id === onePlan.id){
  //             res()
  //           }
  //           else{
  //             newPlans.push(onePlan)
  //             this.storage.set(kkey, newPlans)
  //             res()
  //           }
  //         }          
  //       }
  //       else{
  //         this.storage.set(kkey, [newPlans])
  //         res()
  //       }
  //     })
  //   })
  // }

  // getNewlyImportedPlans(){
  //   var kkey = "newImportedPlans"
  //   return this.storage.get(kkey)
  // }

  // removeNewlyImportedPlan(id) {
  //   var kkey = "newImportedPlans"
  //   return new Promise((res) => {
  //     this.storage.get(kkey).then((items) => {
  //       var itemsToKeep = [];

  //       if (items.length === 1) {
  //         if (id === items[0].id) {
  //           this.storage.set(kkey, itemsToKeep)
  //           res()
  //         }
  //       }

  //       else {
  //         items.forEach((element, index, arr) => {
  //           if (element.id !== id) {
  //             itemsToKeep.push(element)

  //             if (index === arr.length - 1) {
  //               this.storage.set(kkey, itemsToKeep)
  //               res()
  //             }
  //           }
  //           else {
  //             if (index === arr.length - 1) {
  //               this.storage.set(kkey, itemsToKeep)
  //               res()
  //             }
  //           }
  //         })
  //       }
  //     })
  //   })
  // }
}
