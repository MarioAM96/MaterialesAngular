import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Proyecto } from '../../models/proyectos.model';
import { ApiService } from '../../services/api.service';
import { MessageService, SelectItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ActiveSheetService } from '../../services/activesheet.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TagModule
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
  providers: [MessageService, ApiService],
})

export class ProyectosComponent implements OnInit {
  projects: Proyecto[] = [];
  unlockedProject: Proyecto | null = null;
  loading: boolean = false;
  statuses!: SelectItem[];

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private activeSheetService: ActiveSheetService
  ) {}

  ngOnInit() {
    const activeSheetId = sessionStorage.getItem('activeSheetId');
    if (activeSheetId) {
      this.fetchProjects(activeSheetId);
    } else {
      this.fetchProjects();
    }
  }

  fetchProjects(activeSheetId?: string) {
    this.loading = true;
    this.apiService.getProyects().subscribe(
      (response) => {
        this.projects = response;
        if (activeSheetId) {
          const projectToUnlock = this.projects.find(
            (project) => project.sheetid === activeSheetId
          );
          if (projectToUnlock) {
            this.unlockedProject = projectToUnlock;
          }
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los proyectos',
        });
      }
    );
  }

  toggleLock(project: Proyecto) {
    if (this.unlockedProject && this.unlockedProject.id === project.id) {
      this.unlockedProject = null;
      sessionStorage.removeItem('activeSheetId');
      sessionStorage.setItem('activeSheetFilename', '');
    } else {
      this.unlockedProject = project;
      sessionStorage.setItem('activeSheetId', project.sheetid);
      this.activeSheetService.setActiveSheetId(project.sheetid);
      sessionStorage.setItem('activeSheetFilename', project.filename); 
    }
  }

  isProjectUnlocked(project: Proyecto): boolean {
    return (
      this.unlockedProject !== null && this.unlockedProject.id === project.id
    );
  }
}