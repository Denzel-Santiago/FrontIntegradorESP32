import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  // Credenciales válidas (en producción usar un servicio)
  private usuarioValido = 'romi';
  private contrasenaValida = '1234';

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.usuario === this.usuarioValido && this.contrasena === this.contrasenaValida) {
      this.mensajeError = '';
      this.router.navigate(['/admin']);
    } else {
      this.mensajeError = 'Usuario o contraseña incorrectos';
    }
  }
}