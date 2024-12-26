import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [ApiService],
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  projects: any[] = [];
  selectedProject: string = '';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService,  private activeSheetService: ActiveSheetService) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login({ email: this.email, password: this.password }).then((success) => {
      this.isLoading = false;
      if (success) {
        this.isLoggedIn = true;
        this.loadProjects();
      } else {
        this.errorMessage = 'Inicio de sesión fallido. Por favor verifica tus credenciales.';
      }
    });
  }

  loadProjects() {
    this.apiService.getProyects().subscribe(
      (data: any) => {
        this.projects = data;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los proyectos.';
      }
    );
  }

  onProjectSelect() {
    if (this.selectedProject) {
      this.activeSheetService.setActiveSheetId(this.selectedProject);
      this.router.navigate(['/dashboard'], { queryParams: { project: this.selectedProject } });
    }
  }
}