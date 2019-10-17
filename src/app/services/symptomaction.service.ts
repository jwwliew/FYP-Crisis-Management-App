import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Setting, SettingAction } from '../models/symptomaction';
import { TemplateService } from './template.service';
import {v4 as uuid} from 'uuid';
import { Text1Module } from '../news/text1/text1.module';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Action } from 'rxjs/internal/scheduler/Action';
import { error } from '@angular/compiler/src/util';
const STORAGE_KEY = "settingStorageKey";
const ACTION_KEY = "actionKey";
const STORAGE = "glo";
const STORAGE_KEY1 = 'settingStorageKey1'; //定义

@Injectable({
  providedIn: 'root'
})
export class SymptomActionService {
  public it;
  public it2;
  public emmm;
  thisKey: any;
  public xs:any;
  uuid1=uuid();
  constructor(private storage: Storage) { }
//添加++++++++++++++++++++++++++++++++++++++++++↓
  getType(type) {
    if(type == "glo"){
      this.thisKey=STORAGE;
      return this.storage.get(this.thisKey)
    }
    if(type == "Symptom1"){
      this.thisKey=STORAGE_KEY1;
      return this.storage.get(this.thisKey)
    }
//添加++++++++++++++++++++++++++++++++++++++++++↑
    this.thisKey = type == "Symptom" ? STORAGE_KEY : ACTION_KEY 
    console.log("this.thisKey="+this.thisKey);
    return this.storage.get(this.thisKey);
  }
  
  iconArray = ["assets/cough.svg", "assets/ambulance.svg", "assets/medication.svg", "assets/noshortness.svg", "assets/temperature.svg"]

