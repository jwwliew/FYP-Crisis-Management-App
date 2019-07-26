import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})

export class PlanDetailsPage implements OnInit {

  thisgroup = this.formBuilder.group({
    detailname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    detailnric: ['', Validators.compose([Validators.maxLength(9), Validators.minLength(9), Validators.pattern('^(s|g|S|G|T|t)[0-9]{7}[a-z|A-Z]{1}$'), Validators.required])],
    detailtcs: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    detailcontact: ['', Validators.compose([Validators.maxLength(8), Validators.minLength(8), Validators.pattern('[0-9]*'), Validators.required])],
  });

  constructor(private router: Router, private PlanService: PlanService, private activatedRoute: ActivatedRoute,
    private templateService: TemplateService, public formBuilder: FormBuilder) {
  }

  clinicName: any;
  pNric: any;
  pName: any;
  tcsName: any;
  tcsContact: any;
  planName: any;
  date1: string; // PLAN CREATED @ date
  datemy: string;

  appointment = this.templateService.appointment;

  ngOnInit() { }

  dateChanged(my, appObj) {
    //this.datemy = my;
    // this.datemy = moment(my).format('YYYY-MM-DD hh:mmA');
    //install -npm i moment===>to use moment().format
    let time = new Date(my).toLocaleString();
    appObj.appTime=time;
  }

  submitted = false;

  PlanDetails() {
    if (this.thisgroup.controls["detailcontact"].invalid || this.thisgroup.controls["detailname"].invalid ||
      this.thisgroup.controls["detailtcs"].invalid ||
      this.thisgroup.controls["detailnric"].invalid) {
      this.submitted = true;
      this.templateService.presentToastWithOptions("Please enter required plan details highlighted in red");
      return false;
    }
    if (this.templateService.checkAllArrayEmpty("adding plan")) {
      return false;
    }
      //created Date**
      let date = new Date();
      let date1 = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
      let maparr = this.templateService.cleansedArray();
      console.log(this.defaultLanguage, date1, this.planName, this.pName, this.pNric, this.tcsName, this.tcsContact);
      this.PlanService.addPlanDetails(this.defaultLanguage, date1, this.planName, this.pName, this.pNric, this.tcsName, this.tcsContact, maparr, this.appointment).then(() => {
        this.router.navigateByUrl('/tabs/plans');
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

  ionViewWillEnter() {
    // this.frontViewData = this.templateService.getFrontViewData();
    this.planName = this.activatedRoute.snapshot.paramMap.get('planName');
    this.defaultLanguage = +this.activatedRoute.snapshot.paramMap.get("languageID");
    console.error("plan name = " + this.planName);
    console.warn("default lang = " + this.defaultLanguage);
    this.templateService.callEdit(this.defaultLanguage);
    this.templateService.setGlobalSettings();
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

  inputTriggered = false;
  inputFocus = () => this.inputTriggered = true;
  pressEvent(type, thisObject, arrayID, combinedIndex) {
    this.inputTriggered || this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex);
    this.inputTriggered = false;
  }

  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    this.templateService.clickEvent(type, wholeItem, arrayID, combinedIndex);
  }


  clearArray() {
    this.templateService.clearArray();
    console.warn("clear array plan name = " + this.planName);
    // this.router.navigateByUrl("/tabs/plans/details/" + this.defaultLanguage + "/" + this.planName);
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


}
