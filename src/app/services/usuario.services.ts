//usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  private currentUserSubject: BehaviorSubject<{user: Usuario | null, token: string | null}>;
  public currentUser$: Observable<{user: Usuario | null, token: string | null}>;

  constructor(private http: HttpClient) { 
    // Inicializar con valores del localStorage si existen
    const storedUser = localStorage.getItem('currentUser');
    const initialValue = storedUser ? JSON.parse(storedUser) : {user: null, token: null};
    this.currentUserSubject = new BehaviorSubject(initialValue);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Getter para el valor actual del usuario
  public get currentUserValue(): {user: Usuario | null, token: string | null} {
    return this.currentUserSubject.value;
  }

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
    return this.http.get<Usuario>(`${this.apiUrl}${id}`).pipe(
      map(user => ({
        ...user,
        fullName: `${user.name} ${user.lastname}`.toUpperCase()
      }))
    );
  }

  // Get user by email
  getUserByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}by-email`, {
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
    return this.http.put<Usuario>(`${this.apiUrl}${id}`, user);
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  // Login
  login(credentials: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, credentials).pipe(
      tap(response => {
        if (response.token && response.user) {
          // Almacenar usuario y token en localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            user: response.user,
            token: response.token
          }));
          // Emitir el nuevo valor
          this.currentUserSubject.next({
            user: response.user,
            token: response.token
          });
        }
      })
    );
  }

  // Logout
  logout(): void {
    // Remover usuario del localStorage
    localStorage.removeItem('currentUser');
    // Emitir null para los observadores
    this.currentUserSubject.next({user: null, token: null});
  }

  // Método para añadir el token a las solicitudes autenticadas
  private getAuthHeaders() {
    const currentUser = this.currentUserValue;
    if (currentUser.token) {
      return {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      };
    }
    return {};
  }
}