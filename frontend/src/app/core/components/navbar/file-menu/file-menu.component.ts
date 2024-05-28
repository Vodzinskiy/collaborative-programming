import {Component, OnInit} from '@angular/core';
import {FileService} from "../../../../modules/workspace/services/file.service";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-file-menu',
  templateUrl: './file-menu.component.html',
  styleUrl: './file-menu.component.scss'
})
export class FileMenuComponent implements OnInit {

  hideMenu: boolean = true;
  tree: any[] = [];

  constructor(public fileService: FileService, protected projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.project$.subscribe({
        next: project => this.hideMenu = project === null})

    this.fileService.filesObservable$.subscribe({
      next: f => this.tree = f
    })
  }

  newFile() {
    this.fileService.createFile("file", '', this.tree, "")
  }

  newDirectory() {
    this.fileService.createFile("directory", '', this.tree, "")
  }

  saveFiles() {
    this.fileService.saveFiles()
  }
}
