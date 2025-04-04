// consumer.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, retryWhen, delay, take } from 'rxjs/operators';
import { Order } from '../interfaces/consumer.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService implements OnDestroy {
  private socket!: WebSocket;
  private messageSubject: Subject<Order> = new Subject();
  private reconnectAttempts = 3;
  private reconnectDelay = 300000; // 3 horas

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = new WebSocket('ws://localhost:8005/ws');

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.socket.onmessage = (event) => {
        try {
          const data: Order = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        if (!event.wasClean) {
          this.attemptReconnection();
        }
      };
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  }

  private attemptReconnection(): void {
    let attempts = 0;
    
    const tryReconnect = () => {
      attempts++;
      if (attempts <= this.reconnectAttempts) {
        console.log(`Attempting to reconnect (${attempts}/${this.reconnectAttempts})...`);
        setTimeout(() => {
          this.connect();
        }, this.reconnectDelay);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };

    tryReconnect();
  }

  getMessages(): Observable<Order> {
    return this.messageSubject.asObservable().pipe(
      catchError(error => {
        console.error('Error in message stream:', error);
        return throwError(error);
      })
    );
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}