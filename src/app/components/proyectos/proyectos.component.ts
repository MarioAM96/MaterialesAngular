import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Proyecto } from '../../models/proyectos.model';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
  providers: [MessageService, ApiService],
})
export class ProyectosComponent implements OnInit {
  projects: Proyecto[] = [];
  unlockedProject: Proyecto | null = null;
  loading: boolean = false;

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    this.apiService.getProyects().subscribe(
      (response) => {
        this.projects = response;
        this.unlockedProject = null; // Todos los proyectos inician bloqueados
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
      }
    );
  }

  toggleLock(project: Proyecto) {
    if (this.unlockedProject && this.unlockedProject.id === project.id) {
      // Si el proyecto ya está desbloqueado, lo bloqueamos
      this.unlockedProject = null;
    } else {
      // Desbloqueamos el proyecto seleccionado y bloqueamos el anterior (si existe)
      this.unlockedProject = project;
    }
  }

  isProjectUnlocked(project: Proyecto): boolean {
    return this.unlockedProject !== null && this.unlockedProject.id === project.id;
  }
}