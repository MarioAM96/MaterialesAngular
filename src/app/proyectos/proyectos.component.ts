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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Proyecto } from '../models/proyectos.model';
import { AddUsersComponent } from '../add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-proyectos',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
  providers: [ApiService],
})
export class ProyectosComponent implements OnInit {
  allColumns = [
    { name: 'ID', property: 'id', visible: true },
    { name: 'Nombre del Archivo', property: 'filename', visible: true },
    { name: 'Tamaño', property: 'size', visible: true },
    { name: 'Ultima Modificación', property: 'last_modified', visible: true },
    { name: 'Sheet ID', property: 'sheetid', visible: true },
  ];
  isLoading: boolean = false;
  ApiService: any;

  columnFilter: string = '';
  dataSource = new MatTableDataSource<Proyecto>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getProjectsFromApi();
    this.dataSource.filterPredicate = (data: Proyecto, filter: string) => {
      const dataStr = Object.values(data).join(' ').toLowerCase(); // Convertir todos los valores de la fila a texto
      // Normalizar los datos y el filtro antes de compararlos
      const normalizedDataStr = this.removeTildes(dataStr);
      const normalizedFilter = this.removeTildes(filter);
      return normalizedDataStr.includes(normalizedFilter); // Comparar sin tildes
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  removeTildes(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Elimina los caracteres diacríticos
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const normalizedFilterValue = this.removeTildes(filterValue)
      .trim()
      .toLowerCase();
    this.dataSource.filter = normalizedFilterValue;
  }

  get displayedColumns(): string[] {
    return this.allColumns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  getProjectsFromApi(): void {
    this.isLoading = true; // Inicia la carga
    this.apiService.getProyects().subscribe(
      (data: any[]) => {
        const mappedData = data.map((item) => ({
          id: item.id,
          filename: item.filename,
          size: item.size,
          last_modified: item.last_modified,
          sheetid: item.sheetid,
        }));
        this.dataSource.data = mappedData;
        this.isLoading = false; // Finaliza la carga
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.isLoading = false; // Finaliza la carga en caso de error
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

    dialogRef.afterClosed().subscribe((result: Proyecto) => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result]; // Añade el nuevo usuario a la tabla
      }
    });
  }
}
