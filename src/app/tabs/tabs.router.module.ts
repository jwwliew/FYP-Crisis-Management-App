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
                    {
                        path: 'newPlan',
                        loadChildren: '../plans/new-plan/new-plan.module#NewPlanPageModule'
                     },
                     {  
                         path:'details',
                        loadChildren: '../plans/plan-details/plan-details.module#PlanDetailsPageModule'
                     }
                     
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