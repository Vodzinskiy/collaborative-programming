import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkspaceMainComponent} from "./components/workspace-main/workspace-main.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TabsComponent} from "./components/tabs/tabs.component";
import {MatTabsModule} from "@angular/material/tabs";
import {DocumentContentComponent} from "./components/document-content/document-content.component";
import {FormsModule} from "@angular/forms";
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

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
    MatIconButton,
    MatTabsModule,
    FormsModule,
    MonacoEditorModule
  ]
})
export class WorkSpaceModule {}
