import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkspaceMainComponent} from "./components/workspace-main/workspace-main.component";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TabsComponent} from "./components/tabs/tabs.component";
import {MatTabsModule} from "@angular/material/tabs";
import {DocumentContentComponent} from "./components/document-content/document-content.component";
import {FormsModule} from "@angular/forms";
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {FileTreeComponent} from "./components/file-tree/file-tree.component";
import {MatMenuModule} from "@angular/material/menu";
import {NgxMonacoTreeModule} from "ngx-monaco-tree";


@NgModule({
  declarations: [
    WorkspaceMainComponent,
    TabsComponent,
    DocumentContentComponent,
    FileTreeComponent,
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatIconButton,
        MatTabsModule,
        FormsModule,
        MatMenuModule,
        MonacoEditorModule,
        NgxMonacoTreeModule,
    ]
})
export class WorkSpaceModule {}
