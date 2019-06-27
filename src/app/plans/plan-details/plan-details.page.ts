import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ToastController } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';
import {v4 as uuid} from 'uuid';
@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})
export class PlanDetailsPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, public toastController: ToastController, private activatedRoute: ActivatedRoute, 
    private templateService: TemplateService) { }

  pNric: any;
  pName: any;
  tcsName: any;
  tcsContact: any;
  planName: any;


  ngOnInit() {
    // this.planName = this.activatedRoute.snapshot.paramMap.get('id');
  }
  

  PlanDetails() {

    console.log(this.planName,this.pName, this.pNric, this.tcsName, this.tcsContact);
    this.PlanService.addPlanDetails(this.planName,this.pName, this.pNric, this.tcsName, this.tcsContact).then(() => {
      this.router.navigateByUrl('');
      
    });
  }



  //template codes 
  globalLanguage = this.templateService.getGlobalLanguage();
  defaultLanguage = 0;
  frontViewData = this.templateService.getFrontViewData();
  checked = this.templateService.getChecked();

  ionViewWillEnter() {
    // this.frontViewData = this.templateService.getFrontViewData();
    this.planName = this.activatedRoute.snapshot.paramMap.get('id');
    console.error("plan name = " + this.planName);
    console.error("this front view data = " + JSON.stringify(this.frontViewData, null, 2));
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
    this.router.navigateByUrl("/tabs/plans/details/" + this.planName);
  }

  deleteArray() {
    this.templateService.deleteArray();
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
