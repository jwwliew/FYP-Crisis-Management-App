import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  slideOpts= {
    loop: true, // allow first and last slide to move to each other
  };

  slidesDidLoad(slides:IonSlides) {
    slides.startAutoplay();
  }

  segmentChanged($event) {
    console.warn($event);
  }
}
