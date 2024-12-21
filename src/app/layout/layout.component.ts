import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <app-sidebar
      (toggle)="onSidebarToggle($event)"
      [class.collapsed]="isSidebarCollapsed"
    ></app-sidebar>
    <main class="content" [class.collapsed]="isSidebarCollapsed">
      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  imports: [RouterModule, NavbarComponent, SidebarComponent],
  styles: [
    `
      :host {
        display: block;
        height: 100vh; /* Ocupa toda la altura de la ventana */
        overflow: hidden; /* Evita scroll en la página */
      }

      app-navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
      }

      app-sidebar {
        position: fixed;
        top: 56px; /* Altura del navbar */
        left: 0;
        width: 250px; /* Ancho cuando está expandido */
        height: calc(100% - 56px);
        background-color: #f8f9fa;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden; /* Evita scroll en el sidebar */
        transition: width 0.3s ease;
      }

      /* Aquí hacemos el cambio para que el sidebar se contraiga en lugar de ocultarse */
      app-sidebar.collapsed {
        width: 60px; /* Ancho reducido cuando está colapsado */
      }

      .content {
        margin-top: 56px; /* Altura del navbar */
        margin-left: 250px; /* Ancho del sidebar expandido */
        height: calc(100% - 56px);
        overflow: hidden; /* Evita scroll en el contenido */
        transition: margin-left 0.3s ease;
      }

      /* Ajustamos el margen izquierdo del contenido cuando el sidebar está colapsado */
      .content.collapsed {
        margin-left: 60px; /* Ancho del sidebar colapsado */
      }

      .content-container {
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fff;
        padding: 20px;
        margin: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        /* Ajustamos la altura considerando padding y margen */
        height: calc(100% - 20px); /* Altura total menos padding y margen verticales (2 * 20px + 2 * 20px) */
        overflow-y: auto; /* Permite desplazamiento vertical si el contenido excede la altura */
        box-sizing: border-box; /* Asegura que padding y border se incluyan en el cálculo del tamaño */
      }
    `,
  ],
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}