import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-view-templates',
  templateUrl: './view-templates.page.html',
  styleUrls: ['./view-templates.page.scss'],
})
export class ViewTemplatesPage implements OnInit {

  allTemplate: any;

  constructor(private router: Router, private templateService: TemplateService, private event: Events) { }

  ngOnInit() {
    console.error("ngOnInit view template.page.ts called");
  }

  frontViewData = [
    { 
      id: 0,
      type: "Critical",
      colorCard: "danger",
      colorBtn: "redCard",
      toggle: false,
    },
    {
      id: 1,
      type: "Warning",
      colorCard: "warning",
      colorBtn: "warning",
      toggle: false
    }
  ]

  ionViewWillEnter() {
    console.error("ionviewwillenter view template.page.ts called after new template created event");
    let promises = [this.templateService.getAllTemplate("templateKey"), this.templateService.getAllTemplate("warningKey")];
    Promise.all(promises).then(val => {
      this.allTemplate = val[1]; //[0][0] becomes object, which *ngFor cannot iterate through (need array);
      console.group("json data view page");
      console.log(val);
      console.groupEnd();
      console.log(this.allTemplate);
    })
    // this.templateService.getAllTemplate("templateKey").then(val => {
    //   console.log("val = " + JSON.stringify(val));
    //   this.allTemplate = val;
    // });
  }

  newTemplate() {
    console.log("clicked new template");
    this.router.navigateByUrl('/tabs/templates/new'); //routing start from root level
  }

  ionViewWillLeave() {
    console.log("leaving page");
    // this.event.unsubscribe("createdTemplatePublish");
  }
}
