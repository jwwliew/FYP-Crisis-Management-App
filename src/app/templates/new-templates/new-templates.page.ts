import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-new-templates',
  templateUrl: './new-templates.page.html',
  styleUrls: ['./new-templates.page.scss'],
})
export class NewTemplatesPage implements OnInit {

  selectedItem: any;

  constructor(private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
  }
  criticalArray = [];
  type: any;

  itemData = [
    {
      "name": "NAME1",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME2",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME3",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME4",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME4",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME4",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME4",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME4",
      "icon": "assets/cough.svg"
    },
    {
      "name": "NAME4",
      "icon": "assets/cough.svg"
    },
    
  ]

  customSelectSheetOptions: any = {
    header: "Select symptom to take",
    // subHeader: "Select symptom to take",
    // message: "Select symptom to take",
    // translucent: true
  }

  popUpDone() {
    console.log("selected item = " + this.selectedItem)
  }
  

//https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  async presentActionSheet(type) { //https://ionicframework.com/docs/api/action-sheet
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select a symptom from below',
      cssClass: "wholeActionSheet",
      buttons: this.createButtons(type)
      // [{
      //   text: 'Delete',
      //   role: 'destructive',
      //   icon: 'trash',
      //   handler: () => {
      //     console.log('Delete clicked');
      //   }
      // }, {
      //   text: 'Share',
      //   icon: 'share',
      //   handler: () => {
      //     console.log('Share clicked');
      //   }
      // }, {
      //   text: 'Play (open modal)',
      //   icon: 'arrow-dropright-circle',
      //   handler: () => {
      //     console.log('Play clicked');
      //   }
      // }, {
      //   text: 'Favorite',
      //   icon: 'heart',
      //   handler: () => {
      //     console.log('Favorite clicked');
      //   }
      // }, {
      //   text: 'Cancel',
      //   icon: 'close',
      //   role: 'cancel',
      //   handler: () => {
      //     console.log('Cancel clicked');
      //   }
      // }]
    });
    await actionSheet.present();
  }

  createButtons(changeType) {
    let buttons = [];
    this.itemData.forEach(element => {
      let button = {
        text: element.name,
        icon: element.icon,
        handler: () => {
          this.type = changeType;
          console.log(`${element.name} clicked ${this.type}`);
          
        }
      }
      buttons.push(button);
    });
    buttons.push({
      text: "Cancel",
      icon: "close",
      role: "selected"
    })
    return buttons;
  }

  addNewCriticalArray() {
    console.log("clicked");
    let arr = {
      id: uuid(),
      img: "assets/temperature.svg",
      text: "Select action to take"
    }
    this.criticalArray.push(arr);
    console.log(this.criticalArray);
  }
}
