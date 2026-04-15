import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-sm font-medium text-gray-600">Inventario General de Activos Fijos — SIGPRO</h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-aquarius-100 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-aquarius-700">{{ initials }}</span>
          </div>
          <span class="text-sm text-gray-700 font-medium">{{ authService.currentUser()?.nombre }}</span>
        </div>
        <button (click)="authService.logout()" class="text-gray-400 hover:text-red-500 transition-colors" title="Cerrar sesión">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  get initials(): string {
    const name = this.authService.currentUser()?.nombre ?? '';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
