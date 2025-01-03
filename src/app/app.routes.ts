import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';  // Importa el LayoutComponent
import { AuthGuard } from './guards/auth.guard';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MaterialsComponent } from './materials/materials.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,  // Ruta para el Layout, contiene el navbar
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'proyectos', component: ProyectosComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
      { path: 'materiales', component: MaterialsComponent, canActivate: [AuthGuard] },
      // Agrega más rutas aquí si es necesario
    ]
  }
];
