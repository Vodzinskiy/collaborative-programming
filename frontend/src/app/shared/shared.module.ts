import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CustomInputComponent} from "./components/custom-input/custom-input.component";
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {ReactiveFormsModule} from "@angular/forms";
import {SocialLoginComponent} from "./components/social-login/social-login.component";
import {MatButton} from "@angular/material/button";
import {MatCardFooter} from "@angular/material/card";

@NgModule({
  declarations: [CustomInputComponent,
    SocialLoginComponent],
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
    NgOptimizedImage
  ]
})
export class SharedModule { }
