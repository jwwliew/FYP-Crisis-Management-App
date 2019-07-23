import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-template-pop',
  templateUrl: './template-pop.component.html',
  // styleUrls: ['./template-pop.component.scss'],
})
export class TemplatePopComponent implements OnInit {

  constructor(public popoverController: PopoverController, public navParams: NavParams) { 
    this.menuOptions = navParams.data.menuOptions; // this.menuOptions = navParams.get("keyOptions");
  }

  ngOnInit() {}

  // menuOptions = ["Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete", "Export to PDF"];
  menuOptions = [];

  close(thisOption) {
    console.warn(thisOption)
    this.popoverController.dismiss(thisOption);
  }
  
}
