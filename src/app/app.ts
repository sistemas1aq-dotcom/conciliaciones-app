import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    @if (authService.isLoggedIn()) {
      <div class="h-screen flex bg-gray-50">
        <app-sidebar />
        <div class="flex-1 flex flex-col min-w-0">
          <app-header />
          <main class="flex-1 overflow-y-auto p-6">
            <router-outlet />
          </main>
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `,
})
export class App {
  constructor(public authService: AuthService) {}
}
