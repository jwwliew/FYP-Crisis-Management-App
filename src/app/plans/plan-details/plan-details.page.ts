import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { IonRadio, IonSelect } from '@ionic/angular';


@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})
export class PlanDetailsPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private NgZone: NgZone) { }
  pNric: any;
  pName: any;
  tcsName: any;
  tcsContact:any;

  ngOnInit() {
  }
  ;

  PlanDetails() {
    console.log(this.pName,this.pNric,this.tcsName,this.tcsContact);
    this.PlanService.addPlanDetails(this.pName,this.pNric,this.tcsName,this.tcsContact).then(() => {
    });
  }
}
