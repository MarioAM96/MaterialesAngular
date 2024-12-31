import { Component, ViewChild, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Deliveries } from '../../models/deliveries.model';
import { Table } from 'primeng/table';
import { ImportsModule } from '../../imports';
import { AccordionModule } from 'primeng/accordion';
import { Order } from '../../models/order.model';
import { FormsModule } from '@angular/forms';

import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  providers: [ApiService, MessageService],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ToastModule,
    ImportsModule,
    IftaLabelModule,
    FormsModule,
  ],
})
export class DeliveriesComponent implements OnInit {
  @ViewChild('dt4') dt4: Table | undefined;

  deliveries!: Deliveries[];
  public rowDataTecnicos: any[] | null = null;
  loading: boolean = true;
  public materials: { name: string; value: string }[] = [];
  public tecnicos: { name: string; value: string }[] = [];
  public showStepper: boolean = false;
  isAccordionHidden: boolean = true;
  orders!: Order[];
  visible: boolean = false;
  SelectedMaterial: any;
  SelectedCantidad: any;
  SelectedObservacion: any;
  SelectedFechaSolcitada: any;
  SelectedPaqueteTrabajo: any;
  SelectedTecnico: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getDeliveries();
    this.getTecnicos();
    this.getOrders();
  }

  getDeliveries() {
    this.apiService.getDeliveries().subscribe(
      (response: Deliveries[]) => {
        this.deliveries = response.map((item) => new Deliveries(item));
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las órdenes:', error);
      }
    );
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

  showDialog() {
    this.visible = true;
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
        console.error('Error al obtener los técnicos:', error);
      }
    );
  }

  selectOrder(order: Order) {
    this.showDialog();
    console.log('SELECTED ORDER', order);
    this.SelectedMaterial = order.MaterialSolicitado;
    this.SelectedCantidad = order.Cantidad;
    this.SelectedObservacion = order.Observacion;
    this.SelectedFechaSolcitada = order.Fechasolicitada;
    this.SelectedPaqueteTrabajo = order.PaquetedeTrabajo;
    this.SelectedTecnico = order.TecnicoResponsable;
    //this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt4!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }
  applyColumnFilter(event: Event, field: string) {
    const value = (event.target as HTMLInputElement).value;
    this.dt4!.filter(value, field, 'contains');
  }
  toggleAccordion(): void {
    this.isAccordionHidden = !this.isAccordionHidden;
  }
}
