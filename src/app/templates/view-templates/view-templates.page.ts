import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-templates',
  templateUrl: './view-templates.page.html',
  styleUrls: ['./view-templates.page.scss'],
})
export class ViewTemplatesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  newTemplate() {
    console.log("clicked new template");
    this.router.navigateByUrl('/tabs/templates/new'); //routing start from root level
  }

}
