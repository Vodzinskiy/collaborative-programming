import {Injectable} from '@angular/core';
import io from 'socket.io-client';
import {Observable} from 'rxjs';

import {env} from "../../../environments/environment";
import {FileService} from "../../modules/workspace/services/file.service";
import {FileModel} from "../models/file.model";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket;

  constructor(public fileService: FileService) {
    this.socket = io(env.SOCKET_URL, {autoConnect: false, transports: ["websocket"]});
  }

  connectToSocket(projectId: string | undefined) {
    if (this.socket) {
      this.socket.io.opts.query = {projectId: projectId};
      this.socket.connect();
      this.onFilesReceived();
      this.onRequestFiles()
    }
  }

  disconnectFromSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  updateDocument(change: any, documentId: string): void {
    this.socket.emit('updateDocument', change, documentId);
  }

  documentUpdated() {
    return new Observable(observer => {
      this.socket.on('editorChanges', (operations: any) => {
        observer.next(operations);
      });
    });
  }

  public memberListUpdate() {
    return new Observable<string[]>(observer => {
      this.socket.on('projectUserListUpdated', (members: string[]) => {
        observer.next(members);
      });
    });
  }

  private onRequestFiles() {
    this.socket.on('requestFiles', (recipientId: string) => {
      this.socket.emit('files', this.fileService.filesSubject.value, recipientId);
    })
  }

  private onFilesReceived() {
    this.socket.on('files', (files: FileModel[]) => {
      this.fileService.filesSubject.next(files);
    })
  }
}
