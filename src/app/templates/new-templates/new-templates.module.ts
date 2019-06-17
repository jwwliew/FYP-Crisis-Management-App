import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewTemplatesPage } from './new-templates.page';
import { TemplatePopComponent } from '../template-pop/template-pop.component';

const routes: Routes = [
  {
    path: '',
    component: NewTemplatesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [TemplatePopComponent],
  declarations: [NewTemplatesPage, TemplatePopComponent]
})
export class NewTemplatesPageModule {}
