import { Setting } from '../../models/symptomaction';
import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { SymptomActionService } from 'src/app/services/symptomaction.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TemplateService } from 'src/app/services/template.service';
import {v4 as uuid} from 'uuid';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ObjectUnsubscribedError } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.page.html',
  styleUrls: ['./edit-settings.page.scss'],
})
export class EditSettingsPage implements OnInit {

  editID: string;
  editID2: string;
  selectedTab: string;
  contentDetails: Setting = {} as any; //or put contactDetails?.enName in the html page https://stackoverflow.com/questions/35074365/typescript-interface-default-values, else have error   
  //error typeError: cannot read property 'enName' of undefined, https://stackoverflow.com/questions/47498666/cannot-read-property-of-undefined-angular-4-typescript

  // thisForm = new FormGroup({ //https://angular.io/api/forms/FormControlName#use-with-ngmodel
  //   english: new FormControl('', Validators.required),
  //   chinese: new FormControl('')
  // });
  englishEmpty = false;

  thisForm = this.formBuilder.group({
    english: ['', Validators.compose([Validators.pattern(/(?!\s*$)/), Validators.required])],
    chinese: '',
    malay: '',
    tamil: ''
  })

  constructor(private activatedRoute: ActivatedRoute, private settingService: SymptomActionService, public formBuilder: FormBuilder, private router:Router, 
    private templateService: TemplateService, private camera: Camera) { }

  ngOnInit() {
    this.editID = this.activatedRoute.snapshot.paramMap.get("id");
    // this.editID2 = this.activatedRoute.snapshot.paramMap.get("id2");
    console.log("this.editID="+this.editID);
    
    this.selectedTab = this.activatedRoute.snapshot.paramMap.get("selectedTab");  //Symptom-Symptom
    console.log("this.select="+this.selectedTab);
    if (this.editID == "add") {
      this.contentDetails.enName = "New " + this.selectedTab;
    }
    else {
  
 
      console.log("执行SY");
      console.log("this.editID "+this.editID );
      //同时修改两个对象，glo和Symptom1中的对象属性
      this.settingService.getOneSetting2("glo", this.editID).then((obj) => {
        console.log("obj="+obj);
        
        this.contentDetails = obj;
        this.thisForm.controls['english'].setValue(obj.enName);
        this.thisForm.controls['chinese'].setValue(obj.chName);
        this.thisForm.controls['malay'].setValue(obj.myName);
        this.thisForm.controls['tamil'].setValue(obj.tmName);
      })
      this.settingService.getOneSetting2("Symptom1", this.editID).then((obj) => {
        console.log("obj="+obj);
        this.contentDetails = obj;
        this.thisForm.controls['english'].setValue(obj.enName);
        this.thisForm.controls['chinese'].setValue(obj.chName);
        this.thisForm.controls['malay'].setValue(obj.myName);
        this.thisForm.controls['tamil'].setValue(obj.tmName);
      })
    }}
    // this.thisForm = this.formBuilder.group({
    //   title: new FormControl('', Validators.required)
    // })


  ionViewWillEnter() {
    this.editID == "add" && this.input.setFocus();
  }
  
  @ViewChild('englishInput') input;
  save(value) {
 
      
   
    if (!this.contentDetails.icon && value.english.trim() == "") {
      this.templateService.presentToastWithOptions("Please select an image and enter english name");
      this.englishEmpty = true;
      this.input.setFocus();
      return false;
    }
    else if (!this.contentDetails.icon) { //暂时注释了!
      this.templateService.presentToastWithOptions("Please select an image!");
      return false;
    }
    else if (value.english.trim() == "") {
      this.templateService.presentToastWithOptions("English name is required!");
      this.englishEmpty = true;
      this.input.setFocus();
      return false;
    }

    let newValues: Setting = {
      id: this.editID,
      id2:uuid(),
      enName: value.english.trim(),
      chName: value.chinese.trim(),
      myName: value.malay.trim(),
      tmName: value.tamil.trim(),
      icon: this.contentDetails.icon
    }
    this.editID == "add" ? 

      this.settingService.addReusable(this.selectedTab, newValues).then(() => {
        
        this.templateService.presentToastWithOptions("Added " + this.selectedTab.toLowerCase());
        this.settingService.addReusable("glo", newValues).then(() => {
        
          this.templateService.presentToastWithOptions("Added " + this.selectedTab.toLowerCase());
        this.settingService.uuid1=null;
        this.settingService.uuid1=uuid();   
        this.router.navigate(['/tabs/settings/symptomAction']);
      }) }):
      this.settingService.updateOneSetting(this.selectedTab, newValues).then(() => {
        this.templateService.presentToastWithOptions("Updated " + this.selectedTab.toLowerCase());
        this.router.navigate(['/tabs/settings/symptomAction']);
      }); 
  }

  goBack() {
    this.router.navigate(['/tabs/settings/symptomAction']);
    // this.router.navigateByUrl("/tabs/settings/symptomAction").then(() => {
      // this.thisForm.reset(); //reset clears the form data, which will show the error msg when navigating back to page
      // this.thisForm.markAsPristine();
    // }); //https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
  }

  takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      if (atob(imageData).length > 10485760) { //https://stackoverflow.com/a/47302575 https://stackoverflow.com/a/34166265
        this.templateService.presentToastWithOptions("File size too large!")
      }
      else {
        this.contentDetails.icon = base64Image;  //将图像转换为base64
      }
    }, (err) => {
      // Handle error
    });
  }

  focus(position) {
    let thisItem = this.thisForm.controls[position];
    this.thisForm.controls[position].markAsTouched();
    this.thisForm.controls[position].markAsDirty();
  }
  defocus(position) {
    let thisItem = this.thisForm.controls[position];
    // if (!thisItem.value) { //press away, if no value in input, mark as untouched, show placeholder text, label gone
    //   thisItem.markAsPristine();
    //   console.warn("untouched, no value in", thisItem);
    // }
    if (position == 'english') {
      console.warn("position english mark as pristine", thisItem);
      thisItem.markAsPristine(); //https://stackoverflow.com/questions/40690371/set-form-to-pristine-without-clearing-data
    }
    else {
      console.error("position not english mark as untouched", thisItem);
      this.thisForm.controls[position].markAsUntouched();
    }
    // console.error("defocused markAsUntouched()");
  }

  get(item) {
    return this.thisForm.controls[item];
  }

  checkLength(item) {
    let x = this.thisForm.controls[item]
    return x.value ? true : false
  }
}
