import {Component, OnInit} from '@angular/core';
import {ContextMenuAction, MonacoTreeElement} from "ngx-monaco-tree";
import {DialogData} from "../../../../core/models/dialog-data.dto";
import {DialogComponent} from "../../../../shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../services/file.service";

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrl: './file-tree.component.scss'
})
export class FileTreeComponent implements OnInit {
  dark = true;
  currentFile = '';
  tree: any[] = [];

  constructor(public dialog: MatDialog, public fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.filesObservable$.subscribe({
      next: f => this.tree = f
    })
  }

  handleContextMenu(action: ContextMenuAction) {
    switch (action[0]) {
      case 'new_directory':
        return this.fileService.addFile('directory', action[1], this.tree, "");
      case 'new_file':
        return this.fileService.addFile('file', action[1], this.tree, "");
      case 'delete_file':
        return this.remove(action[1], this.tree);
      case 'rename_file':
        return this.rename(action[1], this.tree);
    }
  }

  rename(path: string, localTree: MonacoTreeElement[], index = 0) {
    const parts = path.split('/');
    const part = parts[index];
    const file = localTree.find(el => el.name === part);
    if (!file) return;
    if (index === parts.length - 1) {
      const data: DialogData = {buttonTitle: "Перейменувати", placeholder: "Назва", title: "Перейменувати"}
      const dialogRef = this.dialog.open(DialogComponent, {data});
      dialogRef.afterClosed().subscribe(result => {
        if (result && result !== file.name) {
          file.name = result
        }
      });
    } else if (file.content) {
      this.rename(path, file.content, index + 1);
    }
  }

  remove(path: string, localTree: MonacoTreeElement[]) {
    const [name, ...rest] = path.split('/');
    const index = localTree.findIndex((el) => el.name === name);
    if (index !== -1) {
      if (rest.length === 0) {
        localTree.splice(index, 1);
      } else {
        const {content} = localTree[index];
        if (content) this.remove(rest.join('/'), content);
      }
    }
  }
}
