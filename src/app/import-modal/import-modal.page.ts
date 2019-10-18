import { Component, OnInit } from '@angular/core';

import { ModalController, NavController, ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { PlanService } from './../services/plan.service';

import * as _ from 'lodash';

import { Router } from '@angular/router';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.page.html',
  styleUrls: ['./import-modal.page.scss'],
})
export class ImportModalPage implements OnInit {

  overrallFileContents = "";

  theFiles = null;

  constructor(private modalController: ModalController, private navParams: NavParams,
    private file: File, private navController: NavController,
    private router: Router, private storage: Storage, private toastController: ToastController,
    private planService: PlanService) { }

  ngOnInit() {
    this.theFiles = this.navParams.get('fileArr');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  importSelectedCheck(oneFile) {    //html btn
    this.importSelected(oneFile).then((check) => {
      //nothing
    })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  }

  testbtn(oneFile) {
    this.test(oneFile).then((check) => {

    })
  }

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

  async asyncwhileloop(fileContents) {
    return new Promise(async (res) => {
      var loop = true;
      this.overrallFileContents = fileContents
      while (loop) {
        await this.extractOneItemFromFileContent(this.overrallFileContents).then(async (fileContents) => {
          await this.insertOneItemIntoDb(fileContents).then(async () => {
            await this.checkIfStillContainsItem(this.overrallFileContents).then((check) => {
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

  //returns one plan
  extractOneItemFromFileContent(fileContent: string) {
    return new Promise((res) => {
      let oneItem: string = "";
      let newFileContent: string = "";

      oneItem = fileContent
      oneItem = oneItem.substring(0, oneItem.indexOf(",{\"@\":\"~\"}"))   //find first separator, cuts out separator
      oneItem = JSON.parse(oneItem);      //parse from string to object

      newFileContent = fileContent.slice(fileContent.indexOf(",{\"@\":\"~\"}") + 11);     //takes out first item
      this.overrallFileContents = newFileContent;
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

  updatePlanOnImport() {
    //compare fields, if planname, name, nric, tcs name, tcs contact same]
    //if uuid same, -> check if other fields same

  }

  updateCheckAllFields(onePlan) {   //returns true/false?
    return new Promise((res) => {
      this.planService.getAllPlan().then((allPlans) => {
        var newAllPlans = allPlans.pop()    //remove array brackets []
        delete newAllPlans.id
        delete onePlan.id

        console.log("allplans => " + JSON.stringify(newAllPlans))
        console.log("onePlan => " + JSON.stringify(onePlan))

        var check = _.isEqual(onePlan, newAllPlans)
        console.log(check)
        res(check)
      })
    })
  }

  updateCheckUUID(onePlan) {    //return true/false?
    return new Promise((res) => {
      this.planService.getAllPlan().then((allPlans) => {
        console.log("allplans => " + JSON.stringify(allPlans[0].id))
        console.log("onePlan => " + JSON.stringify(onePlan.id))

        var check = _.isEqual(onePlan.id, allPlans[0].id)
        console.log(check)
        res(check)
      })
    })
  }

  //hi whoever is reading this, im sorry for hardcoding this part hahaha
  //check which fields not same
  getValueOfEachField(onePlan) {
    var valueArr = []

    // var planid
    // var planname
    // var name
    // var nric
    // var cname
    // var ccontact
    // //var createDate
    // //var langauge

    // var templatesid
    // var templatesname

    // var csymptomtext
    // //var csymptomtype
    // //var csymptomimg
    // var csymptomdesc
    // var csymptomid

    // var combinedid
    // var combinedtext
    // //var comibinedtype
    // //var combinedimg
    // var combineddesc
    // var combinedid

    // var apptid
    // var apptclinicname
    // var appttime

    for (var key in onePlan) {
      if (onePlan.hasOwnProperty(key)) {
        // console.log(key + " => " + onePlan[key])

        if (key === "id") {
          console.log(key + " => " + onePlan[key])
          valueArr.push(onePlan[key])
        }
        if (key === "planName") {
          console.log(key + " => " + onePlan[key])
          valueArr.push(onePlan[key])
        }
        if (key === "name") {
          console.log(key + " => " + onePlan[key])
          valueArr.push(onePlan[key])
        }
        if (key === "nric") {
          console.log(key + " => " + onePlan[key])
          valueArr.push(onePlan[key])
        }
        if (key === "cname") {
          console.log(key + " => " + onePlan[key])
          valueArr.push(onePlan[key])
        }
        if (key === "ccontact") {
          console.log(key + " => " + onePlan[key])
          valueArr.push(onePlan[key])
        }

        if (key === "templates") {
          console.log("this is templates array, with the 3 nested arrays")
          var templatesArr = onePlan[key]    // [[{}][{}][{}]]
          //var tcriticalArr = templatesArr[0]    // [{}]
          //var criticalObj = tcriticalArr[0]   // {{}}
          
          var criticalObj = templatesArr[0][0]
          var warningObj = templatesArr[0][0]
          var goodObj = templatesArr[0][0]

          for (var kkey in criticalObj) {
            if (criticalObj.hasOwnProperty(kkey)) {

              if (kkey === "symptom") {
                console.log("this is symptom object")
                var symptom = criticalObj[kkey]     //{}

                for (var kkkey in symptom) {
                  if (symptom.hasOwnProperty(kkkey)) {
                    // console.log(kkkey + " => " + symptom[kkkey])

                    if(kkkey === "id"){
                      console.log(kkkey + " => " + symptom[kkkey])
                      valueArr.push(symptom[kkkey])
                    }
                    if(kkkey === "text"){
                      console.log(kkkey + " => " + symptom[kkkey])
                      valueArr.push(symptom[kkkey])
                    }
                    if(kkkey === "description"){
                      console.log(kkkey + " => " + symptom[kkkey])
                      valueArr.push(symptom[kkkey])
                    }
                    // if(kkkey === "symptomID"){
                    //   console.log(kkkey + " => " + symptom[kkkey])
                    //   valueArr.push(symptom[kkkey])
                    // }
                  }
                }
              }

              if (kkey === "combined") {
                console.log("this is combined array")
                var combinedArr = criticalObj[kkey]    //[{}]
                var combinedObj = combinedArr[0]     //{}

                for (var kkkey in combinedObj) {
                  if (combinedObj.hasOwnProperty(kkkey)) {
                    console.log(kkkey + " => " + combinedObj[kkkey])
                  }
                }

              }
            }
          }
        }
        if (key === "appointment") {
          console.log("this is appointment array")
          var apptArr = onePlan[key]  // [{}]
          var apptObj = apptArr[0]    // {}
          for (var kkey in apptObj) {
            if (apptObj.hasOwnProperty(kkey)) {
              console.log(kkey + " => " + apptObj[kkey])
            }
          }
        }
      }
    }
    console.log("value arr => " + JSON.stringify(valueArr))
  }

  //TODO
  updateConfirmation() {
    //list of plans to be updated, checkbox to choose which to update
  }

  test(oneFile) {
    return new Promise((resolve) => {
      this.readFileToVar(oneFile.name).then((fileContents: string) => {
        this.checkJsonFileId(fileContents).then((fileContents: string) => {
          this.overrallFileContents = fileContents
          this.extractOneItemFromFileContent(this.overrallFileContents).then((fileContents: string) => {
            //this.updateCheckAllFields(fileContents)
            //this.updateCheckUUID(fileContents)
            this.getValueOfEachField(fileContents)

            //TODO
            //compare old and new arr using index of and includes
            //use promise all to see if any returns false
          })
        })
      })
    })
  }

  //TOASTER
  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
