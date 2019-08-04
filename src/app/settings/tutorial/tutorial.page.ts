import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';


@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  constructor(private router: Router, private event: Events) { }

  ngOnInit() {
  }

  selectedTab = "templates"

  templateList = ["assets/tutorial_template1.png", "assets/tutorial_template2.png", "assets/tutorial_template3.png", "assets/tutorial_template4.png", "assets/tutorial_template5.png", 
                  "assets/tutorial_template6.png", "assets/tutorial_template7.png", "assets/tutorial_template8.png"]
  planList = ["assets/tutorial_plan1.jpg", "assets/tutorial_plan2.jpg", "assets/tutorial_plan3.jpg", "assets/tutorial_plan4.jpg", "assets/tutorial_plan5.jpg", 
              "assets/tutorial_plan6.jpg", "assets/tutorial_plan7.jpg", "assets/tutorial_plan8.jpg", "assets/tutorial_plan9.jpg", "assets/tutorial_plan10.jpg", 
              "assets/tutorial_plan11.jpg", "assets/tutorial_plan12.jpg", "assets/tutorial_plan13.jpg"]

  slideOpts= {
    loop: false, // allow first and last slide to move to each other, but click won't work when slide first to last
  }

  getStarted() {
    this.selectedTab == "templates" ? 
      this.router.navigateByUrl("/tabs/templates/new") 
      : this.router.navigateByUrl("/tabs/plans/newPlan").then(() => this.event.publish("newPlan"))
  }

}
