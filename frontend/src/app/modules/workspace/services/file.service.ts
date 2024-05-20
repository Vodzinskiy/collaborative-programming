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

  private filesSubject = new BehaviorSubject<FileModel[]>(this.files);
  filesObservable$: Observable<FileModel[]> = this.filesSubject.asObservable();

  private openFilesSubject = new BehaviorSubject<FileModel[]>(this.openFiles);
  openFilesObservable$: Observable<FileModel[]> = this.openFilesSubject.asObservable();

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  addFile(type: 'directory' | 'file', path: string, localTree: MonacoTreeElement[]) {
    const spited = path.split('/');
    const data: DialogData = {
      buttonTitle: "Створити",
      placeholder: "Назва",
      title: type === 'directory' ? "Нова директорія" : "Новий Файл"
    }
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        if (spited.length === 1) {
          if (path === '') {
            localTree.push(this.file(name, type));
          } else {
            const file = localTree.find((el) => el.name == path);
            if (!file) return;
            else if (file.content === undefined) {
              localTree.push(this.file(name, type));
            } else {
              file.content.push(this.file(name, type));
            }
          }
        } else {
          const file = localTree.find((el) => el.name == spited[0]);
          if (!file || !file.content) return;
          this.addFile(type, spited.slice(1).join('/'), file?.content);
        }
      }
    });
  }

  private file(name: string, type: 'directory' | 'file') {
    let data
    if (type === 'file') {
      data = new FileModel(name, "")
      this.openFile(data)
    } else {
      data = {
        name: name,
        content: [],
      }
    }
    return data
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
}
