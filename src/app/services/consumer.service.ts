import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {

  private socket: WebSocket;
  private messageSubject: Subject<any> = new Subject();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8005/ws'); // Cambia esto si tu URL de WebSocket es diferente.
    this.socket.onmessage = (event) => {
      this.messageSubject.next(JSON.parse(event.data)); // Suponiendo que los mensajes son JSON
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  closeConnection() {
    this.socket.close();
  }
}
