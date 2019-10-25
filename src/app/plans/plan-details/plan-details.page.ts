import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IonList, IonItemSliding ,Events} from '@ionic/angular';
<<<<<<< HEAD
import { equal } from 'assert';
=======
>>>>>>> a29745e80941e7055c67e963ab6d2964362cf06d

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.page.html',
  styleUrls: ['./plan-details.page.scss'],
})

export class PlanDetailsPage implements OnInit {
public lang;
public defaultLanguage1;
  thisgroup = this.formBuilder.group({
    detailname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailnric: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailtcs: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailcontact: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/^[0-9]+$/), Validators.required])],
  });

  constructor(private router: Router, private PlanService: PlanService, private activatedRoute: ActivatedRoute,
    private templateService: TemplateService, public formBuilder: FormBuilder, private planService: PlanService,public eve:Events) {
      this.eve.subscribe("view", item => { //or services https://stackoverflow.com/questions/54304481/ionic-4-angular-7-passing-object-data-to-another-page
        this.defaultLanguage1 = item.language;
        
      })
     
    
  }

  planName: any;
  date1: string; // PLAN CREATED @ date
  datemy: string;

  appointment = this.templateService.appointment;
  //templateService
  ngOnInit() {
    
   }

  dateChanged(my, appObj) {
    // this.datemy = moment(my).format('YYYY-MM-DD hh:mmA');
    //install -npm i moment===>to use moment().format
    // let time = new Date(my).toLocaleString('en-GB', {hour12: true});
    let time = new Date(my).toLocaleString('en-US');
    appObj.appTime = time;
  }

  submitted = false;

  PlanDetails() {
    let arrayForm = [this.thisgroup.controls.detailcontact, this.thisgroup.controls.detailname, this.thisgroup.controls.detailtcs, this.thisgroup.controls.detailnric];
    !this.submitted && arrayForm.forEach(element => {
      if (!element.value) {
        element.setValue(""); //set value if empty
        element.markAsTouched(); // and touch so the red color underline ion-input will be shown
      }
     
    });
    if (this.thisgroup.invalid) {
      this.submitted = true;
      this.templateService.presentToastWithOptions("Please enter required plan details highlighted in red");
      return false;
    }
    if (this.templateService.checkAllArrayEmpty("adding plan") || this.templateService.checkAppointmentEmpty()) {
      return false;
    }
    //created Date**
    // let date = new Date();
    // let date1 = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    // let date1 = new Date().toLocaleString('en-GB', {hour12: true}); //02/08/2019, 2:09:09 pm, without 'en-GB' is 08/02 on my computer
    let date1 = new Date().toLocaleString('en-US');
    let maparr = this.templateService.cleansedArray();
    if(this.planName==='undefined'){
      this.planName=this.templateService.getcgid().planName;
    }
    this.PlanService.addPlanDetails(this.defaultLanguage, date1, this.planName, this.thisgroup.controls.detailname.value.trim(), this.thisgroup.controls.detailnric.value,
      this.thisgroup.controls.detailtcs.value.trim(), this.thisgroup.controls.detailcontact.value, maparr, this.appointment).then(() => {
        this.templateService.resetArray();
      
        //添加刷新！
        this.templateService.language1=null;
        // this.templateService.aa[0]=0;
<<<<<<< HEAD
        // setTimeout(() => {}
        //   location.reload();
        // }, 100);
        
          // this.router.navigateByUrl('/tabs/plans');
          location.replace('#/tabs/plans'); //新跳转方式20191019
          
=======
>>>>>>> a29745e80941e7055c67e963ab6d2964362cf06d
        this.templateService.presentToastWithOptions("Created plan!")
     
      });
     
  }

  newAppt() {
    this.templateService.newAppt();
  }
  checkAppt() {
    return this.templateService.appointment.length > 0
  }

  //template codes 
  globalLanguage = this.templateService.globalLanguage;
  defaultLanguage = 0;
  frontViewData = this.templateService.frontViewData;
  checked = this.templateService.checked;
  android: boolean;
  @ViewChild('input') thisInput;
  ionViewWillEnter() {
    // this.frontViewData = this.templateService.getFrontViewData();
    let obj = this.planService.getExtras("detailextras");
    obj && (this.thisgroup.controls.detailname.setValue(obj.detailname), this.thisgroup.controls.detailnric.setValue(obj.detailnric), this.thisgroup.controls.detailtcs.setValue(obj.detailtcs), this.thisgroup.controls.detailcontact.setValue(obj.detailcontact));
    this.android = this.templateService.checkPlatformAndroid();
    this.planName = this.activatedRoute.snapshot.paramMap.get('planName');
    //++++++++++++++++
    console.log("this.planName");
    //修复修改后数据丢失的问题
    if(this.planName==='undefined'){
      console.log("是空的");
      var aob1=this.templateService.getcgid();
      console.log("接收的对象是:"+aob1);
   
      this.thisgroup.controls.detailname.setValue(aob1.name);
      this.thisgroup.controls.detailnric.setValue(aob1.nric);
      this.thisgroup.controls.detailtcs.setValue(aob1.cname);
      this.thisgroup.controls.detailcontact.setValue(aob1.ccontact);
    
      
    }
    console.log(this.planName);
    this.templateService.settitlea(this.planName);
     //++++++++++++++++
    this.defaultLanguage = +this.activatedRoute.snapshot.paramMap.get("languageID");
    this.lang=this.defaultLanguage
    this.templateService.callEdit(this.lang);
    this.templateService.setGlobalSettings();
    this.thisInput.setFocus();
  }

  goBackToNewPlan() {
    this.PlanService.setExtras("extras", {"language": this.lang, "name": this.planName});
    this.PlanService.setExtras("detailextras", {"detailname": this.thisgroup.controls.detailname.value, "detailnric": this.thisgroup.controls.detailnric.value, "detailtcs": this.thisgroup.controls.detailtcs.value, "detailcontact": this.thisgroup.controls.detailcontact.value});
    // this.templateService.goToViewPageFromEdit();
  }

  getArray(id) {
    return this.templateService.getArray(id);
  }

  checkType(id) {
    return this.templateService.getArray(id).length > 0 ? true : false
  }

  dragAndCheckLongPress(slideItem: IonItemSliding) {
    slideItem.close();
  }

  inputTriggered = false;
  inputFocus = () => this.inputTriggered = true;

  @ViewChild('mylist') mylist: IonList;

  pressEvent(type, thisObject, arrayID, combinedIndex) {
    this.mylist.closeSlidingItems();
    this.apptList.closeSlidingItems();
    !this.android ?
      this.inputTriggered ? this.inputTriggered = false : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
      : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
  }

  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    this.templateService.clickEvent(type, wholeItem, arrayID, combinedIndex);
  }

  clearArray() {
    this.templateService.clearArray();
  }

  deleteArray() {
    this.templateService.deleteArray();
    this.templateService.presentToastWithOptions("Deleted items!");
  }

  //https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  presentActionSheet(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    if(this.templateService.language1==1){
    this.lang='1';
    console.log("this.lang=1");
  }
  if(this.templateService.language1==0){
    this.lang='0';
    console.log("this.lang=0");
  }
    this.templateService.presentActionSheet(symptomOrAction, item, this.lang);
  }

  addNewCriticalArray(type, id) {
    this.templateService.addNewCriticalArray(type, id, this.lang);
  }

  popUp(id) {
    this.templateService.popUp(id, this.lang);
  }

  @ViewChild('apptList') apptList: IonList;
  deleteIOSAppointment(item) {
    this.templateService.deleteIOSAppointment(item);
    this.apptList.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted appointment!");
  }

  deleteIOS(thisItem, arrayID, mainID, combinedID) {
    this.templateService.deleteIOS(thisItem, arrayID, mainID, combinedID);
    this.mylist.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted action!");
  }
  //语言获取锁定
  

}
