import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TemplateService } from './../services/template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { v4 as uuid } from 'uuid';
import { isNgTemplate } from '@angular/compiler';
@Component({
  selector: 'app-text3',
  templateUrl: './text3.page.html',
  styleUrls: ['./text3.page.scss'],
})
export class Text3Page implements OnInit {
  constructor(public router: Router, public activeRoute: ActivatedRoute, public ser: TemplateService, private PlanService: PlanService, private storage: Storage) { }
  public number = 0;
  public shujuid;
  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe(

      params => {

        this.shujuid = params.shuju;
      })

  }
  insert1(value) {
    this.number = value;
  }
  determine() {
    // console.log(this.number);//拿选中的数据
    // console.log("this.number="+this.number);
    this.ser.setdanxuankuangzhi(this.number);
    // this.ser.setlanguage(this.number);
    var templates, templates2;
    // console.log(this.ser.language1);
    // this.ser.setGlobalSettings();
    this.PlanService.getEditDetails(this.shujuid).then(everything => {
      //  templates=[].concat(...everything.templates)[0]
      templates = [].concat(...everything.templates)[0];
      templates2 = everything
    })
    setTimeout(() => {
      // console.log(JSON.stringify(templates));
      // console.log(JSON.stringify([].concat(...templates2.templates)[0]));
      // console.log(templates2.templates[0][0].symptom.text);
      // console.log(templates2.id);
      templates2.id = uuid();
      // console.log(templates2.id);
      // templates2.templates[0][0]
      // console.table("templates="+templates);
      // templates2.templates[0][0].symptom.description="777777777777777777777777";
      var chNamenew = null;
      var id1 = null;
      var id2 = null;
      // console.log(templates);
      // console.log(templates2.templates.length);
      // console.log(templates2.templates[0].length);
      // console.log(templates2.templates[1].length);
      // console.log(templates2.templates[2].length);
      setTimeout(() => {
      
        console.log(JSON.stringify(templates2.templates.length));
       
        // console.log(JSON.stringify( templates2.templates[3][0].length));
        // console.log(JSON.stringify(templates2.templates[0][0].combined.length));
        // console.log(JSON.stringify(templates2.templates[0][0].combined[0]));
        // templates2.templates[0][0].combined[0].text="12313231";
        // console.log(JSON.stringify( templates2.templates[0][0].combined[0]));

        if (this.ser.getdanxuankuangzhi() == 3) { //tmName Tamil 
          //symtom替换
          var englshname;
          for (let index1 = 0; index1 < templates2.templates.length; index1++) {
            for (let index2 = 0; index2 < templates2.templates[index1].length; index2++) {

              //  console.log(id1);
              // alert("id1="+id1);

              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id1 = templates2.templates[index1][index2].symptom.symptomID;
                  if (element.id2 == id1) {
                    englshname=element.enName;
                    chNamenew = element.tmName;
                    console.log(id1);
                    console.log(element.chName);
                    console.log(element.id2);

                  }

                })

                templates2.templates[index1][index2].symptom.text = englshname + '\r\t\n' + chNamenew;
                chNamenew = null;
                result = null
                englshname = null;
                // console.log(result);
              }
              )
            }

          }
          //Action替换
          var chNamenew2=null;
          for (let index3 = 0; index3 < templates2.templates.length; index3++) {
            for (let index4 = 0; index4 < templates2.templates[index3].length; index4++) {
              for (let index5 = 0; index5 < templates2.templates[index3][index4].combined.length; index5++) {
                // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id2 = [].concat(...templates2.templates[index3])[index4].combined[index5].actionID;

                  if (element.id2 == id2) {
                    englshname = element.enName;
                    chNamenew2 = element.tmName;
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    console.log(id2);
                    console.log(element.chName);
                    console.log(element.id2);
                  }
                
                })
                templates2.templates[index3][index4].combined[index5].text= englshname + '\r\t\n' + chNamenew2;
                chNamenew2 = null;
                result = null
              }
            
              )

              }
          }
        }

          
          this.PlanService.addNewPlan(templates2);
        }
        if (this.ser.getdanxuankuangzhi() == 2) { //myName Malay
          //symtom替换
         
          for (let index1 = 0; index1 < templates2.templates.length; index1++) {
            for (let index2 = 0; index2 < templates2.templates[index1].length; index2++) {

              //  console.log(id1);
              // alert("id1="+id1);

              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id1 = templates2.templates[index1][index2].symptom.symptomID;
                  if (element.id2 == id1) {
                    englshname = element.enName;
                    chNamenew = element.myName;
                    console.log(id1);
                    console.log(element.chName);
                    console.log(element.id2);

                  }

                })

                templates2.templates[index1][index2].symptom.text = englshname + '\r\t\n' + chNamenew;
                chNamenew = null;
                result = null;
                englshname=null;
                // console.log(result);
              }
              )
            }

          }
          //Action替换
          var chNamenew2=null;
          for (let index3 = 0; index3 < templates2.templates.length; index3++) {
            for (let index4 = 0; index4 < templates2.templates[index3].length; index4++) {
              for (let index5 = 0; index5 < templates2.templates[index3][index4].combined.length; index5++) {
                // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id2 = [].concat(...templates2.templates[index3])[index4].combined[index5].actionID;

                  if (element.id2 == id2) {
                    englshname=element.enName;
                    chNamenew2 = element.myName;
                    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    // console.log(id2);
                    // console.log(element.chName);
                    // console.log(element.id2);
                  }
                
                })
                templates2.templates[index3][index4].combined[index5].text= englshname+ '\r\t\n' +chNamenew2;
                chNamenew2 = null;
                result = null
                englshname=null;
              }
            
              )

              }
          }
        }

          
          this.PlanService.addNewPlan(templates2);
        }
        if (this.ser.getdanxuankuangzhi() == 1) {
          //symtom替换
          for (let index1 = 0; index1 < templates2.templates.length; index1++) {
            for (let index2 = 0; index2 < templates2.templates[index1].length; index2++) {

              //  console.log(id1);
              // alert("id1="+id1);

              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id1 = templates2.templates[index1][index2].symptom.symptomID;
                  if (element.id2 == id1) {
                    englshname = element.enName;
                    chNamenew = element.chName;
                    console.log(id1);
                    console.log(element.chName);
                    console.log(element.id2);

                  }

                })
                
                templates2.templates[index1][index2].symptom.text = englshname+ '\r\t\n' + chNamenew;
                
                chNamenew = null;
                result = null
                englshname = null;
                // console.log(result);
              }
              )
            }

          }
          //Action替换
          var chNamenew2=null;
          for (let index3 = 0; index3 < templates2.templates.length; index3++) {
            for (let index4 = 0; index4 < templates2.templates[index3].length; index4++) {
              for (let index5 = 0; index5 < templates2.templates[index3][index4].combined.length; index5++) {
                // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id2 = [].concat(...templates2.templates[index3])[index4].combined[index5].actionID;

                  if (element.id2 == id2) {
                    englshname = element.enName;
                    chNamenew2 = element.chName;
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    console.log(id2);
                    console.log(element.chName);
                    console.log(element.id2);
                  }
                
                })
                templates2.templates[index3][index4].combined[index5].text= englshname+ '\r\t\n' +chNamenew2;
                chNamenew2 = null;
                result = null;
                englshname=null;
              }
            
              )

              }
          }
        }

          
          this.PlanService.addNewPlan(templates2);
        }

        if (this.ser.getdanxuankuangzhi() == 0) {  //等于0是英文，所以什么都不加，只显示英文
          for (let index1 = 0; index1 < templates2.templates.length; index1++) {
            for (let index2 = 0; index2 < templates2.templates[index1].length; index2++) {

              //  console.log(id1);
              // alert("id1="+id1);

              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id1 = templates2.templates[index1][index2].symptom.symptomID;
                  if (element.id2 == id1) {

                    chNamenew = element.enName;
                    // console.log(id1);
                    // console.log(element.chName);
                    // console.log(element.id2);

                  }

                });

                templates2.templates[index1][index2].symptom.text = chNamenew + '\r\n';
                chNamenew = null;
                result = null
                // console.log(result);
              }
              )
            }

          }

          var chNamenew2=null;
          for (let index3 = 0; index3 < templates2.templates.length; index3++) {
            for (let index4 = 0; index4 < templates2.templates[index3].length; index4++) {
              for (let index5 = 0; index5 < templates2.templates[index3][index4].combined.length; index5++) {
                // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
              this.storage.get("glo").then(result => {
                result.forEach(element => {
                  id2 = [].concat(...templates2.templates[index3])[index4].combined[index5].actionID;

                  if (element.id2 == id2) {

                    chNamenew2 = element.enName;
                    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    // console.log(id2);
                    // console.log(element.chName);
                    // console.log(element.id2);
                  }
                
                })
                templates2.templates[index3][index4].combined[index5].text= chNamenew2 + '\r\n' ;
                chNamenew2 = null;
                result = null
              }
            
              )

              }
          }
        }

          this.PlanService.addNewPlan(templates2);
        }

      }


        , 200);

      // var id1=templates2.templates[0][0].symptom.symptomID

      // console.log("id1="+id1);
      //   this.storage.get("glo").then(result => {

      //     chNamenew=result.find(item => item.id2 == id1).chName




      //     console.log("result.chName=");
      //     templates2.templates[0][0].symptom.text=chNamenew+templates2.templates[0][0].symptom.text;
      //    }


      // templates2.templates[0][0].symptom.text="777777777777777777777777";
      // )
      // console.log(JSON.stringify([].concat(...templates2.templates)[0]));

      // this.PlanService.addNewPlan(templates2);

      // this.PlanService.editPlan(id, this.details).then(allPlan => {
      // this.templateService.editPageUpdateArray(allPlan, id);
      //  this.PlanService.addNewPlan(templates2).then(allPlan => {

      this.ser.presentToastWithOptions("Updated plan!");




    }, 300);
    var tiaozhuanid;
    setTimeout(() => {
     
      this.storage.get("plan").then(abc=>{
        tiaozhuanid=abc[0].id
      })   
    }, 1000);
    this.router.navigateByUrl('/tabs/plans');
      // this.router.navigateByUrl('/tabs/plans/editplan/' + this.shujuid);
      setTimeout(() => {
        
   
        this.router.navigateByUrl('/tabs/plans/editplan/' + tiaozhuanid);
      }, 1200);
      
 


  }


}


