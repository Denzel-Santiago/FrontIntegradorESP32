import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, retryWhen, delay, tap, take } from 'rxjs/operators';
import { Luz } from '../interfaces/luz.interface';

@Injectable({
  providedIn: 'root'
})
export class LuzService implements OnDestroy {
  private socket$: WebSocketSubject<Luz> | null = null;
  private luzSubject = new BehaviorSubject<Luz | null>(null);
  private reconnectAttempts = 5;
  private reconnectDelay = 5000;
  private isDestroyed = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.isDestroyed) return;

    this.socket$ = webSocket<Luz>({
      url: 'ws://localhost:8003/ws',
      closeObserver: {
        next: () => {
          console.log('Luz WebSocket connection closed');
          if (!this.isDestroyed) this.attemptReconnection();
        }
      },
      openObserver: {
        next: () => console.log('Luz WebSocket connection established')
      }
    });

    this.socket$.pipe(
      retryWhen(errors => errors.pipe(
        tap(err => console.error('Luz WebSocket error, retrying...', err)),
        delay(this.reconnectDelay),
        take(this.reconnectAttempts)
      )),
      catchError(err => {
        console.error('Luz WebSocket connection failed:', err);
        return throwError(() => err);
      })
    ).subscribe({
      next: (data: Luz) => this.luzSubject.next(data),
      error: (err) => this.luzSubject.error(err),
      complete: () => console.log('Luz WebSocket completed')
    });
  }

  private attemptReconnection(): void {
    if (this.isDestroyed) return;
    console.log(`Attempting to reconnect in ${this.reconnectDelay/1000} seconds...`);
    setTimeout(() => this.connect(), this.reconnectDelay);
  }

  getCurrentLuz(): Observable<Luz | null> {
    return this.luzSubject.asObservable();
  }

  sendMessage(message: any): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);
    } else {
      console.error('Cannot send message - WebSocket not connected');
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.socket$?.complete();
    this.luzSubject.complete();
  }
}