import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-deliveries',
  imports: [AgGridAngular, HttpClientModule],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.scss',
  providers: [ApiService],
})
export class DeliveriesComponent {
  @ViewChild('myGrid') myGrid!: AgGridAngular;

  public rowData: any[] | null = null;
  private checkboxStates: { [key: string]: boolean } = {};

  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', type: 'text' },
    {
      field: 'Material Solicitado',
      headerName: 'Material Solicitado',
      type: 'text',
    },
    { field: 'Cantidad', headerName: 'Cantidad', type: 'number' },
    { field: 'Observación', headerName: 'Observación', type: 'text' },
    {
      field: 'Fecha solicitada',
      headerName: 'Fecha Solicitada',
      type: 'date',
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'Paquete de Trabajo',
      headerName: 'Paquete de Trabajo',
      type: 'text',
    },
    {
      field: 'Técnico Responsable',
      headerName: 'Técnico Responsable',
      type: 'text',
    },
    { field: 'Status Entrega', headerName: 'Status Entrega', type: 'text' },
    { field: 'Bodega', headerName: 'Bodega', type: 'number' },
    { field: 'Código', headerName: 'Código', type: 'number' },
    {
      field: 'Fecha de entrega',
      headerName: 'Fecha de Entrega',
      type: 'date',
      valueFormatter: (params) => {
        if (params.value === 0) return 'N/A';
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'Cantidad Entregada',
      headerName: 'Cantidad Entregada',
      type: 'number',
    },
    { field: 'udf', headerName: 'UDF', type: 'text' },
  ];

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] = [10, 25, 50, 100, 200];

  constructor(
    private apiService: ApiService,
    private activeSheetService: ActiveSheetService
  ) {}

  ngOnInit() {
    const activeSheetId = sessionStorage.getItem('activeSheetId');
    this.apiService.getDeliveries().subscribe(
      (response) => {
        this.rowData = response;
        if (activeSheetId) {
          this.rowData?.forEach((row) => {
            this.checkboxStates[row.id] = row.sheetid === activeSheetId;
          });
        }
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
