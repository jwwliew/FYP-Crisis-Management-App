import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Events, LoadingController, IonList, IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';

import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-new-templates',
  templateUrl: './new-templates.page.html',
  styleUrls: ['./new-templates.page.scss'],
})
export class NewTemplatesPage implements OnInit {

  viewPage = false;
  templateName = "Create new template";
  templateID: any;
  editPage = false;

  globalLanguage = this.templateService.globalLanguage;
  defaultLanguage = 0;

  checked = this.templateService.checked;

  selectRadio() {
    this.templateService.selectRadio(this.defaultLanguage);
  }

  constructor(private router: Router, private templateService: TemplateService, private alertCtrl: AlertController, 
    private event: Events, private file: File, private loadingController: LoadingController, private fileOpener: FileOpener) {

      console.error("CONSTURCTOR CALLlED" + JSON.stringify(this.templateService.getAllArray(), null, 2));
      this.event.subscribe("view", item => { //or services https://stackoverflow.com/questions/54304481/ionic-4-angular-7-passing-object-data-to-another-page
        this.viewPage = true;
        console.log("view page = " + this.viewPage + " edit page = " + this.editPage);
        this.templateName = item.name;
        this.templateID = item.id;
        this.defaultLanguage = item.language;
        console.error("defalt lang == " + this.defaultLanguage);
        this.templateService.filterArray(item);
        console.warn("item received --- " + JSON.stringify(item, null, 2));
        console.log(item.template);
        console.error("all view = " + JSON.stringify(this.templateService.getAllArray(), null, 2));
      })

      this.templateService.setGlobalSettings();
    }

  ngOnInit() {
  }

  inputTriggered = false;
  
  inputFocus = () => this.inputTriggered = true;

  @ViewChild('mylist')mylist: IonList;
  android: boolean;
  pressEvent(type, thisObject, arrayID, combinedIndex) {
    this.mylist.closeSlidingItems();
    !this.android ?
      this.inputTriggered ? this.inputTriggered = false : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
      : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
  }
  dragAndCheckLongPress(slideItem: IonItemSliding) {
    slideItem.close();
  }
  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    this.templateService.clickEvent(type, wholeItem, arrayID, combinedIndex);
    this.inputTriggered = false; //added to attempt to stop inputTriggered from being true when tap onto ion-textarea, hence need to long press 2nd time
  }

  clearArray() {
    this.templateService.clearArray();
  }

  deleteArray() {
    this.templateService.deleteArray();
    this.templateService.presentToastWithOptions("Deleted items!");
  }

  deleteIOS(thisItem, arrayID, mainID, combinedID) {
    this.templateService.deleteIOS(thisItem, arrayID, mainID, combinedID);
    this.mylist.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted action!");
  }

