import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'text1', loadChildren: './news/text1/text1.module#Text1Module' },
  { path: 'text2', loadChildren: './text2/text2.module#Text2PageModule' },
  { path: 'text3', loadChildren: './text3/text3.module#Text3PageModule' }

];

@NgModule({
  imports:[
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
