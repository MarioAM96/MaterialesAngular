import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <app-sidebar></app-sidebar>
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
        height: 100vh;
        overflow: hidden;
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
        top: 56px;
        left: 0;
        width: 250px;
        height: calc(100% - 56px);
        //background-color: #f8f9fa;
        //box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: width 0.3s ease;
      }

      app-sidebar.collapsed {
        width: 80px;
      }

      .content {
        margin-top: 56px;
        margin-left: 250px;
        height: calc(100% - 56px);
        overflow: hidden;
        transition: margin-left 0.3s ease;
      }

      .content.collapsed {
        margin-left: 80px;
      }

      .content-container {
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fff;
        //background-color: #CAD593;
        padding: 20px;
        margin: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        height: calc(100% - 20px);
        overflow-y: auto;
        box-sizing: border-box;
      }

      @media (max-width: 768px) {
        .content {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.sidebarCollapsed$.subscribe(
      (collapsed) => (this.isSidebarCollapsed = collapsed)
    );
  }
}