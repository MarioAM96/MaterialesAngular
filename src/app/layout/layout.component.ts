// layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";  // Importa RouterModule

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <app-sidebar></app-sidebar>
    <router-outlet></router-outlet>
  `,
  imports: [RouterModule, NavbarComponent, SidebarComponent],  // Asegúrate de agregar RouterModule aquí
})
export class LayoutComponent {}
