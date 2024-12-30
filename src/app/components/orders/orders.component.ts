import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { forkJoin } from 'rxjs';
import { Order } from '../../models/order.model';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-orders',
  imports: [
    HttpClientModule,
    CommonModule,
    ImportsModule,
    IftaLabelModule,
    ToastModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [ApiService, MessageService],
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild('dt1') dt1: Table | undefined;

  selectedOrder: Order | undefined;
  clonedProducts: { [s: string]: any } = {};
  loading: boolean = true;
  orders!: Order[];
  public rowDataMaterials: any[] | null = null;
  public rowDataTecnicos: any[] | null = null;
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
    if (this.newOrder.fechaSolicitada) {
      const fecha = new Date(this.newOrder.fechaSolicitada);
      this.newOrder.fechaSolicitada = fecha.toISOString().split('T')[0];
    }

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
    this.newOrder = {
      material: '',
      cantidad: null,
      observacion: '',
      fechaSolicitada: '',
      paqueteTrabajo: '',
      tecnico: '',
    };
    this.pedidosList = [];
    this.showForm = false;
  }

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
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
    this.loading = true;
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
        this.getOrders();
        this.pedidosList = [];
        this.showForm = false;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Pedido ingresado',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un problema al enviar los pedidos.',
        });
        console.error('Error adding orders:', error);
      }
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    this.showForm = false;
  }

  onRowEditInit(pedidosList: any) {
    this.clonedProducts[pedidosList.id] = { ...pedidosList };
  }

  onRowEditSave(pedidosList: any) {
    delete this.clonedProducts[pedidosList.id];
  }

  onRowEditCancel(pedidosList: any, index: number) {
    this.pedidosList[index] = { ...this.clonedProducts[pedidosList.id] };
    delete this.clonedProducts[pedidosList.id];
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }
  applyColumnFilter(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.dt1!.filter(value, field, 'contains');
  }
}
