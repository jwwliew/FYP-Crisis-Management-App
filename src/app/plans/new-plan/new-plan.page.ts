import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.page.html',
  styleUrls: ['./new-plan.page.scss'],
})
export class NewPlanPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private templateService: TemplateService) { }

  planName: any;


  ngOnInit() {
  }

  globalLanguage = this.templateService.getGlobalLanguage();
  defaultLanguage = 0;

  selectRadio() {
    console.log("selected " + this.defaultLanguage);
    this.PlanService.addLanguage(this.defaultLanguage).then(() => { }
    )
  };

  nextPage() {
    console.log(this.planName)
    // this.router.navigate (
    //  ['/tabs/plans/details',this.planName]
    this.router.navigateByUrl('/tabs/plans/details/' + this.planName);
    //)
  }


}
