import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ActionSheetController, Events, IonList } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';


@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})
export class ViewPlansPage implements OnInit {

  constructor(private router: Router, private planService: PlanService, public actionSheetController: ActionSheetController, 
    private event: Events, private templateService: TemplateService) {

  }
  details: any;
  plan: any;
  searchTerm: string = "";
  sortedDetails: any;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.searchTerm = "";
    this.planService.getAllPlan().then(plandetails => {
      plandetails = plandetails || [];
      // plandetails.sort((a,b) => b.createdDate.localeCompare(a.createdDate)); //sort latest on top, dont need as used unshift() instead of push(), revert if needed
      this.details = plandetails;
      this.sortedDetails = plandetails; //https://stackoverflow.com/questions/53346885/how-to-efficiently-load-large-list-in-ionic/53347064#53347064
    });
  }

  //search item(s)
  setFilteredItems() {
    this.sortedDetails = this.details.filter(result => result.planName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
    this.mylist.closeSlidingItems();
    // this.PlanService.getPlanFilter(this.searchTerm).then(sname => {
    //   this.mylist.closeSlidingItems();
    //   this.details = sname;
    //   console.log(sname);
    // })
    // console.log("check   " + this.searchTerm);
  }

  //redirect
  onClick() {
    this.router.navigateByUrl('/tabs/plans/newPlan').then(() => this.event.publish("newPlan"))
  }

  goEdit(item) {
    this.router.navigateByUrl('/tabs/plans/editplan/' + item.id);
  }

  //https://ionicframework.com/docs/api/alert
  //delete ADD alert
  @ViewChild('mylist')mylist: IonList;

  swipeEvent(id) {
    // thisEvent.stopPropagation();
    this.templateService.delete("Are you sure you want to delete this plan?").then(() => {
      this.details.splice(this.details.findIndex(x => x.id == id), 1);
      this.sortedDetails = [...this.details];
      this.planService.deletePlanByID(this.details); //default plans from old to new
      this.templateService.presentToastWithOptions("Deleted plan!");
      this.mylist.closeSlidingItems();
      this.searchTerm = "";
    }).catch(() => {})
  }

  presentActionSheetDelayed() { //needed to prevent keyboard taking up white space bug when tap onto searchbar then tap onto filter button
    if (this.focused) {
      setTimeout(() => {
        this.presentActionSheet();
      }, 150);
    }
    else {
      this.presentActionSheet();
    }
  }

  focused: boolean;
  ionFocus() {
    this.focused = true;
  }
  ionBlur() {
    setTimeout(() => { //need setTimeout else too fast for the if statement in presentActionSheetDelayed()
      this.focused = false;
    }, 10);
  }

  //Filter
  async presentActionSheet() {
    this.mylist.closeSlidingItems();
    if (this.sortedDetails.length == 0) {
      this.templateService.presentToastWithOptions("No plans to filter. Please click on 'New' at the top right to add a plan!");
      return false;
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Sort by',
      buttons: [{
        text: 'A to Z',
        // role: 'destructive',
        icon: 'arrow-round-down',
        handler: () => {
          this.details.sort((a,b) => a.planName.localeCompare(b.planName));
          this.sortedDetails = [...this.details]; //https://github.com/angular/components/issues/13854 angular does not detect change until variable get new value
          this.templateService.presentToastWithOptions("Plans sorted from A to Z");
          
          // this.PlanService.getAllPlan().then(wholeplan => {
          //   console.log(this.details);
          //   wholeplan.sort((a, b) => a.planName.localeCompare(b.planName))
          //   this.details = wholeplan;
          //   this.templateService.presentToastWithOptions("Plans sorted from A to Z");
          //   console.log(this.details);
          // });
        }
      }, {
        text: 'Z to A',
        icon: 'arrow-round-up',
        handler: () => {
          this.details.sort((a,b) => b.planName.localeCompare(a.planName));
          this.sortedDetails = [...this.details];
          // this.PlanService.getAllPlan().then(wholeplan => {
          //   wholeplan.sort((a, b) => b.planName.localeCompare(a.planName))
          //   this.details = wholeplan;
          this.templateService.presentToastWithOptions("Plans sorted from Z to A");
          // });
        }
      }, {
        text: 'Date: New to Old',
        icon: 'Trending-down',
        handler: () => {
          this.details.sort((a,b) => b.createdDate.localeCompare(a.createdDate));
          this.sortedDetails = [...this.details];
          // this.PlanService.getAllPlan().then(wholeplan => {
          //   wholeplan.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
          //   this.details = wholeplan;
            this.templateService.presentToastWithOptions("Plans sorted from latest to oldest");
          // });
        }
      }, {
        text: 'Date: Old to New',
        icon: 'Trending-up',
        handler: () => {
          this.details.sort((a,b) => a.createdDate.localeCompare(b.createdDate));
          this.sortedDetails = [...this.details];
          this.templateService.presentToastWithOptions("Plans sorted from oldest to latest");
        }
      }]
    });
    await actionSheet.present();
  }

  itemHeightFn(item, index) { //method to prevent virtual scroll flicker when navigate between tabs
    return 140; //https://github.com/ionic-team/ionic/issues/17540#issuecomment-511136665
  }

  ionViewDidLeave() {
    this.mylist.closeSlidingItems();
  }

  @ViewChild('content')content;
  scrollToItem() {
    this.content.scrollToTop(1000);
    setTimeout(() => {
      this.buttonShown = false;
    }, 1000);
  }
  buttonShown: boolean = false;
  scroll(ev) {
    let currentScrollHeight = ev.target.clientHeight + ev.detail.scrollTop;
    currentScrollHeight > 3000 ? //shown when more than 20 plans https://stackoverflow.com/questions/45880214/how-to-show-hide-button-dependent-on-the-position-of-content-scroll-in-ionic-2
      this.buttonShown = true 
      : this.buttonShown = false;
  }

}
