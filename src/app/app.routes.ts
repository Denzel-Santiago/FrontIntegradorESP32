//app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { VentasComponent } from './Pages/ventas/ventas.component';
import { LoginComponent } from './Pages/login/login.component';
import { AdminComponent } from './Pages/admin/admin.component';
import { UsuarioComponent } from './Pages/user/usuario.component';
import { AuthGuard } from './AuthGuard/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ventas', component: VentasComponent },
    { path: 'login', component: LoginComponent},
    { 
      path: 'admin', 
      component: AdminComponent,
      canActivate: [AuthGuard],
      data: { roles: [1] } // Solo rol 1 (admin)
    },
    { 
      path: 'user', 
      component: UsuarioComponent,
      canActivate: [AuthGuard],
      data: { roles: [2] } // Solo rol 2 (usuario normal)
    },
    // Redirección por defecto
    { path: '**', redirectTo: '' }
];
