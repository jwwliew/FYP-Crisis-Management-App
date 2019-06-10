import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'symptom-action', loadChildren: './settings/symptom-action/symptom-action.module#SymptomActionPageModule' },
  { path: 'new-plan', loadChildren: './plans/new-plan/new-plan.module#NewPlanPageModule' },
  { path: 'plan-details', loadChildren: './plans/plan-details/plan-details.module#PlanDetailsPageModule' },  { path: 'edit-settings', loadChildren: './settings/edit-settings/edit-settings.module#EditSettingsPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
