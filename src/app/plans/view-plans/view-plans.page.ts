import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';

@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})
export class ViewPlansPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService) { }

  plan: any;

  ngOnInit() {
  }

  onClick() {
    this.router.navigateByUrl('tabs/plans/newPlan');
  }


  goToTestPage() {
    this.router.navigateByUrl('/templatedetails');
  }


  getPlanName() {
    this.PlanService.getAllPlan();
  }
}
