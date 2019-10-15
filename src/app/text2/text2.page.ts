import { Component, OnInit } from '@angular/core';
import { SymptomActionService } from '../services/symptomaction.service';
import { Router } from '@angular/router';
import { shiftInitState } from '@angular/core/src/view';
import { TemplateService } from '../services/template.service';
import { from } from 'rxjs';
import { Events, IonList, IonItemSliding } from '@ionic/angular';
import { ViewChild } from '@angular/core'
import { setFirstTemplatePass } from '@angular/core/src/render3/state';
@Component({
  selector: 'app-text2',
  templateUrl: './text2.page.html',
  styleUrls: ['./text2.page.scss'],
})
export class Text2Page implements OnInit {
 public globalSettingObj1=[]; //从globalSettingObj1中筛选出来的数据
 public glo=[];
 
  constructor(public sym:SymptomActionService,public router: Router,public templateService:TemplateService,) { }
 public item;//用来接收传输过来的id值
 public selectedTab = "Symptom1";
  
 @ViewChild('mylist')mylist: IonList;
symptomList = [];
actionList = [];
  ngOnInit() {

    this.router.routerState.root.queryParams.subscribe(

      params => {
        //console.log(JSON.stringify(params))
        
      this.item=params.item;
      console.log("接收数据item="+this.item);
      // console.log("item=="+this.item[0]);
      // console.log(params);


        // //把后台数据全部存入这个数组
        // this.imageText.push(this.comp.globalSettingObj1);
        // //判断abc数组中的一个值
        // console.log("abc0的值是:↓");
        // this.abc.forEach(element => {
        //   // console.log("element的值是:↓");
        //   // console.log(element);
        //   // console.log("element.shuju[0]");
        //   // console.log(element.shuju[0]);
        //   //以下会提示报错，无关紧要！
        //   this.aaa = element.shuju[0];
          
          // console.log("aaa");
    //       // console.log(this.aaa);
    //    });

    //   }
    // );
    })
      
      return this.sym.getType("Symptom1").then((items) => {
        for (let index = 0; index < items.length; index++) {
          // this.a.push(items.find(item => item.id == 1).enName);
          if(items[index].id==this.item){
          this.globalSettingObj1.push(items[index]);
         
         }
        
        }
        
        console.log(this.globalSettingObj1);


      // return this.getType(type).then((items: Setting[]) => {
      //   let img = items.find(item => item.id === id).icon;
      //   // //强行调用glo
      //   // return this.getType("glo").then((items1: Setting[]) => {
      //   //   //  let img = this.ser1.image;
      //   //   let img2 = items1.find(item => item.id+100 === id).icon;
      
      //     console.log("img==="+img);
      //   return img;
      })}
      Click1(item){
        console.log("item===1个"+item.id2);
        this.sym.setitem(item.id,item.id2);
        setTimeout(() => {
          console.log("80:item"+item.id2);
          this.selectedTab="Symptom1";
          this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + item.id2); //routing start from root level
        }, 100);
       
      
      }
      Click2(){
        //跳转新建页面
        
          this.router.navigateByUrl('/tabs/settings/symptomAction/edit/'); //routing start from root level
      
      }
      deleteIOS(thisItem) {
        console.log("thisItem========"+thisItem);
        this.templateService.delete(`Are you sure you want to delete this ${this.selectedTab.toLowerCase()}?`).then(() => {
          this.sym.deleteIOS2("Symptom1", thisItem).then(() => {
            this.templateService.presentToastWithOptions(`Deleted ${this.selectedTab.toLowerCase()}!`);
            this.mylist.closeSlidingItems();
            this.loadItems();
          })
          this.sym.xs(thisItem);
        }).catch(() => {});
      }
      // gotoaddpage(){
      //   this.router.navigateByUrl('/tabs/settings/symptomAction/edit/'+this.selectedTab +"/"+"add");
      // }
      loadItems() {
        let allPromise = [this.sym.getType("Symptom1"), this.sym.getType("Symptom1")];
        Promise.all(allPromise).then(finalPromises => {
          this.symptomList = finalPromises[0];
          this.actionList = finalPromises[1];
        })
      }
      goToAddPage(){
        this.sym.setitem(this.item,'');
        setTimeout(() => {
          this.router.navigateByUrl('/tabs/settings/symptomAction/edit/' + this.selectedTab + "/" + "add");
        }, 100);
       
      }
}
