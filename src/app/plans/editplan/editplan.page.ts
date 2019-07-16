import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { SymptomActionService } from 'src/app/services/symptomaction.service';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService, private settingService: SymptomActionService) { }

  isDisabled: boolean = true;

  details = {} as any;

  ngOnInit() {

  }

  btn_txt = 'Edit';

  editPage(item) {
    this.btn_txt = 'Save';
    this.isDisabled = false;
    return this.PlanService.editPlan(item, this.details)

  }

  ionViewWillEnter() {
    let id = this.activatedRoute.snapshot.paramMap.get('item');
    console.warn("id = " + id);
    this.PlanService.getEditDetails(id).then(everything => {
      [].concat(...everything.template).forEach(eachArray => {
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
        template: [].concat(...everything.template)
      }
      this.templateService.filterArray(obj);
      this.details = everything;
    });
  }

  frontViewData = this.templateService.frontViewData;
  getArray(id) {
    return this.templateService.getArray(id);
  }
  checkType(id) {
    return this.templateService.getArray(id).length > 0 ? true : false
  }

  deleteAppoint() {

  }



}
