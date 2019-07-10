import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService) { }
  private isDisabled: boolean = true;
  details = {} as any;

  ngOnInit() {

  }
  btn_txt='Edit';
  editPage() {
    this.btn_txt='Save';
    this.isDisabled = false;
    // this.PlanService.editPlan(item).then(() => {
      
    // });
  }
  
  ionViewWillEnter() {
    let id = this.activatedRoute.snapshot.paramMap.get('item');
    console.warn("id = " + id);
    this.PlanService.getEditDetails(id).then(everything => {
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

}
