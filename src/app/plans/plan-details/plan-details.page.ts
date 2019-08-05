import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IonList, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})

export class PlanDetailsPage implements OnInit {

  thisgroup = this.formBuilder.group({
    detailname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailnric: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailtcs: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailcontact: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/^[0-9]+$/), Validators.required])],
  });

  constructor(private router: Router, private PlanService: PlanService, private activatedRoute: ActivatedRoute, 
    private templateService: TemplateService, public formBuilder: FormBuilder) {
  }

  planName: any;
  date1: string; // PLAN CREATED @ date
  datemy: string;

  appointment = this.templateService.appointment;

  ngOnInit() { }

  dateChanged(my, appObj) {
    //this.datemy = my;
    // this.datemy = moment(my).format('YYYY-MM-DD hh:mmA');
    //install -npm i moment===>to use moment().format
    // let time = new Date(my).toLocaleString('en-GB', {hour12: true});
    let time = new Date(my).toLocaleString();
    console.warn(time);
    appObj.appTime=time;
  }

  submitted = false;

  PlanDetails() { 
    let arrayForm = [this.thisgroup.controls.detailcontact, this.thisgroup.controls.detailname, this.thisgroup.controls.detailtcs, this.thisgroup.controls.detailnric];
    !this.submitted && arrayForm.forEach(element => {
      if (!element.value) {
        element.setValue(""); //set value if empty
        element.markAsTouched(); // and touch so the red color underline ion-input will be shown
      }
    });
    if (this.thisgroup.invalid) {
      this.submitted = true;
      this.templateService.presentToastWithOptions("Please enter required plan details highlighted in red");
      return false;
    }
    // if (this.thisgroup.controls["detailcontact"].invalid || this.thisgroup.controls["detailname"].invalid ||
    //   this.thisgroup.controls["detailtcs"].invalid ||
    //   this.thisgroup.controls["detailnric"].invalid) {
    //     this.thisgroup.controls["detailname"].setValue("")
    //     this.thisgroup.controls["detailname"].markAsTouched();
    //   this.submitted = true;
    //   this.templateService.presentToastWithOptions("Please enter required plan details highlighted in red");
    //   return false;
    // }
    if (this.templateService.checkAllArrayEmpty("adding plan")) {
      return false;
    }
    let x = this.templateService.checkAppointmentEmpty();
    console.warn("appoint x value = ", x);
    if (x) {
      return false;
    }
      //created Date**
      // let date = new Date();
      // let date1 = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
      // let date1 = new Date().toLocaleString('en-GB', {hour12: true}); //02/08/2019, 2:09:09 pm, without 'en-GB' is 08/02 on my computer
      let date1 = new Date().toLocaleString();
      console.warn("DATE 1", date1);
      let maparr = this.templateService.cleansedArray();
      console.log(this.defaultLanguage, date1, this.planName);
      this.PlanService.addPlanDetails(this.defaultLanguage, date1, this.planName, this.thisgroup.controls.detailname.value.trim(), this.thisgroup.controls.detailnric.value, 
        this.thisgroup.controls.detailtcs.value.trim(), this.thisgroup.controls.detailcontact.value, maparr, this.appointment).then(() => {
          this.templateService.resetArray();
          this.router.navigateByUrl('/tabs/plans');
          this.templateService.presentToastWithOptions("Created plan!")
      });

  }

  newAppt() {
    this.templateService.newAppt();
  }
  checkAppt() {
    return this.templateService.appointment.length > 0
  }

  //template codes 
  globalLanguage = this.templateService.globalLanguage;
  defaultLanguage = 0;
  frontViewData = this.templateService.frontViewData;
  checked = this.templateService.checked;
  android: boolean;
  @ViewChild('input') thisInput;
  ionViewWillEnter() {
    // this.frontViewData = this.templateService.getFrontViewData();
    this.android = this.templateService.checkPlatformAndroid();
    this.planName = this.activatedRoute.snapshot.paramMap.get('planName');
    this.defaultLanguage = +this.activatedRoute.snapshot.paramMap.get("languageID");
    console.error("plan name = " + this.planName);
    console.warn("default lang = " + this.defaultLanguage);
    this.templateService.callEdit(this.defaultLanguage);
    this.templateService.setGlobalSettings();
    this.thisInput.setFocus();
  }

  goBackToTemplate() {
    this.templateService.goToViewPageFromEdit();
  }

  getArray(id) {
    return this.templateService.getArray(id);
  }

  checkType(id) {
    return this.templateService.getArray(id).length > 0 ? true : false
  }

  dragAndCheckLongPress(slideItem: IonItemSliding) {
    slideItem.close();
  }

  inputTriggered = false;
  inputFocus = () => this.inputTriggered = true;

  @ViewChild('mylist')mylist: IonList;

  pressEvent(type, thisObject, arrayID, combinedIndex) {
    this.mylist.closeSlidingItems();
    this.apptList.closeSlidingItems();
    !this.android ?
      this.inputTriggered ? this.inputTriggered = false : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
      : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
  }

  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    this.templateService.clickEvent(type, wholeItem, arrayID, combinedIndex);
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

  popUp(id) {
    this.templateService.popUp(id, this.defaultLanguage);
  }

  @ViewChild('apptList')apptList: IonList;
  deleteIOSAppointment(item) {
    this.templateService.deleteIOSAppointment(item);
    this.apptList.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted appointment!");
  }

  deleteIOS(thisItem, arrayID, mainID, combinedID) {
    this.templateService.deleteIOS(thisItem, arrayID, mainID, combinedID);
    this.mylist.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted action!");
  }

}
