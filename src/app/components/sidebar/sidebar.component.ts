import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-60 bg-aquarius-900 text-white flex flex-col h-full shrink-0">
      <!-- Logo -->
      <div class="p-5 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-aquarius-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
            </svg>
          </div>
          <div>
            <p class="font-bold text-sm">Conciliaciones</p>
            <p class="text-[10px] text-aquarius-300">Aquarius Consulting</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-3 space-y-1">
        @for (item of menuItems; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-aquarius-700/60 text-white" [routerLinkActiveOptions]="{exact: item.exact}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-aquarius-200 hover:bg-aquarius-700/40 hover:text-white transition-all group">
            <div [innerHTML]="item.icon"></div>
            <span>{{ item.label }}</span>
            @if (item.badge) {
              <span class="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{ item.badge }}</span>
            }
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-white/10">
        <p class="text-[10px] text-aquarius-400 text-center">v2026.1.01</p>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  menuItems = [
    {
      route: '/dashboard',
      label: 'Dashboard',
      exact: true,
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>',
    },
    {
      route: '/conciliaciones',
      label: 'Conciliaciones',
      exact: false,
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    },
    {
      route: '/reportes',
      label: 'Reportes',
      exact: false,
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      badge: '3',
    },
    {
      route: '/ai-assistant',
      label: 'Asistente IA',
      exact: false,
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 5.527a.5.5 0 01-.457.298H7.927a.5.5 0 01-.457-.298L5 14.5m14 0H5"/></svg>',
    },
  ];
}
