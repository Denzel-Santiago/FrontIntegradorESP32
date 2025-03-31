import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { VentasComponent } from './Pages/ventas/ventas.component';
import { LoginComponent } from './Pages/login/login.component';
import { AdminComponent } from './Pages/admin/admin.component';

export const routes: Routes = [

    
    { path: '', component: HomeComponent },
    { path: 'ventas', component: VentasComponent },
    { path: 'login', component: LoginComponent},
    { path: 'admin', component: AdminComponent},
    
];
