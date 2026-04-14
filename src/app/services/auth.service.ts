import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal(false);
  private readonly _currentUser = signal<{ usuario: string; nombre: string } | null>(null);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private router: Router) {
    const saved = sessionStorage.getItem('conciliaciones_user');
    if (saved) {
      this._isLoggedIn.set(true);
      this._currentUser.set(JSON.parse(saved));
    }
  }

  login(usuario: string, _clave: string): boolean {
    const user = { usuario, nombre: usuario === '40108915' ? 'Jeremy Aquarius' : `Usuario ${usuario}` };
    this._isLoggedIn.set(true);
    this._currentUser.set(user);
    sessionStorage.setItem('conciliaciones_user', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    sessionStorage.removeItem('conciliaciones_user');
    this.router.navigate(['/login']);
  }
}
