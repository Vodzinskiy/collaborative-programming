import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkspaceMainComponent} from "./components/workspace-main/workspace-main.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TabsComponent} from "./components/tabs/tabs.component";
import {MatTab, MatTabBody, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {DocumentContentComponent} from "./components/document-content/document-content.component";

@NgModule({
  declarations: [
    WorkspaceMainComponent,
    TabsComponent,
    DocumentContentComponent
  ],
  imports: [
    CommonModule,
    MatButton,
    MatIconModule,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIconButton,
    MatTabBody,
  ]
})
export class WorkSpaceModule {}
