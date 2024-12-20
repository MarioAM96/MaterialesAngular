import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddUsersComponent } from '../add-users/add-users.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
  ],
  providers: [ApiService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent {
  allColumns = [
    { name: 'ID', property: 'id', visible: true },
    { name: 'Nombre', property: 'Nombre', visible: true },
    { name: 'Rol', property: 'Rol', visible: true },
    { name: 'Password', property: 'Password', visible: true },
  ];
  ApiService: any;

  columnFilter: string = '';
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getUsersFromApi();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get displayedColumns(): string[] {
    return this.allColumns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  getUsersFromApi(): void {
    this.apiService.getUsers().subscribe(
      (data: any[]) => {
        const mappedData = data.map((item) => ({
          id: item.id,
          Nombre: item['Nombre'],
          Rol: item['Rol'],
          Password: item['Password'],
        }));
        this.dataSource.data = mappedData;
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  toggleAllColumns(visible: boolean) {
    this.allColumns.forEach((column) => (column.visible = visible));
  }

  filteredColumns() {
    return this.allColumns.filter((column) =>
      column.name.toLowerCase().includes(this.columnFilter.toLowerCase())
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allColumns, event.previousIndex, event.currentIndex);
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUsersComponent, {
      width: '400px',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result: Usuario) => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result]; // Añade el nuevo usuario a la tabla
      }
    });
  }
}
