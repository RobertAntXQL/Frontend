import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  menuAbierto = false;

  get username(): string { return this.auth.getUsername(); }
  get inicial(): string { return this.username.charAt(0).toUpperCase(); }

  toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }
  cerrarMenu(): void { this.menuAbierto = false; }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void { this.cerrarMenu(); }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
