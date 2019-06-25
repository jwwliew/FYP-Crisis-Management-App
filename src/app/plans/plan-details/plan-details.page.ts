import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { IonRadio, IonSelect } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})
export class PlanDetailsPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private NgZone: NgZone, public toastController: ToastController, private activatedRoute: ActivatedRoute) { }
  pNric: any;
  pName: any;
  tcsName: any;
  tcsContact: any;
  planName: any;

  ngOnInit() {
  
    this.planName = this.activatedRoute.snapshot.paramMap.get('id');
   
  }
  ;

  PlanDetails() {
    console.log(this.pName, this.pNric, this.tcsName, this.tcsContact);
    this.PlanService.addPlanDetails(this.pName, this.pNric, this.tcsName, this.tcsContact).then(() => {
    });
  }


}
