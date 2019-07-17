import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ActionSheetController, IonItemSliding } from '@ionic/angular';
import { PlanDetailsPage } from '../plan-details/plan-details.page';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})
export class ViewPlansPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, public actionSheetController: ActionSheetController, public toastController: ToastController) {

  }
  details: any;
  plan: any;
  public searchTerm: string = "";
  public items: string[];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.PlanService.getAllPlan().then(plandetails => {
      this.details = plandetails
    });
  }
  //search item(s)
  setFilteredItems() {
    this.PlanService.getPlanFilter(this.searchTerm).then(sname => {
      this.details = sname;
      console.log(sname);
    })
    console.log("check   " + this.searchTerm);
  }

  //redirect
  onClick() {
    this.router.navigateByUrl('tabs/plans/newPlan');
  }

  //redirect
  goToTestPage() {
    this.router.navigateByUrl('/templatedetails');
  }

  goEdit(item) {
    this.router.navigateByUrl('tabs/plans/editplan/' + item.id)
  }


  swipeEvent(id, thisEvent) {
    thisEvent.stopPropagation();
    this.PlanService.deletePlanByID(id).then(result => {
      this.details=result;
    });
  }

  //Filter
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sort by',
      buttons: [{
        text: 'Z to A',
        role: 'destructive',
        icon: 'arrow-round-down',
        handler: () => {
          this.PlanService.getAllPlan().then(wholeplan => {
            wholeplan.sort((a, b) => a.name.localeCompare(b.name))
            this.details = wholeplan;
            console.log("A-Z sorted");
          });
        }
      }, {
        text: 'A to Z',
        icon: 'arrow-round-up',
        handler: () => {
          this.PlanService.getAllPlan().then(wholeplan => {
            wholeplan.sort((a, b) => b.name.localeCompare(a.name))
            this.details = wholeplan;
            console.log("Z-A sorted");
          });
        }
      }, {
        text: 'Date: New to Old',
        icon: 'Trending-down',
        handler: () => {
          this.PlanService.getAllPlan().then(wholeplan => {
            wholeplan.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
            this.details = wholeplan;
            console.log("date sorted")
          });

        }
      }]
    });
    await actionSheet.present();
  }



}
