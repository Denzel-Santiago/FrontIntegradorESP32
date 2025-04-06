// almacen.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Almacen, AlmacenCreate, IncrementarCantidad } from '../interfaces/almacen.interface';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {
  private apiUrl = 'http://54.82.122.162:8000/almacen/';

  constructor(private http: HttpClient) { }

  // Obtener todos los almacenes
  getAllAlmacenes(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  // Obtener almacén por ID
  getAlmacenById(id: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}${id}`);
  }

  // Obtener almacén por tipo de cama
  getAlmacenByTipo(tipoId: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}?tipo_cama_id=${tipoId}`);
  }

  // Crear un nuevo almacén
  createAlmacen(almacen: AlmacenCreate): Observable<Almacen> {
    return this.http.post<Almacen>(this.apiUrl, almacen);
  }

  // Incrementar stock
  incrementarStock(almacenId: number, cantidad: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}${almacenId}/incrementar`,
      { cantidad }
    );
  }

  // Obtener o crear un almacén
  getOrCreateAlmacen(tipoId: number): Observable<Almacen> {
    return new Observable(observer => {
      this.getAlmacenByTipo(tipoId).subscribe({
        next: (almacen) => {
          observer.next(almacen);
          observer.complete();
        },
        error: (error) => {
          // Si no existe, creamos uno nuevo
          const nuevoAlmacen: AlmacenCreate = {
            tipo_cama_id: tipoId,
            cantidad: 0
          };
          this.createAlmacen(nuevoAlmacen).subscribe({
            next: (almacenCreado) => {
              observer.next(almacenCreado);
              observer.complete();
            },
            error: (createError) => {
              observer.error(createError);
              observer.complete();
            }
          });
        }
      });
    });
  }

  // Eliminar almacén
  deleteAlmacen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}