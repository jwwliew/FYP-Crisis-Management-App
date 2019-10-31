import { Component, OnInit } from '@angular/core';

import { ModalController, NavController, ToastController, PopoverController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { PlanService } from './../services/plan.service';
import { ImportConflictPopoverPage } from '../popover/import-conflict-popover/import-conflict-popover.page';

import * as _ from 'lodash';

import { Router } from '@angular/router';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.page.html',
  styleUrls: ['./import-modal.page.scss'],
})
export class ImportModalPage implements OnInit {

  overallFileContents = "";
  theFiles = null;      //var for listing files in html

  storageIdArr = [];      //refers to ids of plans from storage
  fileIdArr = [];       //refers to ids of plans from selected import file
  parsedPlans = [];     //plans without the separator

  constructor(private modalController: ModalController, private navParams: NavParams,
    private file: File, private navController: NavController,
    private router: Router, private storage: Storage, private toastController: ToastController,
    private planService: PlanService, private popoverController: PopoverController) { }

  ngOnInit() {
    this.theFiles = this.navParams.get('fileArr');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  //read .json and store in var
  readFileToVar(filename) {
    return new Promise((res) => {
      this.file.resolveDirectoryUrl(this.file.externalRootDirectory + 'crisisApp').then((dirEntry) => {
        this.file.getFile(dirEntry, filename, { create: false }).then((fileEntry) => {
          fileEntry.file((theFile) => {
            var contents = "";
            var reader = new FileReader();
            reader.readAsText(theFile);

            reader.onloadend = () => storeResults(reader.result);
            function storeResults(results) {
              contents = results;
              res(contents);
            }
          })
        })
      })
    })
  }

  //check file for identifier
  checkJsonFileId(fileContent: string) {
    return new Promise((res, rej) => {
      let fileChecker: string = "";
      let newFileContent: string = "";
      fileChecker = fileContent.substr(1);   //take out opening array bracket
      if (fileChecker.indexOf("\"crisisApp\": \"true\"},") === -1) {
        console.log("Invalid file");
        rej();
      }
      else {
        let pos = fileChecker.indexOf("\"crisisApp\": \"true\"},")   //find first separator, cut out
        let position = pos + 22;
        fileChecker = fileChecker.substr(0, position);

        newFileContent = fileContent.substr(1);
        newFileContent = fileContent.slice(position, -1);
        res(newFileContent);
      }
    })
  }

  async asyncwhileloop(fileContents) {
    return new Promise(async (res) => {
      var loop = true;
      this.overallFileContents = fileContents
      while (loop) {
        await this.extractOneItemFromFileContent(this.overallFileContents).then(async (fileContents) => {
          await this.insertOneItemIntoDb(fileContents).then(async () => {
            await this.checkIfStillContainsItem(this.overallFileContents).then((check) => {
              if (check === true) {
                //console.log("EXITING LOOP. . .")
                loop = false;
                res();
              }
            })
          })
        })

        //while loop safety, if more than 10secs, break loop
        setTimeout(() => {
          if (loop === true) {
            console.log("Activating safety measures. Breaking loop. . .")
            loop = false;
          }
        }, 10000);
      }
    })
  }

  //returns one plan
  extractOneItemFromFileContent(fileContent: string) {
    return new Promise((res) => {
      let oneItem: string = "";
      let newFileContent: string = "";

      oneItem = fileContent
      oneItem = oneItem.substring(0, oneItem.indexOf(",{\"@\":\"~\"}"))   //find first separator, cuts out separator
      oneItem = JSON.parse(oneItem);      //parse from string to object

      newFileContent = fileContent.slice(fileContent.indexOf(",{\"@\":\"~\"}") + 11);     //takes out first item
      this.overallFileContents = newFileContent;
      //console.log("oneitem => " + JSON.stringify(oneItem))
      res(oneItem);
    })
  }

  //inserts one plan into db
  insertOneItemIntoDb(theItem) {
    return new Promise((res) => {
      const key = "plan";
      this.storage.get(key).then((result: any[]) => {
        result.push(theItem);
        this.storage.set(key, result)
        res()
      })
    })
  }

  checkIfStillContainsItem(overallFileContent) {
    let check: boolean = false;
    return new Promise((res) => {
      if (overallFileContent.length > 0 && overallFileContent !== "") {   //theres still things in var
        res(check)
      }
      else {
        check = true;
        res(check)
      }
    })
  }

  importBtn(oneFile) {    //html btn
    this.importFile(oneFile).then(() => {
      this.modalController.dismiss();
      this.showToast("Import successful");
    })
  }

  //revised import
  importFile(oneFile) {
    return new Promise((Mresolve) => {
      this.readFileToVar(oneFile.name).then((fileContents: string) => {
        this.checkJsonFileId(fileContents).then((fileContents: string) => {
          let apromise2 = this.asyncLoopToParseFile(fileContents)
          let apromise1 = this.getStoragePlansIds().then((check) => {
            if(check === true){     //if local db not empty
              Promise.all([apromise1, apromise2]).then(() => {
                new Promise((res1) => {
                  this.filterSameIds(this.storageIdArr, this.fileIdArr).then((filteredIdArr: string[]) => {
                    if (filteredIdArr.length <= 0) {    //if there are no conflicting plans
                      res1()
                    }
                    if (filteredIdArr.length > 0) {     //if there are conflicting plans
                      let bpromise1 = this.getFilteredPlansFileSide(filteredIdArr)
                      let bpromise2 = this.getFilteredPlansStorageSide(filteredIdArr)
                      Promise.all([bpromise1, bpromise2]).then((values) => {
                        this.popover(values).then(() => {   //brings up popover to let user resolve conflicting files
                          res1()
                        })
                      })
                    }
                  })
                }).then(() => {
                  //for plans without conflicts
                  new Promise((res2) => {
                    this.filterDiffIds(this.storageIdArr, this.fileIdArr).then((filteredIdArr: string[]) => {
                      if (filteredIdArr.length <= 0) {    //if there are no new plans
                        res2()
                      }
                      if (filteredIdArr.length > 0) {     //if there are new plans
                        this.getFilteredPlans(filteredIdArr).then((filteredPlans) => {
                          this.insertPlansIntoDb(filteredPlans).then(() => {
                            res2()
                          })
                        })
                      }
                    })
                  }).then(() => {
                    Mresolve();
                    this.resetArr();
                  })
                })
              })
            }
            if(check === false){    //if local db is empty
              //just imports files straight away (skips conflict part)
              this.asyncwhileloop(fileContents).then(() => {
                Mresolve();
                this.resetArr();
              })
            }
          })
        })
        .catch((err) => {   //catch files without valid identifier {"@":"~"}
          console.log("Caught error => " + JSON.stringify(err));
          this.showToast("Invalid file");
        })
      })
    }).catch((err) => {
      console.log("Caught error => " + JSON.stringify(err))
    }) 
  }

  getStoragePlansIds() {
    return new Promise((res) => {
      var check = false;
      this.planService.getAllPlan().then(async (allPlans) => {
        if (allPlans.length <= 0) {
          res(check)
        }
        else {
          for (let i = 0; i < allPlans.length; i++) {
            var onePlan = allPlans[i]
            let onePlanId = onePlan.id
            this.storageIdArr.push(onePlanId)
            if (i === allPlans.length - 1) {
              check = true;
              res(check)
            }
          }
        }
      })
    })
  }

  asyncLoopToParseFile(fileContents) {
    return new Promise(async (res) => {
      var loop = true
      this.overallFileContents = fileContents
      while (loop) {
        await this.parseFileAndGetFilePlansIds(this.overallFileContents).then(async () => {
          await this.checkIfStillContainsItem(this.overallFileContents).then((check) => {
            if (check === true) {
              loop = false
              res()
            }
          })
        })

        //while loop safety, if more than 10secs, break loop
        setTimeout(() => {
          if (loop === true) {
            console.log("Activating safety measures. Breaking loop. . .")
            loop = false;
          }
        }, 10000);
      }
    })
  }

  parseFileAndGetFilePlansIds(fileContent) {
    return new Promise((res) => {
      let oneItem;
      let newFileContent: string = "";

      oneItem = fileContent
      oneItem = oneItem.substring(0, oneItem.indexOf(",{\"@\":\"~\"}"))   //find first separator, cuts out separator
      oneItem = JSON.parse(oneItem);      //parse from string to object

      newFileContent = fileContent.slice(fileContent.indexOf(",{\"@\":\"~\"}") + 11);     //takes out first item
      this.overallFileContents = newFileContent;

      var oneItemId = oneItem.id
      this.fileIdArr.push(oneItemId)
      this.parsedPlans.push(oneItem)
      res();
    })
  }

  //check if uuid exists in the other arr, returns filtered arr
  filterSameIds(storageIdArr, fileIdArr) {
    return new Promise((res) => {
      var conflictsArr = storageIdArr.filter(function (a) {
        return fileIdArr.indexOf(a) != -1
      })
      //console.log("conflictsArr => " + JSON.stringify(conflictsArr))
      res(conflictsArr)
    })
  }

  //check if uuid DOES NOT exist in the other arr, returns filtered arr
  filterDiffIds(storageIdArr, fileIdArr) {
    return new Promise((res) => {
      var noConflictsArr = fileIdArr.filter(function (a) {
        return storageIdArr.indexOf(a) == -1;
      })
      //console.log("noConflictsArr => " + JSON.stringify(noConflictsArr))
      res(noConflictsArr)
    })
  }

  getFilteredPlans(filteredIdArr) {
    return new Promise((res) => {
      var parsedplans = this.parsedPlans
      var filteredPlans = parsedplans.filter(function (q) {
        return filteredIdArr.indexOf(q.id) != -1;
      })
      res(filteredPlans);
    })
  }

  insertPlansIntoDb(filteredPlans) {
    return new Promise(async (res) => {
      for(var w=0; w<filteredPlans.length; w++){
        await this.planService.importAddNewPlan(filteredPlans[w]).then(() => {
          if(w == filteredPlans.length-1){
            res();
          } 
        })               
      }
    })
  }

  getFilteredPlansStorageSide(filteredIdArr) {
    return new Promise((res) => {
      this.planService.getAllPlan().then((allPlans) => {
        var filteredPlans = allPlans.filter(function (q) {
          return filteredIdArr.indexOf(q.id) != -1;
        })
        res(filteredPlans)
      })
    })
  }

  //this function is same as getFilteredPlans. I just wanted a different name to avoid confusion :)
  getFilteredPlansFileSide(filteredIdArr) {
    return new Promise((res) => {
      var parsedPlans = this.parsedPlans;
      var filteredPlans = parsedPlans.filter(function (q) {
        return filteredIdArr.indexOf(q.id) != -1;
      })
      res(filteredPlans)
    })
  }

  async popover(conflictedPlans) {
    return new Promise(async (res) => {
      const popover = await this.popoverController.create({
        component: ImportConflictPopoverPage,
        componentProps: {
          conflictedPlans: conflictedPlans
        },
      });
      popover.present()

      popover.onDidDismiss().then((check) => {
        if (check.data === true) {    //only triggers if popover is NOT dismissed by tapping backdrop
          res()
        }
      })
    })
  }

  //reset global arrays
  resetArr() {
    this.fileIdArr = [];
    this.storageIdArr = [];
    this.parsedPlans = [];
  }

  //TOASTER
  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  //OLD CODES FOR REFERENCE

  //OUTDATED, NOT USED
  importSelectedCheck(oneFile) {    //html btn
    this.importSelected(oneFile).then((check) => {
      //nothing
    })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  }

  //OUTDATED, NOT USED
  importSelected(oneFile) {
    return new Promise((resolve) => {
      this.readFileToVar(oneFile.name).then((fileContents: string) => {
        this.checkJsonFileId(fileContents).then((fileContents: string) => {
          this.asyncwhileloop(fileContents).then(() => {
            resolve();
          })
        })
          .catch((err) => {
            this.showToast("Invalid file");
          })
      })
    }).then(() => {   //wait for all files to be inserted into db before dismissing modal, onmodaldismissed, page is refreshed
      this.modalController.dismiss();
      this.showToast("Import successful")
    })
  }

  //TODO: not priority
  //compare old and new arr using index of and includes
  //use promise all to see if any returns false

  // //checks all fields except for plan uuid, returns true/false
  // //NOT PRIORITY
  // updateCheckAllFields(onePlan) {
  //   return new Promise((res) => {
  //     this.planService.getAllPlan().then((allPlans) => {
  //       var newAllPlans = allPlans.pop()    //remove array brackets []
  //       delete newAllPlans.id
  //       delete onePlan.id

  //       console.log("allplans => " + JSON.stringify(newAllPlans))
  //       console.log("onePlan => " + JSON.stringify(onePlan))

  //       var check = _.isEqual(onePlan, newAllPlans)
  //       console.log(check)
  //       res(check)
  //     })
  //   })
  // }

  // //NOT PRIORITY
  // //hi whoever is reading this, im sorry for hardcoding this part hahaha
  // //get values of each field and store in array
  // getValueOfEachField(onePlan) {    //returns array
  //   return new Promise((res) => {

  //     async function asyncloop() {
  //       var valueArr = []

  //       for (var key in onePlan) {
  //         if (onePlan.hasOwnProperty(key)) {
  //           if (key === "planName") {
  //             valueArr.push(onePlan[key])
  //           }
  //           if (key === "name") {
  //             valueArr.push(onePlan[key])
  //           }
  //           if (key === "nric") {
  //             valueArr.push(onePlan[key])
  //           }
  //           if (key === "cname") {
  //             valueArr.push(onePlan[key])
  //           }
  //           if (key === "ccontact") {
  //             valueArr.push(onePlan[key])
  //           }

  //           if (key === "templates") {
  //             var templatesArr = onePlan[key]    // [[{},{}][{}][{}]]  more than 1 {} if more than 1 action

  //             var criticalArr = templatesArr[0]
  //             var warningArr = templatesArr[1]
  //             var goodArr = templatesArr[2]

  //             //critical arr
  //             for (var z = 0; z < criticalArr.length; z++) {
  //               var criticalObj = criticalArr[z]
  //               //console.log("critical => " + JSON.stringify(criticalObj))

  //               for (var kkey in criticalObj) {
  //                 if (criticalObj.hasOwnProperty(kkey)) {
  //                   if (kkey === "symptom") {
  //                     var symptom = criticalObj[kkey]     //{}
  //                     for (var kkkey in symptom) {
  //                       if (symptom.hasOwnProperty(kkkey)) {
  //                         if (kkkey === "description") {
  //                           valueArr.push(symptom[kkkey])
  //                         }
  //                         if (kkkey === "symptomID") {
  //                           valueArr.push(symptom[kkkey])
  //                         }
  //                       }
  //                     }
  //                   }

  //                   if (kkey === "combined") {
  //                     var combinedArr = criticalObj[kkey]    //[{}]
  //                     for (var a = 0; a < combinedArr.length; a++) {
  //                       for (var kkkey in combinedArr[a]) {
  //                         if (combinedArr[a].hasOwnProperty(kkkey)) {
  //                           if (kkkey === "description") {
  //                             valueArr.push(combinedArr[a][kkkey])
  //                           }
  //                           if (kkkey === "actionID") {
  //                             valueArr.push(combinedArr[a][kkkey])
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }

