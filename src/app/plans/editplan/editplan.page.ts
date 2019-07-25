import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { SymptomActionService } from 'src/app/services/symptomaction.service';
import { LoadingController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {
  private something: FormGroup;
  constructor(private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService, private settingService: SymptomActionService,
    private router: Router, private file: File, private loadingController: LoadingController, private fileOpener: FileOpener, public formBuilder: FormBuilder) {

    this.something = formBuilder.group({
      detailname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      detailnric: ['', Validators.compose([Validators.maxLength(9), Validators.minLength(9), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      detailtcs: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      detailcontact: ['', Validators.compose([Validators.maxLength(8), Validators.minLength(8), Validators.pattern('[0-9]*'), Validators.required])],
    });
  }
  submitted = false;
  isDisabled: boolean = true;

  details = {} as any;

  ngOnInit() {

  }

  backViewPlan() {
    this.router.navigateByUrl('/tabs/plans');
  }

  ionViewWillEnter() {
    let id = this.activatedRoute.snapshot.paramMap.get('item');
    console.warn("id = " + id);
    this.templateService.setGlobalSettings();
    this.PlanService.getEditDetails(id).then(everything => {
      [].concat(...everything.templates).forEach(eachArray => {
        this.settingService.getOneImage("Symptom", eachArray.symptom.symptomID).then(oneImg => {
          eachArray.symptom.img = oneImg;
        });
        eachArray.combined.forEach(oneCombined => {
          this.settingService.getOneImage("Action", oneCombined.actionID).then(actionImg => {
            oneCombined.img = actionImg;
          })
        })
      });
      let obj = {
        template: [].concat(...everything.templates)
      }
      this.templateService.filterArray(obj);
      this.details = everything;
      this.defaultLanguage = everything.language;
    });
  }

  frontViewData = this.templateService.frontViewData;
  checked = this.templateService.checked;
  defaultLanguage = 0;

  getArray(id) {
    return this.templateService.getArray(id);
  }
  checkType(id) {
    return this.templateService.getArray(id).length > 0 ? true : false
  }
  inputTriggered = false;
  inputFocus = () => this.inputTriggered = true;
  pressEvent(type, thisObject, arrayID) {
    this.inputTriggered || this.templateService.pressEvent(type, thisObject, arrayID);
    this.inputTriggered = false;
  }
  clickEvent(type, wholeItem, arrayID) {
    this.templateService.clickEvent(type, wholeItem, arrayID);
  }
  presentActionSheet(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    this.templateService.presentActionSheet(symptomOrAction, item, this.defaultLanguage);
  }
  addNewCriticalArray(type, id) {
    this.templateService.addNewCriticalArray(type, id, this.defaultLanguage);
  }
  popUp(id) {
    this.templateService.popUp(id, this.defaultLanguage);
  }
  clearArray() {
    this.templateService.clearArray();
    // this.router.navigateByUrl("/tabs/plans/editplan/" + this.details.id);
  }
  deleteArray() {
    this.templateService.deleteArray();
    this.templateService.presentToastWithOptions("Deleted items!");
  }


  popOverController(x) {
    let menuOptions = ["Edit", "Rename", "Export to PDF"];
    this.templateService.popOverController('popover', x, menuOptions).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
        data.data && this.callAction(data.data);
      });
    })
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var call = {
      'Edit': () => this.callEdit(),
      'Rename': () => this.askForName(),
      "Export to PDF": () => this.exportToPDF()
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
    const directory = this.file.dataDirectory;
    const div = document.getElementById('Html2PDF'); //https://github.com/MarouaneSH/Ionic-jsPdf-Html2Canvas, https://stackoverflow.com/questions/43730612/opening-pdf-file-in-ionic-2-app

    let width = div.clientWidth * 3;
    let height = div.clientHeight * 3;
    let millimeters = { width, height };
    millimeters.width = Math.floor(width * 0.264583);
    millimeters.height = Math.floor(height * 0.264583);

    let scale = 2; //https://github.com/tsayen/dom-to-image/issues/69
    domtoimage.toPng(div, { height: div.offsetHeight * 2, width: div.offsetWidth * 2, style: { transform: `scale(${scale}) translate(${div.offsetWidth / 2 / scale}px, ${div.offsetHeight / 2 / scale}px)` } }).then(dataUrl => {

      const doc = new jsPDF('p', 'mm', 'a4', true);
      doc.deletePage(1); //https://stackoverflow.com/questions/29578721/image-in-pdf-cut-off-how-to-make-a-canvas-fit-entirely-in-a-pdf-page/42295522#42295522
      doc.addPage(millimeters.width * 2, millimeters.height * 1.95);
      doc.addImage(dataUrl, 'PNG', 0, 10, doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST');

      doc.save('pdfDocument.pdf'); //for website

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
      this.file.writeFile(directory, fileName, buffer, { replace: true }).then(success => { //https://ourcodeworld.com/articles/read/38/how-to-capture-an-image-from-a-dom-element-with-javascript
        console.log("File created Succesfully" + JSON.stringify(success));
        this.loading.dismiss();
        this.templateService.presentToastWithOptions("File created successfully!!!");
        this.fileOpener.open(success.nativeURL, "application/pdf").catch(() => this.templateService.presentToastWithOptions("Please install a PDF Viewer such as Acrobat!"));
      }).catch((error) => console.log("Cannot Create File " + JSON.stringify(error)));
    })
  }

  callEdit() {
    this.isDisabled = false;
    this.templateService.callEdit(this.defaultLanguage);
  }
  addAppt() {
    console.log("triggered")



  }
  savePage(id) {
    if (this.something.controls["detailcontact"].invalid || this.something.controls["detailname"].invalid ||
      this.something.controls["detailtcs"].invalid ||
      this.something.controls["detailnric"].invalid) {
      this.submitted = true;
      return false;
    }
    else {
      this.PlanService.editPlan(id, this.details).then(allPlan => {
        this.templateService.editPageUpdateArray(allPlan, id);
        this.templateService.presentToastWithOptions("Saved plan successfully!");
        this.isDisabled = true;
      })
    }
  }

  askForName() {
    this.templateService.alertInput("Enter new name").then((alertData: string) => {
      console.error("rename alert data plan!!" + alertData);

      this.PlanService.renamePlan(this.details.id, alertData).then(() => {
        this.details.planName = alertData;
        this.templateService.presentToastWithOptions("Renamed plan!");
      })

    }).catch(() => {
    }

    )
  }


  dateChanged(my) {
    this.details.datemy = new Date(my).toLocaleString();
  }

  deleteAppoint() {

  }


}
