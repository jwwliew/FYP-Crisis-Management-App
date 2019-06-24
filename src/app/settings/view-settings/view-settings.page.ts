import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.page.html',
  styleUrls: ['./view-settings.page.scss'],
})
export class ViewSettingsPage implements OnInit {

  constructor(private router: Router, public event:Events) { }

  ngOnInit() {
  }

  onClick() {
    this.router.navigateByUrl('/tabs/settings/symptomAction'); //routing start from root level
  }

}
