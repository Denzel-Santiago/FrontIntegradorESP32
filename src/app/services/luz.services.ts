import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, filter, retryWhen, take } from 'rxjs/operators';
import { Luz } from '../interfaces/luz.interface';

@Injectable({
  providedIn: 'root'
})
export class LuzService implements OnDestroy {
 private socket!: WebSocket;
   private messageSubject: Subject<Luz> = new Subject();
   private connectionStatusSubject = new BehaviorSubject<boolean>(false);
   private readonly reconnectAttempts = 5;
   private readonly reconnectDelay = 5000; // 5 segundos
 
  constructor() {
    this.connect();
  }

  private connect(): void {
        try {
          this.socket = new WebSocket('ws://44.212.103.182:8003/ws');
    
          this.socket.onopen = () => {
            console.log('WebSocket connection established');
          };
    
          this.socket.onmessage = (event) => {
            try {
              const data: Luz = JSON.parse(event.data);
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
  
     getMessages(): Observable<Luz> {
        return this.messageSubject.asObservable().pipe(
          catchError(error => {
            console.error('Error in message stream:', error);
            return throwError(error);
          })
        );
      }
    getConnectionStatus(): Observable<boolean> {
      return this.connectionStatusSubject.asObservable();
    }
  
    ngOnDestroy(): void {
      if (this.socket) {
        this.socket.close();
      }
    }
}