// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  Order,
  OrderCreate,
  OrderResponse
} from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://34.201.232.188:8004/api/order';

  constructor(private http: HttpClient) { }

  // Create a new order
  createOrder(order: OrderCreate): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order).pipe(
      catchError(error => {
        console.error('Error al crear el pedido:', error);
        throw error;
      })
    );
  }
}