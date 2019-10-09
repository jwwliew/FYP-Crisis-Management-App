import { Component, OnInit } from '@angular/core';

import { ModalController, NavController } from '@ionic/angular';
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
    private router: Router, private storage: Storage) { }

  ngOnInit() {
    this.theFiles = this.navParams.get('fileArr');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  importSelectedCheck(oneFile) {
    this.importSelected(oneFile).then((check) => {
      //nothing
    })
      .catch(err => {
        console.log(JSON.stringify(err))
      })
  }

  importSelected(oneFile) {
    return new Promise((resolve, reject) => {
      this.readFileToVar(oneFile.name).then((fileContents: string) => {
        this.checkJsonFileId(fileContents).then((fileContents: string) => {
          if (fileContents === "false") {
            reject();
          }
          else {            
            this.whileloop(fileContents)
          }
        })
      })
      //TODO: REFRESH  put in another function?
      this.modalController.dismiss();
      this.router.navigateByUrl('/tabs/plans');
    })
  }

  async whileloop(fileContents){
    var loop = true;
    while (loop) {
      console.log("INFINITE LOOP WOO")
      await this.extractOneItemFromFileContent(fileContents).then(async(fileContents) => {
        console.log("BASE => " + JSON.stringify(fileContents))
        await this.insertOneItemIntoDb(fileContents).then(async() => {
          await this.checkIfStillContainsItem(this.overrallFileContents).then((check) => {
            if (check === false) {
              console.log("EXITING LOOP. . .")
              loop = false;                      
            }
          })
        })
      })
    }
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
      let check;
      let fileChecker: string = "";
      let newFileContent: string = "";
      fileChecker = fileContent.substr(1);   //take out opening array bracket
      if (fileChecker.indexOf("\"crisisApp\": \"true\"},") === -1) {
        console.log("Not a valid file!");
        check = "false"
        rej(check);
      }
      else {
        let pos = fileChecker.indexOf("\"crisisApp\": \"true\"},")   //find first separator, cut out
        let position = pos + 21;
        fileChecker = fileChecker.substr(0, position);

        newFileContent = fileContent.substr(1);
        newFileContent = fileContent.slice(position, -1);
        check = true
        res(newFileContent);
      }
    })
  }

  extractOneItemFromFileContent(fileContent: string) {
    console.log("TEST 1")
    return new Promise((res) => {
      let oneItem: string = "";
      let newFileContent: string = "";
      let resolveArr = []    //since promise res can only return 1 value, i return the resolveArr with 2 values inside

      oneItem = fileContent.substr(1);      // remove first array bracket
      oneItem = oneItem.substring(0, fileContent.indexOf(",{\"@\":\"~\"}") - 1)   //find first separator, cut out one item. -1 takes out comma
      //console.log(oneItem);
      oneItem = JSON.parse(oneItem);      //parse from string to object

      newFileContent = fileContent.slice(fileContent.indexOf(",{\"@\":\"~\"}") + 11);     //takes out first item
      console.log("TEST TEST TEST => " + fileContent.slice(fileContent.indexOf(",{\"@\":\"~\"}") + 11))
      this.overrallFileContents = newFileContent;

      //resolveArr = [oneItem, newFileContent];
      res(oneItem);
    })
  }

  insertOneItemIntoDb(theItem) {
    console.log("TEST 2")
    console.log("TEST 2 => " + JSON.stringify(theItem))
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
    console.log("TEST 3")
    let check: boolean = false;
    return new Promise((res) => {
      if (overallFileContent.length > 0 && overallFileContent !== "") {
        check = true;
        console.log("NOTHING IN THE VAR ANYMORE")
        res(check)
      }
      else {
        console.log("theres still something inside")
        res(check)
      }
    })
  }

  insertAllPlansToDb() {

  }
}
