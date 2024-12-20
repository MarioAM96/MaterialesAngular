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
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

interface Proyecto {
  id: string;
  materialSolicitado: string;
  cantidad: string;
  observacion: string;
  fechaSolicitada: string;
  paqueteTrabajo: string;
  tecnicoResponsable: string;
  statusEntrega: string;
  bodega: string;
  codigo: string;
  fechaEntrega: string;
  cantidadEntregada: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
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
    FormsModule
  ],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {
  allColumns = [
    { name: 'ID', property: 'id', visible: true },
    { name: 'Material Solicitado', property: 'materialSolicitado', visible: true },
    { name: 'Cantidad', property: 'cantidad', visible: true },
    { name: 'Observación', property: 'observacion', visible: true },
    { name: 'Fecha Solicitada', property: 'fechaSolicitada', visible: true },
    { name: 'Paquete de Trabajo', property: 'paqueteTrabajo', visible: true },
    { name: 'Técnico Responsable', property: 'tecnicoResponsable', visible: true },
    { name: 'Status Entrega', property: 'statusEntrega', visible: true },
    { name: 'Bodega', property: 'bodega', visible: true },
    { name: 'Código', property: 'codigo', visible: true },
    { name: 'Fecha de Entrega', property: 'fechaEntrega', visible: true },
    { name: 'Cantidad Entregada', property: 'cantidadEntregada', visible: true }
  ];

  columnFilter: string = '';
  dataSource = new MatTableDataSource<Proyecto>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getDataFromApi();
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
    return this.allColumns.filter(column => column.visible).map(column => column.property);
  }

  getDataFromApi(): void {
    const apiUrl = 'https://api.tvmax.ec/api/get-deliveries/1UliJqH6oNuZEk6l72r7alxHe5QOyYGS6ZzS8NtyfYP4/PEDIDOS/materiales-fibramax-65bb0c225f90.json';

    this.http.get<any[]>(apiUrl).subscribe(data => {
      const mappedData = data.map(item => ({
        id: item.id,
        materialSolicitado: item['Material Solicitado'],
        cantidad: item['Cantidad'],
        observacion: item['Observación'],
        fechaSolicitada: item['Fecha solicitada'],
        paqueteTrabajo: item['Paquete de Trabajo'],
        tecnicoResponsable: item['Técnico Responsable'],
        statusEntrega: item['Status Entrega'],
        bodega: item['Bodega'],
        codigo: item['Código'],
        fechaEntrega: item['Fecha de entrega'],
        cantidadEntregada: item['Cantidad Entregada']
      }));

      this.dataSource.data = mappedData;
    });
  }

  toggleAllColumns(visible: boolean) {
    this.allColumns.forEach(column => column.visible = visible);
  }
  
  filteredColumns() {
    return this.allColumns.filter(column => column.name.toLowerCase().includes(this.columnFilter.toLowerCase()));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allColumns, event.previousIndex, event.currentIndex);
  }
  
}