import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponent} from "./app.component";
import {AuthModule} from "./modules/auth/auth.module";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {WorkSpaceModule} from "./modules/workspace/work-space.module";
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {CoreModule} from "./core/core.module";
import {ProfileComponent} from "./modules/profile/profile.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {SharedModule} from "./shared/shared.module";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {DeleteDialogComponent} from "./modules/profile/delete-dialog.component";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";

@NgModule({
  declarations: [AppComponent, ProfileComponent, DeleteDialogComponent],
  imports: [
    BrowserModule,
    CommonModule,
    MonacoEditorModule.forRoot(),
    AuthModule,
    WorkSpaceModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormFieldModule,
    SharedModule,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
