import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor() {
    if (this.auth.isAuthenticated()) {
      void this.router.navigate(['/productos']);
    }
  }

  login(): void {
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Completa el usuario y la contraseña.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        void this.router.navigate(['/productos']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : err.status === 0
            ? `No se pudo conectar al backend en ${environment.apiUrl}.`
            : 'No fue posible iniciar sesión. Revisa el servidor.';
      }
    });
  }
}
