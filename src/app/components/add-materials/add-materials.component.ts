import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-materials',
  imports: [
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [ApiService],
  templateUrl: './add-materials.component.html',
  styleUrl: './add-materials.component.scss'
})
export class AddMaterialsComponent {
  usuario: Usuario = {
    id: '',
    Nombre: '',
    Rol: '',
    Password: '',
  };
  ApiService: any;

  constructor(
    public dialogRef: MatDialogRef<AddMaterialsComponent>,
    private apiService: ApiService, // Inyectamos ApiService
    private snackBar: MatSnackBar // Inyectamos MatSnackBar
  ) {}

  save() {
    const payload = {
      userName: this.usuario.Nombre,
      accountType: this.usuario.Rol,
      password: this.usuario.Password,
    };
    //console.log("payload", payload);

    this.apiService.addUser(payload).subscribe(
      (response: any) => {
        console.log('Usuario agregado exitosamente:', response);
        if (response.status) {
          Swal.fire({
            title: 'Éxito!',
            text: 'Usuario creado correctamente',
            icon: 'success',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4CAF50',
          });
          this.dialogRef.close(this.usuario);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al crear el usuario',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#F44336',
          });
        }
      },
      (error: any) => {
        console.error('Error al agregar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al crear el usuario',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#F44336',
        });
      }
    );
  }
  
  close() {
    this.dialogRef.close(); // Cierra sin devolver datos
  }  
}
