import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatCardModule, // Para utilizar mat-card
    MatIconModule,
    FontAwesomeModule,RouterModule
      // Para utilizar mat-icon
  ]
})
export class DashboardComponent {
  pendingOrders: number = 25; // Número predefinido de pedidos pendientes
}