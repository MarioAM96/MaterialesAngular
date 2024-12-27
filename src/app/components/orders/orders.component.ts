import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-orders',
  imports: [AgGridAngular, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [ApiService],
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild('myGrid') myGrid!: AgGridAngular;

  public rowData: any[] | null = null;
  public rowDataMaterials: any[] | null = null;
  public rowDataTecnicos: any[] | null = null;

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

  public showForm = false;
  newOrder = {
    material: '',
    cantidad: null,
    observacion: '',
    fechaSolicitada: '',
    paqueteTrabajo: '',
    tecnico: '',
  };
  public materials: { name: string; value: string }[] = [];
  public tecnicos: { name: string; value: string }[] = [];

  pedidosList: {
    material: string;
    cantidad: number | null;
    observacion: string;
    fechaSolicitada: string;
    paqueteTrabajo: string;
    tecnico: string;
  }[] = [];

  addOrder() {
    this.pedidosList.push({ ...this.newOrder });
    this.newOrder = {
      material: '',
      cantidad: null,
      observacion: '',
      fechaSolicitada: '',
      paqueteTrabajo: '',
      tecnico: '',
    };
  }

  cancelOrder() {
    // Limpiar el formulario
    this.newOrder = {
      material: '',
      cantidad: null,
      observacion: '',
      fechaSolicitada: '',
      paqueteTrabajo: '',
      tecnico: '',
    };

    // Vaciar la lista de pedidos
    this.pedidosList = [];

    // Ocultar el formulario
    this.showForm = false;
  }

  constructor(
    private apiService: ApiService,
    private activeSheetService: ActiveSheetService
  ) {}

  ngOnInit() {
    const activeSheetId = sessionStorage.getItem('activeSheetId');
    this.getOrders();
    this.getMaterials();
    this.getTecnicos();
  }

  getOrders() {
    this.apiService.getOrders().subscribe(
      (response) => {
        this.rowData = response;
      },
      (error) => {
        console.error('Error al obtener las ordenes:', error);
      }
    );
  }

  getMaterials() {
    this.apiService.getMaterials().subscribe(
      (response: any[]) => {
        this.rowDataMaterials = response;
        this.materials = response
          .filter((item) => item.Material && item.Material.trim() !== '')
          .map((item) => ({
            name: item.Material,
            value: item.id,
          }));
      },
      (error) => {
        console.error('Error al obtener los materiales:', error);
      }
    );
  }

  getTecnicos() {
    this.apiService.getUsers().subscribe(
      (response: any[]) => {
        this.rowDataTecnicos = response;
        this.tecnicos = response
          .filter((item) => item.Nombre && item.Nombre.trim() !== '')
          .map((item) => ({
            name: item.Nombre,
            value: item.id,
          }));
      },
      (error) => {
        console.error('Error al obtener los tecnicos:', error);
      }
    );
  }
  
  

  removeOrder(index: number) {
    this.pedidosList.splice(index, 1);
  }

  ngAfterViewInit() {
    //console.log(this.myGrid.api);
  }

  submitOrders() {
    const payloads = this.pedidosList.map((order) => ({
      
      unuse: '',
      material: order.material,
      quantity: order.cantidad,
      comment: order.observacion,
      soldate: order.fechaSolicitada,
      packagework: order.paqueteTrabajo,
      tecnico: order.tecnico,
      status: 'Pendiente',
    }));
  
    const requests = payloads.map((payload) => this.apiService.addOrder(payload));
  
    forkJoin(requests).subscribe(
      (responses) => {
        console.log('All orders added successfully:', responses);
        this.getOrders();
        this.pedidosList = [];
        this.showForm = false;
      },
      (error) => {
        console.error('Error adding orders:', error);
      }
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    console.log('Nuevo pedido:', this.newOrder);
    this.showForm = false; 
  }
}
