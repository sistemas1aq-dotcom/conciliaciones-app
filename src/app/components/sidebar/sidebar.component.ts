import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-60 bg-[#1a3a5f] text-white flex flex-col h-full shrink-0 overflow-y-auto">
      <!-- Logo -->
      <div class="p-4 border-b border-white/10 text-center">
        <div class="w-14 h-14 bg-white/10 rounded-xl mx-auto mb-2 flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <p class="font-bold text-sm">{{ userName }}</p>
        <p class="text-[10px] text-blue-300 mt-0.5">Administrador</p>
        <div class="mt-2 text-[10px]">
          <p class="text-amber-300 font-semibold">AQUARIUS CONSULTING</p>
          <p class="text-blue-200 ml-2">GENÉRICA</p>
          <p class="text-blue-200 ml-1 flex items-center gap-1 justify-center mt-0.5">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>
            INV. GENERAL DE ACTIVOS FIJOS
          </p>
        </div>
      </div>

      <!-- Maestros -->
      <div class="p-2">
        <p class="text-[10px] text-blue-300 uppercase tracking-wider px-3 py-2 font-semibold">Maestros</p>
        @for (item of maestros; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-white/20 text-white font-semibold" class="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-blue-100 hover:bg-white/10 transition-all">
            <span [innerHTML]="item.icon" class="w-4 h-4 shrink-0"></span>
            {{ item.label }}
          </a>
        }
      </div>

      <!-- Cronograma -->
      <div class="p-2 pt-0">
        <p class="text-[10px] text-blue-300 uppercase tracking-wider px-3 py-2 font-semibold">Cronograma</p>
        @for (item of cronograma; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-white/20 text-white font-semibold" class="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-blue-100 hover:bg-white/10 transition-all">
            <span [innerHTML]="item.icon" class="w-4 h-4 shrink-0"></span>
            {{ item.label }}
          </a>
        }
      </div>

      <!-- Inventario -->
      <div class="p-2 pt-0">
        <p class="text-[10px] text-blue-300 uppercase tracking-wider px-3 py-2 font-semibold">Inventario</p>
        @for (item of inventario; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-white/20 text-white font-semibold" class="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-blue-100 hover:bg-white/10 transition-all">
            <span [innerHTML]="item.icon" class="w-4 h-4 shrink-0"></span>
            {{ item.label }}
          </a>
        }
      </div>

      <!-- Procesos Contables -->
      <div class="p-2 pt-0">
        <p class="text-[10px] text-blue-300 uppercase tracking-wider px-3 py-2 font-semibold">Procesos Contables</p>
        @for (item of procesosContables; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-white/20 text-white font-semibold" class="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-blue-100 hover:bg-white/10 transition-all">
            <span [innerHTML]="item.icon" class="w-4 h-4 shrink-0"></span>
            {{ item.label }}
          </a>
        }
      </div>

      <!-- Reportes -->
      <div class="p-2 pt-0">
        <p class="text-[10px] text-blue-300 uppercase tracking-wider px-3 py-2 font-semibold">Reportes</p>
        @for (item of reportes; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-white/20 text-white font-semibold" class="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-blue-100 hover:bg-white/10 transition-all">
            <span [innerHTML]="item.icon" class="w-4 h-4 shrink-0"></span>
            {{ item.label }}
          </a>
        }
      </div>

      <!-- IA -->
      <div class="p-2 pt-0">
        <p class="text-[10px] text-blue-300 uppercase tracking-wider px-3 py-2 font-semibold">Inteligencia Artificial</p>
        <a routerLink="/ai-assistant" routerLinkActive="bg-white/20 text-white font-semibold" class="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-blue-100 hover:bg-white/10 transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M14.25 3.104v5.714c0 .597.237 1.17.659 1.591L19 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.3 24.3 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5m-4.75-11.396c.251.023.501.05.75.082M19 14.5l-2.47 5.527a.5.5 0 01-.457.298H7.927a.5.5 0 01-.457-.298L5 14.5m14 0H5"/></svg>
          Asistente IA
        </a>
      </div>

      <!-- Footer -->
      <div class="mt-auto p-3 border-t border-white/10 flex items-center gap-2 justify-center">
        <span class="text-[10px] text-blue-300">v2026.1.01 FIXORA</span>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  userName = 'YSLA FRANCIA MIRIAN ANTONIA';
  si = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">';

  maestros = [
    { route: '/maestros/sedes', label: 'Sedes', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
    { route: '/maestros/ubicaciones', label: 'Ubicaciones', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
    { route: '/maestros/centros-costo', label: 'Centros de Costos', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
    { route: '/maestros/catalogo', label: 'Catálogo', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>' },
    { route: '/maestros/base-inventario', label: 'Base Inventario', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>' },
    { route: '/maestros/estados-conservacion', label: 'Estados de Conservación', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' },
    { route: '/maestros/estructura-contable', label: 'Estructura Contable', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
    { route: '/maestros/inventario-contable', label: 'Inventario Contable', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
  ];

  cronograma = [
    { route: '/cronograma/actividades', label: 'Actividades', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    { route: '/cronograma/entregables', label: 'Entregables relacionados', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
    { route: '/cronograma/docs-iso', label: 'Documentos ISO relacionados', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>' },
  ];

  inventario = [
    { route: '/inventario/base-capturas', label: 'Base Capturas', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>' },
    { route: '/inventario/procesar-depurar', label: 'Procesar y Depurar', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' },
    { route: '/inventario/importacion', label: 'Importación', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>' },
    { route: '/inventario/inventario-final', label: 'Inventario final', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    { route: '/inventario/registro-fotografico', label: 'Registro Fotográfico', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  ];

  procesosContables = [
    { route: '/procesos/conciliacion-automatica', label: 'Conciliación automática', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' },
    { route: '/procesos/conciliacion-manual', label: 'Conciliación manual', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>' },
  ];

  reportes = [
    { route: '/reportes/ficha-tecnica', label: 'Ficha Técnica', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/></svg>' },
    { route: '/reportes/inventario-valorizado', label: 'Inv. Valorizado por Cuenta', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    { route: '/reportes/inventario-catalogo', label: 'Inv. por Catálogo', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
  ];
}
