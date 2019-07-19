import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ToastController, Events } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';
import { v4 as uuid } from 'uuid';

import * as moment from 'moment';
import { stringify } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})
export class PlanDetailsPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, public toastController: ToastController, private activatedRoute: ActivatedRoute,
    private templateService: TemplateService, private event: Events) { }
  clinicName: any;
  pNric: any;
  pName: any;
  tcsName: any;
  tcsContact: any;
  planName: any;
  date1: string; // PLAN CREATED @ date
  datemy: string;

  ngOnInit() {

    // this.planName = this.activatedRoute.snapshot.paramMap.get('id');


  }

  // dateChanged(time) {
  // console.log(time);
  // console.log(this.datedmy);
  // }
  // datedmy: any;
  dateChanged(my, time) {
    //this.datemy = my;
    // this.datemy = moment(my).format('YYYY-MM-DD hh:mmA');
    //install -npm i moment===>to use moment().format
    console.log("bf"+time,this.appointment)
    time = new Date(my).toLocaleString();
    console.log("aft"+time,this.appointment)
  }

  PlanDetails() {
    //created Date**
    let date = new Date();
    let date1 = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    let maparr = this.templateService.cleansedArray();
    console.log(this.defaultLanguage, date1, this.planName, this.pName, this.pNric, this.tcsName, this.tcsContact, this.datemy, this.clinicName);
    this.PlanService.addPlanDetails(this.defaultLanguage, date1, this.planName, this.pName, this.pNric, this.tcsName, this.tcsContact, maparr, this.datemy, this.clinicName).then(() => {
      this.router.navigateByUrl('/tabs/plans');

    });
  }

  appointment = []

  newPlan() {
    let something = {
      clinicName: "",
      appTime: "",
    }

    this.appointment.push(something);
    console.log(this.appointment);
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

  pressEvent(type, thisObject, arrayID) {
    this.templateService.pressEvent(type, thisObject, arrayID);
  }

  clickEvent(type, wholeItem, arrayID) {
    this.templateService.clickEvent(type, wholeItem, arrayID);
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
