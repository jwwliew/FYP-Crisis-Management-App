import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { SymptomActionService } from 'src/app/services/symptomaction.service';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {

  constructor(private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService, private settingService: SymptomActionService, private router: Router) { }

  isDisabled: boolean = true;

  details = {} as any;

  ngOnInit() {

  }

  editPage(id) {
    this.isDisabled = !this.isDisabled;
    if (this.isDisabled) {
      this.PlanService.editPlan(id, this.details).then(allPlan => {
        this.templateService.editPageUpdateArray(allPlan, id);
        this.templateService.presentToastWithOptions("Saved plan successfully!");
      })
    }
    else {
      this.templateService.callEdit(this.defaultLanguage)
    }
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
  pressEvent(type, thisObject, arrayID) {
    this.templateService.pressEvent(type, thisObject, arrayID);
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

  dateChanged(my) {
    this.details.datemy = new Date(my).toLocaleString();
  }

  deleteAppoint() {

  }


}
