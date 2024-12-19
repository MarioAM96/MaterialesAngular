import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userName: string = ''; // Variable para el nombre del usuariod
  userRol: string = ''; // Variable para el nombre del usuario
  isCollapsed: boolean = false; // Estado de la barra lateral (expandida o colapsada)

  ngOnInit() {
    // Recuperamos el nombre y el correo del usuario desde sessionStorage
    const storedUserName = sessionStorage.getItem('userName');
    const storedRol = sessionStorage.getItem('authToken');
    
    if (storedUserName) {
      this.userName = storedUserName;
    }
    if (storedUserName) {
      this.userRol = storedRol || '';
    }
  }

  // Método para alternar el estado de la barra lateral (colapsada o expandida)
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
