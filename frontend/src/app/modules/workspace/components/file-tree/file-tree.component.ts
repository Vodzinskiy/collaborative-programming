import {Component, OnInit} from '@angular/core';
import {ContextMenuAction, MonacoTreeElement} from "ngx-monaco-tree";
import {DialogData} from "../../../../core/models/dialog-data.dto";
import {DialogComponent} from "../../../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../services/file.service";
import {FileSocketService} from "../../../../core/services/file-socket.service";
import {ProjectSocketService} from "../../../../core/services/project-socket.service";
import {ProjectObject} from "../../../../core/models/project-object.dto";

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrl: './file-tree.component.scss'
})
export class FileTreeComponent implements OnInit {
  dark: boolean = true;
  author: boolean = false;
  tree: any[] = [];

  constructor(public dialog: MatDialog, public fileService: FileService,
              public fileSocket: FileSocketService, public projectSocket: ProjectSocketService) {}

  ngOnInit(): void {
    this.projectSocket.onRequestFiles();
    this.projectSocket.onFilesReceived();
    this.fileService.filesObservable$.subscribe({
      next: f => this.tree = f
    });
    this.fileSocket.onAddFile().subscribe((o: ProjectObject) => {
      this.fileService.addFile(o.type, o.path, this.tree, o.fPath, o.name, false, o.id)
    });
    this.fileSocket.onRenameFile().subscribe(({path, newName}) => {
      this.rename(newName, path, this.tree);
    });
    this.fileSocket.onRemoveFile().subscribe((path) => {
      this.remove(path, this.tree);
    });
  }

  handleContextMenu(action: ContextMenuAction) {
    switch (action[0]) {
      case 'new_directory':
        return this.fileService.createFile('directory', action[1], this.tree, "");
      case 'new_file':
        return this.fileService.createFile('file', action[1], this.tree, "");
      case 'delete_file':
        this.author = true;
        return this.remove(action[1], this.tree);
      case 'rename_file':
        this.author = true;
        return this.renameWindow(action[1], this.tree);
    }
  }

  private renameWindow(path: string, localTree: MonacoTreeElement[]) {
    const data: DialogData = {buttonTitle: "Перейменувати", placeholder: "Назва", title: "Перейменувати"}
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rename(result, path, localTree)
      }
    });
  }

  rename(name: string, path: string, localTree: MonacoTreeElement[], index = 0) {
    const parts = path.split('/');
    const part = parts[index];
    const file = localTree.find(el => el.name === part);
    if (!file) return;
    if (this.author) {
      this.fileSocket.renameFile(path, name)
      this.author = false;
    }
    if (index === parts.length - 1) {
      file.name = name
      this.fileService.updateFile(path, name);
    } else if (file.content) {
      this.rename(name, path, file.content, index + 1);
    }
  }

  remove(path: string, localTree: MonacoTreeElement[], closeAllInDir = true) {
    const closeFileByPath = (filePath: string) => {
      const index = this.fileService.openFiles.findIndex(file => file.fPath === filePath);
      if (index !== -1) this.fileService.closeFile(index);
    };
    const processDirectory = (dirPath: string, tree: MonacoTreeElement[]) => {
      tree.forEach(el => {
        const fullPath = `${dirPath}/${el.name}`;
        el.content ? processDirectory(fullPath, el.content) : closeFileByPath(fullPath);
      });
    };
    if (closeAllInDir) {
      const [name] = path.split('/');
      const dir = localTree.find(el => el.name === name);
      if (dir?.content) processDirectory(name, dir.content);
    }
    closeFileByPath(path);
    const [name, ...rest] = path.split('/');
    const index = localTree.findIndex(el => el.name === name);
    if (this.author) {
      this.fileSocket.removeFile(path);
      this.author = false;
    }
    if (index !== -1) {
      if (rest.length === 0) {
        localTree.splice(index, 1);
      } else {
        const content = localTree[index].content;
        if (content) this.remove(rest.join('/'), content, false);
      }
    }
  }
}
