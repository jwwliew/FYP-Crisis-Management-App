import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImportConflictPopoverPage } from './import-conflict-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ImportConflictPopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ImportConflictPopoverPage]
})
export class ImportConflictPopoverPageModule {}
