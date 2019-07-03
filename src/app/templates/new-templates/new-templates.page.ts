import { Component, OnInit } from '@angular/core';
import { AlertController, Events, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';
import { TemplatePopComponent } from '../template-pop/template-pop.component';

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
    private event: Events, private popoverCtrl: PopoverController) {

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


  pressEvent(type, thisObject, arrayID) {
    this.templateService.pressEvent(type, thisObject, arrayID);
  }

  clickEvent(type, wholeItem, arrayID) {
    this.templateService.clickEvent(type, wholeItem, arrayID);
  }

  clearArray() {
    this.templateService.clearArray();
  }

  deleteArray() {
    this.templateService.deleteArray();
    this.templateService.presentToastWithOptions("Deleted items!");
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
      if (this.templateService.checkAllArrayEmpty("updating")) {
        return false;
      }
    }
    let maparr = this.templateService.cleansedArray();
    console.error(JSON.stringify(maparr, null, 2));
    this.templateService.createTemplate(maparr, templateNameFromInput, this.templateID, this.templateName, this.defaultLanguage).then((val) => {
      // this.event.publish("created", this.criticalArray);
      console.error("VAL " + JSON.stringify(val,null,2))
      templateNameFromInput ?
        this.router.navigateByUrl('/tabs/templates') :
        this.templateService.editPageUpdateArray(val, this.templateID), this.editPage = false, this.viewPage = true
    })
  }

  goToViewPageFromEdit() {
    this.templateService.goToViewPageFromEdit();
    this.editPage = false;
    this.viewPage = true;
  }

  async askForName(typeOfAction) {
    if (typeOfAction == "add") {
      if (this.templateService.checkAllArrayEmpty("adding")) {
        return false;
      }
    }
    //templateName = templateName ? "Rename " + templateName : "Enter template name";
    let templateName = (typeOfAction == "rename") ? "Enter new name" : 
      (typeOfAction == "duplicate") ? "Enter name of the duplicated template" :
      (typeOfAction == "Create Crisis Plan") ? "Enter Crisis Plan name" : "Enter template name"
    let alert = await this.alertCtrl.create({
      header: templateName,
      message: '',
      inputs: [
        {
          name: 'nameInput',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Ok',
          handler: (alertData => {
            console.warn(alertData);
            console.log("ok name1 = " + alertData.nameInput);
            //if (templateName == "Enter template name") {
            if (alertData.nameInput === "") {
              alert.message = "Name is required!"
              this.templateService.presentToastWithOptions("Name is required!");
              return false;
            }
            if (typeOfAction == "rename") {
              this.templateService.renameTemplate(alertData.nameInput, this.templateID).then((val) => {
                console.warn("rename val = " + JSON.stringify(val, null, 2));
                this.templateName = alertData.nameInput;
              });
            }
            else if (typeOfAction == "duplicate") {
              this.templateService.duplicateTemplate(alertData.nameInput, this.templateID).then(() => {
                this.router.navigate(["/tabs/templates"], {replaceUrl: true});
              })
            }
            else if (typeOfAction == "Create Crisis Plan") {
              this.router.navigateByUrl("/tabs/plans/details/" + this.defaultLanguage + "/" + alertData.nameInput);
            }
            else {
              this.addTemplate(alertData.nameInput);
            }
          })
        }
      ]
    });
    await alert.present();
  }


  frontViewData: any;

  ionViewWillEnter() {
    console.log("ng init + " + JSON.stringify(this.templateService.getAllArray(),null,2));
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


  async popOverController(x) { 
    const popover = await this.popoverCtrl.create({
      component: TemplatePopComponent,
      event: x, //https://www.youtube.com/watch?v=wMpGiniuZNc
    });
    popover.onDidDismiss().then((data) => { //method 2 ngOnInIt inside onDidDismiss()
      console.log("popup dismiss data = " + data.data);
      //Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete"];
      this.callAction(data.data);
    })
    return await popover.present();
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var call = {
      'Edit': () => this.callEdit(),
      'Rename': () => this.askForName('rename'),
      'Duplicate': () => this.askForName('duplicate'),
      "Create Crisis Plan": () => this.askForName('Create Crisis Plan'),
      "Delete": () => this.delete(),
    };
    call[type]();
  }

  callEdit() {
    console.log("edit is called " + this.templateID);
    this.templateService.getOneTemplate(this.templateID).then(thisTemplate => {
      this.templateService.callEdit(thisTemplate.language);
      this.editPage = true;
    });
    return "hello"
  }

  delete() {
    this.alertCtrl.create({
      header: 'Are you sure you want to delete this template?',
      message: 'Once deleted, there is no retrieving back!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.templateService.deleteTemplate(this.templateID).then(() => {
              this.templateService.presentToastWithOptions("Deleted template!");
              this.router.navigate(["/tabs/templates"], {replaceUrl: true});
            })
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

}
