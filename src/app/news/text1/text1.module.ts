import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Text1Component } from './text1.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router'
import { ActivatedRoute } from '@angular/router';
const routes: Routes=[
{
  path: '',
  component:Text1Component
}
];
@NgModule({
  declarations: [Text1Component],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
  
})
export class Text1Module { 

  
}
