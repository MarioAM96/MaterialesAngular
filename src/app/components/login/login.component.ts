import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule],  // Include CommonModule in the imports array
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login({ email: this.email, password: this.password }).then((success) => {
      this.isLoading = false;
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Inicio de sesión fallido. Por favor verifica tus credenciales.';
      }
    });
  }
}