// usuario.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent {
  currentUser: Usuario | null = null;

  constructor(private router: Router) {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.currentUser = parsedData.user || parsedData; // Compatibilidad con ambos formatos
    } else {
      // Si no hay usuario, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  logout() {
    // Limpiar localStorage y redirigir al login
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}