import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-700 mb-2">{{ titulo }}</h2>
      <p class="text-sm text-gray-400">Módulo en desarrollo — Próximamente disponible</p>
    </div>
  `,
})
export class PlaceholderComponent {
  titulo = 'Módulo';
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(d => { if (d['titulo']) this.titulo = d['titulo']; });
  }
}
