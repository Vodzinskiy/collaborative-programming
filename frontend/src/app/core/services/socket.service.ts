import {Injectable} from '@angular/core';
import io from 'socket.io-client';
import {env} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket;

  constructor() {
    this.socket = io(env.SOCKET_URL, {autoConnect: false, transports: ["websocket"]});
  }

  connectToSocket(projectId: string | undefined) {
    if (this.socket) {
      this.socket.io.opts.query = {projectId: projectId};
      this.socket.connect();
    }
  }

  disconnectFromSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public getSocket() {
    return this.socket;
  }
}