//https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  presentActionSheet(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    this.templateService.presentActionSheet(symptomOrAction, item, this.defaultLanguage);
  }

  addNewCriticalArray(type, id) {
    this.templateService.addNewCriticalArray(type, id, this.defaultLanguage);
  }

  addTemplate(templateNameFromInput) {
    if (!templateNameFromInput) {
      if (this.templateService.checkAllArrayEmpty("updating template")) {
        return false;
      }
    }
    let maparr = this.templateService.cleansedArray();
    console.error(JSON.stringify(maparr, null, 2));
    this.templateService.createTemplate(maparr, templateNameFromInput, this.templateID, this.templateName, this.defaultLanguage).then((val) => {
      // this.event.publish("created", this.criticalArray);
      console.error("VAL " + JSON.stringify(val,null,2))
      templateNameFromInput ?
        (this.router.navigateByUrl('/tabs/templates'), this.templateService.presentToastWithOptions("Created template!")) :
        (this.templateService.editPageUpdateArray(val, this.templateID), this.templateService.presentToastWithOptions("Updated template!"),this.editPage = false, this.viewPage = true)
    })
  }

  goToViewPageFromEdit() {
    this.templateService.goToViewPageFromEdit();
    this.editPage = false;
    this.viewPage = true;
  }

  askForName(typeOfAction) {
    if (typeOfAction == "add") {
      if (this.templateService.checkAllArrayEmpty("adding template")) {
        return false;
      }
    }
    //templateName = templateName ? "Rename " + templateName : "Enter template name";
    let templateName = (typeOfAction == "rename") ? "Enter new name" : 
      (typeOfAction == "duplicate") ? "Enter name of the duplicated template" :
      (typeOfAction == "Create Crisis Plan") ? "Enter Crisis Plan name" : "Enter template name"
      this.templateService.alertInput(templateName).then((alertData: string) => {
        console.warn("alert data here ==== " + alertData);
        if (typeOfAction == "rename") {
          this.templateService.renameTemplate(alertData, this.templateID).then(() => {
            this.templateName = alertData;
            this.templateService.presentToastWithOptions("Renamed template!");
          });
        }
        else if (typeOfAction == "duplicate") {
          this.templateService.duplicateTemplate(alertData, this.templateID).then(() => {
            this.templateService.presentToastWithOptions("Duplicated template!");
            this.router.navigate(["/tabs/templates"], {replaceUrl: true});
          })
        }
        else if (typeOfAction == "Create Crisis Plan") {
          this.router.navigateByUrl("/tabs/plans/details/" + this.defaultLanguage + "/" + alertData);
        }
        else {
          this.addTemplate(alertData);
        }
      }).catch(() => {console.error("alert input cancelleleddedd")})
  }

  frontViewData: any;

  ionViewWillEnter() {
    console.log("ng init + " + JSON.stringify(this.templateService.getAllArray(),null,2));
    this.android = this.templateService.checkPlatformAndroid();
    this.frontViewData = this.templateService.frontViewData;
  }

  // verify() {
  //   if (this.criticalArray.map(a => a.symptom.text).includes("Symptom")) {
  //     this.presentToastWithOptions();
  //   }
  //   else {
  //     this.popUp();
  //   }
  // }

  popUp(id) {
    this.templateService.popUp(id, this.defaultLanguage);
  }

  checkType(id) {
    return this.templateService.getArray(id).length > 0
  }

  getArray(id) {
    return this.templateService.getArray(id);
  }


  popOverController(x) { 
    let menuOptions = ["Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete"];
    this.templateService.popOverController('popover', x, menuOptions).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => { //method 2 ngOnInIt inside onDidDismiss()
        console.log("popup dismiss data = " + data.data);
        data.data && this.callAction(data.data);
      });
    })
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var call = {
      'Edit': () => this.callEdit(),
      'Rename': () => this.askForName('rename'),
      'Duplicate': () => this.askForName('duplicate'),
      "Create Crisis Plan": () => this.askForName('Create Crisis Plan'),
      "Delete": () => this.delete(),
      // "Export to PDF": () => this.exportToPDF()
    };
    call[type]();
  }

  loading: any;
  async presentLoading(msg) {
    this.loading = await this.loadingController.create({
      message: msg
    });
    return await this.loading.present();
  }
  
  exportToPDF() {
    this.presentLoading('Creating PDF file...');
      //This is where the PDF file will stored , you can change it as you like
        // for more information please visit https://ionicframework.com/docs/native/file/, https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/#where-to-store-files
        // const directory = this.file.externalRootDirectory + "Download";
        const directory = this.file.dataDirectory;
        // this.templateService.presentToastWithOptions(directory);
      console.time();
    const div = document.getElementById('Html2PDF'); //https://github.com/MarouaneSH/Ionic-jsPdf-Html2Canvas, https://stackoverflow.com/questions/43730612/opening-pdf-file-in-ionic-2-app
    // const options = { background: 'grey', height: 845, width: 595 }; //https://stackoverflow.com/questions/24069124/how-to-save-a-image-in-multiple-pages-of-pdf-using-jspdf
    // domtoimage.toPng(div, {height:2500, width: 360} ).then((dataUrl) => {
    
  
      // let width = canvas.width;
      // let height = canvas.height;
      let width = div.clientWidth * 3;
      let height = div.clientHeight * 3;
      let millimeters = {width,height};
      millimeters.width = Math.floor(width*0.264583);
      // millimeters.width = 360;
      millimeters.height = Math.floor(height*0.264583);
      console.error(millimeters);
      console.warn("div height width ", div.clientHeight, div.clientWidth);
      console.error("canvas height width ", height, width);
      let scale = 2; //https://github.com/tsayen/dom-to-image/issues/69
      domtoimage.toPng(div, {height: div.offsetHeight * 2, width: div.offsetWidth * 2, style:{transform: `scale(${scale}) translate(${div.offsetWidth / 2 / scale}px, ${div.offsetHeight / 2 / scale}px)`}}).then(dataUrl => {
      // domtoimage.toPng(div, {height:div.offsetHeight, width:div.offsetWidth}).then(dataUrl => {
      //   // console.warn("data url = ", dataUrl);
      //   console.warn("image height = ", div.clientHeight);
      //   console.warn("image width = ", div.clientWidth);
      //   console.error("window height = ", div.offsetHeight);
      //   console.error("window width = ", div.offsetHeight);
      //   //Initialize JSPDF
        const doc = new jsPDF('p', 'mm', 'a4', true);
        doc.deletePage(1); //https://stackoverflow.com/questions/29578721/image-in-pdf-cut-off-how-to-make-a-canvas-fit-entirely-in-a-pdf-page/42295522#42295522
        doc.addPage(millimeters.width * 2, millimeters.height * 1.95);
        // doc.addPage(millimeters.width, millimeters.height);
        console.warn("internal page size width height", doc.internal.pageSize.width, doc.internal.pageSize.height);
        const imgHeight = (height * doc.internal.pageSize.width) / width;
        console.error("img height, milimetre height", imgHeight, millimeters.height);
        console.error("internal width vs milimeter width", doc.internal.pageSize.width, millimeters.width);
        // doc.addImage(dataUrl, "PNG", 6, 15, '','','', 'FAST');
        doc.addImage(dataUrl,'PNG', 0, 10, doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST');
        // const doc = new jsPDF('p', 'pt', [PDF_WIDTH, PDF_HEIGHT]);

        // doc.addImage(dataUrl, "PNG", top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        // for (var i = 1; i <= totalPDFPages; i++) {
        //   doc.addPage(PDF_WIDTH, PDF_HEIGHT);
        //   doc.addImage(dataUrl, "PNG", top_left_margin, -(PDF_HEIGHT*i)+(top_left_margin*4), canvas_image_width, canvas_image_height);
        // }
  
        // doc.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        // heightLeft -= pageHeight;
        // while (heightLeft >= 0) { //https://github.com/MrRio/jsPDF/issues/434
        //   position = heightLeft - imgHeight;
        //   doc.addPage();
        //   doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        //   heightLeft -= pageHeight;
        // }

        doc.save('pdfDocument.pdf'); //for website
        console.timeEnd();
        // if (leftHeight < pageHeight) {
        //   doc.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
        // } else {
        //   while (leftHeight > 0) {
        //     doc.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        //     leftHeight -= pageHeight;
        //     position -= 841.89;
        //     if (leftHeight > 0) {
        //       doc.addPage();
        //     }
        //   }
        
        // let imgWidth = 180;
        // let pageHeight = 360;
        // let position = 0;

        // // let imgHeight = div.clientHeight * imgWidth / div.clientWidth;
        // let imgHeight = 845 * 180 / div.clientWidth;
        // let heightLeft = imgHeight;
        
        // let contentH = div.clientHeight; //https://stackoverflow.com/questions/22991086/how-to-display-an-image-in-two-pages-in-pdf-using-jspdf
        // let $w, $actw, $h, $acth, $maxw, $maxh, $count;
        // $w = $actw = 360;
        // $h = $acth = 845;
        // $w = $actw = canvas.width;
        // $h = $acth = canvas.height;
        // let width = $maxw = doc.internal.pageSize.width;
        // let height = $maxh = doc.internal.pageSize.height;
        // if (!$maxh) $maxh = height;
        // if (!$maxw) $maxw = width;
        // if ($w > $maxw) {
        //   $w = $maxw;
        //   $h = Math.round($acth / $actw * $maxw);
        // }
        // doc.addImage(dataUrl, 'PNG', 0, 0, $w, $h);
        // $count = Math.ceil($h / $maxh) - 1; 
        // for (var i = 1; i <= $count; i++) {
        //   position = - $maxh * i
        //   alert(position);
        //   // doc.addPage(dataUrl, 'JPEG', 0, 0, $w, $h);
        //   doc.addPage();
        //   doc.addImage(dataUrl, 'PNG', 0, position, $w, $h);
        // }
        // Add image Url to PDF
        // doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
        // doc.addImage(dataUrl, "PNG", 15, 20, 180, 340); //https://rawgit.com/MrRio/jsPDF/master/docs/module-addImage.html
        
        // doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
  
        // heightLeft -= pageHeight;
        // while (heightLeft >=0) {
        //   position = heightLeft - imgHeight;
        //   doc.addPage();
        //   doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        //   heightLeft -= pageHeight;
        // }
        
        // doc.save('pdfDocument.pdf'); //for website

        let pdfOutput = doc.output();
        // using ArrayBuffer will allow you to put image inside PDF
        let buffer = new ArrayBuffer(pdfOutput.length);
        let array = new Uint8Array(buffer);
        for (var i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i);
        }

        // Name of pdf
        const fileName = "crisisOpener.pdf";
        //Writing File to Device  
        this.file.writeFile(directory,fileName, buffer, {replace: true}).then(success => { //https://ourcodeworld.com/articles/read/38/how-to-capture-an-image-from-a-dom-element-with-javascript
          console.log("File created Succesfully" + JSON.stringify(success));
          this.loading.dismiss();
          // this.loadingController.dismiss();
          this.templateService.presentToastWithOptions("File created successfully!!!");
          this.fileOpener.open(success.nativeURL, "application/pdf").catch(() => this.templateService.presentToastWithOptions("Please install a PDF Viewer such as Acrobat!"));
        }).catch((error)=> console.log("Cannot Create File " +JSON.stringify(error)));
          
      }
    // doc.save('test.pdf');//fails to add image to pdf
      )

  }
    // const div = document.getElementById("contentID");
    // const options = {background:"white",height :div.clientHeight , width : div.clientWidth  };
    // html2canvas(div,options).then((canvas)=>{
    //   //Initialize JSPDF
    //   var doc = new jsPDF("p","mm","a4");
    //   //Converting canvas to Image
    //   let imgData = canvas.toDataURL("image/PNG");
    //   //Add image Canvas to PDF
    //   doc.addImage(imgData, 'PNG', 20,20 );
      
    //   let pdfOutput = doc.output();
    //   // using ArrayBuffer will allow you to put image inside PDF
    //   let buffer = new ArrayBuffer(pdfOutput.length);
    //   let array = new Uint8Array(buffer);
    //   for (var i = 0; i < pdfOutput.length; i++) {
    //       array[i] = pdfOutput.charCodeAt(i);
    //   }


    //   //This is where the PDF file will stored , you can change it as you like
    //   // for more information please visit https://ionicframework.com/docs/native/file/
    //   const directory = this.file.externalApplicationStorageDirectory ;

    //   //Name of pdf
    //   const fileName = "example.pdf";
      
    //   //Writing File to Device
    //   this.file.writeFile(directory,fileName,buffer)
    //   .then((success)=> console.log("File created Succesfully" + JSON.stringify(success)))
    //   .catch((error)=> console.log("Cannot Create File " +JSON.stringify(error)));
  
  
    // });

  callEdit() {
    console.log("edit is called " + this.templateID);
    this.templateService.getOneTemplate(this.templateID).then(thisTemplate => {
      this.templateService.callEdit(thisTemplate.language);
      this.editPage = true;
    });
    return "hello"
  }

  delete() {
    this.templateService.delete("Are you sure you want to delete this template?").then(() => {
      this.templateService.deleteTemplate(this.templateID).then(() => {
        this.templateService.presentToastWithOptions("Deleted template!");
        this.router.navigate(["/tabs/templates"], {replaceUrl: true});
      });
    }).catch(() => {console.log("delete canceled")})
  }

}
