import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userName: string = ''; // Variable para el nombre del usuario
  userRol: string = ''; // Variable para el rol del usuario
  isCollapsed: boolean = false; // Estado de la barra lateral (expandida o colapsada)

  @Output() toggle = new EventEmitter<boolean>(); // Emisor para notificar cambios

  ngOnInit() {
    // Recuperamos el nombre y el rol del usuario desde sessionStorage
    const storedUserName = sessionStorage.getItem('userName');
    const storedRol = sessionStorage.getItem('authToken');
    
    if (storedUserName) {
      this.userName = storedUserName;
    }
    if (storedRol) {
      this.userRol = storedRol;
    }
  }

  // Método para alternar el estado de la barra lateral (colapsada o expandida)
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed); // Emitimos el nuevo estado
  }
}