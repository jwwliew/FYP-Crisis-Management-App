import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events, NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-templates',
  templateUrl: './view-templates.page.html',
  styleUrls: ['./view-templates.page.scss'],
})
export class ViewTemplatesPage implements OnInit {

  allTemplate = [];

  constructor(private router: Router, private templateService: TemplateService, private event: Events, private navCtrl: NavController) { }

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
    // let promises = [this.templateService.getAllTemplate("templateKey"), this.templateService.getAllTemplate("warningKey")];
    // Promise.all(promises).then(val => {
    //   this.allTemplate = val[1]; //[0][0] becomes object, which *ngFor cannot iterate through (need array);
    //   console.group("json data view page");
    //   console.log(val);
    //   console.groupEnd();
    //   console.log(this.allTemplate);
    // })
    this.templateService.getAllTemplate("allKey").then(val => {
      console.group("json data view page");
      console.log(val);
      console.groupEnd();
      val = val || []; //prevent null if val empty at start no storage
      this.allTemplate = val.map((element, index) => {
        console.log("ele,ent --- " + JSON.stringify(element, null, 2))
        console.log([].concat(...element.templates))
        let obj = {
          id: val[index].id,
          name: val[index].name,
          template: [].concat(...element.templates)
        }
        return obj;
      });
      // this.allTemplate = [{name: val[0].name, template: [].concat(...val[0].templates)}]; //https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
      // console.warn("array pushed = " + JSON.stringify(this.allTemplate, null, 2) + "\n array length = " + this.allTemplate[0].template.length);
      console.warn(this.allTemplate);
    });

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

  goToDynamicAddPage(templateItem) {
    // this.event.publish("edit", templateItem);
    console.log("dynamic id = " + JSON.stringify(templateItem, null, 2))
    // this.router.navigateByUrl("/tabs/templates/new");
    this.navCtrl.navigateRoot("/tabs/templates/new").then(() => { //https://stackoverflow.com/questions/38342171/ionic-2-events-publish-and-subscribe-not-working
      this.event.publish("view", templateItem);
    })
  }
}
