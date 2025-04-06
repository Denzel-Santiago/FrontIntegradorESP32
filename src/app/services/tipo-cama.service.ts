//tipo-cama.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  TipoCama, 
  TipoCamaCreate, 
  TipoCamaUpdate 
} from '../interfaces/tipo-cama.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoCamaService {
  private apiUrl = 'http://54.82.122.162:8000/tipos-cama/';

  constructor(private http: HttpClient) { }

  // Get all tipos de cama
  getAllTiposCama(): Observable<TipoCama[]> {
    return this.http.get<TipoCama[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener tipos de cama:', error);
        return [];
      })
    );
  }

  // Get tipo cama by ID
  getTipoCamaById(id: number): Observable<TipoCama> {
    return this.http.get<TipoCama>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener tipo de cama:', error);
        throw error;
      })
    );
  }

  // Create a new tipo cama
  createTipoCama(tipoCama: TipoCamaCreate): Observable<TipoCama> {
    return this.http.post<TipoCama>(this.apiUrl, tipoCama).pipe(
      catchError(error => {
        console.error('Error al crear tipo de cama:', error);
        throw error;
      })
    );
  }

  // Update a tipo cama
  updateTipoCama(id: number, tipoCama: TipoCamaUpdate): Observable<TipoCama> {
    return this.http.put<TipoCama>(`${this.apiUrl}${id}`, tipoCama).pipe(
      catchError(error => {
        console.error('Error al actualizar tipo de cama:', error);
        throw error;
      })
    );
  }

  // Delete a tipo cama
  deleteTipoCama(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar tipo de cama:', error);
        throw error;
      })
    );
  }
}