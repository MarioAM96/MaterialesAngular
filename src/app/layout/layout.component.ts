import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <div class="layout-container">
      <app-sidebar (toggle)="onSidebarToggle($event)"></app-sidebar>
      <main class="content" [class.collapsed]="isSidebarCollapsed">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  imports: [RouterModule, NavbarComponent, SidebarComponent],
  styles: [
    `
      .layout-container {
        display: flex;
        flex-direction: row;
      }

      app-sidebar {
        flex-shrink: 0;
        background-color: #f8f9fa;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        height: calc(100vh - 56px); /* Altura total menos la del navbar */
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        transition: margin-left 0.3s ease;
      }

      .content.collapsed {
        margin-left: 0; /* Ajusta el margen cuando el sidebar está colapsado */
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