import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.page.html',
  styleUrls: ['./view-settings.page.scss'],
})
export class ViewSettingsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClick() {
    this.router.navigateByUrl('/tabs/templates'); //routingstart from root level
    console.log("clicked on symp")
  }
}
