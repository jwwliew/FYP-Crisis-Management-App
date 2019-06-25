import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ActionSheetController } from '@ionic/angular';
import { PlanDetailsPage } from '../plan-details/plan-details.page';


@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})
export class ViewPlansPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, public actionSheetController: ActionSheetController) { }

  plan: any;

  ngOnInit() {
   this.PlanService.getAllPlan().then(cname=>{
    this.details=cname
    });

  }

  details: any;


  setFilteredItems() {
    this.PlanService.getPlanFilter();
  }

  //redirect
  onClick() {
    this.router.navigateByUrl('tabs/plans/newPlan');
  }

  //redirect
  goToTestPage() {
    this.router.navigateByUrl('/templatedetails');
  }

  //get
  getPlanName() {
    this.PlanService.getAllPlan();
  }

  //Filter
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter by',
      buttons: [{
        text: 'Letters: A to Z',
        role: 'destructive',
        icon: 'arrow-round-down',
        handler: () => {
          console.log('A to Z');
        }
      }, {
        text: 'Letters: Z to A',
        icon: 'arrow-round-up',
        handler: () => {
          console.log('Z to A');
        }
      }, {
        text: 'Date: New to Old',
        icon: 'Trending-down',
        handler: () => {
          console.log('N to O');
        }
      }, {
        text: 'Date: Old to New',
        icon: 'Trending-up',
        handler: () => {
          console.log('O to N');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel');
        }
      }]
    });
    await actionSheet.present();
  }
}
