import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userName: string | null = '';
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getUserInitials(): string {
    if (!this.userName) return '';
    const names = this.userName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: MouseEvent) {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}