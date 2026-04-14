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
          <h1 class="text-2xl font-bold text-gray-900">Conciliación de Inventarios</h1>
          <p class="text-sm text-gray-500">Inventario físico vs registro en sistema</p>
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
            <label class="block text-xs font-medium text-gray-600 mb-1">Almacén</label>
            <select [(ngModel)]="filtros.almacen" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todos">Todos</option>
              @for (alm of almacenes; track alm) {
                <option [value]="alm">{{ alm }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
            <select [(ngModel)]="filtros.categoria" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todos">Todas</option>
              @for (cat of categorias; track cat.value) {
                <option [value]="cat.value">{{ cat.label }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input type="date" [(ngModel)]="filtros.fechaDesde" (ngModelChange)="aplicarFiltros()" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
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
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Código</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Producto</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Almacén</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Cant. Física</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Cant. Sistema</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Dif. Cant.</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">Dif. Peso (Kg)</th>
                <th class="text-center px-4 py-3 font-semibold text-gray-600">Estado</th>
                <th class="text-center px-4 py-3 font-semibold text-gray-600">Detalle</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (c of conciliacionesPaginadas; track c.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-aquarius-700 font-medium">{{ c.registroFisico?.producto?.codigo }}</td>
                  <td class="px-4 py-3 max-w-[180px] truncate" [title]="c.registroFisico?.producto?.nombre ?? ''">{{ c.registroFisico?.producto?.nombre }}</td>
                  <td class="px-4 py-3 text-xs">{{ c.registroFisico?.producto?.almacen }}</td>
                  <td class="px-4 py-3 text-right font-mono">{{ c.registroFisico?.cantidadFisica }} {{ c.registroFisico?.producto?.unidadMedida }}</td>
                  <td class="px-4 py-3 text-right font-mono">{{ c.registroSistema ? c.registroSistema.cantidadSistema + ' ' + c.registroFisico?.producto?.unidadMedida : '—' }}</td>
                  <td class="px-4 py-3 text-right font-mono" [class]="c.diferenciaCantidad !== 0 ? 'text-red-600 font-semibold' : 'text-green-600'">
                    {{ c.diferenciaCantidad !== 0 ? (c.diferenciaCantidad > 0 ? '+' : '') + c.diferenciaCantidad : '0' }}
                  </td>
                  <td class="px-4 py-3 text-right font-mono" [class]="Math.abs(c.diferenciaPeso) > 0.5 ? 'text-red-600 font-semibold' : 'text-green-600'">
                    {{ Math.abs(c.diferenciaPeso) > 0.01 ? (c.diferenciaPeso > 0 ? '+' : '') + c.diferenciaPeso.toFixed(2) : '0.00' }}
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
            <button (click)="cambiarPagina(paginaActual - 1)" [disabled]="paginaActual === 1" class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Ant</button>
            @for (p of paginas; track p) {
              <button (click)="cambiarPagina(p)" [class]="p === paginaActual ? 'bg-aquarius-600 text-white border-aquarius-600' : 'border-gray-300 hover:bg-gray-100'" class="px-3 py-1 text-xs rounded border">{{ p }}</button>
            }
            <button (click)="cambiarPagina(paginaActual + 1)" [disabled]="paginaActual === totalPaginas" class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Sig</button>
          </div>
        </div>
      </div>

      <!-- Modal Detalle -->
      @if (detalleSeleccionado) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="detalleSeleccionado = null">
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-900">{{ detalleSeleccionado.registroFisico?.producto?.nombre }}</h3>
                <button (click)="detalleSeleccionado = null" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <p class="text-sm text-gray-500 mb-4 font-mono">{{ detalleSeleccionado.registroFisico?.producto?.codigo }} — {{ detalleSeleccionado.id }}</p>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Inventario Físico
                  </h4>
                  @if (detalleSeleccionado.registroFisico) {
                    <div class="space-y-2 text-sm">
                      <div><span class="text-gray-500">Cantidad:</span> <span class="font-bold">{{ detalleSeleccionado.registroFisico.cantidadFisica }} {{ detalleSeleccionado.registroFisico.producto.unidadMedida }}</span></div>
                      <div><span class="text-gray-500">Peso:</span> {{ detalleSeleccionado.registroFisico.pesoKg }} Kg</div>
                      <div><span class="text-gray-500">Lote:</span> <span class="font-mono text-xs">{{ detalleSeleccionado.registroFisico.lote }}</span></div>
                      <div><span class="text-gray-500">Ubicación:</span> {{ detalleSeleccionado.registroFisico.ubicacion }}</div>
                      <div><span class="text-gray-500">Fecha:</span> {{ detalleSeleccionado.registroFisico.fecha }}</div>
                      <div><span class="text-gray-500">Responsable:</span> {{ detalleSeleccionado.registroFisico.responsable }}</div>
                    </div>
                  }
                </div>

                <div class="bg-green-50 rounded-xl p-4">
                  <h4 class="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Registro en Sistema
                  </h4>
                  @if (detalleSeleccionado.registroSistema) {
                    <div class="space-y-2 text-sm">
                      <div><span class="text-gray-500">Cantidad:</span> <span class="font-bold">{{ detalleSeleccionado.registroSistema.cantidadSistema }} {{ detalleSeleccionado.registroFisico?.producto?.unidadMedida }}</span></div>
                      <div><span class="text-gray-500">Peso:</span> {{ detalleSeleccionado.registroSistema.pesoKg }} Kg</div>
                      <div><span class="text-gray-500">Lote:</span> <span class="font-mono text-xs">{{ detalleSeleccionado.registroSistema.lote }}</span></div>
                      <div><span class="text-gray-500">Últ. Movimiento:</span> {{ detalleSeleccionado.registroSistema.ultimoMovimiento }}</div>
                      <div><span class="text-gray-500">Tipo:</span> {{ detalleSeleccionado.registroSistema.tipoMovimiento }}</div>
                    </div>
                  } @else {
                    <p class="text-sm text-gray-500 italic">Sin registro en sistema</p>
                  }
                </div>
              </div>

              <div class="mt-4 p-3 rounded-lg" [class]="detalleSeleccionado.estado === 'conciliado' ? 'bg-green-50' : detalleSeleccionado.estado === 'pendiente' ? 'bg-amber-50' : 'bg-red-50'">
                <p class="text-sm"><span class="font-semibold">Estado:</span> {{ detalleSeleccionado.estado | titlecase }}</p>
                <p class="text-sm"><span class="font-semibold">Observación:</span> {{ detalleSeleccionado.observacion }}</p>
                @if (detalleSeleccionado.diferenciaCantidad !== 0) {
                  <p class="text-sm"><span class="font-semibold">Dif. Cantidad:</span> <span class="text-red-600 font-bold">{{ detalleSeleccionado.diferenciaCantidad }}</span></p>
                }
                @if (Math.abs(detalleSeleccionado.diferenciaPeso) > 0.01) {
                  <p class="text-sm"><span class="font-semibold">Dif. Peso:</span> <span class="text-red-600 font-bold">{{ detalleSeleccionado.diferenciaPeso.toFixed(2) }} Kg</span></p>
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
  almacenes: string[] = [];
  categorias: { value: string; label: string }[] = [];
  detalleSeleccionado: Conciliacion | null = null;
  Math = Math;

  filtros = { estado: 'todos', almacen: 'todos', categoria: 'todos', fechaDesde: '', fechaHasta: '' };
  paginaActual = 1;
  porPagina = 15;

  constructor(private conciliacionService: ConciliacionService) {}

  ngOnInit(): void {
    this.almacenes = this.conciliacionService.getAlmacenes();
    this.categorias = this.conciliacionService.getCategorias();
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

  cambiarPagina(p: number): void {
    this.paginaActual = p;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.conciliacionesPaginadas = this.conciliacionesFiltradas.slice(inicio, inicio + this.porPagina);
  }

  limpiarFiltros(): void {
    this.filtros = { estado: 'todos', almacen: 'todos', categoria: 'todos', fechaDesde: '', fechaHasta: '' };
    this.aplicarFiltros();
  }

  verDetalle(c: Conciliacion): void {
    this.detalleSeleccionado = c;
  }

  exportar(): void {
    alert('Exportación simulada: Se generaría un archivo Excel con el inventario conciliado.');
  }
}
