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
                        loadChildren: '../plans/view-plans/view-plans.module#ViewPlansPageModule'
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
                        loadChildren: '../templates/view-templates/view-templates.module#ViewTemplatesPageModule'
                    }
                ]
            },
            {
                path: 'settings',
                children: [
                    {
                        path: '',
                        loadChildren: '../settings/view-settings/view-settings.module#ViewSettingsPageModule'
                    },
                    {
                        path: 'symptomAction',
                        loadChildren: '../settings/symptom-action/symptom-action.module#SymptomActionPageModule'
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
export class TabsPageRoutingModule { }