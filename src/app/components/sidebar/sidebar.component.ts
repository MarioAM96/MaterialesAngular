import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  userName: string = '';
  userRol: string = '';
  isCollapsed: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    const storedUserName = sessionStorage.getItem('userName');
    const storedRol = sessionStorage.getItem('authToken');
    
    if (storedUserName) {
      this.userName = storedUserName;
    }
    if (storedRol) {
      this.userRol = storedRol;
    }

    this.sidebarService.sidebarCollapsed$.subscribe(
      (collapsed) => (this.isCollapsed = collapsed)
    );
  }
}