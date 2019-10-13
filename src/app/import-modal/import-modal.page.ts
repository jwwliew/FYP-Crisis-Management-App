import { Component, OnInit } from '@angular/core';

import { ModalController, NavController, ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';

// import { StorageService, Item } from '../services/storage.service';

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
    private router: Router, private storage: Storage, private toastController: ToastController) { }

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

  async asyncwhileloop(fileContents){
    return new Promise(async(res) => {
      var loop = true;
      this.overrallFileContents = fileContents
      while (loop) {
        await this.extractOneItemFromFileContent(this.overrallFileContents).then(async(fileContents) => {
          await this.insertOneItemIntoDb(fileContents).then(async() => {
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
          if(loop === true){
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

  extractOneItemFromFileContent(fileContent: string) {
    return new Promise((res) => {
      let oneItem: string = "";
      let newFileContent: string = "";

      oneItem = fileContent;
      oneItem = oneItem.substring(0, oneItem.indexOf(",{\"@\":\"~\"}") )   //find first separator, cuts out separator
      oneItem = JSON.parse(oneItem);      //parse from string to object

      newFileContent = fileContent.slice(fileContent.indexOf(",{\"@\":\"~\"}") + 11);     //takes out first item
      this.overrallFileContents = newFileContent;
      res(oneItem);
    })
  }

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

  //TOASTER
  async showToast(msg) {

    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
