import { Setting } from '../../models/symptomaction';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { SymptomActionService } from 'src/app/services/symptomaction.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TemplateService } from 'src/app/services/template.service';

import {v4 as uuid} from 'uuid';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.page.html',
  styleUrls: ['./edit-settings.page.scss'],
})
export class EditSettingsPage implements OnInit {

  editID: string;
  selectedTab: string;
  contentDetails: Setting = {} as any; //or put contactDetails?.enName in the html page https://stackoverflow.com/questions/35074365/typescript-interface-default-values, else have error   
  //error typeError: cannot read property 'enName' of undefined, https://stackoverflow.com/questions/47498666/cannot-read-property-of-undefined-angular-4-typescript

  // thisForm = new FormGroup({ //https://angular.io/api/forms/FormControlName#use-with-ngmodel
  //   english: new FormControl('', Validators.required),
  //   chinese: new FormControl('')
  // });
  englishEmpty = false;

  thisForm = this.formBuilder.group({
    english: ['', Validators.required],
    chinese: '',
    malay: '',
    tamil: ''
  })

  constructor(private activatedRoute: ActivatedRoute, private settingService: SymptomActionService, public formBuilder: FormBuilder, private router:Router, 
    private templateService: TemplateService, private camera: Camera) { }

  ngOnInit() {
    this.editID = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("hello this page params = " + this.editID);
    this.selectedTab = this.activatedRoute.snapshot.paramMap.get("selectedTab");  
    console.log("this selected tab = " + this.selectedTab);
    if (this.editID == "add") {
      this.contentDetails.enName = "New " + this.selectedTab;
    }
    else {
      this.settingService.getOneSetting(this.selectedTab, this.editID).then((obj) => {
        this.contentDetails = obj;
        this.thisForm.controls['english'].setValue(obj.enName);
        this.thisForm.controls['chinese'].setValue(obj.chName);
        this.thisForm.controls['malay'].setValue(obj.myName);
        this.thisForm.controls['tamil'].setValue(obj.tmName);
      })
    }
    // this.thisForm = this.formBuilder.group({
    //   title: new FormControl('', Validators.required)
    // })
  }

  save(value) {
    console.log("clicked save " + JSON.stringify(value));
    if (value.english == "") {
      this.templateService.presentToastWithOptions("English name is required!");
      this.englishEmpty = true;
      return false;
    }
    console.error("content detail obj before saving = " + JSON.stringify(this.contentDetails, null, 2));
    let newValues: Setting = {
      id: this.editID,
      enName: value.english,
      chName: value.chinese,
      myName: value.malay,
      tmName: value.tamil,
      icon: this.contentDetails.icon || "assets/empty.svg"
    }
    let functionToCall = this.editID == "add" ? this.settingService.addReusable(this.selectedTab, newValues) : this.settingService.updateOneSetting(this.selectedTab, newValues)
    functionToCall.then(() => {
      this.goBack();
    })
  }

  goBack() {
    //this.router.navigate(['/tabs/settings/symptomAction'])
    this.router.navigateByUrl("/tabs/settings/symptomAction"); //https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
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
      // console.error("application storage directory " + this.file.)
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.contentDetails.icon = base64Image;
    }, (err) => {
      // Handle error
    });
  }


}
