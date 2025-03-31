// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivate(route: any): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.usuarioService.currentUserValue;
    const requiredRoles = route.data?.roles as number[];
    
    if (currentUser && currentUser.token) {
      // Verificar roles si la ruta los requiere
      if (requiredRoles && !requiredRoles.includes(currentUser.user?.roleId || 0)) {
        // Redirigir a home si no tiene el rol necesario
        return this.router.createUrlTree(['/']);
      }
      return true;
    } else {
      // Redirigir al login si no está autenticado
      return this.router.createUrlTree(['/login']);
    }
  }
}