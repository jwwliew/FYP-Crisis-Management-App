import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-template-pop',
  templateUrl: './template-pop.component.html',
  // styleUrls: ['./template-pop.component.scss'],
})
export class TemplatePopComponent implements OnInit {

  constructor(public popoverController: PopoverController, public navParams: NavParams, private modalController: ModalController) { 
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
    this.modalPopUp ? this.modalController.dismiss(thisOption) : this.popoverController.dismiss(thisOption);
  }
  
  returnLanguage(element) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[this.navParams.data.defaultLanguage] || element.enName;
  }

  itemHeightFn(item, index) { //method to prevent virtual scroll flicker when navigate between tabs
    return 70; //https://github.com/ionic-team/ionic/issues/17540#issuecomment-511136665
  }

  @ViewChild('content')content;
  scrollToItem() {
    this.content.scrollToTop(1000);
    setTimeout(() => {
      this.buttonShown = false;
    }, 1000);
  }
  buttonShown: boolean = false;
  scroll(ev) {
    let currentScrollHeight = ev.target.clientHeight + ev.detail.scrollTop;
    currentScrollHeight > 1500 ? //shown when more than 20 plans https://stackoverflow.com/questions/45880214/how-to-show-hide-button-dependent-on-the-position-of-content-scroll-in-ionic-2
      this.buttonShown = true 
      : this.buttonShown = false;
  }

}
