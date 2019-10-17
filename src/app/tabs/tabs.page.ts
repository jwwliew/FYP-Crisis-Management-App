import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TemplateService } from '../services/template.service';
import { PlanService } from '../services/plan.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private navCtrl: NavController, private templateService: TemplateService, private planService: PlanService) { }

  styles = ['color: green', 'background: yellow'].join(";");

  ngOnInit() {
    // for(var i=0;i<=1;i++){
    // this.templateService.refresh();
    // break;
    // }

  }
  // shuaxin(){
  // this.templateService.refresh();
  // }
  goToRoot(location) {
    let rootLocations = ["/tabs/plans", "/tabs/templates", "/tabs/settings"];
    this.planService.resetExtras();
    this.navCtrl.navigateRoot(rootLocations[location]);
  
  }

  resetGlobalArray() {
    this.templateService.resetArray();
  }

  // ionViewWillEnter() {
  //   console.error("%cION VIEW WILL ENTER TABS PAGE ", this.styles);
  // }
}
