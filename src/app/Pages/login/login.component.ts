//login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.services';
import { LoginData } from '../../interfaces/usuario.interface';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterModule],
    standalone: true,
    templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: LoginData = {
    email: '',
    password: ''
  };
  mensajeError: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  iniciarSesion() {
    this.isLoading = true;
    this.mensajeError = '';
    
    this.usuarioService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Redirigir según el rol
        if (response.user.roleId === 1) {
          this.router.navigate(['/admin']);
        } else if (response.user.roleId === 2) {
          this.router.navigate(['/user']);
        } else {
          // Rol no reconocido, redirigir a home
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.mensajeError = 'Email o contraseña incorrectos';
        console.error('Error en el login:', error);
      }
    });
  }
}