import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkspaceMainComponent} from "./components/workspace-main/workspace-main.component";
import {MatButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    WorkspaceMainComponent
  ],
  imports: [
    CommonModule,
    MatButton,
    MatIconModule,
  ]
})
export class WorkSpaceModule {}
