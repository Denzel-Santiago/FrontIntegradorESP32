// humedad.service.ts
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Humedad } from '../interfaces/humedad.interface';  // Asegúrate de importar la interfaz

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  private socket: WebSocket | null = null; 
  private temperatureSubject: BehaviorSubject<Humedad | null> = new BehaviorSubject<Humedad | null>(null);

  constructor() {
    this.connectToWebSocket();
  }

  // Conectar al WebSocket
  private connectToWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:8002/ws');  // Dirección del WebSocket en el servidor

    // Al recibir un mensaje del WebSocket
    this.socket.onmessage = (event) => {
      const temperature: Humedad = JSON.parse(event.data);
      this.temperatureSubject.next(temperature);
    };

    // Manejar los errores de la conexión
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cerrar la conexión del WebSocket
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  // Obtener los datos de la temperatura
  getCurrentTemperature(): Observable<Humedad | null> {
    return this.temperatureSubject.asObservable();
  }

  // Cerrar WebSocket manualmente cuando se destruya el servicio
  closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
