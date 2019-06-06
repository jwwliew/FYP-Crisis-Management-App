import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-symptom-action',
  templateUrl: './symptom-action.page.html',
  styleUrls: ['./symptom-action.page.scss'],
})
export class SymptomActionPage implements OnInit {

  selectedTab = "Symptom";
  symptomList = ["ok", "hi"];
  actionList = ["action", "action2"];

  constructor() { }

  ngOnInit() {
  }

  newSymptomAction() {

  }

  goToSymptom() {
    this.selectedTab = "Symptom";
    console.log("selected symptom tab");
  }
  goToAction() {
    this.selectedTab = "Action";
    console.log("selected action tab");
  }

  selectedSymptom(id) {
    console.log("this selected symptom id = " + id);
  }

  checkSelected() {
    var returnValue = true;
    if (this.selectedTab == "Action") {
      returnValue = false;
    }
    return returnValue;
  }
}
