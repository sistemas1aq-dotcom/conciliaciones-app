import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HelpOverlayComponent } from './components/help-overlay/help-overlay.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, HelpOverlayComponent],
  template: `
    @if (authService.isLoggedIn()) {
      <div class="h-screen flex bg-gray-50 relative">
        <!-- Mobile overlay -->
        @if (sidebarOpen()) {
          <div class="fixed inset-0 bg-black/50 z-30 lg:hidden" (click)="sidebarOpen.set(false)"></div>
        }

        <!-- Sidebar -->
        <div [class]="sidebarOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
          class="fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out">
          <app-sidebar />
        </div>

        <div class="flex-1 flex flex-col min-w-0">
          <app-header
            (toggleSidebar)="sidebarOpen.set(!sidebarOpen())"
            (toggleHelp)="helpOpen.set(!helpOpen())" />
          <main class="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <router-outlet />
          </main>
        </div>

        <!-- Help overlay -->
        @if (helpOpen()) {
          <app-help-overlay (close)="helpOpen.set(false)" />
        }
      </div>
    } @else {
      <router-outlet />
    }
  `,
})
export class App {
  sidebarOpen = signal(false);
  helpOpen = signal(false);

  constructor(public authService: AuthService) {}
}
