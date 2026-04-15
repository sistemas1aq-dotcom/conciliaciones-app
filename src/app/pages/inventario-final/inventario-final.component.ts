import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivoFijoService } from '../../services/activo-fijo.service';
import { ActivoFijo, ConciliacionAF, Sede } from '../../models/activo-fijo.model';

interface FilaInventarioFinal {
  codigo: string;
  descripcion: string;
  ubicacion: string;
  estado: string;
  responsable: string;
  fechaLectura: string;
  conciliado: boolean;
}

@Component({
  selector: 'app-inventario-final',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventario Final</h1>
          <p class="text-sm text-gray-500">Resumen del inventario completado</p>
        </div>
        <button (click)="exportar()"
          class="w-full sm:w-auto bg-aquarius-600 hover:bg-aquarius-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Exportar
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Sede</label>
            <select [(ngModel)]="sedeSeleccionada" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todas">Todas las sedes</option>
              @for (s of sedes; track s.id) {
                <option [value]="s.descripcion">{{ s.descripcion }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Fecha de corte</label>
            <input type="date" [(ngModel)]="fechaCorte"
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
          </div>
          <div class="flex items-end">
            <button (click)="generar()"
              class="w-full bg-aquarius-600 hover:bg-aquarius-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Generar
            </button>
          </div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Total Activos</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalActivos }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Inventariados</p>
          <p class="text-2xl font-bold text-green-600 mt-1">{{ inventariados }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">No Inventariados</p>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ noInventariados }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">% Avance</p>
          <p class="text-2xl font-bold text-aquarius-600 mt-1">{{ porcentajeAvance }}%</p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-aquarius-600 h-2 rounded-full transition-all" [style.width.%]="porcentajeAvance"></div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-[#1a3a5f] text-white">
              <tr>
                <th class="text-left px-4 py-3 font-semibold">Codigo</th>
                <th class="text-left px-4 py-3 font-semibold">Descripcion</th>
                <th class="text-left px-4 py-3 font-semibold">Ubicacion</th>
                <th class="text-left px-4 py-3 font-semibold">Estado</th>
                <th class="text-left px-4 py-3 font-semibold">Responsable</th>
                <th class="text-left px-4 py-3 font-semibold">Fecha Lectura</th>
                <th class="text-center px-4 py-3 font-semibold">Conciliado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (fila of filasPaginadas; track fila.codigo) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-aquarius-700 font-medium">{{ fila.codigo }}</td>
                  <td class="px-4 py-3 max-w-[200px] truncate" [title]="fila.descripcion">{{ fila.descripcion }}</td>
                  <td class="px-4 py-3 text-xs">{{ fila.ubicacion }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      [class]="{
                        'bg-green-100 text-green-700': fila.estado === 'Bueno' || fila.estado === 'Nuevo',
                        'bg-amber-100 text-amber-700': fila.estado === 'Regular',
                        'bg-red-100 text-red-700': fila.estado === 'Malo' || fila.estado === 'Chatarra'
                      }">
                      {{ fila.estado }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs">{{ fila.responsable }}</td>
                  <td class="px-4 py-3 text-xs text-gray-500">{{ fila.fechaLectura }}</td>
                  <td class="px-4 py-3 text-center">
                    @if (fila.conciliado) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Si</span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">No</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Paginacion -->
        <div class="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 gap-2">
          <p class="text-xs text-gray-500">Mostrando {{ (paginaActual - 1) * porPagina + 1 }} - {{ minVal(paginaActual * porPagina, filas.length) }} de {{ filas.length }}</p>
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
export class InventarioFinalComponent implements OnInit {
  sedes: Sede[] = [];
  sedeSeleccionada = 'todas';
  fechaCorte = '2026-04-14';

  totalActivos = 0;
  inventariados = 0;
  noInventariados = 0;
  porcentajeAvance = 0;

  filas: FilaInventarioFinal[] = [];
  filasPaginadas: FilaInventarioFinal[] = [];
  paginaActual = 1;
  porPagina = 8;

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    this.sedes = this.activoService.getSedes();
    this.generar();
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.filas.length / this.porPagina));
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  generar(): void {
    const activos = this.activoService.getActivosFijos();
    const conciliaciones = this.activoService.getConciliaciones();
    const codigosConciliados = new Set(conciliaciones.filter(c => c.resultado === 'conciliado').map(c => c.barNue));

    this.filas = activos.map(a => ({
      codigo: a.barNue,
      descripcion: a.catDescripcion,
      ubicacion: a.ubicacion,
      estado: a.estadoConservacion,
      responsable: a.responsable,
      fechaLectura: a.fecLectura,
      conciliado: codigosConciliados.has(a.barNue),
    }));

    this.totalActivos = this.filas.length;
    this.inventariados = this.filas.filter(f => f.conciliado).length;
    this.noInventariados = this.totalActivos - this.inventariados;
    this.porcentajeAvance = this.totalActivos > 0 ? Math.round((this.inventariados / this.totalActivos) * 100) : 0;

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
    this.filasPaginadas = this.filas.slice(inicio, inicio + this.porPagina);
  }

  exportar(): void {
    alert('Exportacion simulada: Se generaria un archivo Excel con el inventario final.');
  }

  minVal(a: number, b: number): number {
    return Math.min(a, b);
  }
}
