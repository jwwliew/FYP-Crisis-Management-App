import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ActionSheetController, Events, IonList, ToastController } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';

//JW
import { File } from '@ionic-native/file/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { ImportModalPage } from '../../import-modal/import-modal.page';
import { v4 as uuid } from 'uuid';
import { Storage } from '@ionic/storage';

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
    private popoverController: PopoverController) {

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

  //JW
  chooseImport() {    //html btn
    this.getImportFiles().then((filearr) => {
      this.openModal(filearr);
    });
  }

  getImportFiles() {
    return new Promise((res) => {
      this.checkAppRootFolderExist().then((check: boolean) => {
        if (check === false) {
          //console.log("Nothing to import");
          this.showToast("No import files available")
        }
        else if (check === true) {
          this.checkIfContainsFiles().then((isThere) => {
            if (isThere === true) {
              this.listJsonFiles(function (callbackResult) {
                if (callbackResult.length >= 1) {
                  res(callbackResult);
                }
              })
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

  checkIfContainsFiles() {
    return new Promise((res) => {
      var isThere = false;
      let path = this.file.externalRootDirectory
      this.file.listDir(path, 'crisisApp').then((files) => {
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

  //list import files available in device storage
  async listJsonFiles(callback) {       //callback function, returns a fileArr of json files
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

    this.file.listDir(path, 'crisisApp').then(async (files) => {
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

  //open import selection page
  async openModal(filearr) {
    var newFileArr = [];
    newFileArr = filearr[0];      //since filearr is a [[]], im unwrapping the outer array
    //console.log("function openModal => " + JSON.stringify(newFileArr));
    const modal = await this.modalController.create({
      component: ImportModalPage,
      componentProps: {
        fileArr: newFileArr
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
    this.checkAppRootFolderExist().then((isThere: boolean) => {
      if (isThere == true) {
        this.exportAllPlans().then(() => {
          this.showToast("Export successful")
        })
      }
      else if (isThere == false) {
        this.showToast("App folder not found. Creating one for you. . .")
        this.createAppRootFolder().then((isCreated: boolean) => {
          if (isCreated === true) {
            this.exportAllPlans().then(() => {
              this.showToast("Export successful")
            })
          }
        })
      }
    })
  }

  //check device storage for app folder
  checkAppRootFolderExist() {
    return new Promise((res) => {
      let path = this.file.externalRootDirectory;
      this.file.checkDir(path, 'crisisApp').then((isThere) => {
        if (isThere == true) {
          //console.log("App folder found!");
          res(isThere);
        }
      })
        .catch((err) => {
          if (err.code == 1) {    //code for file not found
            let isThere = false;
            //console.log("App folder not found!");
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
        console.log("App folder created!");
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
          this.showToast("Nothing to export!")
          check = false
          res(check)
        }

        let newPlansStr: string = "";
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
          let data: string = newPlansStr;
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
    })
      .catch((err) => {
        //do nothing
        //console.log("Error caught => " + JSON.stringify(err))
      })
  }

  //create identifier to identify json file (files identified by regex => {id: crisisApp})
  idJsonFile(): string {
    let fileId: string = uuid();
    let fileCheck: string = `{\"id\": \"${fileId}\", \"crisisApp\": \"true\"},`
    return fileCheck;
  }

  //create and number filenames
  nameJsonFile(): Promise<string> {
    return new Promise(async (res) => {
      this.checkIfContainsFiles().then((isThere) => {
        if (isThere === true) {
          let filename: string = "allPlans";
          this.listJsonFiles(function (callbackResult) {
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
          })
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
  pressEvent(e, item){
    this.checkboxHidden = true;
  }

  //hide checkboxes
  disableCheckbox(){
    this.checkboxHidden = false;
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
        let filename = await that.nameJsonFile();
        let data: string = newPlansStr;
        let path = that.file.externalRootDirectory + "crisisApp/";
        await that.file.writeFile(path, filename, data, { replace: true });
        res(check)
      }

      looper(putIntoFile, newPlansStr, that);
    })
  }

  //TOASTER
  async showToast(msg) {      //TODO: append/stack toaster, make sure msg wont overlap each other
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
