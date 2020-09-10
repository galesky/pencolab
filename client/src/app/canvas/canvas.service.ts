import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { DrawAction } from './draw.interface';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  constructor(private socket: Socket) { }

  // TODO - convert to observables
  currentDocument = this.socket.fromEvent<any>('document');
  documents = this.socket.fromEvent<any>('documents');
  siblingDrawAction = this.socket.fromEvent<any>('siblingDrawAction');


  pingWs() {
    console.log("asdasdasd")
    this.socket.emit('pingWs')
  }

  getStatus() {
    console.log(this.socket)
    this.socket.emit('pingWs')
  }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  
  createOrJoinCanvas(currentRoom: string) {
    this.socket.emit('createOrJoinCanvas', { id: currentRoom, canvas: '' });
  }

  editCanvas(drawAction: DrawAction) {
    this.socket.emit('editCanvas', drawAction);
  }
}
