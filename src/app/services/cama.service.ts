// cama.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Cama, 
  CamaCreate, 
  CamaUpdate,
  CamaAfricana 
} from '../interfaces/cama.interface';

@Injectable({
  providedIn: 'root'
})
export class CamaService {
  private apiUrl = 'http://54.82.122.162:8000/camas/';
  private apiUrlAfricana = 'http://54.82.122.162:8000/camas-africanas/';

  constructor(private http: HttpClient) { }

  // Get all camas
  getAllCamas(): Observable<Cama[]> {
    return this.http.get<Cama[]>(this.apiUrl).pipe(
      map(camas => camas.map(cama => ({
        ...cama,
        nombreCompleto: `${cama.modelo} (Tipo: ${cama.tipo_id})`
      })))
    );
  }

  // Get cama by ID
  getCamaById(id: number): Observable<Cama> {
    return this.http.get<Cama>(`${this.apiUrl}${id}`);
  }

  // Create a new cama
  createCama(cama: CamaCreate): Observable<Cama> {
    return this.http.post<Cama>(this.apiUrl, cama);
  }

  // Update a cama
  updateCama(id: number, cama: CamaUpdate): Observable<Cama> {
    return this.http.put<Cama>(`${this.apiUrl}${id}`, cama);
  }

  // Delete a cama
  deleteCama(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  // Get camas by usuario ID
  getCamasByUsuario(usuarioId: number): Observable<Cama[]> {
    return this.http.get<Cama[]>(`${this.apiUrl}usuario/${usuarioId}`);
  }

  // Get camas by tipo ID
  getCamasByTipo(tipoId: number): Observable<Cama[]> {
    return this.http.get<Cama[]>(`${this.apiUrl}tipo/${tipoId}`);
  }

  // Métodos específicos para Camas Africanas
  getCamasAfricanas(): Observable<CamaAfricana[]> {
    return this.http.get<CamaAfricana[]>(this.apiUrlAfricana);
  }

  getCamaAfricanaById(id: number): Observable<CamaAfricana> {
    return this.http.get<CamaAfricana>(`${this.apiUrlAfricana}${id}`);
  }

  createCamaAfricana(camaAfricana: Omit<CamaAfricana, 'id'>): Observable<CamaAfricana> {
    return this.http.post<CamaAfricana>(this.apiUrlAfricana, camaAfricana);
  }

  deleteCamaAfricana(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlAfricana}${id}`);
  }
}