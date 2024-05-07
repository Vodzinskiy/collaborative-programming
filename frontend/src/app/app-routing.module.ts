import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkspaceMainComponent} from "./modules/workspace/components/workspace-main/workspace-main.component";

const routes: Routes = [{
  path: '',
  component: WorkspaceMainComponent
},]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
