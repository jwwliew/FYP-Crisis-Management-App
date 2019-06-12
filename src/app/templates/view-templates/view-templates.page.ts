import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-templates',
  templateUrl: './view-templates.page.html',
  styleUrls: ['./view-templates.page.scss'],
})
export class ViewTemplatesPage implements OnInit {

  allTemplate: any;

  constructor(private router: Router, private templateService: TemplateService) { }

  ngOnInit() {
    console.error("ngOnInit view template.page.ts called");
  }

  ionViewWillEnter() {
    console.error("ionviewwillenter view template.page.ts called");
    this.templateService.getAllTemplate().then(val => {
      console.log("VAL = " + JSON.stringify(val));
      this.allTemplate = val[0]; //[0][0] becomes object, which *ngFor cannot iterate through (need array)
      console.warn(this.allTemplate);
    });
  }
  newTemplate() {
    console.log("clicked new template");
    this.router.navigateByUrl('/tabs/templates/new'); //routing start from root level
  }

}
