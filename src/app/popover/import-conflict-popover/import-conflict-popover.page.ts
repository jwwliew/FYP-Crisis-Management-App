import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-import-conflict-popover',
  templateUrl: './import-conflict-popover.page.html',
  styleUrls: ['./import-conflict-popover.page.scss'],
})
export class ImportConflictPopoverPage implements OnInit {

  fileSide = [];      //plans on import file
  storageSide = [];   //plans from app (local)
  toDelete = [];        //plans to delete are filtered into this array
  toAdd = [];           //plans to add are filtered into this array
  check = false;        //to check if popover dismissed by backdrop

  constructor(private navParams: NavParams, private popoverController: PopoverController,
    private storage: Storage, private planService: PlanService, private  toastController: ToastController) { }

  ngOnInit() {
    let values = this.navParams.get('conflictedPlans')
    if(this.fileSide.length <= 0){
      this.fileSide = values[0]
    }
    if(this.storageSide.length <= 0){
      this.storageSide = values[1]
    }
    this.toDelete = [];
    this.toAdd = [];
  }

  //TODO:
  //FIX WEIRD WIGGLY ANIMATION WHEN TAPPING ON ITEM
  updateBtn() {    //html btn
    this.filterSelectedPlans(this.storageSide, this.fileSide).then(() => {
      if(this.toDelete.length <= 0 || this.toAdd.length <= 0){
        this.check = true;
        this.dismiss(this.check);
        this.clearArr();
      }
      this.removeSelectedPlansFromLocal(this.toDelete).then(() => {
        this.addSelectedPlans(this.toAdd).then(() => {
          this.check = true;
          this.dismiss(this.check);     //read onDidDismiss for popover at import-modal.page.ts
          this.clearArr();
        })
      })
    })
    .catch((err) => {
      console.log("ERROR CAUGHT => " + JSON.stringify(err))
      this.dismiss(this.check)
      this.clearArr();
    })
  }

  filterSelectedPlans(_storageSide, _fileside) {    //filter out all the plans with checkbox ticked
    return new Promise((res) => {
      for (var a = 0; a < _storageSide.length; a++) {
        if (_storageSide[a].isChecked === true) {
          this.toDelete.push(_storageSide[a]);

          for (var b = 0; b < _fileside.length; b++) {
            if (_storageSide[a].id === _fileside[b].id) {
              this.toAdd.push(_fileside[b])
            }
          }
        }
        if (a === _storageSide.length - 1) {
          //console.log("EXITING LOOP. . .")
          res();
        }
      }
    })
  }

  removeSelectedPlansFromLocal(toDelete) {      //remove plans from app (local db) 
    return new Promise(async (res) => {
      for (var i = 0; i < toDelete.length; i++) {
        await this.planService.deletePlanById(toDelete[i].id).then(() => {
          if (i === toDelete.length - 1) {
            //console.log("EXITING LOOP. . .")
            res();
          }
        })
      }
    })
  }

  addSelectedPlans(toAdd) {     //add plans selected
    const key = "plan";
    return new Promise(async (res) => {
      for (var k = 0; k < toAdd.length; k++) {
        await this.planService.addNewPlan(toAdd[k]).then(() => {
          if (k === toAdd.length - 1) {
            //console.log("EXITING LOOP. . .")
            res()
          }
        })
      }
    })
  }

  dismiss(check) {    //dismiss popover
    this.resetIsChecked().then(() => {
      this.popoverController.dismiss(check);
    })
  }

  resetIsChecked() {    //set all isChecked back to false
    const key = "plan";
    return new Promise((res) => {
      this.planService.getAllPlan().then((allPlans) => {
        for(var k=0; k<allPlans.length; k++){
          allPlans[k].isChecked == false

          if(k === allPlans.length-1){
            this.storage.set(key, allPlans)
            res()
          }
        }
      })
    })
  }

  clearArr() {      //self explanatory. . . clears arrays
    this.toDelete = []
    this.toAdd = [];
    this.fileSide = null;
    this.storageSide = null;
  }

  //TOASTER
  async showToast(msg) {
    const toast = await this.toastController.create({
      header: msg,
      duration: 3000,
      position: 'bottom',
      buttons: [{
        text: 'CLOSE',
        role: 'cancel'
      }]
    });
    toast.present();
  }


  // //NOT USED, REDUNDANT CODES WOOPS
  // filterUnselectedPlans() {
  //   return new Promise((res) => {
  //     var conflictedPlans = this.conflictPlans;
  //     conflictedPlans.forEach((element, index, arr) => {
  //       if (element.isChecked === false) {
  //         console.log("CURRENT ITEM IS => " + JSON.stringify(element))

  //         this.unselectedPlans.push(element);
  //       }
  //       if (index === arr.length - 1) {
  //         res();
  //       }
  //     })
  //   })
  // }

  // //NOT USED, REDUNDANT CODES WOOPS
  // insertRemainingPlansToDb(unselectedPlans) {
  //   return new Promise((res) => {
  //     unselectedPlans.forEach((element, index, arr) => {
  //       const key = "plan";
  //       this.storage.get(key).then((result: any[]) => {
  //         result.push(element);
  //         this.storage.set(key, result)
  //       })

  //       if (index === arr.length - 1) {
  //         res()
  //       }
  //     })
  //   })
  // }

}
