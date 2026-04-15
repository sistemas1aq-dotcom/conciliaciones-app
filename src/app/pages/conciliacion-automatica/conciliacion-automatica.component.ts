import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivoFijoService } from '../../services/activo-fijo.service';
import { ConciliacionAF } from '../../models/activo-fijo.model';

@Component({
  selector: 'app-conciliacion-automatica',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Conciliacion Automatica</h1>
          <p class="text-sm text-gray-500">Cruce automatico del inventario fisico vs contable</p>
        </div>
      </div>

      <!-- Action bar -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Fecha desde</label>
            <input type="date" [(ngModel)]="fechaDesde"
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Fecha hasta</label>
            <input type="date" [(ngModel)]="fechaHasta"
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
          </div>
          <button (click)="ejecutarConciliacion()"
            class="w-full sm:w-auto bg-aquarius-600 hover:bg-aquarius-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Ejecutar Conciliacion
          </button>
          <button (click)="exportar()"
            class="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Exportar Resultado
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Total Procesados</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalProcesados }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Conciliados</p>
          <p class="text-2xl font-bold text-green-600 mt-1">{{ conciliados }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Sobrantes</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ sobrantes }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Faltantes</p>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ faltantes }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
          <p class="text-xs text-gray-500 font-medium">Discrepancias</p>
          <p class="text-2xl font-bold text-purple-600 mt-1">{{ discrepancias }}</p>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Progreso de conciliacion</span>
          <span class="text-sm font-bold text-aquarius-600">{{ porcentajeConciliacion }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="bg-aquarius-600 h-3 rounded-full transition-all duration-500" [style.width.%]="porcentajeConciliacion"></div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-[#1a3a5f] text-white">
              <tr>
                <th class="text-left px-4 py-3 font-semibold min-w-[120px]">Codigo Barra</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[180px]">Descripcion</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[120px]">Ubic. Fisica</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[120px]">Ubic. Contable</th>
                <th class="text-left px-4 py-3 font-semibold">Estado Fisico</th>
                <th class="text-left px-4 py-3 font-semibold">Estado Contable</th>
                <th class="text-right px-4 py-3 font-semibold min-w-[110px]">Valor Contable</th>
                <th class="text-center px-4 py-3 font-semibold">Resultado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (c of conciliacionesPaginadas; track c.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-aquarius-700 font-medium">{{ c.barNue }}</td>
                  <td class="px-4 py-3 max-w-[200px] truncate" [title]="c.descripcion">{{ c.descripcion }}</td>
                  <td class="px-4 py-3 text-xs">{{ c.ubicacionFisica }}</td>
                  <td class="px-4 py-3 text-xs">{{ c.ubicacionContable }}</td>
                  <td class="px-4 py-3 text-xs">{{ c.estadoFisico }}</td>
                  <td class="px-4 py-3 text-xs">{{ c.estadoContable }}</td>
                  <td class="px-4 py-3 text-right font-mono text-xs">{{ c.valorContable | number:'1.2-2' }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="{
                        'bg-green-100 text-green-700': c.resultado === 'conciliado',
                        'bg-amber-100 text-amber-700': c.resultado === 'sobrante',
                        'bg-red-100 text-red-700': c.resultado === 'faltante',
                        'bg-purple-100 text-purple-700': c.resultado === 'discrepancia'
                      }">
                      {{ c.resultado === 'conciliado' ? 'Conciliado' : c.resultado === 'sobrante' ? 'Sobrante' : c.resultado === 'faltante' ? 'Faltante' : 'Discrepancia' }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Paginacion -->
        <div class="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 gap-2">
          <p class="text-xs text-gray-500">Mostrando {{ (paginaActual - 1) * porPagina + 1 }} - {{ minVal(paginaActual * porPagina, conciliaciones.length) }} de {{ conciliaciones.length }}</p>
          <div class="flex gap-1">
            <button (click)="cambiarPagina(paginaActual - 1)" [disabled]="paginaActual === 1"
              class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Ant</button>
            @for (p of paginas; track p) {
              <button (click)="cambiarPagina(p)"
                [class]="p === paginaActual ? 'bg-aquarius-600 text-white border-aquarius-600' : 'border-gray-300 hover:bg-gray-100'"
                class="px-3 py-1 text-xs rounded border">{{ p }}</button>
            }
            <button (click)="cambiarPagina(paginaActual + 1)" [disabled]="paginaActual === totalPaginas"
              class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Sig</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConciliacionAutomaticaComponent implements OnInit {
  fechaDesde = '2026-01-01';
  fechaHasta = '2026-04-14';

  conciliaciones: ConciliacionAF[] = [];
  conciliacionesPaginadas: ConciliacionAF[] = [];

  totalProcesados = 0;
  conciliados = 0;
  sobrantes = 0;
  faltantes = 0;
  discrepancias = 0;
  porcentajeConciliacion = 0;

  paginaActual = 1;
  porPagina = 8;

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    this.ejecutarConciliacion();
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.conciliaciones.length / this.porPagina));
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  ejecutarConciliacion(): void {
    this.conciliaciones = this.activoService.getConciliaciones();
    this.totalProcesados = this.conciliaciones.length;
    this.conciliados = this.conciliaciones.filter(c => c.resultado === 'conciliado').length;
    this.sobrantes = this.conciliaciones.filter(c => c.resultado === 'sobrante').length;
    this.faltantes = this.conciliaciones.filter(c => c.resultado === 'faltante').length;
    this.discrepancias = this.conciliaciones.filter(c => c.resultado === 'discrepancia').length;
    this.porcentajeConciliacion = this.totalProcesados > 0 ? Math.round((this.conciliados / this.totalProcesados) * 100) : 0;
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  cambiarPagina(p: number): void {
    if (p < 1 || p > this.totalPaginas) return;
    this.paginaActual = p;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.conciliacionesPaginadas = this.conciliaciones.slice(inicio, inicio + this.porPagina);
  }

  exportar(): void {
    alert('Exportacion simulada: Se generaria un archivo Excel con los resultados de la conciliacion automatica.');
  }

  minVal(a: number, b: number): number {
    return Math.min(a, b);
  }
}
