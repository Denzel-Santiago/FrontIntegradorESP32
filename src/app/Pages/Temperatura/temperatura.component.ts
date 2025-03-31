// usuario.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';
import { SidebarComponent } from "../../component/sidebar/sidebar.component";

@Component({
  selector: 'app-temperatura',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './temperatura.component.html',
})
export class temperaturaComponent {
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