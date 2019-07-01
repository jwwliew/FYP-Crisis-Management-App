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
                        path: 'details/:languageID/:planName',
                        loadChildren: '../plans/plan-details/plan-details.module#PlanDetailsPageModule'
                    },
                    {
                        path: 'editplan/:item',
                        loadChildren: '../plans/editplan/editplan.module#EditplanPageModule'
                    }

                ]
            },
            {
                path: 'templates',
                children: [
                    {
                        path: '',
                        loadChildren: '../templates/view-templates/view-templates.module#ViewTemplatesPageModule'
                    },
                    {
                        path: 'new',
                        loadChildren: '../templates/new-templates/new-templates.module#NewTemplatesPageModule'
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
                        children: [
                            {
                                path: '',
                                loadChildren: '../settings/symptom-action/symptom-action.module#SymptomActionPageModule'
                            },
                            {
                                path: 'edit/:selectedTab/:id',
                                loadChildren: '../settings/edit-settings/edit-settings.module#EditSettingsPageModule'
                            }
                        ]
                    },
                    {
                        path: 'tutorial',
                        loadChildren: '../settings/tutorial/tutorial.module#TutorialPageModule' 
                    },
                    { 
                        path: 'about', 
                        loadChildren: '../settings/about/about.module#AboutPageModule' 
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