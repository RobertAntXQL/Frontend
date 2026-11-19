import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface LoginResponse {
  token: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storageKey = 'electrostore_jwt';
  private readonly usernameKey = 'electrostore_usuario';

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, {
      username: username.trim(), password
    }).pipe(
      tap(response => {
        if (!response?.token) {
          throw new Error('El backend no devolvió un token JWT.');
        }
        localStorage.setItem(this.storageKey, response.token);
        localStorage.setItem(this.usernameKey, username.trim());
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  getUsername(): string {
    return localStorage.getItem(this.usernameKey) ?? 'Usuario';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      // Validación local de expiración; el backend valida firma y permisos.
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.usernameKey);
  }

  logoutAndRedirect(): void {
    this.logout();
    void this.router.navigate(['/login']);
  }
}
