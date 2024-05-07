import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponent} from "./app.component";
import {AuthModule} from "./modules/auth/auth.module";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {NavbarComponent} from "./core/components/navbar/navbar.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {WorkSpaceModule} from "./modules/workspace/work-space.module";

@NgModule({
  declarations: [AppComponent,
    NavbarComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AuthModule,
    WorkSpaceModule,
    AppRoutingModule,
    MatToolbar,
    MatIcon,
    MatAnchor,
    MatIconButton,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatFabButton,
    MatMiniFabButton,
    MatDivider
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
