import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-template-pop',
  templateUrl: './template-pop.component.html',
  // styleUrls: ['./template-pop.component.scss'],
})
export class TemplatePopComponent implements OnInit {

  constructor(public popoverController: PopoverController, public navParams: NavParams, private modalController: ModalController) { 
    console.warn("this navparams = ", navParams);
    navParams.data.type == 'modal' && (this.modalPopUp = true);
    this.menuOptions = navParams.data.menuOptions; // this.menuOptions = navParams.get("keyOptions");
    this.symptomOrAction = navParams.data.symptomOrAction;
  }

  ngOnInit() {}
  
  // menuOptions = ["Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete", "Export to PDF"];
  menuOptions = [];
  modalPopUp = false;
  defaultLanguage = 0;
  symptomOrAction: string;

  close(thisOption) {
    console.warn(thisOption)
    this.modalPopUp ? this.modalController.dismiss(thisOption) : this.popoverController.dismiss(thisOption);
  }
  
  returnLanguage(element) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[this.navParams.data.defaultLanguage] || element.enName;
  }
}
