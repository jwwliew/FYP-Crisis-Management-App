import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.page.html',
  styleUrls: ['./new-plan.page.scss'],
})
export class NewPlanPage implements OnInit {

  slideOneForm = this.formBuilder.group({
    firstName: ['', Validators.compose([Validators.maxLength(35), Validators.pattern(/(?!\s*$)/), Validators.required])], //https://stackoverflow.com/questions/45567341/regex-dont-match-if-it-is-an-empty-string
  })

  submitted=false;
  android: boolean;

  constructor(private router: Router, private templateService: TemplateService, public formBuilder: FormBuilder, private event: Events) {
  }

  ngOnInit() {
  }

  globalLanguage = this.templateService.globalLanguage;
  defaultLanguage = 0;

  @ViewChild('input') thisInput;
  nextPage() {
    let planName = this.slideOneForm.controls.firstName;
    if (planName.invalid) {
      this.submitted = true;
      // this.templateService.presentToastWithOptions("Plan name cannot be empty!");
      this.thisInput.setFocus();
      return false;
    }
    this.router.navigateByUrl('/tabs/plans/details/' + this.defaultLanguage + '/' + planName.value.trim());
  }

  cancel() {
    this.router.navigateByUrl('/tabs/plans');
  }

  resetPlan() {
    this.defaultLanguage = 0;
    this.slideOneForm.reset();
    this.submitted = false;
  }

  ionViewWillEnter() {
    this.android = this.templateService.checkPlatformAndroid();
    this.event.subscribe("newPlan", () => {
      this.resetPlan();
      this.event.unsubscribe("newPlan");
    })
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.thisInput.setFocus(); //does keyboard show up?
    }, 10)
  }
  
  inputFocus() {
    this.slideOneForm.controls.firstName.markAsTouched();
    this.slideOneForm.controls.firstName.markAsDirty();
  }
  defocus() {
    if (!this.slideOneForm.controls.firstName.value) {
      this.slideOneForm.controls.firstName.markAsPristine();
    }
  }

}
