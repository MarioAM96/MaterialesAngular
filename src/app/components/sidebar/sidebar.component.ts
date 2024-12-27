import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faClipboardList,
  faTruck,
  faCog,
  faTasks,
  faUsers,
  faCubes,
  faUser
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class SidebarComponent implements OnInit {
  userName: string = '';
  userRol: string = '';
  isCollapsed: boolean = false;

  constructor(
    private sidebarService: SidebarService,
    private iconLibrary: FaIconLibrary
  ) {
    this.iconLibrary.addIcons(
      faHome,
      faClipboardList,
      faTruck,
      faCog,
      faTasks,
      faUsers,
      faCubes,
      faUser
    );
  }

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