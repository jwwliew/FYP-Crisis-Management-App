import { Component, OnInit, ViewChild } from '@angular/core';
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
                  "assets/tutorial_template6.png", "assets/tutorial_template7.png", "assets/tutorial_template8.png", "assets/tutorial_template9.png", "assets/tutorial_template10.png",
                  "assets/tutorial_template11.png", "assets/tutorial_template12.png"]
  planList = ["assets/tutorial_plan1.png", "assets/tutorial_plan2.PNG", "assets/tutorial_plan3.png", "assets/tutorial_plan4.png", "assets/tutorial_plan5.png", 
              "assets/tutorial_plan6.PNG", "assets/tutorial_plan7.png", "assets/tutorial_plan8.png", "assets/tutorial_plan9.png", "assets/tutorial_plan10.png", 
              "assets/tutorial_plan11.png", "assets/tutorial_plan12.png", "assets/tutorial_plan13.png"]

  slideOpts= {
    loop: false, // allow first and last slide to move to each other, but click won't work when slide first to last
  }

  getStarted() {
    this.selectedTab == "templates" ? 
      this.router.navigateByUrl("/tabs/templates/new") 
      : this.router.navigateByUrl("/tabs/plans/newPlan").then(() => this.event.publish("newPlan"))
  }

  @ViewChild('slider') slider;
  resetIndex() {
    this.slider.slideTo(0)
  }
}
