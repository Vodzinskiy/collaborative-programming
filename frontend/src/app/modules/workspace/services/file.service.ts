import { Injectable } from '@angular/core';
import {FileModel} from "../../../core/models/file.model";
import {UUID} from "crypto";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private files: FileModel[] = []
  private openFiles: FileModel[] = []

  private openFilesSubject = new BehaviorSubject<FileModel[]>(this.openFiles);
  openFilesObservable$: Observable<FileModel[]> = this.openFilesSubject.asObservable();

  constructor() {
    this.addFile("new", "")
  }

  addFile(title:string, content: string) {
    let file= new FileModel(title, content)
    this.files.push(file)
    this.openFile(file.id)
  }

  deleteFile(id: UUID) {
    const index = this.files.findIndex(file => file.id.toString() === id.toString());
    if (index !== -1) {
      this.files.splice(index, 1);
    }
    this.closeFile(id);
  }

  openFile(id: UUID) {
    let file = this.files.find(file => file.id.toString() === id.toString());
    if (file) {
      this.openFiles.push(file);
      this.openFilesSubject.next(this.openFiles);
    }
  }

  closeFile(id: UUID) {
    const index = this.files.findIndex(file => file.id.toString() === id.toString());
    if (index !== -1) {
      this.openFiles.splice(index, 1);
      this.openFilesSubject.next(this.openFiles);
    }
  }
}
