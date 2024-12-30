import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ImportsModule } from '../../imports';
import { MessageService, SelectItem } from 'primeng/api';
import { ProductService } from '../../services/productservice';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FontAwesomeModule,
    RouterModule,
    ImportsModule,
  ],
  providers: [MessageService, ProductService],
})
export class DashboardComponent {
  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  pedidosList: {
    material: string;
    cantidad: number | null;
    observacion: string;
    fechaSolicitada: string;
    paqueteTrabajo: string;
    tecnico: string;
  }[] = [];

  products!: Product[];

  statuses!: SelectItem[];

  clonedProducts: { [s: string]: Product } = {};

  pendingOrders: number = 25;

  ngOnInit() {
    // this.productService.getProductsMini().then((data) => {
    //   this.products = data;
    // });

    this.pedidosList = [
      {
        material: 'Cemento',
        cantidad: 50,
        observacion: 'Requiere entrega urgente',
        fechaSolicitada: '2024-12-30',
        paqueteTrabajo: 'Paquete A',
        tecnico: 'Juan Pérez'
      },
      {
        material: 'Arena',
        cantidad: 100,
        observacion: 'Verificar calidad antes de entrega',
        fechaSolicitada: '2024-12-31',
        paqueteTrabajo: 'Paquete B',
        tecnico: 'Maria Gómez'
      },
      {
        material: 'Grava',
        cantidad: 200,
        observacion: 'Pedido regular',
        fechaSolicitada: '2024-12-29',
        paqueteTrabajo: 'Paquete C',
        tecnico: 'Carlos Rodríguez'
      },
      {
        material: 'Ladrillos',
        cantidad: 150,
        observacion: 'Urgente, entregar antes de fin de mes',
        fechaSolicitada: '2024-12-28',
        paqueteTrabajo: 'Paquete D',
        tecnico: 'Ana Torres'
      }
    ];
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price !== undefined && product.price > 0) {
      delete this.clonedProducts[product.id as string];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Price',
      });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
}
