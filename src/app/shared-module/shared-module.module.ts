import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonItemDirective } from './ion-item.directive';

@NgModule({
  declarations: [IonItemDirective],
  exports: [IonItemDirective],
  imports: [
    CommonModule
  ]
})
export class SharedModuleModule { }
