import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivoFijoService } from '../../services/activo-fijo.service';
import { ActivoFijo } from '../../models/activo-fijo.model';

interface FotoRegistro {
  id: number;
  barNue: string;
  descripcion: string;
  fecha: string;
  estadoConservacion: string;
  color: string;
  seleccionado: boolean;
}

@Component({
  selector: 'app-registro-fotografico',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Registro Fotografico</h1>
          <p class="text-sm text-gray-500">Galeria de fotografias de activos fijos inventariados</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex gap-4">
          <button (click)="tabActiva = 'galeria'"
            [class]="tabActiva === 'galeria' ? 'border-aquarius-600 text-aquarius-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors">
            Galeria
          </button>
          <button (click)="tabActiva = 'descarga'"
            [class]="tabActiva === 'descarga' ? 'border-aquarius-600 text-aquarius-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors">
            Descarga Masiva
          </button>
        </nav>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-600 mb-1">Buscar</label>
            <input type="text" [(ngModel)]="busqueda" placeholder="Buscar por codigo..."
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500 focus:border-aquarius-500" />
          </div>
          <div class="w-full sm:w-32">
            <label class="block text-xs font-medium text-gray-600 mb-1">Anio</label>
            <select [(ngModel)]="anioSeleccionado" (ngModelChange)="filtrar()"
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              @for (a of anios; track a) {
                <option [value]="a">{{ a }}</option>
              }
            </select>
          </div>
          <div class="flex gap-2">
            <button (click)="filtrar()"
              class="w-full sm:w-auto bg-aquarius-600 hover:bg-aquarius-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Buscar
            </button>
            <button (click)="limpiar()"
              class="w-full sm:w-auto border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refrescar
            </button>
          </div>
        </div>
        <div class="mt-3">
          <span class="text-sm text-gray-600 font-medium">Total de fotos: {{ fotosFiltradas.length }}</span>
        </div>
      </div>

      <!-- Galeria Tab -->
      @if (tabActiva === 'galeria') {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (foto of fotosPaginadas; track foto.id) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div class="h-40 flex items-center justify-center" [style.background-color]="foto.color">
                <svg class="w-12 h-12 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div class="p-3">
                <p class="text-xs font-mono text-aquarius-700 font-medium">{{ foto.barNue }}</p>
                <p class="text-sm text-gray-800 font-medium truncate mt-1" [title]="foto.descripcion">{{ foto.descripcion }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-500">{{ foto.fecha }}</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    [class]="{
                      'bg-green-100 text-green-700': foto.estadoConservacion === 'Bueno' || foto.estadoConservacion === 'Nuevo',
                      'bg-amber-100 text-amber-700': foto.estadoConservacion === 'Regular',
                      'bg-red-100 text-red-700': foto.estadoConservacion === 'Malo' || foto.estadoConservacion === 'Chatarra'
                    }">
                    {{ foto.estadoConservacion }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Descarga Masiva Tab -->
      @if (tabActiva === 'descarga') {
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" [checked]="todosSeleccionados" (change)="toggleTodos()"
                class="rounded border-gray-300 text-aquarius-600 focus:ring-aquarius-500" />
              Seleccionar todos
            </label>
            <button (click)="descargarSeleccionados()" [disabled]="seleccionadosCount === 0"
              class="w-full sm:w-auto bg-aquarius-600 hover:bg-aquarius-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Descargar seleccionados ({{ seleccionadosCount }})
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-[#1a3a5f] text-white">
                <tr>
                  <th class="px-4 py-3 text-left w-10">
                    <input type="checkbox" [checked]="todosSeleccionados" (change)="toggleTodos()"
                      class="rounded border-gray-300" />
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">Codigo</th>
                  <th class="px-4 py-3 text-left font-semibold">Descripcion</th>
                  <th class="px-4 py-3 text-left font-semibold">Fecha</th>
                  <th class="px-4 py-3 text-left font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (foto of fotosFiltradas; track foto.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                      <input type="checkbox" [(ngModel)]="foto.seleccionado"
                        class="rounded border-gray-300 text-aquarius-600 focus:ring-aquarius-500" />
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-aquarius-700 font-medium">{{ foto.barNue }}</td>
                    <td class="px-4 py-3 max-w-[200px] truncate">{{ foto.descripcion }}</td>
                    <td class="px-4 py-3 text-xs text-gray-500">{{ foto.fecha }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        [class]="{
                          'bg-green-100 text-green-700': foto.estadoConservacion === 'Bueno' || foto.estadoConservacion === 'Nuevo',
                          'bg-amber-100 text-amber-700': foto.estadoConservacion === 'Regular',
                          'bg-red-100 text-red-700': foto.estadoConservacion === 'Malo' || foto.estadoConservacion === 'Chatarra'
                        }">
                        {{ foto.estadoConservacion }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Paginacion -->
      @if (tabActiva === 'galeria') {
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500">Mostrando {{ (paginaActual - 1) * porPagina + 1 }} - {{ minVal(paginaActual * porPagina, fotosFiltradas.length) }} de {{ fotosFiltradas.length }}</p>
          <div class="flex gap-1 flex-wrap justify-center">
            <button (click)="cambiarPagina(1)" [disabled]="paginaActual === 1"
              class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Primera</button>
            <button (click)="cambiarPagina(paginaActual - 1)" [disabled]="paginaActual === 1"
              class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
            <span class="px-3 py-1 text-xs rounded bg-aquarius-600 text-white border border-aquarius-600">{{ paginaActual }}</span>
            <button (click)="cambiarPagina(paginaActual + 1)" [disabled]="paginaActual === totalPaginas"
              class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
            <button (click)="cambiarPagina(totalPaginas)" [disabled]="paginaActual === totalPaginas"
              class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Ultima</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class RegistroFotograficoComponent implements OnInit {
  tabActiva: 'galeria' | 'descarga' = 'galeria';
  busqueda = '';
  anioSeleccionado = 2026;
  anios = [2024, 2025, 2026];

  fotos: FotoRegistro[] = [];
  fotosFiltradas: FotoRegistro[] = [];
  fotosPaginadas: FotoRegistro[] = [];

  paginaActual = 1;
  porPagina = 8;

  private colores = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#f97316', '#84cc16', '#a855f7'];

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    const activos = this.activoService.getActivosFijos();
    this.fotos = activos.slice(0, 12).map((a, i) => ({
      id: a.id,
      barNue: a.barNue,
      descripcion: a.catDescripcion,
      fecha: a.fecLectura,
      estadoConservacion: a.estadoConservacion,
      color: this.colores[i % this.colores.length],
      seleccionado: false,
    }));
    this.filtrar();
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.fotosFiltradas.length / this.porPagina));
  }

  get todosSeleccionados(): boolean {
    return this.fotosFiltradas.length > 0 && this.fotosFiltradas.every(f => f.seleccionado);
  }

  get seleccionadosCount(): number {
    return this.fotosFiltradas.filter(f => f.seleccionado).length;
  }

  filtrar(): void {
    const term = this.busqueda.toLowerCase();
    this.fotosFiltradas = this.fotos.filter(f =>
      (!term || f.barNue.toLowerCase().includes(term) || f.descripcion.toLowerCase().includes(term))
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  limpiar(): void {
    this.busqueda = '';
    this.anioSeleccionado = 2026;
    this.filtrar();
  }

  cambiarPagina(p: number): void {
    if (p < 1 || p > this.totalPaginas) return;
    this.paginaActual = p;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.fotosPaginadas = this.fotosFiltradas.slice(inicio, inicio + this.porPagina);
  }

  toggleTodos(): void {
    const nuevoEstado = !this.todosSeleccionados;
    this.fotosFiltradas.forEach(f => f.seleccionado = nuevoEstado);
  }

  descargarSeleccionados(): void {
    alert(`Descarga simulada: Se descargarian ${this.seleccionadosCount} fotografias.`);
  }

  minVal(a: number, b: number): number {
    return Math.min(a, b);
  }
}
