// luz.services.ts
import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { Temperature } from '../interfaces/luz.interface';

@Injectable({
  providedIn: 'root',
})
export class LuzService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    // Conectar al WebSocket
    this.socket$ = new WebSocketSubject('ws://localhost:8003/ws');
  }

  // Método para escuchar los mensajes de temperatura
  public getTemperatureUpdates(): Observable<Temperature> {
    return this.socket$.asObservable();
  }

  // Método para enviar un mensaje a través del WebSocket (si es necesario)
  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  // Método para cerrar la conexión de WebSocket
  public closeConnection(): void {
    this.socket$.complete();
  }
}
