import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ConciliacionService } from '../../services/conciliacion.service';
import { Conciliacion } from '../../models/conciliacion.model';

@Component({
  selector: 'app-conciliaciones',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Conciliaciones</h1>
          <p class="text-sm text-gray-500">Gestión de conciliaciones bancarias vs contables</p>
        </div>
        <button (click)="exportar()" class="bg-aquarius-600 hover:bg-aquarius-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Exportar
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Estado</label>
            <select [(ngModel)]="filtros.estado" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todos">Todos</option>
              <option value="conciliado">Conciliado</option>
              <option value="pendiente">Pendiente</option>
              <option value="discrepancia">Discrepancia</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Banco</label>
            <select [(ngModel)]="filtros.banco" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todos">Todos</option>
              @for (banco of bancos; track banco) {
                <option [value]="banco">{{ banco }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input type="date" [(ngModel)]="filtros.fechaDesde" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
            <input type="date" [(ngModel)]="filtros.fechaHasta" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
          </div>
          <div class="flex items-end">
            <button (click)="limpiarFiltros()" class="w-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">Limpiar</button>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Descripción</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Banco</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Monto Banco</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Monto Contable</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Diferencia</th>
                <th class="text-center px-4 py-3 font-semibold text-gray-600">Estado</th>
                <th class="text-center px-4 py-3 font-semibold text-gray-600">Detalle</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (c of conciliacionesPaginadas; track c.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-gray-500">{{ c.id }}</td>
                  <td class="px-4 py-3">{{ c.transaccionBancaria?.fecha }}</td>
                  <td class="px-4 py-3 max-w-[200px] truncate">{{ c.transaccionBancaria?.descripcion }}</td>
                  <td class="px-4 py-3">{{ c.transaccionBancaria?.banco }}</td>
                  <td class="px-4 py-3 text-right font-mono">S/ {{ c.transaccionBancaria?.monto?.toFixed(2) }}</td>
                  <td class="px-4 py-3 text-right font-mono">{{ c.transaccionContable ? 'S/ ' + c.transaccionContable.monto.toFixed(2) : '—' }}</td>
                  <td class="px-4 py-3 text-right font-mono" [class]="c.diferencia !== 0 ? 'text-red-600 font-semibold' : 'text-green-600'">
                    {{ c.diferencia !== 0 ? 'S/ ' + Math.abs(c.diferencia).toFixed(2) : '0.00' }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="{
                        'bg-green-100 text-green-700': c.estado === 'conciliado',
                        'bg-amber-100 text-amber-700': c.estado === 'pendiente',
                        'bg-red-100 text-red-700': c.estado === 'discrepancia'
                      }">
                      {{ c.estado | titlecase }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button (click)="verDetalle(c)" class="text-aquarius-600 hover:text-aquarius-800 transition-colors">
                      <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p class="text-xs text-gray-500">Mostrando {{ (paginaActual - 1) * porPagina + 1 }} - {{ Math.min(paginaActual * porPagina, conciliacionesFiltradas.length) }} de {{ conciliacionesFiltradas.length }}</p>
          <div class="flex gap-1">
            <button (click)="paginaActual = paginaActual - 1" [disabled]="paginaActual === 1" class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Ant</button>
            @for (p of paginas; track p) {
              <button (click)="paginaActual = p" [class]="p === paginaActual ? 'bg-aquarius-600 text-white border-aquarius-600' : 'border-gray-300 hover:bg-gray-100'" class="px-3 py-1 text-xs rounded border">{{ p }}</button>
            }
            <button (click)="paginaActual = paginaActual + 1" [disabled]="paginaActual === totalPaginas" class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Sig</button>
          </div>
        </div>
      </div>

      <!-- Modal Detalle -->
      @if (detalleSeleccionado) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="detalleSeleccionado = null">
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-900">Detalle de Conciliación {{ detalleSeleccionado.id }}</h3>
                <button (click)="detalleSeleccionado = null" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Banco -->
                <div class="bg-blue-50 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-blue-800 mb-3">Transacción Bancaria</h4>
                  @if (detalleSeleccionado.transaccionBancaria) {
                    <div class="space-y-2 text-sm">
                      <div><span class="text-gray-500">Ref:</span> <span class="font-mono">{{ detalleSeleccionado.transaccionBancaria.referencia }}</span></div>
                      <div><span class="text-gray-500">Fecha:</span> {{ detalleSeleccionado.transaccionBancaria.fecha }}</div>
                      <div><span class="text-gray-500">Banco:</span> {{ detalleSeleccionado.transaccionBancaria.banco }}</div>
                      <div><span class="text-gray-500">Cuenta:</span> {{ detalleSeleccionado.transaccionBancaria.numeroCuenta }}</div>
                      <div><span class="text-gray-500">Monto:</span> <span class="font-bold">S/ {{ detalleSeleccionado.transaccionBancaria.monto.toFixed(2) }}</span></div>
                      <div><span class="text-gray-500">Tipo:</span> {{ detalleSeleccionado.transaccionBancaria.tipo }}</div>
                    </div>
                  }
                </div>

                <!-- Contable -->
                <div class="bg-green-50 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-green-800 mb-3">Transacción Contable</h4>
                  @if (detalleSeleccionado.transaccionContable) {
                    <div class="space-y-2 text-sm">
                      <div><span class="text-gray-500">Asiento:</span> <span class="font-mono">{{ detalleSeleccionado.transaccionContable.codigoAsiento }}</span></div>
                      <div><span class="text-gray-500">Fecha:</span> {{ detalleSeleccionado.transaccionContable.fecha }}</div>
                      <div><span class="text-gray-500">Cuenta:</span> {{ detalleSeleccionado.transaccionContable.cuentaContable }}</div>
                      <div><span class="text-gray-500">C. Costo:</span> {{ detalleSeleccionado.transaccionContable.centroCosto }}</div>
                      <div><span class="text-gray-500">Monto:</span> <span class="font-bold">S/ {{ detalleSeleccionado.transaccionContable.monto.toFixed(2) }}</span></div>
                      <div><span class="text-gray-500">Tipo:</span> {{ detalleSeleccionado.transaccionContable.tipo }}</div>
                    </div>
                  } @else {
                    <p class="text-sm text-gray-500 italic">Sin contrapartida contable</p>
                  }
                </div>
              </div>

              <div class="mt-4 p-3 rounded-lg" [class]="detalleSeleccionado.estado === 'conciliado' ? 'bg-green-50' : detalleSeleccionado.estado === 'pendiente' ? 'bg-amber-50' : 'bg-red-50'">
                <p class="text-sm"><span class="font-semibold">Estado:</span> {{ detalleSeleccionado.estado | titlecase }}</p>
                <p class="text-sm"><span class="font-semibold">Observación:</span> {{ detalleSeleccionado.observacion }}</p>
                @if (detalleSeleccionado.diferencia !== 0) {
                  <p class="text-sm"><span class="font-semibold">Diferencia:</span> <span class="text-red-600 font-bold">S/ {{ Math.abs(detalleSeleccionado.diferencia).toFixed(2) }}</span></p>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ConciliacionesComponent implements OnInit {
  conciliacionesFiltradas: Conciliacion[] = [];
  conciliacionesPaginadas: Conciliacion[] = [];
  bancos: string[] = [];
  detalleSeleccionado: Conciliacion | null = null;
  Math = Math;

  filtros = { estado: 'todos', banco: 'todos', fechaDesde: '', fechaHasta: '' };
  paginaActual = 1;
  porPagina = 15;

  constructor(private conciliacionService: ConciliacionService) {}

  ngOnInit(): void {
    this.bancos = this.conciliacionService.getBancos();
    this.aplicarFiltros();
  }

  get totalPaginas(): number {
    return Math.ceil(this.conciliacionesFiltradas.length / this.porPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  aplicarFiltros(): void {
    this.conciliacionesFiltradas = this.conciliacionService.getConciliacionesFiltradas(this.filtros);
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.conciliacionesPaginadas = this.conciliacionesFiltradas.slice(inicio, inicio + this.porPagina);
  }

  limpiarFiltros(): void {
    this.filtros = { estado: 'todos', banco: 'todos', fechaDesde: '', fechaHasta: '' };
    this.aplicarFiltros();
  }

  verDetalle(c: Conciliacion): void {
    this.detalleSeleccionado = c;
  }

  exportar(): void {
    alert('Exportación simulada: Se generaría un archivo Excel con las conciliaciones filtradas.');
  }
}
