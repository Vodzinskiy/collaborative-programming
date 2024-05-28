import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FileService} from "../../modules/workspace/services/file.service";
import {FileModel} from "../models/file.model";
import {SocketService} from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectSocketService {

  constructor(public fileService: FileService, public socket: SocketService) {}

  public memberListUpdate() {
    return new Observable<string[]>(observer => {
      this.socket.getSocket().on('projectUserListUpdated', (members: string[]) => {
        observer.next(members);
      });
    });
  }

  public onRequestFiles() {
    this.socket.getSocket().on('requestFiles', (recipientId: string) => {
      this.socket.getSocket().emit('files', this.fileService.filesSubject.value, recipientId);
    })
  }

  public onFilesReceived() {
    this.socket.getSocket().on('files', (files: FileModel[]) => {
      this.fileService.filesSubject.next(files);
    })
  }
}
