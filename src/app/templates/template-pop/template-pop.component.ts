import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RouterInitializer } from '@angular/router/src/router_module';
import { importType } from '@angular/compiler/src/output/output_ast';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from 'src/app/services/template.service';
@Component({
  selector: 'app-template-pop',
  templateUrl: './template-pop.component.html',
  // styleUrls: ['./template-pop.component.scss'],
})
export class TemplatePopComponent implements OnInit {
  data: any;
  // yaya;
  constructor(public ser:TemplateService,public router: Router, public popoverController: PopoverController, public navParams: NavParams, private modalController: ModalController, public settingstorge: Storage) {
    navParams.data.type == 'modal' && (this.modalPopUp = true);
    this.menuOptions = navParams.data.menuOptions; // this.menuOptions = navParams.get("keyOptions");
    this.symptomOrAction = navParams.data.symptomOrAction;

  }

  ngOnInit() {
    this.settingstorge.get('settingStorageKey1').then(value => {
      this.data = value
      // console.log("this.data");
      // console.log(this.data);
    },

    )
  }

  // menuOptions = ["Edit", "Rename", "Duplicate", "Create Crisis Plan", "Delete", "Export to PDF"];
  menuOptions = [];
  modalPopUp = false;
  defaultLanguage = 0;
  symptomOrAction: string;
// tiaozhuan(){
//   this.yaya=this.ser.gettitlea();
// }
  close(thisOption) {
    
    if(thisOption.id==-10||thisOption.id==-9||thisOption.id==-8||thisOption.id==-7||thisOption.id==-6||thisOption.id==-5||thisOption.id==-4||thisOption.id==-3||thisOption.id==-2||thisOption.id==-1||thisOption.id==1||thisOption.id==2||thisOption.id==3||thisOption.id==4||thisOption.id==5||thisOption.id==11||thisOption.id==12||thisOption.id==13||thisOption.id==14){
        let shuju=[];
        this.data.forEach(element => {
          
          //当ID相同时跳转到新的页面
          if(element.id==thisOption.id){
            // console.log("element======"+element);
            shuju.push(element.id);
          
         // this.modalController.dismiss();
        }
          });
         
          // console.log("跳转之前↓")
          // console.log(shuju)
          // console.log("跳转之前↑") 
          this.modalController.dismiss();
            this.router.navigate(['/text1'], {
              queryParams: {
    
                shuju   //console.log(JSON.stringify(params))
              },
             
            });
  
           
        
    
      
        //console.log(item.id)
        //console.log(this.data)
    
      
    }
    
    else{
    this.modalPopUp ? this.modalController.dismiss(thisOption) : this.popoverController.dismiss(thisOption);
  }
}

  returnLanguage(element) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[this.navParams.data.defaultLanguage] || element.enName;
  }

  itemHeightFn(item, index) { //method to prevent virtual scroll flicker when navigate between tabs
    return 70; //https://github.com/ionic-team/ionic/issues/17540#issuecomment-511136665
  }

  @ViewChild('content') content;
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
  close2(thisOption){
    this.modalPopUp ? this.modalController.dismiss(thisOption) : this.popoverController.dismiss(thisOption);
  }

  //添加~~++++++++++++++++++++++++++++
  

}

