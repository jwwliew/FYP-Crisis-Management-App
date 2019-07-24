import { SymptomActionService } from '../../services/symptomaction.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, IonList } from '@ionic/angular';
import { Router } from '@angular/router';

import 'hammerjs'; //for gestures
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-symptom-action',
  templateUrl: './symptom-action.page.html',
  styleUrls: ['./symptom-action.page.scss'],
})
export class SymptomActionPage implements OnInit {

  selectedTab = "Symptom";
  //symptomList = ["ok", "hi"];
  symptomList = [];
  //actionList = ["action", "action2"];
  actionList = [];

  checked = []
  
  @ViewChild('mylist')mylist: IonList;

  deleteIOS(thisItem) {
    this.templateService.delete(`Are you sure you want to delete this ${this.selectedTab.toLowerCase()}?`).then(() => {
      console.error("delete one item", thisItem);
      this.settingService.deleteIOS(this.selectedTab, thisItem).then(() => {
        this.templateService.presentToastWithOptions(`Deleted one ${this.selectedTab.toLowerCase()}!`);
        this.mylist.closeSlidingItems();
        this.loadItems();
      })
    }).catch(() => {});
  }

  pressEvent(x) {
    console.log("pressed " + JSON.stringify(x));
    if (this.checked.length == 0) {
      this.checked.push({
        id: x.id,
        selectedType: this.selectedTab
      });
      x.checked = true;
      console.log("length not == 0 hold");
    }
    console.log("after press checked = " + this.checked);
  } 

  check(item) { //https://forum.ionicframework.com/t/determining-if-checkbox-is-checked/68628/5, https://forum.ionicframework.com/t/how-to-check-if-checkboxes-is-checked-or-unchecked/68799/7
    console.log("item before", item);
    // let itemID = this.checked.indexOf(item.id);
    console.warn("CHEKED BEFORE " + JSON.stringify(this.checked,null,2));
    let itemID = this.checked.findIndex(x => x.id == item.id);
    console.warn("ITEM ID FOUND " + itemID);
    if (itemID !== -1) {
      this.checked.splice(itemID, 1);
      delete item.checked;
    }
    else {
      this.checked.push({id: item.id, selectedType: this.selectedTab})
    }
    // itemID !== -1 ? this.checked.splice(itemID, 1) : this.checked.push({id: item.id, selectedType: this.selectedTab})
    console.log("Checked == " , this.checked);
    console.warn("ITEM AFTER " , item);
  }
  
  deleteSelected() {
    this.templateService.delete(`Are you sure you want to delete these ${this.selectedTab.toLowerCase()}?`).then(() => {
      console.log("deleting -- " + this.checked);
      this.settingService.deleteSetting(this.selectedTab, this.checked).then((a) => {
        console.log("delete success");
        console.log(a)
        this.templateService.presentToastWithOptions(`Deleted ${this.checked.length} ${this.selectedTab.toLowerCase()}`);
        this.checked.length = 0;
        this.loadItems();
      });
    }).catch(() => {});
  }

  clearArray() {
    this.checked.forEach(x => {
      let thisArray = x.selectedType == "Symptom" ? this.symptomList : this.actionList
      console.error("this array = " + JSON.stringify(thisArray,null,2))
      let thisElement = thisArray.find(oneItem => oneItem.id == x.id);
      console.error("this leement === " + JSON.stringify(thisElement,null,2));
      thisElement.checked = false;
    })
    this.checked.length = 0;
  }

  constructor(private settingService: SymptomActionService, public event: Events, private router: Router, private templateService: TemplateService) {}

  ngOnInit() {
    console.log("ngOnInIt() called");
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  loadItems() {
    let allPromise = [this.settingService.getType("Symptom"), this.settingService.getType("Action")];
    Promise.all(allPromise).then(finalPromises => {
      // finalPromises.forEach(eachArr => {
      //   eachArr && eachArr.forEach(element => {
      //       if (element.icon instanceof Blob) {
      //         this.settingService.readImage(element.icon).then(convertedBase64 => {
      //           element.icon = convertedBase64;
      //         })
      //       }
      //   });
      // })
      this.symptomList = finalPromises[0];
      this.actionList = finalPromises[1];
    })
  }

  goToType(type) {
    this.selectedTab = type;
    console.log(`selected ${this.selectedTab} tab`);
    this.clearArray();
  }

  segmentChanged() {
    this.clearArray();
  }

  selectedSymptom(id) {
    console.log(`this selected ${this.selectedTab} id = ${id}`);
    if (this.checked.length == 0) {
      this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + id); //routing start from root level
    }
  }
  
  goToAddPage() {
    this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + "add"); //routing start from root level
  }

}
