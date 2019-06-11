import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-templates',
  templateUrl: './new-templates.page.html',
  styleUrls: ['./new-templates.page.scss'],
})
export class NewTemplatesPage implements OnInit {

  selectedItem: any;

  constructor() { }

  ngOnInit() {
  }

  customSelectSheetOptions:any = {
    header: "Select symptom to take",
    // subHeader: "Select symptom to take",
    // message: "Select symptom to take",
    // translucent: true
  }
  
  popUpDone() {
    console.log("selected item = " + this.selectedItem)
  }

}
