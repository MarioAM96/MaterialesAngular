import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-orders',
  imports: [AgGridAngular, HttpClientModule,FormsModule,CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [ApiService],
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild('myGrid') myGrid!: AgGridAngular;

  public rowData: any[] | null = null;
  private checkboxStates: { [key: string]: boolean } = {};

  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', type: 'text' },
    { field: 'Material Solicitado', headerName: 'Material Solicitado', type: 'text' },
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
    { field: 'Paquete de Trabajo', headerName: 'Paquete de Trabajo', type: 'text' },
    { field: 'Técnico Responsable', headerName: 'Técnico Responsable', type: 'text' },
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
    { field: 'Cantidad Entregada', headerName: 'Cantidad Entregada', type: 'number' },
    { field: 'udf', headerName: 'UDF', type: 'text' }
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
    tecnico: ''
  };
  public materials = ['Material 1', 'Material 2'];
  public tecnicos = ['Técnico 1', 'Técnico 2'];
  pedidosList: { material: string; cantidad: number | null; observacion: string; fechaSolicitada: string; paqueteTrabajo: string; tecnico: string; }[] = [];

  addOrder() {
    this.pedidosList.push({ ...this.newOrder });
    this.newOrder = {
      material: '',
      cantidad: null,
      observacion: '',
      fechaSolicitada: '',
      paqueteTrabajo: '',
      tecnico: ''
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
        tecnico: ''
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
    this.apiService.getOrders().subscribe(
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
  removeOrder(index: number) {
    this.pedidosList.splice(index, 1);
}

  ngAfterViewInit() {
    //console.log(this.myGrid.api);
  }

  submitOrders() {
    console.log('Pedidos a enviar:', this.pedidosList);
    // Aquí puedes añadir la lógica para enviar los pedidos
    this.pedidosList = []; // Limpiar la lista después de enviar
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    console.log('Nuevo pedido:', this.newOrder);
    // Aquí puedes agregar la lógica para enviar el nuevo pedido al servidor
    this.showForm = false; // Cierra el formulario después de enviar
  }
}