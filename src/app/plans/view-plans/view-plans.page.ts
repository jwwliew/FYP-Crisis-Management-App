import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ActionSheetController, Events, IonList, ToastController, AlertController } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';
import { SettingsService } from 'src/app/services/settings.service';

//JW
import { File } from '@ionic-native/file/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { ImportModalPage } from '../../import-modal/import-modal.page';
import { v4 as uuid } from 'uuid';
import { Storage } from '@ionic/storage';
import * as CryptoJS from 'crypto-js';

declare let window: any;

@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})

// @Directive({
//   selector: '[disableControl]'
// })

export class ViewPlansPage implements OnInit {

  constructor(private router: Router, private planService: PlanService, public actionSheetController: ActionSheetController,
    private event: Events, private templateService: TemplateService, private file: File,
    private modalController: ModalController, private storage: Storage, private toastController: ToastController,
    private popoverController: PopoverController, private alertController: AlertController,
    private settingService: SettingsService) {

  }
  details: any;
  plan: any;
  searchTerm: string = "";
  sortedDetails: any;
  //JW
  checkboxHidden: boolean = false;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.searchTerm = "";
    this.planService.getAllPlan().then(plandetails => {
      plandetails = plandetails || [];
      // plandetails.sort((a,b) => b.createdDate.localeCompare(a.createdDate)); //sort latest on top, dont need as used unshift() instead of push(), revert if needed
      this.details = plandetails;
      this.sortedDetails = plandetails; //https://stackoverflow.com/questions/53346885/how-to-efficiently-load-large-list-in-ionic/53347064#53347064
    });
  }

  //search item(s)
  setFilteredItems() {
    this.sortedDetails = this.details.filter(result =>
      result.planName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || result.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
    this.mylist.closeSlidingItems();
    // this.PlanService.getPlanFilter(this.searchTerm).then(sname => {
    //   this.mylist.closeSlidingItems();
    //   this.details = sname;
    //   console.log(sname);
    // })
    // console.log("check   " + this.searchTerm);
  }

  //redirect
  onClick() {
    this.router.navigateByUrl('/tabs/plans/newPlan');
  }

  goEdit(item) {
    this.router.navigateByUrl('/tabs/plans/editplan/' + item.id);
  }

  //https://ionicframework.com/docs/api/alert
  //delete ADD alert
  @ViewChild('mylist') mylist: IonList;

  swipeEvent(id) {
    // thisEvent.stopPropagation();
    this.templateService.delete("Are you sure you want to delete this plan?").then(() => {
      this.details.splice(this.details.findIndex(x => x.id == id), 1);
      this.sortedDetails = [...this.details];
      this.planService.deletePlanByID(this.details); //default plans from old to new
      this.templateService.presentToastWithOptions("Deleted plan!");
      this.mylist.closeSlidingItems();
      this.searchTerm = "";
    }).catch(() => { })
  }

  presentActionSheetDelayed() { //needed to prevent keyboard taking up white space bug when tap onto searchbar then tap onto filter button
    if (this.focused) {
      setTimeout(() => {
        this.presentActionSheet();
      }, 150);
    }
    else {
      this.presentActionSheet();
    }
  }

  focused: boolean;
  ionFocus() {
    this.focused = true;
  }
  ionBlur() {
    setTimeout(() => { //need setTimeout else too fast for the if statement in presentActionSheetDelayed()
      this.focused = false;
    }, 10);
  }

  //Filter
  async presentActionSheet() {
    this.mylist.closeSlidingItems();
    if (this.sortedDetails.length == 0) {
      this.templateService.presentToastWithOptions("No plans to filter. Please click on 'New' at the top right to add a plan!");
      return false;
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Sort by',
      buttons: [{
        text: 'A to Z',
        // role: 'destructive',
        icon: 'arrow-round-down',
        handler: () => {
          this.details.sort((a, b) => a.planName.localeCompare(b.planName));
          this.sortedDetails = [...this.details]; //https://github.com/angular/components/issues/13854 angular does not detect change until variable get new value
          this.templateService.presentToastWithOptions("Plans sorted from A to Z");

          // this.PlanService.getAllPlan().then(wholeplan => {
          //   console.log(this.details);
          //   wholeplan.sort((a, b) => a.planName.localeCompare(b.planName))
          //   this.details = wholeplan;
          //   this.templateService.presentToastWithOptions("Plans sorted from A to Z");
          //   console.log(this.details);
          // });
        }
      }, {
        text: 'Z to A',
        icon: 'arrow-round-up',
        handler: () => {
          this.details.sort((a, b) => b.planName.localeCompare(a.planName));
          this.sortedDetails = [...this.details];
          // this.PlanService.getAllPlan().then(wholeplan => {
          //   wholeplan.sort((a, b) => b.planName.localeCompare(a.planName))
          //   this.details = wholeplan;
          this.templateService.presentToastWithOptions("Plans sorted from Z to A");
          // });
        }
      }, {
        text: 'Date: New to Old',
        icon: 'Trending-down',
        handler: () => {
          this.details.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
          this.sortedDetails = [...this.details];
          // this.PlanService.getAllPlan().then(wholeplan => {
          //   wholeplan.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
          //   this.details = wholeplan;
          this.templateService.presentToastWithOptions("Plans sorted from latest to oldest");
          // });
        }
      }, {
        text: 'Date: Old to New',
        icon: 'Trending-up',
        handler: () => {
          this.details.sort((a, b) => a.createdDate.localeCompare(b.createdDate));
          this.sortedDetails = [...this.details];
          this.templateService.presentToastWithOptions("Plans sorted from oldest to latest");
        }
      }]
    });
    await actionSheet.present();
  }

  itemHeightFn(item, index) { //method to prevent virtual scroll flicker when navigate between tabs
    return 140; //https://github.com/ionic-team/ionic/issues/17540#issuecomment-511136665
  }

  ionViewDidLeave() {
    this.mylist.closeSlidingItems();
  }

  @ViewChild('content') content;
  scrollToItem() {
    this.content.scrollToTop(1000);
    setTimeout(() => {
      this.buttonShown = false;
    }, 1000);
  }
  buttonShown: boolean = false;
  scroll(ev) {
    let currentScrollHeight = ev.target.clientHeight + ev.detail.scrollTop;
    currentScrollHeight > 3000 ? //shown when more than 20 plans https://stackoverflow.com/questions/45880214/how-to-show-hide-button-dependent-on-the-position-of-content-scroll-in-ionic-2
      this.buttonShown = true
      : this.buttonShown = false;
  }

  //TODO:
  //check if downloads folder empty
  //loop through downloads folder and store files
  //send to openModal()


  //JW
  chooseImport() {    //html btn
    this.getImportFiles().then((filearr) => {
      this.openModal(filearr);
    });
  }

  //TODO:
  //update logic
  //check if it is json file, if no, ignore.
  getImportFiles() {
    return new Promise((Mres) => {
      var promise1 = new Promise((res1) => {
        this.checkFolderExist('Download').then((check: boolean) => {
          if (check === false) {
            res1()
          }
          else if (check === true) {
            this.checkIfContainsFiles('Download').then((isThere: boolean) => {
              if (isThere === true) {
                this.listFiles(function (callbackResult){
                  if(callbackResult.length >= 1){
                    res1(callbackResult)
                  }
                }, "Download")
              }
              else if (isThere === false) {
                res1()
              }
              else {
                //catch error
              }
            })
          }
        })
      })

      var promise2 = new Promise((res2) => {
        this.checkFolderExist('Bluetooth').then((check: boolean) => {
          if (check === false) {
            res2()
          }
          else if(check === true) {
            this.checkIfContainsFiles('Bluetooth').then((isThere: boolean) => {
              if (isThere === true) {
                this.listFiles(function (callbackResult){
                  if(callbackResult.length >= 1){
                    res2(callbackResult)
                  }
                }, "Bluetooth")
              }
              else if (isThere === false) {
                res2()
              }
              else {
                //catch error
              }
            })
          }
        })        
      })
      var promise3 = new Promise((res3) => {
        this.checkFolderExist('crisisApp').then((check: boolean) => {
          if (check === false) {
            res3()
            //this.showToast("No import files available")
          }
          else if (check === true) {
            this.checkIfContainsFiles('crisisApp').then((isThere: boolean) => {
              if (isThere === true) {
                this.listFiles(function (callbackResult) {
                  if (callbackResult.length >= 1) {
                    res3(callbackResult);
                  }
                }, "crisisApp")
              }
              else if (isThere === false) {
                res3()
                //this.showToast("No import files available")
              }
              else {                
                //catch error?
              }
            })
          }
        })
      })

      Promise.all([promise1, promise2, promise3]).then((filesArr) => {
        Mres(filesArr)
      })
    })
  }

  //OUTDATED, NOT USED
  getImportFiles2() {
    return new Promise((res) => {
      this.checkFolderExist('crisisApp').then((check: boolean) => {
        if (check === false) {
          this.showToast("No import files available")
        }
        else if (check === true) {
          this.checkIfContainsFiles('crisisApp').then((isThere) => {
            if (isThere === true) {
              this.listFiles(function (callbackResult) {
                if (callbackResult.length >= 1) {
                  res(callbackResult);
                }
              }, "crisisApp")
            }
            else if (isThere === false) {
              this.showToast("No import files available")
            }
            else {
              //catch error?
              console.log("catch error?")
            }
          })
        }
      })
    })
  }

  checkIfContainsFiles(foldername: string) {
    return new Promise((res) => {
      var isThere = false;
      let path = this.file.externalRootDirectory
      this.file.listDir(path, foldername).then((files) => {
        if (files.length <= 0) {
          res(isThere)
        }
        else {
          isThere = true;
          res(isThere)
        }
      })
    })
  }

  //list files in external storage ONLY. pass in folder name
  async listFiles(callback, foldername: string) {       //callback function, returns a fileArr of json files
    let path = this.file.externalRootDirectory;
    let fileArr = [];

    function checkFile(theFile) {    //check if it is a folder, if false, dont push into fileArr
      return new Promise((res) => {
        if (theFile.isFile === true) {
          fileArr.push(theFile);
          res()
        }
        else {
          //do nothing
          res()
        }
      })
    }

    this.file.listDir(path, foldername).then(async (files) => {
      (async function asyncloop() {     //loop through files in folder
        for (let a = 0; a < files.length; a++) {
          await checkFile(files[a])     //function checkFile pushes json files into fileArr, returns fileArr
          var filelength = files.length - 1;
          if (a == filelength) {        //checks if loop is finished, resolves promise if yes
            var promise1 = new Promise((res) => {
              res(fileArr);
            })
          }
          Promise.all([promise1]).then(function (result) {      //wait for promise to be resolved
            var filteredResult = result.filter(function (el) {    //take out nulls from array
              return el != null;
            });
            callback(filteredResult);       //returns result to function call
          })
            .catch(err => {
              console.log("Error catch for Promise.all => " + JSON.stringify(err));
            })
        }
      })()
    })
  }

  //open import file selection page
  async openModal(filearr) {
    const modal = await this.modalController.create({
      component: ImportModalPage,
      componentProps: {
        fileArr: filearr
      }
    });
    modal.onDidDismiss().then(() => {
      this.refreshPage()
    })

    modal.present()
  }

  //refresh page after modal dismissed
  refreshPage() {
    this.ionViewWillEnter();
  }

  exportPlansBtn() {   //html btn
    this.checkDontAskAgain().then((enabled) => {
      if(enabled === true){
        this.checkFolderExist('crisisApp').then((isThere: boolean) => {
          if (isThere == true) {
            this.exportAllPlans()
          }
          else if (isThere == false) {
            this.showToast("App folder not found. Creating one for you. . .")
            this.createAppRootFolder().then((isCreated: boolean) => {
              if (isCreated === true) {
                this.exportAllPlans()
              }
            })
          }
        })
      }
      else if(enabled === false){
        this.presentExportAlert().then((check) => {
          if(check === false){
            //user clicked cancel. do nothing
          }
          if(check === true){
            this.checkFolderExist('crisisApp').then((isThere: boolean) => {
              if (isThere == true) {
                this.exportAllPlans()
              }
              else if (isThere == false) {
                this.showToast("App folder not found. Creating one for you. . .")
                this.createAppRootFolder().then((isCreated: boolean) => {
                  if (isCreated === true) {
                    this.exportAllPlans()
                  }
                })
              }
            })
          }      
        })
      }
    })        
  }
  
  //check device storage for app folder
  checkFolderExist(foldername: string) {
    return new Promise((res) => {
      let path = this.file.externalRootDirectory;
      this.file.checkDir(path, foldername).then((isThere) => {
        if (isThere == true) {
          //console.log("App folder found!");
          res(isThere);
        }
      })
        .catch((err) => {
          console.log("Caught something!")
          if (err.code == 1) {    //code for file not found
            let isThere = false;
            //console.log("Caught error, please ignore => " + JSON.stringify(err))
            res(isThere);
          }
        })
    })
  }

  //create app folder in device external storage
  createAppRootFolder() {
    var isCreated = false;
    return new Promise((res) => {
      let path = this.file.externalRootDirectory;
      this.file.createDir(path, 'crisisApp', true).then((dirEntry) => {
        //console.log("App folder created!");
        this.showToast("App folder created!");
        if (dirEntry.isDirectory === true) {
          isCreated = true
          res(isCreated)
        }
      })
    })
  }

  //retrieve all plans from db and put into file
  exportAllPlans() {
    var check = true;
    return new Promise((res) => {
      this.planService.getAllPlan().then((plans) => {

        if (plans.length <= 0) {    //if no plans in db
          check = false
          res(check)
        }

        let newPlansStr: string = "";   //string to be written into file
        let that = this;

        let fileCheck = this.idJsonFile();
        newPlansStr = fileCheck + newPlansStr;    //add filecheck in front
        newPlansStr = "[" + newPlansStr;

        function looper(callback, newPlansStr, that) {
          for (let a = 0; a < plans.length; a++) {
            let onePlan = JSON.stringify(plans[a]);
            onePlan += ",{\"@\":\"~\"},";     //add separator in btwn each plan
            newPlansStr += onePlan;
            if (a == plans.length - 1) {
              newPlansStr = newPlansStr.substring(0, newPlansStr.length - 1)    //remove last comma
              newPlansStr = newPlansStr + "]";
              callback(newPlansStr, that)
            }
          }
        }

        //put into file part
        async function putIntoFile(newPlansStr, that) {
          let filename = await that.nameJsonFile();
          let data: string = await that.encryptData(newPlansStr);
          let path = that.file.externalRootDirectory + "crisisApp/";
          await that.file.writeFile(path, filename, data, { replace: true });
          res(check)
        }

        looper(putIntoFile, newPlansStr, that);
      })
    }).then((check) => {
      if (check === true) {
        this.showToast("Export successful")
      }
      if (check === false){
        this.showToast("Nothing to export!")
      }
    })
      .catch((err) => {
        console.log("Error caught => " + JSON.stringify(err))
      })
  }

  //create identifier to identify json file (files identified by regex => {id: crisisApp})
  idJsonFile(): string {
    let fileId: string = uuid();
    let fileCheck: string = `{\"id\": \"${fileId}\", \"crisisApp\": \"true\"},`
    return fileCheck;
  }

  //TODO: LET USER NAME FILES, USE THIS PART TO NUMBER THEM IF FILENAME IS THE SAME
  //create and number filenames
  nameJsonFile(): Promise<string> {
    return new Promise(async (res) => {
      this.checkIfContainsFiles('crisisApp').then((isThere) => {
        if (isThere === true) {
          let filename: string = "allPlans";
          this.listFiles(function (callbackResult) {
            if (callbackResult.length >= 1) {
              var files = callbackResult[0];

              if (files.length <= 1) {    //if theres only 1 file in app folder
                files.forEach(element => {    //callback result is [[]], thus callbackResult[0]
                  if (element.name.includes(filename)) {    //check if its "allPlans" file
                    let fileNo = parseInt(element.name.slice(-2))   //extract number from file
                    let fileNoString: string = "";
                    fileNo = fileNo += 1      //increment file number

                    if (fileNo <= 9) {      //if file number is less than 10, add 0 in front
                      fileNoString = fileNo.toString()
                      fileNoString = "0" + fileNoString
                    }
                    else {
                      fileNoString = fileNo.toString();
                    }
                    filename = filename + fileNoString      //add number to filename, end result should be allPlans<number>
                    console.log("filename => " + filename);
                    res(filename)
                  }
                  else {
                    console.log("This is the first file!")
                    let filename: string = "allPlans";
                    filename = filename + "01";
                    console.log("filename => " + filename)
                    res(filename)
                  }
                })
              }
              else {     //if theres more than one file in app folder
                let numberArr = [];
                (async function asyncloop() {
                  files.forEach((element, index, array) => {
                    if (element.name.includes(filename)) {
                      let fileNo = parseInt(element.name.slice(-2))
                      numberArr.push(fileNo)
                    }
                    if (index == array.length - 1) {        //checks if loop is finished, resolves promise if yes
                      var promise = new Promise((res2) => {
                        res2(numberArr);
                      }).then((numberArr: number[]) => {
                        numberArr = numberArr.sort((a: number, b: number) => b - a);    //sort by desc order
                        let biggestNo: number = numberArr[0];     //get biggest number in arr
                        let fileNo = biggestNo += 1;
                        let fileNoString: string = "";

                        if (fileNo <= 9) {
                          fileNoString = fileNo.toString()
                          fileNoString = "0" + fileNoString
                        }
                        else {
                          fileNoString = fileNo.toString();
                        }
                        filename = filename + fileNoString
                        console.log("filename => " + filename);
                        res(filename)
                      })
                    }
                  });
                })();
              }

            }
          }, "crisisApp")
        }
        else if (isThere === false) {     //first file in the app folder
          console.log("This is the first file!")
          let filename: string = "allPlans";
          filename = filename + "01";
          console.log("filename => " + filename)
          res(filename)
        }
        else {
          //catch error?
        }
      })
    })
  }

  encryptData(fileData: string){
    return new Promise((res) => {
      const encryptKey = "iLoveProgramming"
      var encryptedString = CryptoJS.AES.encrypt(fileData, encryptKey)
      encryptedString = encryptedString.toString()
      res(encryptedString)
    })
  }

  popOverController(x) {
    let menuOptions = ["Import plans", "Export all plans"];
    this.templateService.popOverController('popover', x, menuOptions).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
        data.data && this.callAction(data.data);
      });
    })
  }

  callAction(type) {
    var call = {
      'Import plans': () => this.chooseImport(),
      'Export all plans': () => this.exportPlansBtn()
    };
    call[type]();
  }

  //on hold, show checkboxes
  enableCheckbox(e){
    this.checkboxHidden = true
    var slideElement = <HTMLInputElement> document.getElementById("slideitem")
    slideElement.disabled = !slideElement.disabled
  }

  //hide checkboxes
  disableCheckbox(){
    this.checkboxHidden = false;
    var slideElement = <HTMLInputElement> document.getElementById("slideitem")
    slideElement.disabled = !slideElement.disabled
    this.sortedDetails.forEach(element => {     //reset checkbox to false
      element.isChecked = false
    });
  }

  selectedPlansBtn(){   //html btn
    this.selectedPlans().then((selectedPlans:any) => {
      if(selectedPlans.length === this.sortedDetails.length){
        this.exportAllPlans().then(() => {
          this.checkboxHidden = false;
          this.showToast("Export successful")
        })
      }
      else if(selectedPlans.length <= 0){
        this.showToast("Nothing was selected")
      }
      else{
        this.exportSelectedPlans(selectedPlans).then(() => {
          this.checkboxHidden = false;
          this.showToast("Export successful")
        })
      }
    })
  }

  selectedPlans(){
    return new Promise((res) => {
      var selectedPlans = []
      this.sortedDetails.forEach((onePlan, index) => {
        if(onePlan.isChecked === true){
          onePlan.isChecked = false;    //uncheck the selected plan
          selectedPlans.push(onePlan)
        }
        else{
          //continue
        }
        if(index === this.sortedDetails.length-1){
          res(selectedPlans)
        }
      });
    })    
  }

  exportSelectedPlans(selectedPlans){
    var check = true;
    return new Promise((res) => {
      let newPlansStr: string = "";
      let that = this;

      let fileCheck = this.idJsonFile();
      newPlansStr = fileCheck + newPlansStr;    //add filecheck in front
      newPlansStr = "[" + newPlansStr;

      function looper(callback, newPlansStr, that) {
        for (let a = 0; a < selectedPlans.length; a++) {
          let onePlan = JSON.stringify(selectedPlans[a]);
          onePlan += ",{\"@\":\"~\"},";     //add separator in btwn each plan
          newPlansStr += onePlan;
          if (a == selectedPlans.length - 1) {
            newPlansStr = newPlansStr.substring(0, newPlansStr.length - 1)    //remove last comma
            newPlansStr = newPlansStr + "]";
            callback(newPlansStr, that)
          }
        }
      }

      //put into file part
      async function putIntoFile(newPlansStr, that) {
        let filename = await that.nameJsonFile()
        let data: string = await that.encryptData(newPlansStr)
        let path = that.file.externalRootDirectory + "crisisApp/"
        await that.file.writeFile(path, filename, data, { replace: true })
        res(check)
      }

      looper(putIntoFile, newPlansStr, that);
    })
  }

  async presentExportAlert(){
    return new Promise(async(res) => {
      var check = false
      const alert = await this.alertController.create({
        header: 'Export Confirmation',
        message: 'Are you sure you want to export selected plans?',
        inputs: [
          {
            name: "dontaskagain",
            type: "checkbox",
            label: "Don't Ask Again",
            value: true,
            checked: false,            
          }
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary", 
            handler: () => {
              res(check)
            }         
          },
          {
            text: "Ok",
            handler: () => {
              check = true
              res(check)
            }
          }
        ]
      });
  
      await alert.present();
      var result = await alert.onDidDismiss()
      console.log(result)
      if (result.data != undefined) {
        if (result.data.values[0] === true) {
          this.enableDontAskAgain()
        }
      }
    })
  }

  enableDontAskAgain(){
    this.settingService.exportToggleDontAskAgain()
  }

  checkDontAskAgain(){
    var enabled = false
    return new Promise((res) => {
      this.settingService.exportCheckToggle().then((toggle) => {
        if(toggle === false){
          res(enabled)
        }
        if(toggle === true){
          enabled = true
          res(enabled)
        }
      })
    })    
  }

  //TOASTER
  async showToast(msg) {      //TODO: append/stack toaster, make sure msg wont overlap each other
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

  //OLD CODES, FOR REFERENCE
  // //turn off alert for export
  // enableDontAskAgain2() {
  //   window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fs){
  //     fs.root.getFile("exportDontAskAgain.txt", {create: false}, function(fileEntry){
  //       writeFile(fileEntry)
  //     })
  //   })

  //   function writeFile(fileEntry) {
  //     fileEntry.createWriter(function (fileWriter) {
  //       fileWriter.onwriteend = function () {
  //         //console.log("Successful file write...");
  //         readFile(fileEntry)
  //       };
  
  //       fileWriter.onerror = function (e) {
  //         console.log("Failed file write: " + e.toString());
  //       };
  //       var contents = "exportDontAskAgain=true"  
  //       fileWriter.write(contents);
  //     });
  //   }

  //   function readFile(fileEntry) {
  //       fileEntry.file((theFile) => {
  //         var contents = "";
  //         var reader = new FileReader();
  //         reader.readAsText(theFile);
  
  //         reader.onloadend = () => storeResults(reader.result);
  //         function storeResults(results) {
  //           contents = results
  //         }
  //       }, onErrorReadFile)
  //   }

  //   function onErrorReadFile(){
  //     console.log("Error reading app setting file")
  //   }
  // }

  // checkDontAskAgain2(){
  //   var enabled = false
  //   return new Promise((res) => {
  //     window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fs){
  //       fs.root.getFile("exportDontAskAgain.txt", {create: false}, function(fileEntry){
  //         readFile(fileEntry).then((contents: string) => {
  //           if(contents === "exportDontAskAgain=false"){
  //             res(enabled)
  //           }
  //           if(contents === "exportDontAskAgain=true"){
  //             enabled = true
  //             res(enabled)
  //           }
  //         })
  //       })
  //     })
  //   })
    
  //   async function readFile(fileEntry) {
  //     return new Promise((res) => {
  //       fileEntry.file((theFile) => {
  //         var contents = "";
  //         var reader = new FileReader();
  //         reader.readAsText(theFile);
  
  //         reader.onloadend = () => storeResults(reader.result);
  //         async function storeResults(results) {
  //           contents = results
  //           res(contents)
  //         }
  //       }, onErrorReadFile)
  //     })      
  //   }

  //   function onErrorReadFile(){
  //     console.log("Error reading app setting file")
  //   }
  // }

}
