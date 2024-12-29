import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { forkJoin } from 'rxjs';
import { Order } from '../../models/order.model';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Table } from 'primeng/table'


ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-orders',
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    ImportsModule,
    IftaLabelModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [ApiService],
})
export class OrdersComponent implements OnInit, AfterViewInit {
  selectedOrder: Order | undefined;
  clonedProducts: { [s: string]: any } = {};
  loading: boolean = true;
  
  @ViewChild('myGrid') myGrid!: AgGridAngular;
  @ViewChild('dt1') dt1: Table | undefined;
  orders!: Order[];

  public rowData: any[] | null = null;
  public rowDataMaterials: any[] | null = null;
  public rowDataTecnicos: any[] | null = null;

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

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
      (response: Order[]) => {
        this.orders = response.map((item) => new Order(item));
        this.loading = false;
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

    const requests = payloads.map((payload) =>
      this.apiService.addOrder(payload)
    );

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

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = { ...product }; // Guardar la fila original
  }

  // Guarda la edición de una fila
  onRowEditSave(product: any) {
    // Aquí puedes agregar cualquier lógica de validación o guardar los cambios
    delete this.clonedProducts[product.id]; // Elimina el estado clonado porque ya se guardó
  }

  // Cancela la edición de una fila y restaura el valor original
  onRowEditCancel(product: any, index: number) {
    this.pedidosList[index] = { ...this.clonedProducts[product.id] }; // Restaurar el valor original
    delete this.clonedProducts[product.id]; // Eliminar el clon
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  applyColumnFilter(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.dt1!.filter(value, field, 'contains');
  }
}
