import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-add-users',
  imports: [
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [ApiService],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss',
})
export class AddUsersComponent {
  usuario: Usuario = {
    id: '',
    Nombre: '',
    Rol: '',
    Password: '',
  };
  ApiService: any;

  constructor(
    public dialogRef: MatDialogRef<AddUsersComponent>,
    private apiService: ApiService, // Inyectamos ApiService
    private snackBar: MatSnackBar // Inyectamos MatSnackBar
  ) {}

  save() {
    console.log('Usuario antes de guardar:', this.usuario);
    
    const payload = {
      userName: this.usuario.Nombre,
      accountType: this.usuario.Rol,
      password: this.usuario.Password,
    };
    console.log("payload", payload);
    
    this.apiService.addUser(payload).subscribe(
      (response: any) => {
        console.log('Usuario agregado exitosamente:', response);
        if (response.status) {
          this.snackBar.open('Usuario creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success'], // Estilo para éxito
          });
          this.dialogRef.close(this.usuario);
        } else {
          this.snackBar.open('Error al crear el usuario', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-error'], // Estilo para error
          });
        }
      },
      (error: any) => {
        console.error('Error al agregar usuario:', error);
        this.snackBar.open('Ocurrió un error al crear el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error'], // Estilo para error
        });
      }
    );
  }
  
  close() {
    this.dialogRef.close(); // Cierra sin devolver datos
  }  
}
