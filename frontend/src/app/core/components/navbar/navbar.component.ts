import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../modules/auth/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../../modules/workspace/services/file.service";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {DialogData} from "../../models/dialog-data.dto";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  firstLetter: string = "A";
  isLoading = true;

  constructor(public authService: AuthService, public dialog: MatDialog, public fileService: FileService) {
  }

  ngOnInit(): void {
    this.authenticated()
  }

  authenticated() {
    this.authService.checkAuthStatus().subscribe({
        next: ()=> this.isLoading = false,
        error: ()=> this.isLoading = false
      }
    );
  }

  signout() {
    this.authService.signout().subscribe()
    this.authService.setAuthStatus(false)
  }

  newFile() {
    const data: DialogData = {buttonTitle: "Створити", placeholder: "Назва", title: "Новий Файл"}
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result)  {
        this.fileService.addFile(result, "")
      }
    });
  }
}
