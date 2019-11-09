import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { SettingsService } from 'src/app/services/settings.service';

declare let window: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private file: File, private settingService: SettingsService) { }

  exportChecked: boolean
  importChecked: boolean
  exportDisable: boolean = false
  importDisable: boolean = false

  ngOnInit() {
    this.settingService.exportCheckToggle().then((toggle: boolean) => {
      this.exportChecked = toggle
    })
    this.settingService.importCheckToggle().then((toggle: boolean) => {
      this.importChecked = toggle
    })
  }

  exportToggleDontAskAgain(){
    this.exportDisable = true
    setTimeout(() => {
      this.exportDisable = false
    }, 1000);
    this.settingService.exportToggleDontAskAgain().then(() => {

    })
  }

  importToggleDontAskAgain(){
    this.importDisable = true
    setTimeout(() => {
      this.importDisable = false
    }, 1000);
    this.settingService.importToggleDontAskAgain().then(() => {
    })
  }

  //OLD CODES, FOR REFERENCE
  // exportToggleDontAskAgain2(){
  //   var that = this
  //   window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {
  //     fs.root.getFile("exportDontAskAgain.txt", { create: false}, function (fileEntry) {
  //       that.readFile(fileEntry).then((content) => {
  //         var data
  //         if(that.exportChecked === false){
  //           data = "exportDontAskAgain=false"
  //           that.writeFile(fileEntry, data)
  //         }
  //         if(that.exportChecked === true){
  //           data = "exportDontAskAgain=true"
  //           that.writeFile(fileEntry, data)
  //         }
  //       })
  //     })
  //   }, this.onErrorLoadFs)
  // }

  // writeFile(fileEntry, data) {
  //   fileEntry.createWriter(function (fileWriter) {
  //     fileWriter.onwriteend = function () {
  //       //console.log("Successful")
  //     };

  //     fileWriter.onerror = function (e) {
  //       console.log("Failed file write: " + e.toString());
  //     };
  //     fileWriter.write(data);
  //   });
  // }

  // readFile(fileEntry) {
  //   return new Promise((res) => {
  //     fileEntry.file((theFile) => {
  //       var contents = "";
  //       var reader = new FileReader();
  //       reader.readAsText(theFile);

  //       reader.onloadend = () => storeResults(reader.result);
  //       function storeResults(results) {
  //         contents = results
  //         res(contents)
  //       }
  //     }, this.onErrorReadFile)
  //   })
  // }

  // onErrorReadFile(){
  //   console.log("Error reading app setting file")
  // }

  // onErrorLoadFs() {
  //   console.log("Error requesting file system")
  // }
}
