import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { IonRadio, IonSelect } from '@ionic/angular';


@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.page.html',
  styleUrls: ['./new-plan.page.scss'],
})
export class NewPlanPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private NgZone: NgZone) { }

  planName: any;


  ngOnInit() {
  }

  globalLanguage = [[0, "English"], [1, "中文"], [2, "Malay"], [3, "Tamil"]];
  defaultLanguage = 0;

  selectRadio() {
    console.log("selected " + this.defaultLanguage);
    this.PlanService.addLanguage(this.defaultLanguage).then(() => { }
    )
  };

  nextPage() {
    console.log(this.planName)
    // this.router.navigate (
    //  ['/tabs/plans/details',this.planName]
    this.router.navigateByUrl('tabs/plans/details/' + this.planName);
    //)
  }

}
