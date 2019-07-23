import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.page.html',
  styleUrls: ['./new-plan.page.scss'],
})
export class NewPlanPage implements OnInit {
  @ViewChild('signupSlider') signupSlider;
  public slideOneForm: FormGroup;

  public submitAttempt: boolean = false;

  constructor(private router: Router, private PlanService: PlanService, private templateService: TemplateService, public formBuilder: FormBuilder) {

    this.slideOneForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    })
    console.log(this.submitAttempt);

  }

  planName: any;

  ngOnInit() {
  }
  globalLanguage = this.templateService.globalLanguage;
  defaultLanguage = 0;

  nextPage() {
    if (this.planName == undefined) {
      return false;
    }
    else {
      console.log(this.planName, this.defaultLanguage)
      // this.router.navigate (
      //  ['/tabs/plans/details',this.planName]
      this.router.navigateByUrl('tabs/plans/details/' + this.defaultLanguage + '/' + this.planName);
      //)

    }
  }

  cancel() {
    this.router.navigateByUrl('');
  }

}
