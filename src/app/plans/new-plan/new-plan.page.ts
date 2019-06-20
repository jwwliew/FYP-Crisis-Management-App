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

  nextPage() {
    console.log(this.planName)
        this.PlanService.addNewPlan(this.planName).then(() => {
      this.router.navigateByUrl('tabs/plans/details');
    });
  }

}
