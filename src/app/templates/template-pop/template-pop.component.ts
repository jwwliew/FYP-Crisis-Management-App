import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-template-pop',
  templateUrl: './template-pop.component.html',
  // styleUrls: ['./template-pop.component.scss'],
})
export class TemplatePopComponent implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  menuOptions = ["Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete"];

  close(thisOption) {
    console.warn(thisOption)
    this.popoverController.dismiss(thisOption);
  }
  
}
