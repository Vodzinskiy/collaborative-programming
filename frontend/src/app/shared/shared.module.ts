import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CustomInputComponent} from "./components/custom-input/custom-input.component";
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SocialLoginComponent} from "./components/social-login/social-login.component";
import {MatButton} from "@angular/material/button";
import {MatCardFooter} from "@angular/material/card";
import {DialogComponent} from "./components/dialog/dialog.component";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";

@NgModule({
  declarations: [CustomInputComponent,
    SocialLoginComponent,
    DialogComponent],
  exports: [
    CustomInputComponent,
    SocialLoginComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButton,
    MatCardFooter,
    NgOptimizedImage,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatDialogActions,
    MatDialogClose
  ]
})
export class SharedModule { }
