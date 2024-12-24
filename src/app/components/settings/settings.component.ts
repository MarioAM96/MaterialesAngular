import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'my-app',
  imports: [AgGridAngular, HttpClientModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ApiService],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('myGrid') myGrid!: AgGridAngular;

  public rowData: any[] | null = null;

  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'filename', headerName: 'Nombre de Archivo', editable: true },
    { field: 'size', headerName: 'Tamaño', filter: 'agNumberColumnFilter' },
    {
      field: 'last_modified',
      headerName: 'Última Modificación',
      valueFormatter: (params) => {
        const date = new Date(params.value * 1000);
        return date.toLocaleDateString();
      },
    },
    { field: 'sheetid', headerName: 'Sheet ID' },
  ];

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] = [10, 25, 50];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getProyects().subscribe(
      (response) => {
        console.log('Proyectos obtenidos:', response);
        this.rowData = response;
      },
      (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    );
  }

  ngAfterViewInit() {
    console.log(this.myGrid.api);
  }
}
