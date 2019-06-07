import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})
export class ViewPlansPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClick() {
    this.router.navigateByUrl('tabs/plans/newPlan');
  }
  

  goToTestPage() {
      this.router.navigateByUrl('/templatedetails');
  }
  
}
