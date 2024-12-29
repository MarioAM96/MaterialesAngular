import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ActiveSheetService } from '../../services/activesheet.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Proyecto } from '../../models/proyectos.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    Select,
  ],
  providers: [ApiService],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    selectedCity: new FormControl<Proyecto | null>(null),
  });

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  projects: Proyecto[] = [];
  selectedProject: string = '';
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private activeSheetService: ActiveSheetService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login({ email: this.email, password: this.password })
      .then((success) => {
        this.isLoading = false;
        if (success) {
          this.isLoggedIn = true;
          this.loadProjects();
        } else {
          this.errorMessage =
            'Inicio de sesión fallido. Por favor verifica tus credenciales.';
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
    const selectedCity = this.formGroup?.get('selectedCity')?.value; 

    if (selectedCity) {
      this.activeSheetService.setActiveSheetId(selectedCity.sheetid);
      sessionStorage.setItem('activeSheetFilename', selectedCity.filename);
      this.router.navigate(['/dashboard'], {
        queryParams: { project: selectedCity.sheetid },
      });
    }
  }
}
