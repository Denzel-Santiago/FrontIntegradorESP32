import { Routes } from '@angular/router';
import { HomeComponent } from '../app//home//home.component';
import { VentasComponent } from './ventas/ventas.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [

    
    { path: '', component: HomeComponent },
    { path: 'ventas', component: VentasComponent },
    {path:'login',component:LoginComponent}





];
