import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'plans',
        children: [
          {
            path: '',
            loadChildren: '../plans/plans.module#PlansPageModule'
          },
          // {
          //   path: ':id',
          //   loadChildren: '../film-details/film-details.module#FilmDetailsPageModule'
          // }
        ]
      },
      {
        path: 'templates',
        children: [
          {
            path: '',
            loadChildren: '../templates/templates.module#TemplatesPageModule'
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: '../settings/settings.module#SettingsPageModule'
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/plans',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}