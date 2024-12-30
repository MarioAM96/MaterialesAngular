import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ImportsModule,
    Dialog,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
],
  providers: [ApiService, MessageService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  @ViewChild('dt3') dt3: Table | undefined;
  ApiService: any;
  users!: Usuario[];
  visible: boolean = false;
  loading: boolean = true;
  columnFilter: string = '';
  value!: string;
  rols: any[] | undefined;
  user = {
    Nombre: '',
    Rol: '',
    Password: ''
  };
  constructor(private http: HttpClient, private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getUsersFromApi();
    this.rols = ['Técnico','Administrador'];
  }

  ngAfterViewInit() {}

  getUsersFromApi(): void {
    this.apiService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  showDialog() {
    this.visible = true;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt3!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }
  applyColumnFilter(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.dt3!.filter(value, field, 'contains');
  }

  save() {
    if (!this.user.Nombre || !this.user.Rol || !this.user.Password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor completa todos los campos.',
      });
      return;
    }
  
    this.loading = true;
    const payload = {
      userName: this.user.Nombre.trim(),
      accountType: this.user.Rol,
      password: this.user.Password,
    };
  
    this.apiService.addUser(payload).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.status) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario creado exitosamente.',
          });
          this.getUsersFromApi(); // Refresca la lista de usuarios
          this.resetForm();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Ocurrió un problema al crear el usuario.',
          });
        }
      },
      (error: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el usuario. Intenta nuevamente más tarde.',
        });
        console.error('Error al agregar usuario:', error);
      }
    );
  }
  
  resetForm() {
    this.user = {
      Nombre: '',
      Rol: '',
      Password: ''
    };
  }

  cancel() {
    this.resetForm();
    this.visible = false;
  }
}
