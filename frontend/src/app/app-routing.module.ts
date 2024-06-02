import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WorkspaceMainComponent} from "./modules/workspace/components/workspace-main/workspace-main.component";
import {ProfileComponent} from "./modules/profile/profile.component";

const routes: Routes = [{
  path: '',
  component: WorkspaceMainComponent
  },
  {
    path: 'p/:id',
    component: WorkspaceMainComponent

  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: '**',
    redirectTo: ''
  }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
