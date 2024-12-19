import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule] 
})
export class DashboardComponent {
  // Datos de prueba para la tabla
  data = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
    { id: 3, name: 'Sam Brown', email: 'sam.brown@example.com', role: 'Manager' },
    { id: 4, name: 'Lisa White', email: 'lisa.white@example.com', role: 'User' }
  ];
}
