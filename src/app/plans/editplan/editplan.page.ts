import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { SymptomActionService } from 'src/app/services/symptomaction.service';
import { LoadingController, IonList, IonItemSliding } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as  html2canvas from 'html2canvas';
import { computeStackId } from '@ionic/angular/dist/directives/navigation/stack-utils';
import * as jquery from 'jquery';
declare var $: any;
// declare var jquery:any;
@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {

  submitted = false;
  isDisabled: boolean = true;
  details = {} as any;
  backUpPlanDetails = [];
  android: boolean;
  dataUrl;
  constructor(private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService, private settingService: SymptomActionService,
    private router: Router, private file: File, private loadingController: LoadingController, private fileOpener: FileOpener, public formBuilder: FormBuilder) {
  }

  something = this.formBuilder.group({
    detailname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailnric: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailtcs: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailcontact: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/^[0-9]+$/), Validators.required])],
  });

  ngOnInit() { }

  getApptArray() {
    return this.templateService.getApptArray();
  }

  backViewPlan(id) {
    this.isDisabled ? this.templateService.resetArray()
      : (
        this.something.controls.detailname.setValue(this.backUpPlanDetails[0]),
        this.something.controls.detailnric.setValue(this.backUpPlanDetails[1]),
        this.something.controls.detailtcs.setValue(this.backUpPlanDetails[2]),
        this.something.controls.detailcontact.setValue(this.backUpPlanDetails[3]),
        this.templateService.goToViewPageFromEdit(),
        this.router.navigateByUrl('/tabs/plans/editplan/' + id),
        this.isDisabled = true
      )
  }

  ionViewWillEnter() {
    this.android = this.templateService.checkPlatformAndroid();
    let id = this.activatedRoute.snapshot.paramMap.get('item');
    this.templateService.setplanid(id);
    // alert("获取id为:"+id);
    this.templateService.setGlobalSettings();
    this.PlanService.getEditDetails(id).then(everything => {
      [].concat(...everything.templates).forEach(eachArray => {
        // alert(id); 可以获取到
        console.log("eachArray.symptom.id2=" + eachArray.symptom.symptomID);
        this.settingService.getimg("Symptom", eachArray.symptom.symptomID, eachArray.symptom.text).then(oneImg => {
          console.log("oneimg=" + oneImg);
          eachArray.symptom.img = oneImg;
        });
        eachArray.combined.forEach(oneCombined => {
          this.settingService.getimg("Action", oneCombined.actionID, oneCombined.text).then(actionImg => {
            oneCombined.img = actionImg;
          })
        })
      });
      let obj = {
        template: [].concat(...everything.templates)
      }
      this.templateService.filterArray(obj);
      this.details = everything;
      this.defaultLanguage = everything.language;
      this.templateService.appointment = everything.appointment;
      this.something.controls['detailname'].setValue(this.details.name);
      this.something.controls.detailnric.setValue(this.details.nric);
      this.something.controls.detailtcs.setValue(this.details.cname);
      this.something.controls.detailcontact.setValue(this.details.ccontact);
    });
  }

  frontViewData = this.templateService.frontViewData;
  checked = this.templateService.checked;
  defaultLanguage = 0;

  getArray(id) {
    return this.templateService.getArray(id);
  }
  checkType(id) {
    return this.templateService.getArray(id).length > 0 ? true : false
  }

  inputTriggered = false;
  inputFocus = () => this.inputTriggered = true;
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

  presentActionSheet(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    this.templateService.presentActionSheet(symptomOrAction, item, this.defaultLanguage);
  }
  addNewCriticalArray(type, id) {
    this.templateService.addNewCriticalArray(type, id, this.defaultLanguage);
  }
  popUp(id) {
    this.templateService.popUp(id, this.defaultLanguage);
  }
  clearArray() {
    this.templateService.clearArray();
    // this.router.navigateByUrl("/tabs/plans/editplan/" + this.details.id);
  }
  deleteArray() {
    this.templateService.deleteArray();
    this.templateService.presentToastWithOptions("Deleted items!");
  }

  popOverController(x) {
    let menuOptions = ["Edit", "Rename", "Export to PDF"];
    this.templateService.popOverController('popover', x, menuOptions).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
        data.data && this.callAction(data.data);
      });
    })
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var call = {
      'Edit': () => this.callEdit(),
      'Rename': () => this.askForName(),
      'Export to PDF': () => this.exportToPDF()
    };
    call[type]();
  }

  public loading: any;
  async presentLoading(msg) {
    this.loading = await this.loadingController.create({
      message: msg
    });
    return await this.loading.present();
  }


  exportToPDF() {
    //获取点击id为：

    var planid = this.templateService.getplanid();
    // alert(planid);
    var aaa1; var aaa2; var aaa3;
    //各个容器的长度
    this.PlanService.getEditDetails(planid).then(everything => {
      aaa1 = [].concat(...everything.templates[0]).length;
      aaa2 = [].concat(...everything.templates[1]).length;
      aaa3 = [].concat(...everything.templates[2]).length;
      // alert(aaa1);
      // alert(aaa2);
      // alert(aaa3);
    })
    setTimeout(() => {
      //赋值后找到的长度，因有计算，所以单独延时加载

      if (aaa1 == 3 || aaa1 == 2 || aaa1 == 1) {

        var html = document.querySelector("#Html2PDF > ion-card:nth-child(2)").innerHTML;
        document.querySelector("#Html2PDF > ion-card:nth-child(2)").innerHTML = html + '<div id="cod516"></div>';

      }
    }, 300);
    setTimeout(() => {
      //赋值后找到的长度，因有计算，所以单独延时加载

      if (aaa2 == 3 || aaa2 == 2 || aaa2 == 1) {

        var html = document.querySelector("#Html2PDF > ion-card:nth-child(3)").innerHTML;
        document.querySelector("#Html2PDF > ion-card:nth-child(3)").innerHTML = html + '<div id="cod517"></div>';

      }
    }, 300);
    setTimeout(() => {
      //赋值后找到的长度，因有计算，所以单独延时加载

      if (aaa3 == 3 || aaa3 == 2 || aaa3 == 1) {

        var html = document.querySelector("#Html2PDF > ion-card:nth-child(4)").innerHTML;
        document.querySelector("#Html2PDF > ion-card:nth-child(4)").innerHTML = html + '<div id="cod518"></div>';

      }
    }, 300);
    setTimeout(() => {
      // alert("3:"+aaa1);
      // this.presentLoading('Creating PDF file...');
      const directory = this.file.externalRootDirectory;
      console.log("directory的值=" + directory); //directory=null
      // ****获取id = html2PDF dom对象
      const div = document.getElementById('Html2PDF');
      console.log("my")
      console.log("div的值=" + div); //div的值=[object HTMLDivElement]
      let width = div.clientWidth * 3;
      console.log("width的值=" + width); //width的值=1374
      // ****一页pdf显示html页面生成的canvas高度;
      var pageHeight = div.scrollWidth / 592.28 * 841.89;
      console.log("pageHeight的值=" + pageHeight); //pageHeight的值=651.0191463496994
      // ****未生成pdf的html页面高度
      var leftHeight = div.scrollHeight;
      console.log("leftHeight的值=" + leftHeight);//leftHeight的值=1522 整个数据的宽度、包括不可见的
      let height = div.clientHeight * 3;
      console.log("height的值=" + height); //height的值=4242
      let millimeters = { width, height };

      var position = 0;
      millimeters.width = Math.floor(width * 0.264583); //返回最大整数四舍五入
      millimeters.height = Math.floor(height * 0.264583);//返回最大整数四舍五入
      // ****a4纸的尺寸
      let imgWidth = 595.28;
      let imgHeight = 592.28 / div.scrollWidth * div.scrollHeight
      // imgHeight-=200;压缩或者扩张
      console.log("imgHeight的值=" + imgHeight); //imgHeight的值=1968.231790393013
      let scale = 2; //https://github.com/tsayen/dom-to-image/issues/69
      domtoimage.toPng(div, {
        height: div.offsetHeight * 2, width: div.offsetWidth * 1.95, style:
          { transform: `scale(${scale}) translate(${div.offsetWidth / 2.1 / scale}px, ${div.offsetHeight / 2 / scale}px)` }
      }).then(dataUrl => {

        // const doc = new jsPDF('p', 'mm', 'a4', true);
        //创建 jsppdf
        const doc = new jsPDF('', 'pt', 'a4')
        console.log(dataUrl);
        console.log(imgWidth + '    ' + imgHeight)
        console.log(leftHeight + '    ' + pageHeight)
        // 判断 是否要分页
        if (leftHeight < pageHeight) {
          //doc.deletePage(1); //https://stackoverflow.com/questions/29578721/image-in-pdf-cut-off-how-to-make-a-canvas-fit-entirely-in-a-pdf-page/42295522#42295522
          //doc.addPage(millimeters.width * 2, millimeters.height * 1.95);
          doc.addImage(dataUrl, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST');
          // doc.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

        } else {
          var cod = document.getElementById("cod516");
          var cod2 = document.getElementById("cod517");
          var cod3 = document.getElementById("cod518");
          // alert("cod="+cod.offsetTop/div.scrollWidth * div.scrollHeight)//338
          try {
            var codheight = cod.offsetTop / div.scrollWidth * div.scrollHeight;
          } catch (e) { }
          try {
            var codheight2 = cod2.offsetTop / div.scrollWidth * div.scrollHeight;
          } catch (e) { }
          try {
            var codheight3 = cod3.offsetTop / div.scrollWidth * div.scrollHeight;
          } catch (e) { }
          // alert(aaa1 + '-' + aaa2 + '-' + aaa3);
         
          if (aaa1 == 3 && aaa2 == 3 && aaa3 == 3) { //1:2 2:0 3:2


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 760)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 3 && aaa2 == 3 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 620)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 3 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 720)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 3 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 830)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 3 && aaa2 == 2 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 860)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 2 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 830)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 2 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight + 830)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 2 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+810)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 1 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+810)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 1 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+810)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 1 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+810)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 1 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+770)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 3 && aaa2 == 0 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+500)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 0 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+500)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 0 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+500)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 3 && aaa2 == 0 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+500)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 3 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+620)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 3 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+620)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 3 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+600)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 3 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight+670)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 2 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 1020)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 2 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 950)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 2 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 875)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 2 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 1 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 780)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 1 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 890)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 == 2 && aaa2 == 1 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 1 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 865)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 0 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 0 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 2 && aaa2 == 0 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 0 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 2 && aaa2 == 0 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 3 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight2;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 1 && aaa2 == 3 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight2;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 3 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 790)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight2;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 3 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 880)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight2;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 2 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 2 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 860)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 2 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight2;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 2 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 1 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 860)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          } if (aaa1 == 1 && aaa2 == 1 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          } 
          if (aaa1 == 1 && aaa2 == 1 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 835)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 1 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 1 && aaa2 == 0 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 800)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 0 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth,codheight + 860)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 1 && aaa2 == 0 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 1 && aaa2 == 0 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 == 0 && aaa2 == 3&& aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight3+60)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }




          if (aaa1 == 0 && aaa2 == 3 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight3+500)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 == 0 && aaa2 == 3 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, codheight3+500)//406.4x665.84 相差85 285    -50-20-20=web

              leftHeight -= codheight3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 == 0 && aaa2 == 3 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 0 && aaa2 == 2 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 0 && aaa2 == 2 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }


          if (aaa1 == 0 && aaa2 == 2 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 == 0 && aaa2 ==2 && aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }


          if (aaa1 == 0 && aaa2 == 1 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 == 0 && aaa2 == 1 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }


          if (aaa1 == 0 && aaa2 == 1 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 0 && aaa2 == 1&& aaa3 == 0) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 0 && aaa2 == 0 && aaa3 == 3) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }

          if (aaa1 == 0 && aaa2 == 0 && aaa3 == 2) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }
          if (aaa1 == 0 && aaa2 == 0 && aaa3 == 1) {


            while (leftHeight > 0) {

              doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')

              leftHeight -= pageHeight*3;
              position -= 841.89;
              if (leftHeight > 0) {
                doc.addPage();
              }

            }
            doc.save('pdfDocument.pdf');
          }



          if (aaa1 >=4|| aaa2 >=4 || aaa3 >=4) {

            while(leftHeight > 0) {


                          //  doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')
                          doc.addImage(dataUrl, 'PNG', 0, position,imgWidth,imgHeight)
                          position -= 841.89;
                          // if(position<=-800&&position>=-1600){
                          //   imgHeight+=;
                          // }
                           leftHeight -= pageHeight;
                          //  position -= 841.89;
                           console.log(leftHeight+'    '+pageHeight)
                           //避免添加空白页
                           if(leftHeight > 0) {
                            doc.addPage();
                            // doc.print();
                  // doc.print();
              }

            }
            doc.save('pdfDocument.pdf');
          }


        }

        //for website

        let pdfOutput = doc.output();
        // using ArrayBuffer will allow you to put image inside PDF
        // 使用ArrayBuffer将允许您将图像放入PDF
        let buffer = new ArrayBuffer(pdfOutput.length);
        let array = new Uint8Array(buffer);
        for (var i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i);
        }
        console.log(buffer);
        // Name of pdf
        const fileName = "CrisisPlan.pdf";
        //Writing File to Device  将文件写入设备
        this.file.writeFile(directory, fileName, buffer, { replace: true }).then(success => { //https://ourcodeworld.com/articles/read/38/how-to-capture-an-image-from-a-dom-element-with-javascript
          console.log("文件已写入");
          this.loading.dismiss();
          this.templateService.presentToastWithOptions("PDF file has been created!");
          this.fileOpener.open(success.nativeURL, "application/pdf").catch(() => this.templateService.presentToastWithOptions("Please install a PDF Viewer such as Acrobat!"));
        }).catch((error) => this.templateService.presentToastWithOptions("An error has occured!!!"));
      })
    }, 1000);

    // // this.presentLoading('Creating PDF file...');
    // const directory = this.file.externalRootDirectory;
    // console.log("directory的值="+directory); //directory=null
    // // ****获取id = html2PDF dom对象
    // const div = document.getElementById('Html2PDF');
    // console.log("my")
    // console.log("div的值="+div); //div的值=[object HTMLDivElement]
    // let width = div.clientWidth * 3;
    // console.log("width的值="+width); //width的值=1374
    //  // ****一页pdf显示html页面生成的canvas高度;
    //  var pageHeight = div.scrollWidth / 592.28 * 841.89; 
    //  console.log("pageHeight的值="+pageHeight); //pageHeight的值=651.0191463496994
    //  // ****未生成pdf的html页面高度
    //  var leftHeight = div.scrollHeight; 
    //  console.log("leftHeight的值="+leftHeight);//leftHeight的值=1522 整个数据的宽度、包括不可见的
    // let height = div.clientHeight * 3;
    // console.log("height的值="+height); //height的值=4242
    // let millimeters = { width, height };

    // var position = 0;
    // millimeters.width = Math.floor(width * 0.264583); //返回最大整数四舍五入
    // millimeters.height = Math.floor(height * 0.264583);//返回最大整数四舍五入
    // // ****a4纸的尺寸
    // let imgWidth = 595.28;
    // let imgHeight = 592.28/div.scrollWidth * div.scrollHeight
    // // imgHeight-=200;压缩或者扩张
    // console.log("imgHeight的值="+imgHeight); //imgHeight的值=1968.231790393013
    // let scale = 2; //https://github.com/tsayen/dom-to-image/issues/69
    // domtoimage.toPng(div, { 
    //   height: div.offsetHeight * 2, width: div.offsetWidth * 1.95, style: 
    //   { transform: `scale(${scale}) translate(${div.offsetWidth / 2.1 / scale}px, ${div.offsetHeight / 2 / scale}px)` } }).then(dataUrl => {

    //   // const doc = new jsPDF('p', 'mm', 'a4', true);
    //   //创建 jsppdf
    //   const doc = new jsPDF('', 'pt','a4')
    //   console.log(dataUrl);
    //   console.log(imgWidth+'    '+imgHeight)
    //   console.log(leftHeight+'    '+pageHeight)
    //   // 判断 是否要分页
    //   if(leftHeight < pageHeight) {
    //   //doc.deletePage(1); //https://stackoverflow.com/questions/29578721/image-in-pdf-cut-off-how-to-make-a-canvas-fit-entirely-in-a-pdf-page/42295522#42295522
    //   //doc.addPage(millimeters.width * 2, millimeters.height * 1.95);
    //   doc.addImage(dataUrl, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST');
    //   // doc.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

    //   }else {
    //          while(leftHeight > 0) {


    //             //  doc.addImage(dataUrl, 'PNG', 0, position,doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST')
    //             doc.addImage(dataUrl, 'PNG', 0, position,imgWidth,imgHeight)
    //             position -= 841.89;
    //             // if(position<=-800&&position>=-1600){
    //             //   imgHeight+=;
    //             // }
    //              leftHeight -= pageHeight;
    //             //  position -= 841.89;
    //              console.log(leftHeight+'    '+pageHeight)
    //              //避免添加空白页
    //              if(leftHeight > 0) {
    //               doc.addPage();
    //               // doc.print();
    //              }
    //          }
    //      }

    //    doc.save('pdfDocument.pdf'); //for website

    //   let pdfOutput = doc.output();
    //   // using ArrayBuffer will allow you to put image inside PDF
    //   // 使用ArrayBuffer将允许您将图像放入PDF
    //   let buffer = new ArrayBuffer(pdfOutput.length);
    //   let array = new Uint8Array(buffer);
    //   for (var i = 0; i < pdfOutput.length; i++) {
    //     array[i] = pdfOutput.charCodeAt(i);
    //   }
    //   console.log(buffer);
    //   // Name of pdf
    //   const fileName = "CrisisPlan.pdf";
    //   //Writing File to Device  将文件写入设备
    //   this.file.writeFile(directory, fileName, buffer, { replace: true }).then(success => { //https://ourcodeworld.com/articles/read/38/how-to-capture-an-image-from-a-dom-element-with-javascript
    //     console.log("文件已写入");
    //     this.loading.dismiss();
    //     this.templateService.presentToastWithOptions("PDF file has been created!");
    //    this.fileOpener.open(success.nativeURL, "application/pdf").catch(() => this.templateService.presentToastWithOptions("Please install a PDF Viewer such as Acrobat!"));
    //   }).catch((error) => this.templateService.presentToastWithOptions("An error has occured!!!"));
    // })
  }



  callEdit() {
    this.backUpPlanDetails = [this.details.name, this.details.nric, this.details.cname, this.details.ccontact];
    console.log("id callEdit =" + this.details.id);
    console.log("this.details=" + this.details);
    setTimeout(() => {
      this.templateService.setcgid(this.details);
    }, 300);

    console.log("1");
    this.isDisabled = false;
    // alert(this.details.id);
    var shuu;
    this.PlanService.getEditDetails(this.details.id).then(everything => {
      [].concat(...everything.templates).forEach(eachArray => {
        shuu=eachArray.symptom.text;
        
      }
        )})
        setTimeout(() => {
          // alert(shuu);
         var cf = this.templateService.pdzwyw(shuu); //判断是否为中文
        //  alert(cf);
        this.defaultLanguage=cf;
        this.templateService.callEdit(this.defaultLanguage);
        }, 300);
       
    
    console.log("3");
  }

  savePage(id, formValue) {
    let arrayForm = [this.something.controls.detailcontact, this.something.controls.detailname, this.something.controls.detailtcs, this.something.controls.detailnric];
    !this.submitted && arrayForm.forEach(element => {
      if (element.invalid) {
        element.setValue(element.value);
        element.markAsTouched(); // and touch so the red color underline ion-input will be shown
      }
    });
    if (this.something.invalid) {
      this.submitted = true;
      this.templateService.presentToastWithOptions("Please enter required plan details highlighted in red");
      return false;
    }
    if (this.templateService.checkAllArrayEmpty("updating plan") || this.templateService.checkAppointmentEmpty()) {
      return false;
    }
    this.details.name = formValue.detailname.trim();
    this.details.nric = formValue.detailnric;
    this.details.cname = formValue.detailtcs.trim();
    this.details.ccontact = formValue.detailcontact;

    this.PlanService.editPlan(id, this.details).then(allPlan => {
      this.templateService.editPageUpdateArray(allPlan, id);
      this.templateService.presentToastWithOptions("Updated plan!");
      this.something.controls.detailname.setValue(this.details.name); //set again trim() value in case there is white space
      this.something.controls.detailtcs.setValue(this.details.cname);
      this.isDisabled = true;
    })
  }

  askForName() {
    this.templateService.alertInput("Enter new name").then((alertData: string) => {
      this.PlanService.renamePlan(this.details.id, alertData).then(() => {
        this.details.planName = alertData;
        this.templateService.presentToastWithOptions("Renamed plan!");
      })
    }).catch(() => { })
  }

  dateChanged(my, appObj) {
    // let time = new Date(my).toLocaleString('en-GB'); //'en-GB' will crash as the system keeps returning 02/08 and 08/02 at same time when logged
    let time = new Date(my).toLocaleString('en-US');
    appObj.appTime = time;
  }

  newAppt() {
    this.templateService.newAppt();
  }

  checkAppt() {
    return this.templateService.appointment.length > 0
  }

  @ViewChild('mylist') mylist: IonList;
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

  dragAndCheckLongPress(slideItem: IonItemSliding) {
    slideItem.close();
  }

}
