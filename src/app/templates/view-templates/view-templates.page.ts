import { TemplateService } from 'src/app/services/template.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events, NavController } from '@ionic/angular';
import { SymptomActionService } from 'src/app/services/symptomaction.service';

@Component({
  selector: 'app-view-templates',
  templateUrl: './view-templates.page.html',
  styleUrls: ['./view-templates.page.scss'],
})
export class ViewTemplatesPage implements OnInit {

  allTemplate = [];
  loading = true;

  constructor(private router: Router, private templateService: TemplateService, private event: Events, private navCtrl: NavController, private settingService: SymptomActionService) { }

  ngOnInit() {
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
    this.loading = true;
    this.loadTemplates();
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  loadTemplates() {
    this.templateService.getAllTemplate("allKey").then(val => {
      val = val || []; //prevent null if val empty at start no storage
      this.allTemplate = val.map((element, index) => {
        element.templates.forEach(x => {
          x.length && x.forEach(y => {
            this.settingService.getOneImage("Symptom", y.symptom.symptomID).then(oneImg => {
              y.symptom.img = oneImg;
            })
          });
        })
        let obj = {
          id: val[index].id,
          name: val[index].name,
          template: [].concat(...element.templates), //https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
          language: val[index].language
        }
        return obj;
      });
      this.allTemplate.sort((a,b) => a.language - b.language); //sort template by language English > Chinese > Malay > Tamil
      this.allTemplate.forEach(x => {
        x.template = x.template.filter(function(element) {
          // console.error(this);
          return !this.has(element.symptom.symptomID) && this.add(element.symptom.symptomID) // https://stackoverflow.com/questions/51517650/removing-duplicates-using-set-in-javascript
        }, new Set);  
      })
    });
  }

  newTemplate() {
    this.templateService.resetArray(); //when continue creating 2nd template, contents of 1st template is still here, hence need to clean template
    this.router.navigateByUrl('/tabs/templates/new') //routing start from root level
  }

  goToDynamicAddPage(templateItem) {
    this.templateService.getOneTemplate(templateItem.id).then(modifiedTemplate => {
      modifiedTemplate["template"] = modifiedTemplate["templates"];
      delete modifiedTemplate["templates"];
      // modifiedTemplate.template = [].concat(...modifiedTemplate.template); //join the array of array of objects into one array of objects to call filterArray in template service
      modifiedTemplate.template = modifiedTemplate.template.flat(Infinity);
      modifiedTemplate.template.forEach(element => {
        this.settingService.getOneImage("Symptom", element.symptom.symptomID).then(oneImg => {
          element.symptom.img = oneImg;
        });
        element.combined.forEach(oneCombined => {
          this.settingService.getOneImage("Action", oneCombined.actionID).then(actionImg => {
            oneCombined.img = actionImg;
          });
        });
    });
      this.navCtrl.navigateRoot("/tabs/templates/new").then(() => { //https://stackoverflow.com/questions/38342171/ionic-2-events-publish-and-subscribe-not-working
        this.event.publish("view", modifiedTemplate);
      })
    })
  }

  itemHeightFn(item, index) { //method to prevent virtual scroll flicker when navigate between tabs
    return 190; //https://github.com/ionic-team/ionic/issues/17540#issuecomment-511136665
  }

}
