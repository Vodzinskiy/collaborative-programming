import {Component, OnInit} from '@angular/core';
import {DialogData} from "../../../models/dialog-data.dto";
import {DialogComponent} from "../../../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../../../modules/workspace/services/file.service";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-file-menu',
  templateUrl: './file-menu.component.html',
  styleUrl: './file-menu.component.scss'
})
export class FileMenuComponent implements OnInit {

  hideMenu: boolean = true;

  constructor(public dialog: MatDialog, public fileService: FileService, protected projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.project$.subscribe({
        next: project => this.hideMenu = project === null})
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
