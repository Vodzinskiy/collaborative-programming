import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {RouterLink} from "@angular/router";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {ProjectMenuComponent} from "./components/navbar/project-menu/project-menu.component";
import {ProjectDetailsComponent} from "./components/navbar/project-details/project-details.component";

@NgModule({
  declarations: [NavbarComponent, ProjectMenuComponent, ProjectDetailsComponent],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatToolbar,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
    RouterLink,
    MatButton,
    MatMiniFabButton,
  ]
})
export class CoreModule { }
