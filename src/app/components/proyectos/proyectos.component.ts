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
  unlockedProyects: Proyecto[] = [];
  lockedProyects: Proyecto[] = [];
  loading: boolean = false;

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit() {
    this.fetchProyects();
  }

  fetchProyects() {
    this.loading = true;
    this.apiService.getProyects().subscribe(
      (response) => {
        this.unlockedProyects = response;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
      }
    );
  }

  toggleLock(data: Proyecto, frozen: boolean, index: number) {
    if (frozen) {
      this.lockedProyects.splice(index, 1);
      this.unlockedProyects.push(data);
    } else {
      this.unlockedProyects.splice(index, 1);
      this.lockedProyects.push(data);
    }
    this.sortProyects();
  }

  sortProyects() {
    this.unlockedProyects.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }
}