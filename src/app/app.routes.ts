import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';  // Importa el LayoutComponent
import { AuthGuard } from './guards/auth.guard';
import { ProyectosComponent } from './proyectos/proyectos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,  // Ruta para el Layout, contiene el navbar
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'proyectos', component: ProyectosComponent, canActivate: [AuthGuard] },
      // Agrega más rutas aquí si es necesario
    ]
  }
];
