import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { getName } from 'ionicons/dist/types/icon/utils';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService) { }
  details: any;

  ngOnInit() {
    
  }

   ionViewWillEnter(){
    let id = this.activatedRoute.snapshot.paramMap.get('item');
    console.log(id)
    this.PlanService.getEditDetails (id).then(everything=>{
      this.details=everything;
      console.log(everything)
    })
  
   }

  }