  //             //warning arr
  //             for (var y = 0; y < warningArr.length; y++) {
  //               var warningObj = warningArr[y]
  //               //console.log("warning => " + JSON.stringify(warningObj))

  //               for (var kkey in warningObj) {
  //                 if (warningObj.hasOwnProperty(kkey)) {
  //                   if (kkey === "symptom") {
  //                     var symptom = warningObj[kkey]     //{}
  //                     for (var kkkey in symptom) {
  //                       if (symptom.hasOwnProperty(kkkey)) {
  //                         if (kkkey === "description") {
  //                           valueArr.push(symptom[kkkey])
  //                         }
  //                         if (kkkey === "symptomID") {
  //                           valueArr.push(symptom[kkkey])
  //                         }
  //                       }
  //                     }
  //                   }

  //                   if (kkey === "combined") {
  //                     var combinedArr = warningObj[kkey]    //[{}]
  //                     for (var a = 0; a < combinedArr.length; a++) {
  //                       for (var kkkey in combinedArr[a]) {
  //                         if (combinedArr[a].hasOwnProperty(kkkey)) {
  //                           if (kkkey === "description") {
  //                             valueArr.push(combinedArr[a][kkkey])
  //                           }
  //                           if (kkkey === "actionID") {
  //                             valueArr.push(combinedArr[a][kkkey])
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }

  //             //good arr
  //             for (var x = 0; x < goodArr.length; x++) {
  //               var goodObj = goodArr[x]
  //               //console.log("good => " + JSON.stringify(goodObj))

  //               for (var kkey in goodObj) {
  //                 if (goodObj.hasOwnProperty(kkey)) {
  //                   if (kkey === "symptom") {
  //                     var symptom = goodObj[kkey]     //{}
  //                     for (var kkkey in symptom) {
  //                       if (symptom.hasOwnProperty(kkkey)) {
  //                         if (kkkey === "description") {
  //                           valueArr.push(symptom[kkkey])
  //                         }
  //                         if (kkkey === "symptomID") {
  //                           valueArr.push(symptom[kkkey])
  //                         }
  //                       }
  //                     }
  //                   }

  //                   if (kkey === "combined") {
  //                     var combinedArr = goodObj[kkey]    //[{}]
  //                     for (var a = 0; a < combinedArr.length; a++) {
  //                       for (var kkkey in combinedArr[a]) {
  //                         if (combinedArr[a].hasOwnProperty(kkkey)) {
  //                           if (kkkey === "description") {
  //                             valueArr.push(combinedArr[a][kkkey])
  //                           }
  //                           if (kkkey === "actionID") {
  //                             valueArr.push(combinedArr[a][kkkey])
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }

  //           //appointment arr
  //           if (key === "appointment") {
  //             var apptArr = onePlan[key]  // [{}]
  //             for (var b = 0; b < apptArr.length; b++) {
  //               for (var kkey in apptArr[b]) {
  //                 if (apptArr[b].hasOwnProperty(kkey)) {
  //                   if (kkey === "clinicName") {
  //                     valueArr.push(apptArr[b][kkey])
  //                   }
  //                   if (kkey === "appTime") {
  //                     valueArr.push(apptArr[b][kkey])
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       console.log("value arr => " + JSON.stringify(valueArr))
  //       await res(valueArr)
  //     }
  //     asyncloop();

  //   })
  // }
}
