import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import {v4 as uuid} from 'uuid';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-new-templates',
  templateUrl: './new-templates.page.html',
  styleUrls: ['./new-templates.page.scss'],
})
export class NewTemplatesPage implements OnInit {

  constructor(private actionSheetCtrl: ActionSheetController, private router: Router, private templateStorage: TemplateService) { }

  ngOnInit() {

  }

  criticalArray = [];

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
      "name": "Cough",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Cancer",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Dead",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Gtg",
      "icon": "assets/cough.svg"
    },
    {
      "name": "High Blood Pressure",
      "icon": "assets/cough.svg"
    },
    {
      "name": "Watar",
      "icon": "assets/cough.svg"
    },
    
  ]

  customSelectSheetOptions: any = {
    header: "Select symptom to take",
    // subHeader: "Select symptom to take",
    // message: "Select symptom to take",
    // translucent: true
  }

//https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  async presentActionSheet(oddOrEven, item) { //https://ionicframework.com/docs/api/action-sheet
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select a symptom from below ' + oddOrEven,
      cssClass: "wholeActionSheet",
      buttons: this.createButtons(item)
    });
    await actionSheet.present();
  }

  createButtons(itemToUpdate) {
    let buttons = [];
    this.itemData.forEach(element => {
      let button = {
        text: element.name,
        icon: element.icon,
        handler: () => {
          console.log(`${element.name} clicked`);
          itemToUpdate.text = element.name
          console.log("item to update " + JSON.stringify(itemToUpdate));
          console.log("whole array = " + JSON.stringify(this.criticalArray));
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

  addNewCriticalArray(type) {
    console.log("clicked " + type); //critical or caution or good
    let arr1 = {
      id: uuid(),
      img: "assets/temperature.svg",
      text: "Select Symptom",
      type: "Symptom"
    }
    let arr2 = {
      id: uuid(),
      img: "assets/empty.svg",
      text: "Select Action",
      type: "Action"
    }
    this.criticalArray.push(arr1);
    this.criticalArray.push(arr2);
    console.log(this.criticalArray);
  }

  addTemplate() {
    console.log("critical array = " + JSON.stringify(this.criticalArray));
    let filteredArray = [];
    filteredArray = this.criticalArray.filter(x => x.text != "Select Action" && x.text != "Select Symptom");
    console.log("after filter array = " + JSON.stringify(filteredArray));
    console.warn("length array = " + filteredArray.length);

    let symptomArray = [];
    let actionArray = [];
    symptomArray = filteredArray.filter(x => x.type == "Symptom");
    actionArray = filteredArray.filter(x => x.type == "Action");
    console.error("final symptom array = " + JSON.stringify(symptomArray));
    console.error(`final action array = ${JSON.stringify(actionArray)}`);

    let finalArray = [];

    actionArray.forEach((x, index) => { //https://stackoverflow.com/questions/10457264/how-to-find-first-element-of-array-matching-a-boolean-condition-in-javascript
      let y = symptomArray[index];
      if (y) {
        let obj = [{
          "oneSymptom": y,
          "oneAction": x
        }]
        finalArray.push(obj); //1 key value consist of one symptom, one action
      }
      else { //got action, no symptom, reference previous symptom
        //finalArray[finalArray.length - 1].push(x);
        let obj = {"oneAction": x}
        console.log("y does not exist, x = " + JSON.stringify(x));
        finalArray[finalArray.length-1].push(obj) //error
        console.log("final array after = " + JSON.stringify(finalArray));
      }
    })

    console.warn("final array how it looks like \n " + JSON.stringify(finalArray));
    console.log("final array length = " + finalArray.length);
    this.templateStorage.createTemplate(finalArray).then(() => {
      this.router.navigateByUrl('/tabs/templates'); //routing start from root level
    })
  }

  jsonData = [
    { 
      'id': 1,
      'symptom': { 
        "text": "Cough",
        "type": "Symptom",
        "img": "assets/temperature.svg"
      },
      'combined': [
        { 
          "text": "CancerAct",
          "type": "Action",
          "img": "assets/temperature.svg"
        },
        {
          "text": "DieAct",
          "type": "Action",
          "img": "assets/temperature.svg"
        },
        {
          "text": "kys kys kys",
          "type": "Action",
          "img": "assets/temperature.svg"
        }
      ]
    },
    {
      'id': 2,
      'symptom': { 
        "text": "mid",
        "type": "Symptom",
        "img": "assets/temperature.svg"
      }
    },
    {
      'id': 3,
      'symptom': { 
        "text": "2222",
        "type": "Symptom",
        "img": "assets/temperature.svg"
      },
      'combined': [
        { 
          "text": "secondAct",
          "type": "Action",
          "img": "assets/temperature.svg"
        },
        {
          "text": "secondAct2",
          "type": "Action",
          "img": "assets/temperature.svg"
        },
      ]
    }
  ]

  ionViewWillEnter() {
    console.error(this.jsonData);
    this.jsonData.forEach((element,index) => {
      console.error(this.jsonData[index]);
    });
  }

}
