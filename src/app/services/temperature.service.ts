import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Temperature } from '../interfaces/temperature.interface';  // Importa la interfaz

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  private socket: WebSocket | null = null;  // Inicializar como null
  private temperatureSubject: BehaviorSubject<Temperature | null> = new BehaviorSubject<Temperature | null>(null);

  constructor() {
    this.connectToWebSocket();
  }

  // Conectar al WebSocket
  private connectToWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:8001/ws');

    // Al recibir un mensaje del WebSocket
    this.socket.onmessage = (event) => {
      const temperature: Temperature = JSON.parse(event.data);
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
  getCurrentTemperature(): Observable<Temperature | null> {
    return this.temperatureSubject.asObservable();
  }

  // Cerrar WebSocket manualmente cuando se destruya el servicio
  closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
