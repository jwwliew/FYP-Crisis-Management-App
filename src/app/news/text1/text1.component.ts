import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component'
//import { NewPlanPage } from '../../plans/new-plan/new-plan.page';
import { SymptomActionService } from '../../services/symptomaction.service';
import { TemplateService } from '../../services/template.service';
import { isNgTemplate } from '@angular/compiler';
import { Storage } from '@ionic/storage';
import { load } from '@angular/core/src/render3';
@Component({
  selector: 'app-text1',
  templateUrl: './text1.component.html',
  styleUrls: ['./text1.component.scss'],
})
export class Text1Component implements OnInit {
  public lan:any[1];
  public abb=this.ser.language();
  public defaultLanguage = this.abb;
  public abc: any = []; //选择传递过来的值
  public fzsz: any = []; //复制数组
  public imageText: any = []; //全部后台数据
  public imageTxt: any = [];  //筛选数据
  public ggg:any = []; //text
  public aaa: any = []; //提取abc第一个数据的值
  public image;
  public text;
  public text1:any;
  public xianshi1;
  public newtxt=[]; //用来刷新修改后的数组
  public itee:any=[]; //定义数组item传enname
  public data=[];
  public av=[];
  public itemm={
    description: "",
    actionID:"",
    id:"",
    img: "assets/empty.svg",
    text: "Action",
    type: "Action",
  };
  constructor(public settingstorge: Storage,public ser:TemplateService,public comp: AppComponent, public router: Router, public activatedRoute: ActivatedRoute,public sym:SymptomActionService) { }
  
  ngOnInit() {
    this.settingstorge.get("settingStorageKey1").then(value => {
      console.log(JSON.stringify(value))
      this.data=value;
      console.log(this.data);
    
      // console.log("this.data");
      // console.log(this.data);
    },)
    
    console.log("DATA:=");
    console.log(this.data);

    // this.text1="123112321313";z
    this.fzsz.push(this.comp.globalSettingObj1);
    console.log("复制数组的值！！！");
    console.log(this.fzsz);
    this.geini(this.fzsz);



    console.log("+++++++++++++++++++++");
    console.log(this.imageText);

    console.log("this.text1");
    console.log(this.text1);
    this.text1=this.ser.gettitlea();
    

    
    var self = this
    this.router.routerState.root.queryParams.subscribe(

      params => {
        //console.log(JSON.stringify(params))
        
        console.log(params);
        console.log(params);
        this.abc.push(params);

        //把后台数据全部存入这个数组
        
        console.log("imageTextimageTextimageTextimageText=↓");
        console.log(this.imageText);
        //判断abc数组中的一个值
        console.log("abc0的值是:↓");
        this.abc.forEach(element => {
          // console.log("element的值是:↓");
          // console.log(element);
          // console.log("element.shuju[0]");
          // console.log(element.shuju[0]);
          //以下会提示报错，无关紧要！
          this.aaa = element.shuju[0];

        
          // console.log("aaa");
          // console.log(this.aaa);
       });

      }
    );
    this.xiugai();
    //循环遍历，把值返回筛选数组中
    // this.imageText=this.sym.getxs(this.imageText)

      
      console.log(this.data[0]);
   
      console.log("1231313"+JSON.stringify(this.data));
    
      var timeoutid=setTimeout(() => {
        this.push1();
        this.out1();
      }, 500);
      
      

  
      // setTimeout(() => {
      //   for (let index = 0; index < this.data.length; index++) {
          
      //     if(self.aaa == this.data[index].id){
      //       this.imageTxt.push(this.data[index]);
      //     }

      //   }
      // }, 100);
      // setTimeout(() => {
      //   console.log("3:31分"+this.imageTxt);
      //   this.ggg=this.imageTxt;
      // },200);

     
     
      
      // console.log(element.id);
    
      //     //页面显示语言
      //     if(self.aaa == element.id){
      //     //  if(arrayItem.enName==this.imageText.find(item => item.enName==arrayItem.enName)){
      
      //     console.log("来嘛来嘛");
      //     self.imageTxt.push(element);
      //   }
      //     // }
        
      //   });
     

  
    

  
    // for (let index = 0; index < self.itee.length; index++) {
    //  self.imageTxt[index].chName=self.itee[index].chName;
      
    // }
    
  } 
  push1(){
    for (let index = 0; index < this.data.length; index++) {
          
          if(this.aaa== this.data[index].id){
            this.imageTxt.push(this.data[index]);
          }

        }
  }

