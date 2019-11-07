import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {IonicStorageModule} from '@ionic/storage';

import {HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as Hammer from 'hammerjs';
import * as CryptoJS from 'crypto-js';
import { TemplatePopComponent } from './templates/template-pop/template-pop.component';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { ImportModalPageModule } from './import-modal/import-modal.module'
import { ImportConflictPopoverPageModule } from './popover/import-conflict-popover/import-conflict-popover.module'


//JW
export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
      'press': { time: 1000 },  //set press delay for 1 second, default is 300ms
  }
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {touchAction: "pan-y"});
    mc.get("press").set({time:666});
    return mc;
  }
}

@NgModule({
  declarations: [AppComponent, TemplatePopComponent],
  entryComponents: [TemplatePopComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(),
    ImportModalPageModule, ImportConflictPopoverPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FileOpener,
    FileChooser,
    FilePath,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
