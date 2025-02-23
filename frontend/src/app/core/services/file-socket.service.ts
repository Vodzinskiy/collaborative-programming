import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SocketService} from "./socket.service";
import {ProjectObject} from "../models/project-object.dto";

@Injectable({
  providedIn: 'root'
})
export class FileSocketService {

  constructor(public socket: SocketService) {}

  updateFile(change: any, fileId: string): void {
    this.socket.getSocket().emit('updateFile', change, fileId);
  }

  fileUpdated(fileId?: string): Observable<any> {
    return new Observable(observer => {
      this.socket.getSocket().on('fileUpdates', (operations: any, id: string) => {
        if (fileId === id) {
          observer.next(operations);
        }
        if (!fileId) {
          observer.next({operations, id});
        }
      });
    });
  }

  addFile(obj: ProjectObject) {
    console.log(obj.data)
    this.socket.getSocket().emit('addFile', obj)
  }

  renameFile(path: string, newName: string) {
    this.socket.getSocket().emit('renameFile', path, newName);
  }

  removeFile(path: string) {
    this.socket.getSocket().emit('removeFile', path);
  }

  onAddFile(): Observable<ProjectObject>{
    return new Observable(observer => {
      this.socket.getSocket().on('addFile', (obj: ProjectObject) => {
        console.log("==" + obj.data)
        observer.next(obj);
      });
    });
  }

  onRenameFile(): Observable<{path: string, newName: string}> {
    return new Observable(observer => {
      this.socket.getSocket().on('renameFile', (path: string, newName: string) => {
        observer.next({path, newName});
      });
    });
  }

  onRemoveFile(): Observable<string> {
    return new Observable(observer => {
      this.socket.getSocket().on('removeFile', (path: string) => {
        observer.next(path);
      });
    });
  }
}