  readImage(icon) {
    return new Promise(resolve => {
      var reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(icon);
    });
  }
  convertToBlob(base64Image) { 
    return fetch(base64Image).then(res => res.blob()) //https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  }

  setemm(item){
    console.log("setemm中item的值="+item)
    this.emmm=item;
  }
  addReusable(type, item) {
    console.log(type);
    console.log("开始判断");
    console.log("this.it="+this.it);
    if(type == "Symptom1"){
     
   
      console.log("Symptom1");
      var settingObj: Setting = {
        id:this.it,
        id2:this.uuid1,
        enName: item.enName,
        chName: item.chName,
        myName: item.myName,
        tmName: item.tmName,
        icon: item.icon
      };
    

  }
  if(type=="glo") {
    console.log("6");
    var settingObj: SettingAction = {
      
      id: this.it,
      id2:this.uuid1,
      enName: item.enName,
      chName: item.chName,
      myName: item.myName,
      tmName: item.tmName,
      icon: item.icon
    }
  }

    if(type=="Action") {
      console.log("5");
      var settingObj: SettingAction = {
        
        id: uuid(),
        id2:uuid(),
        enName: item.enName,
        chName: item.chName,
        myName: item.myName,
        tmName: item.tmName,
        icon: item.icon
      }
    }
    return this.getType(type).then(result => {
      result = result || [];
      result.push(settingObj);
      // result.push()
      return this.storage.set(this.thisKey, result);
    })
  }
  //+++++++++++新增
//   setxs(item){
//   this.xs = item.enName;
//   console.log
//   }
//   getxs(igText){
//         igText.forEach(element => {
//          element.forEach(function (arrayItem) {
//         if(this.xs == arrayItem.enName){
//           arrayItem.id=100;
//         }
 
//   })
// })
// return igText;
// }
    //+++++++++++新增
  clearStorage() {
    this.storage.clear();
  }

  getOneSetting(type, id) {
    return this.getType(type).then((items: Setting[]) => {
      // console.error("items = " + JSON.stringify(items, null, 2));
      return items.find(item => item.id == id) //previously used filter returns array need [0] to access in editSettings page
    })
  }

  //锁定id进行修改数组中的数据
  getOneSetting2(type, id) {
    console.log("getOneSetting2()");
    console.log("id====="+id)
    console.log("type===="+type)
    if(type=="Action"){
    return this.getType(type).then((items: Setting[]) => {
      // console.error("items = " + JSON.stringify(items, null, 2));
      console.log("items.find(item => item.enName == enName)="+items.find(item => item.id2 === id));
      return items.find(item => item.id2 === id)
     
       //previously used filter returns array need [0] to access in editSettings page
    })}
    if(type=="glo"||type=="Symptom1"){ //设置Symptom1和glo
      return this.getType(type).then((items: Setting[]) => {
        // console.error("items = " + JSON.stringify(items, null, 2));
        console.log("items.find(item => item.enName == enName)="+items.find(item => item.id2 === id));
        // this.getType(type).then((items: Setting[]) => {});
        return items.find(item => item.id2 === id)
       
         //previously used filter returns array need [0] to access in editSettings page
      })}

  }
  //选择类别前传递过来的参数1，2，3，4的id和id2
  setitem(item,item2){
    this.it=item;
    this.it2=item2;
    console.log("存进去了it="+this.it);
  }
  updateOneSetting(type, newValues) {
   console.log("updateOneSetting");
   console.log("type="+type);
   if(type=='Action'){
    console.log("updateOneSetting=action");
    return this.getType(type).then((items: Setting[]) => {
      let itemIndex = items.findIndex(item => item.id === newValues.id);
      items[itemIndex] = newValues;
      console.log("this.thisKey============"+this.thisKey);
      return this.storage.set(this.thisKey, items);
    })}
    else{
      console.log("sym");
      return this.getType(type).then((items: Setting[]) => {
        let itemIndex = items.findIndex(item => item.id2 === newValues.id);
        this.xiangbanfa(newValues);
        console.log("newValues.id="+newValues.id);
        items[itemIndex] = newValues;
        console.log("this.thisKey============"+this.thisKey);
        return this.storage.set(this.thisKey, items);
      })
    }

  }
  xiangbanfa(newValues){
   
      console.log("this.it="+this.it);
      newValues.id=this.it;
      newValues.id2=this.it2;
   


  }
  deleteSetting(type, checkedArray) {
    return this.getType(type).then((items: Setting[]) => {
      checkedArray.forEach(element => {
        items.splice(items.findIndex(item => item.id === element.id), 1);
      });
      return this.storage.set(this.thisKey, items);
    })
  }
  
  deleteIOS(type, thisItem) {
    return this.getType(type).then((items: Setting[]) => {
      items.splice(items.findIndex(item => item.id === thisItem.id), 1);
      return this.storage.set(this.thisKey, items);
    })
  }
  deleteIOS2(type, thisItem) {
    return this.getType(type).then((items: Setting[]) => {
      items.splice(items.findIndex(item => item.enName === thisItem.enName), 1);
      return this.storage.set(this.thisKey, items);
    })
  }
isChinese(str){     //判断字符串是否为中文
    if(/^[\u3220-\uFA29]+$/.test(str)){
        return true;
    }else{
        return false;
    }
}
outputObj(obj) { //打印方法
	var description = "";
	for (var i in obj) {
		description += i + " = " + obj[i] + "\n";
	}
	alert(description);
}
  getimg(action,id,enName){  //定义一个调用数据服务
    console.log(id);
    console.log("蝙蝠侠");
    console.log(enName);
    if(action=="Symptom"||action=="Action"){
      return this.getType("glo").then((items: Setting[]) => {
        console.log("闪电侠");
          console.log(items);
          try{
          if(this.isChinese(enName)==true){
            let img = items.find(item => item.id2 == id).icon;
         
            console.log("返回我自定义的img1");
            console.log("img="+img);
           return img
          }
          if(this.isChinese(enName)==false){

          
          
           let img = items.find(item => item.id2 == id).icon;
         
            console.log("返回我自定义的img2");
            console.log("img="+img);
           return img
          } }catch(e){
            console.log("执行catch");
            console.log("enName="+enName);
            console.log("enName="+items);
            let img = items.find(item => item.enName == enName).icon;
         
            console.log("返回我自定义的img1");
            console.log("img="+img);
           return img
          }
       
    })}
  //   if(action=="Action"){
  //     console.log("我走这里ACTION");
      
  //       console.log("im coming!!");
  //       return this.getType("glo").then((items: Setting[]) => {
  //       console.log("Action中的items"+items);;
  //       // this.outputObj(items);
  //         let img2 = items.find(item => item.id2 === id).icon;
  //         console.log("返回我自定义的img2值为="+items);
  //         return img2;
  //       })
      

  //   }
   
   }

  getOneImage(type, id) {
    return this.getType(type).then((items: Setting[]) => {
      let img = items.find(item => item.id === id).icon;
      // //强行调用glo
      // return this.getType("glo").then((items1: Setting[]) => {
      //   //  let img = this.ser1.image;
      //   let img2 = items1.find(item => item.id+100 === id).icon;
    
        console.log("img==="+img);
      return img;
    })
  // })
  }

}
