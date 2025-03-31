// membresia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Membresia, 
  MembresiaCreate, 
  MembresiaUpdate, 
  RenovacionMembresia, 
  MembresiaUsuario 
} from '../interfaces/membresia.interface';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {
  private apiUrl = 'http://localhost:8000/membresias/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MembresiaUsuario[]> {
    return this.http.get<MembresiaUsuario[]>(this.apiUrl);
  }

  getById(id: number): Observable<MembresiaUsuario> {
    return this.http.get<MembresiaUsuario>(`${this.apiUrl}/${id}`);
  }

  create(membresia: MembresiaCreate): Observable<Membresia> {
    return this.http.post<Membresia>(this.apiUrl, membresia);
  }

  update(id: number, membresia: MembresiaUpdate): Observable<Membresia> {
    return this.http.put<Membresia>(`${this.apiUrl}/${id}`, membresia);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByUsuario(usuarioId: number): Observable<MembresiaUsuario[]> {
    return this.http.get<MembresiaUsuario[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getActivaByUsuario(usuarioId: number): Observable<MembresiaUsuario> {
    return this.http.get<MembresiaUsuario>(`${this.apiUrl}/usuario/${usuarioId}/activa`);
  }

  renovar(id: number, renovacion: RenovacionMembresia): Observable<Membresia> {
    return this.http.put<Membresia>(`${this.apiUrl}/${id}/renovar`, renovacion);
  }

  getPorVencer(): Observable<MembresiaUsuario[]> {
    return this.http.get<MembresiaUsuario[]>(`${this.apiUrl}/por-vencer`);
  }

  getVencidas(): Observable<MembresiaUsuario[]> {
    return this.http.get<MembresiaUsuario[]>(`${this.apiUrl}/vencidas`);
  }

  getActivas(): Observable<MembresiaUsuario[]> {
    return this.http.get<MembresiaUsuario[]>(`${this.apiUrl}/activas`);
  }
}