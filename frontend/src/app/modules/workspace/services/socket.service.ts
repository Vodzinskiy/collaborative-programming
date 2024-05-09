import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

import {env} from "../../../../environments/environment";
import {Change} from "../../../core/models/change.dto";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io(env.SOCKET_URL);
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
}
