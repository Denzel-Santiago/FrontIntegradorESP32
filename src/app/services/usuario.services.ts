//usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Usuario, 
  UsuarioCreate, 
  UsuarioUpdate, 
  LoginData, 
  LoginResponse 
} from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8000/usuarios/';

  constructor(private http: HttpClient) { }

  // Get all users with fullName calculated
  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(users => users.map(user => ({
        ...user,
        fullName: `${user.name} ${user.lastname}`.toUpperCase()
      })))
    );
  }

  // Get user by ID
  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      map(user => ({
        ...user,
        fullName: `${user.name} ${user.lastname}`.toUpperCase()
      }))
    );
  }

  // Get user by email
  getUserByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/by-email`, {
      params: { email }
    }).pipe(
      map(user => ({
        ...user,
        fullName: `${user.name} ${user.lastname}`.toUpperCase()
      }))
    );
  }

  // Create a new user
  createUser(user: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, user);
  }

  // Update a user
  updateUser(id: number, user: UsuarioUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Login
  login(credentials: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }
}