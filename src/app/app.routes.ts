import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';  // Importa el LayoutComponent
import { AuthGuard } from './guards/auth.guard';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [AuthGuard, RoleGuard], 
        data: { expectedRoles: ['Administrador', 'Técnico'] } 
      },
      { 
        path: 'proyectos', 
        component: ProyectosComponent, 
        canActivate: [AuthGuard, RoleGuard], 
        data: { expectedRoles: ['Administrador'] } 
      },
      { 
        path: 'usuarios', 
        component: UsuariosComponent, 
        canActivate: [AuthGuard, RoleGuard], 
        data: { expectedRoles: ['Administrador'] } 
      },
      { 
        path: 'materiales', 
        component: MaterialsComponent, 
        canActivate: [AuthGuard, RoleGuard], 
        data: { expectedRoles: ['Administrador', 'Técnico'] } 
      },
      { 
        path: 'settings', 
        component: SettingsComponent, 
        canActivate: [AuthGuard, RoleGuard], 
        data: { expectedRoles: ['Administrador','Técnico'] } 
      },
    ]
  }
];