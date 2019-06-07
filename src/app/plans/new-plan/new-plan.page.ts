import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.page.html',
  styleUrls: ['./new-plan.page.scss'],
})
export class NewPlanPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  nextPage()
  {
    this.router.navigateByUrl('tabs/plans/details');
  }
}
