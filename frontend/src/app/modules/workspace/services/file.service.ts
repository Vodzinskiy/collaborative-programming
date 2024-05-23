import {Injectable} from '@angular/core';
import {FileModel} from "../../../core/models/file.model";
import {UUID} from "crypto";
import {BehaviorSubject, Observable} from "rxjs";
import {env} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DialogData} from "../../../core/models/dialog-data.dto";
import {DialogComponent} from "../../../shared/components/dialog/dialog.component";
import {MonacoTreeElement} from "ngx-monaco-tree";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = env.API_URL;
  private files: any[] = []
  private openFiles: FileModel[] = []

  private tabIndexSubject = new BehaviorSubject<number | null>(null);
  public tabIndexObservable$ = this.tabIndexSubject.asObservable();

  filesSubject = new BehaviorSubject<FileModel[]>(this.files);
  filesObservable$: Observable<FileModel[]> = this.filesSubject.asObservable();

  private openFilesSubject = new BehaviorSubject<FileModel[]>(this.openFiles);
  openFilesObservable$: Observable<FileModel[]> = this.openFilesSubject.asObservable();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  addFile(type: 'directory' | 'file', path: string, localTree: MonacoTreeElement[], fullPath: string) {
    const title = type === 'directory' ? "Нова директорія" : "Новий файл";
    const data: DialogData = {buttonTitle: "Створити", placeholder: "Назва", title: title}
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.createFile(type, path, localTree, fullPath, name)
      }
    });
  }

  private createFile(type: 'directory' | 'file', path: string, localTree: MonacoTreeElement[], fullPath: string, name: string) {
    const spited = path.split('/');
    if (spited.length === 1) {
      if (path === '') {
        const newFullPath = `${fullPath}/${name}`;
        localTree.push(this.file(name, type, newFullPath));
      } else {
        const file = localTree.find((el) => el.name == path);
        if (!file) return;
        else if (file.content === undefined) {
          const newFullPath = `${fullPath}/${name}`;
          localTree.push(this.file(name, type, newFullPath));
        } else {
          const newFullPath = `${fullPath}/${path}/${name}`;
          file.content.push(this.file(name, type, newFullPath));
        }
      }
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      const newFullPath = `${fullPath}/${spited[0]}`;
      this.createFile(type, spited.slice(1).join('/'), file?.content, newFullPath, name);
    }
  }

  private file(name: string, type: 'directory' | 'file', fullPath: string) {
    if (type === 'file') {
      let data = new FileModel(name, "", fullPath.slice(1))
      this.openFile(data)
      return data
    } else {
      return {name: name, content: []}
    }
  }

  saveFile(file: FileModel) {
    this.http.put(`${this.apiUrl}project/1/`, file, {observe: 'response', withCredentials: true}).subscribe()
  }

  deleteFile(id: UUID) {
    const index = this.files.findIndex(file => file.id.toString() === id.toString());
    if (index !== -1) {
      this.files.splice(index, 1);
    }
    this.closeFile(this.files.findIndex(file => file.id.toString() === id.toString()));
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
    const tabIndex = this.openFiles.findIndex(file => file.path === name);
    if (tabIndex !== -1) {
      this.tabIndexSubject.next(tabIndex);
    } else {
      const fileToOpen = this.filesSubject.value.find(file => file.path === name);
      if (fileToOpen) {
        const fileModel = new FileModel(fileToOpen.name, fileToOpen.data, fileToOpen.path);
        this.openFile(fileModel);
      }
    }
  }
}
