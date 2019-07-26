import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.page.html',
  styleUrls: ['./new-plan.page.scss'],
})
export class NewPlanPage implements OnInit {


  public slideOneForm: FormGroup;

  submitted=false;

  constructor(private router: Router, private templateService: TemplateService, public formBuilder: FormBuilder) {
      this.slideOneForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    })
  }

  planName: any;

  ngOnInit() {
  }

  globalLanguage = this.templateService.globalLanguage;
  defaultLanguage = 0;

  nextPage() {
    console.log(this.planName)
    if (!this.planName) {
      this.submitted=true;
      this.templateService.presentToastWithOptions("Plan name cannot be empty!")
      return false;
    }
    this.router.navigateByUrl('/tabs/plans/details/' + this.defaultLanguage + '/' + this.planName);
  }

  cancel() {
    this.router.navigateByUrl('/tabs/plans');
  }

}