  out1(){
    this.ggg=this.imageTxt;
    // this.ggg=this.ser.zhenglishuju(this.ggg,this.ser.fanhuiyuyan());
    console.log("this.ggg="+this.ggg);
    if(this.ser.language1==0){
      this.ggg=null;
      this.ggg=this.imageTxt;
  
    }
    if(this.ser.language1==1){
      this.ggg=null;
      this.ggg=this.imageTxt;
     for (let index = 0; index < this.imageTxt.length; index++) {
     this.ggg[index].enName=this.imageTxt[index].chName;
       
     }
    }
  // for (let index = 0; index < this.ggg.length; index++) {
  //  this.ggg[index].enName=this.ser.returnLanguage(this.ggg[index],1);
    
  // }

  console.log("out1准备完毕！！！");
  }
 xiugai(){
  console.log("修改前的数组");
  // 
  
  //  console.log(this.newtxt);
  //  for (let index = 0; index < this.imageTxt.length; index++) {
  //   // this.imageTxt[index].chName=this.text;
  //   console.log(this.defaultLanguage);
  //   console.log("this.ser.language1");
  //   console.log(this.ser.language1);
  //   this.imageTxt[index].chName=this.ser.returnLanguage(this.imageTxt[index],this.ser.language1);
  //  } 
  //  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  //  console.log(this.imageTxt);
  //  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  //  this.ggg=this.imageTxt;
   
  //  console.log("修改后的数组");
  //  console.log(this.newtxt);
  //  this.imageTxt=this.newtxt; //刷新修改的数组
  //  console.log("整理后的数组数组");
  //  console.log(this.newtxt);
  //  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  //  console.log(this.ggg);
  //  console.log(this.defaultLanguage);
  
 }
 xianshi(item){
    console.log("执行显示函数");

    // this.image=this.imageTxt.icon;
    // this.text=this.imageTxt.enName;
    this.image=this.imageTxt.icon;
    console.log("this.imageTxt");
    console.log(this.imageTxt);

    this.text=this.ser.returnLanguage(item,this.defaultLanguage);
    
    console.log("this.defaultLanguage 成功获取");
    console.log(this.defaultLanguage);
    console.log("this.text");
    console.log(this.text);

 }
geini(geini){
console.log("geini is");
console.log(geini);
}
fanhui(item){
  this.sym.setemm(item);
  this.xianshi(item);
  item.chName=this.text;
  console.log("item.chName");
  console.log(item.chName);
  console.log("传递过来的数据是item");
  console.log(item);
  // console.log("itemm的值是");
  // console.log(this.itemm);
  // console.log("itemm的值是");
  if(item.id<=5){
  this.ser.chuanhui('Symptom', this.itemm, this.defaultLanguage,item);
}
  else{
    this.ser.chuanhui('Action', this.itemm, this.defaultLanguage,item);
  }
  console.log("this.gettitlea");
 
  console.log(this.ser.gettitlea());
  //console.log(this.pdp.planName);
  this.router.navigateByUrl('/tabs/plans/details/0/'+this.text1);

  //this.ser.fanhui(item);
  //跳转回选择页面
 //text1是标题
//  console.log("this.text1=");
//  this.text1=this.np.text1;
//  console.log(this.text1);
 //this.ser.chuanhui('Symptom', item, this.defaultLanguage);
  // presentActionSheet('Symptom', item, globalItem.id);
  //this.router.navigateByUrl('/tabs/plans/details/0/');
}




// presentActionSheet(symptomOrAction, item, defaultLanguage) { //https://ionicframework.com/docs/api/action-sheet
//   symptomOrAction = symptomOrAction == "updateAction" ? "Action" : symptomOrAction
//   if (this.checkSymptomOrActionEmpty(symptomOrAction)) {
//     return false;
//   }
//   let typeToCall = symptomOrAction == 'Symptom' ? this.settingSymptom: this.settingAction;
//   this.popOverController('modal', '', typeToCall, defaultLanguage, symptomOrAction).then(callModal => {
//     callModal.present();
//     callModal.onDidDismiss().then(data => {
//       if (!data.data) return false;
//       if (symptomOrAction == "Symptom") {
//         item.symptom.text = this.returnLanguage(data.data, defaultLanguage);
//         item.symptom.img = data.data.icon;
//         item.symptom.symptomID = data.data.id;
//       }
//       else {
//         item.text = this.returnLanguage(data.data, defaultLanguage);
//         item.img = data.data.icon;
//         item.actionID = data.data.id;
//       }
//     })
//   })
// }

}








  // const actionSheet = await this.actionSheetCtrl.create({
  //   header: "Select a " + symptomOrAction.toLowerCase() + " from below",
  //   cssClass: "wholeActionSheet",
  //   buttons: this.createButtons(item, symptomOrAction, defaultLanguage),
  //   mode: "ios"
  // });
  // await actionSheet.present();

