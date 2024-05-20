import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

import {env} from "../../../environments/environment";
import {Change} from "../models/change.dto";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket;

  constructor() {
    this.socket = io(env.SOCKET_URL, { autoConnect: false });
  }

  connectToSocket(projectId: string | undefined) {
    if (this.socket) {
      this.socket.io.opts.query = { projectId: projectId };
      this.socket.connect();
    }
  }

  disconnectFromSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  updateDocument(change: Change, documentId: string): void {
    this.socket.emit('updateDocumentChar', change, documentId);
  }

  documentUpdated(): Observable<Change> {
    return new Observable<Change>(observer => {
      this.socket.on('documentUpdatedChar', (changeDto: Change) => {
        observer.next(changeDto);
      });
    });
  }

  public memberListUpdate() {
    return new Observable<string[]>(observer => {
      this.socket.on('projectUserListUpdated', (members: string[]) => {
        console.log(members)
        observer.next(members);
      });
    });
  }
}
