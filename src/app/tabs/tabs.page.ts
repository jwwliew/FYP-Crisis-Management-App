import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private navCtrl: NavController, private templateService: TemplateService) { }

  ngOnInit() {
  }

  goToRoot(location) {
    let rootLocations = ["/tabs/plans", "/tabs/templates", "/tabs/settings"];
    this.navCtrl.navigateRoot(rootLocations[location]);
  }

  resetGlobalArray() {
    this.templateService.resetArray();
  }
}
