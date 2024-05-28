import {Injectable} from '@angular/core';
import {FileModel} from "../../../core/models/file.model";
import {BehaviorSubject, Observable} from "rxjs";
import {DialogData} from "../../../core/models/dialog-data.dto";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {MonacoTreeElement} from "ngx-monaco-tree";
import {MatDialog} from "@angular/material/dialog";
import {FileSocketService} from "../../../core/services/file-socket.service";
import {UUID} from "crypto";
import {ProjectObject} from "../../../core/models/project-object.dto";
import JSZip from 'jszip';
import {saveAs} from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  public files: any[] = []
  public openFiles: FileModel[] = []

  private tabIndexSubject = new BehaviorSubject<number | null>(null);
  public tabIndexObservable$ = this.tabIndexSubject.asObservable();

  filesSubject = new BehaviorSubject<FileModel[]>(this.files);
  filesObservable$: Observable<FileModel[]> = this.filesSubject.asObservable();

  openFilesSubject = new BehaviorSubject<FileModel[]>(this.openFiles);
  openFilesObservable$: Observable<FileModel[]> = this.openFilesSubject.asObservable();

  constructor(public socket: FileSocketService, public dialog: MatDialog) {
    this.socket.documentUpdated().subscribe(({operations, id}) => {
      if (!this.openFilesSubject.value.some(file => file.id === id)) {
        this.applyChanges(id, operations);
      }
    });
  }

  createFile(type: 'directory' | 'file', path: string, localTree: MonacoTreeElement[], fullPath: string) {
    const title = type === 'directory' ? "Нова директорія" : "Новий файл";
    const data: DialogData = {buttonTitle: "Створити", placeholder: "Назва", title: title}
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.addFile(type, path, localTree, fullPath, name, true)
      }
    });
  }

  public addFile(type: 'directory' | 'file', path: string, localTree: MonacoTreeElement[], fullPath: string, name: string, author: boolean = false, id: UUID | undefined = undefined) {
    const spited = path.split('/');
    if (spited.length === 1) {
      if (path === '') {
        const newFullPath = `${fullPath}/${name}`;
        localTree.push(this.file(name, type, newFullPath, id, author));
      } else {
        const file = localTree.find((el) => el.name == path);
        if (!file) return;
        else if (file.content === undefined) {
          const newFullPath = `${fullPath}/${name}`;
          localTree.push(this.file(name, type, newFullPath, id, author));
        } else {
          const newFullPath = `${fullPath}/${path}/${name}`;
          file.content.push(this.file(name, type, newFullPath, id, author));
        }
      }
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      const newFullPath = `${fullPath}/${spited[0]}`;
      this.addFile(type, spited.slice(1).join('/'), file?.content, newFullPath, name, author, id);
    }
  }

  private file(name: string, type: 'directory' | 'file', fPath: string, id: UUID | undefined, author: boolean) {
    const path = fPath.replace(/\/[^/]*$/, '').slice(1);
    if (type === 'file') {
      let data = new FileModel(id, name, "", fPath.slice(1))
      if (author) {
        const obj: ProjectObject = {content: "", fPath: "", id: data.id, name: name, path: path, type: type};
        this.socket.addFile(obj)
      }
      this.openFile(data)
      return data
    } else {
      if (author) {
        const obj: ProjectObject = {content: "", fPath: "", name: name, path: path, type: type};
        this.socket.addFile(obj)
      }
      return {name: name, content: [], type: type}
    }
  }

  updateFile(path: string, name: string) {
    const file = this.findFileRecursive(this.filesSubject.value, path);
    if (file !== null) {
      file.name = name;
      if (file.fPath) {
        file.fPath = file.fPath.replace(/[^/]*$/, name);
      }
      this.filesSubject.next(this.filesSubject.value);
    }
  }

  applyChanges(id: UUID, changes: any[]): void {
    const file = this.findFileRecursive(this.filesSubject.value, "", id);
    changes.sort((a, b) => a.rangeOffset - b.rangeOffset);
    let offset = 0;
    for (const change of changes) {
      const startIndex = this.getIndexFromPosition(file.data, change.range.startLineNumber, change.range.startColumn) + offset;
      const endIndex = this.getIndexFromPosition(file.data, change.range.endLineNumber, change.range.endColumn) + offset;
      const removedText = file.data.slice(startIndex, endIndex);
      file.data = file.data.slice(0, startIndex) + change.text + file.data.slice(endIndex);
      offset += change.text.length - removedText.length;
    }
  }

  private getIndexFromPosition(fileData: string, lineNumber: number, column: number): number {
    const lines = fileData.split('\n');
    let index = 0;
    for (let i = 0; i < lineNumber - 1; i++) {
      index += lines[i].length + 1;
    }
    index += column - 1;
    return index;
  }

  openFile(file: FileModel) {
    if (file) {
      this.openFiles.push(file);
      this.openFilesSubject.next(this.openFiles);
    }
  }

  closeFile(index: number) {
    if (index !== -1) {
      this.openFiles.splice(index, 1);
      this.openFilesSubject.next(this.openFiles);
    }
  }

  public switchToTab(name: string) {
    const tabIndex = this.openFiles.findIndex(file => file.fPath === name);
    if (tabIndex !== -1) {
      this.tabIndexSubject.next(tabIndex);
    } else {
      const fileToOpen = this.findFileRecursive(this.filesSubject.value, name);
      if (fileToOpen) {
        const fileModel = new FileModel(fileToOpen.id, fileToOpen.name, fileToOpen.data, fileToOpen.fPath);
        this.openFile(fileModel);
      }
    }
  }

  private findFileRecursive(items: any[], name: string, id?: UUID): any {
    for (const item of items) {
      if (!item.content && (item.fPath === name || item.id === id)) {
        return item;
      }
      if (item.content) {
        const foundFile = this.findFileRecursive(item.content, name);
        if (foundFile) {
          return foundFile;
        }
      }
    }
    return null;
  }

  public saveFiles() {
    const zip = new JSZip;
    const processFiles = (items: any[], currentPath: string) => {
      for (const item of items) {
        if (!item.content) {
          zip.file(item.fPath, item.data);
        } else {
          processFiles(item.content, `${currentPath}/${item.name}`);
        }
      }
    };
    processFiles(this.filesSubject.value, '');
    zip.generateAsync({type: 'blob'}).then(function (content) {
      saveAs(content, 'files.zip');
    });
  }
}

