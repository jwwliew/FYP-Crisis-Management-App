import { SymptomActionService } from '../../services/symptomaction.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Events, IonList, IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { TemplateService } from 'src/app/services/template.service';
import { configFromSession } from '@ionic/core';

@Component({
  selector: 'app-symptom-action',
  templateUrl: './symptom-action.page.html',
  styleUrls: ['./symptom-action.page.scss'],
})
export class SymptomActionPage implements OnInit {
  public add2;
  selectedTab = "Symptom";
  symptomList = [];
  actionList = [];

  checked = []
  @Input('ngModel') value:any;
  @ViewChild('mylist')mylist: IonList;
  ngclick1(){
    // console.log("ngclick1");
    this.add2=null;
  }
  ngclick2(){
    // console.log("ngclick2");
    this.add2=null;

  }
  deleteIOS(thisItem) {
    this.templateService.delete(`Are you sure you want to delete this ${this.selectedTab.toLowerCase()}?`).then(() => {
      this.settingService.deleteIOS(this.selectedTab, thisItem).then(() => {
        this.templateService.presentToastWithOptions(`Deleted ${this.selectedTab.toLowerCase()}!`);
        this.mylist.closeSlidingItems();
        this.loadItems();
      })
    }).catch(() => {});
  }

  dragAndCheckLongPress(slideItem: IonItemSliding) {
    slideItem.close();
  }

  pressEvent(x) {
    if (this.checked.length == 0) {
      this.mylist.closeSlidingItems();
      this.checked.push({
        id: x.id,
        selectedType: this.selectedTab
      });
      x.checked = true;
    }
  } 

  check(item) { //https://forum.ionicframework.com/t/determining-if-checkbox-is-checked/68628/5, https://forum.ionicframework.com/t/how-to-check-if-checkboxes-is-checked-or-unchecked/68799/7
    let itemID = this.checked.findIndex(x => x.id == item.id);
    if (itemID !== -1) {
      this.checked.splice(itemID, 1);
      delete item.checked;
    }
    else {
      this.checked.push({id: item.id, selectedType: this.selectedTab})
    }
  }
  
  deleteSelected() {
    this.templateService.delete(`Are you sure you want to delete these ${this.selectedTab.toLowerCase()}?`).then(() => {
      this.settingService.deleteSetting(this.selectedTab, this.checked).then(() => {
        this.templateService.presentToastWithOptions(`Deleted ${this.checked.length} ${this.selectedTab.toLowerCase()}`);
        this.checked.length = 0;
        this.loadItems();
      });
    }).catch(() => {});
  }

  clearArray() {
    this.checked.forEach(x => {
      let thisArray = x.selectedType == "Symptom" ? this.symptomList : this.actionList
      let thisElement = thisArray.find(oneItem => oneItem.id == x.id);
      // thisElement.checked = false;
      delete thisElement.checked;
    })
    this.checked.length = 0;
  }

  constructor(private settingService: SymptomActionService, public event: Events, private router: Router, private templateService: TemplateService) {}

  ngOnInit() {
    // this.add2=this.myadd.value;'
    console.log("model="+this.value);
  }
  select(item){
    // if (this.checked.length == 0) {
    //    this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + item); //routing start from root level
    //    }
   var pubg=item;
   
    if(item.id==-10||item.id==-9||item.id==-8||item.id==-7||item.id==-6||item.id==-5||item.id==-4
      ||item.id==-3||item.id==-2||item.id==-1||item.id==1||item.id==2||item.id==3||item.id==4||item.id==11||
      item.id==12||item.id==13||item.id==14){
    // console.log("唐门="+item.id);
    // console.log("执行select函数");
    item=item.id;
    this.router.navigate(['/text2'], {
      queryParams: {

        item
          //console.log(JSON.stringify(params))
      },
     
    });
    // console.log("item="+item);
  }
  else{
    // console.log("唐门2="+item);
    this.selectedTab="Action";
    // console.log("pubg.id="+pubg.id);
    this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + pubg.id); //routing start from root level
  }
}

  ionViewWillEnter() {
    this.loadItems();
    this.android = this.templateService.checkPlatformAndroid();
  }

  loadItems() {
    let allPromise = [this.settingService.getType("Symptom"), this.settingService.getType("Action")];
    Promise.all(allPromise).then(finalPromises => {
      this.symptomList = finalPromises[0];
      this.actionList = finalPromises[1];
    })
  }

  goToType(type) {
    this.selectedTab = type;
    this.clearArray();
    this.mylist.closeSlidingItems();
  }

  segmentChanged() {
    this.clearArray();
    this.mylist.closeSlidingItems();
  }

  selectedSymptom(id) {
    //  if (this.checked.length == 0) {
    //   this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + id); //routing start from root level
    //  }
  }
  
  goToAddPage() {
    console.log("this.add2="+this.add2);
    
  if(this.add2=="add"){
    this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + "add"); //routing start from root level
  }
  else{
    return false;
  }

}


  renderDividers(record : any, recordIndex : number, records : any)  : any
  {
    let num:number= 0;


     // IF this is every tenth record we want to
     // inject the correct heading from the above
     // array into the list to act as a divider
     // between different comic genres
    if (recordIndex % 10 === 0)
    {
        return 'Header ' + recordIndex;
    }
    return null;
  }

  android: boolean;

  ionViewWillLeave() {
    this.mylist.closeSlidingItems();
  }
  
  @ViewChild('content')content;
  scrollToItem() {
    console.warn("clicked scroll");
    this.content.scrollToTop(1000);
    setTimeout(() => {
      this.buttonShown = false;
    }, 1000);
  }
  buttonShown: boolean = false;
  scroll(ev) {
    let currentScrollHeight = ev.target.clientHeight + ev.detail.scrollTop;
    currentScrollHeight > 1500 ? //shown when more than 20 settings https://stackoverflow.com/questions/45880214/how-to-show-hide-button-dependent-on-the-position-of-content-scroll-in-ionic-2
      this.buttonShown = true 
      : this.buttonShown = false;
  }

}
