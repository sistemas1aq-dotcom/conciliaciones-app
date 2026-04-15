import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivoFijoService } from '../../../services/activo-fijo.service';
import { InventarioContable } from '../../../models/activo-fijo.model';

interface GrupoCuenta {
  cuenta: string;
  items: InventarioContable[];
  totalAdquisicion: number;
  totalDepreciacion: number;
  totalNeto: number;
  expandido: boolean;
}

@Component({
  selector: 'app-inventario-valorizado',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventario Valorizado por Cuenta</h1>
          <p class="text-sm text-gray-500">Reporte financiero agrupado por cuenta contable</p>
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
          <div class="sm:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Cuenta contable</label>
            <select [(ngModel)]="cuentaSeleccionada" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todas">Todas las cuentas</option>
              @for (c of cuentasDisponibles; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
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
          <p class="text-xs text-gray-500 font-medium">Valor Adquisicion</p>
          <p class="text-lg font-bold text-gray-900 mt-1">S/ {{ totalValorAdquisicion | number:'1.2-2' }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Depreciacion Total</p>
          <p class="text-lg font-bold text-red-600 mt-1">S/ {{ totalDepreciacion | number:'1.2-2' }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Valor Neto Total</p>
          <p class="text-lg font-bold text-green-600 mt-1">S/ {{ totalValorNeto | number:'1.2-2' }}</p>
        </div>
      </div>

      <!-- Tabla agrupada -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-[#1a3a5f] text-white">
              <tr>
                <th class="text-left px-4 py-3 font-semibold min-w-[130px]">Cuenta</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[120px]">Codigo</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[200px]">Descripcion</th>
                <th class="text-right px-4 py-3 font-semibold min-w-[130px]">Valor Adquisicion</th>
                <th class="text-right px-4 py-3 font-semibold min-w-[130px]">Depreciacion</th>
                <th class="text-right px-4 py-3 font-semibold min-w-[120px]">Valor Neto</th>
                <th class="text-right px-4 py-3 font-semibold min-w-[90px]">% Deprec.</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (grupo of grupos; track grupo.cuenta) {
                <!-- Fila de grupo -->
                <tr class="bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" (click)="grupo.expandido = !grupo.expandido">
                  <td class="px-4 py-3 font-semibold text-aquarius-700 text-xs" colspan="3">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 transition-transform" [class.rotate-90]="grupo.expandido" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                      {{ grupo.cuenta }} ({{ grupo.items.length }} items)
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right font-mono font-semibold text-xs">{{ grupo.totalAdquisicion | number:'1.2-2' }}</td>
                  <td class="px-4 py-3 text-right font-mono font-semibold text-xs text-red-600">{{ grupo.totalDepreciacion | number:'1.2-2' }}</td>
                  <td class="px-4 py-3 text-right font-mono font-semibold text-xs text-green-600">{{ grupo.totalNeto | number:'1.2-2' }}</td>
                  <td class="px-4 py-3 text-right font-mono font-semibold text-xs">{{ calcPorcentaje(grupo.totalDepreciacion, grupo.totalAdquisicion) }}%</td>
                </tr>
                <!-- Items del grupo -->
                @if (grupo.expandido) {
                  @for (item of grupo.items; track item.id) {
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-2 text-xs text-gray-400 pl-10">{{ item.cuentaContable }}</td>
                      <td class="px-4 py-2 font-mono text-xs text-aquarius-700 font-medium">{{ item.codigoActivo }}</td>
                      <td class="px-4 py-2 max-w-[200px] truncate text-xs" [title]="item.descripcion">{{ item.descripcion }}</td>
                      <td class="px-4 py-2 text-right font-mono text-xs">{{ item.valorAdquisicion | number:'1.2-2' }}</td>
                      <td class="px-4 py-2 text-right font-mono text-xs text-red-600">{{ item.depreciacionAcumulada | number:'1.2-2' }}</td>
                      <td class="px-4 py-2 text-right font-mono text-xs text-green-600">{{ item.valorNeto | number:'1.2-2' }}</td>
                      <td class="px-4 py-2 text-right font-mono text-xs">{{ calcPorcentaje(item.depreciacionAcumulada, item.valorAdquisicion) }}%</td>
                    </tr>
                  }
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class InventarioValorizadoComponent implements OnInit {
  cuentaSeleccionada = 'todas';
  cuentasDisponibles: string[] = [];

  grupos: GrupoCuenta[] = [];
  totalActivos = 0;
  totalValorAdquisicion = 0;
  totalDepreciacion = 0;
  totalValorNeto = 0;

  private inventario: InventarioContable[] = [];

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    this.inventario = this.activoService.getInventarioContable();
    this.cuentasDisponibles = [...new Set(this.inventario.map(i => i.cuentaContable))].sort();
    this.generar();
  }

  generar(): void {
    let datos = this.inventario;
    if (this.cuentaSeleccionada !== 'todas') {
      datos = datos.filter(i => i.cuentaContable === this.cuentaSeleccionada);
    }

    const mapa = new Map<string, InventarioContable[]>();
    for (const item of datos) {
      const arr = mapa.get(item.cuentaContable) || [];
      arr.push(item);
      mapa.set(item.cuentaContable, arr);
    }

    this.grupos = Array.from(mapa.entries()).map(([cuenta, items]) => ({
      cuenta,
      items,
      totalAdquisicion: items.reduce((s, i) => s + i.valorAdquisicion, 0),
      totalDepreciacion: items.reduce((s, i) => s + i.depreciacionAcumulada, 0),
      totalNeto: items.reduce((s, i) => s + i.valorNeto, 0),
      expandido: false,
    })).sort((a, b) => a.cuenta.localeCompare(b.cuenta));

    this.totalActivos = datos.length;
    this.totalValorAdquisicion = datos.reduce((s, i) => s + i.valorAdquisicion, 0);
    this.totalDepreciacion = datos.reduce((s, i) => s + i.depreciacionAcumulada, 0);
    this.totalValorNeto = datos.reduce((s, i) => s + i.valorNeto, 0);
  }

  calcPorcentaje(depreciacion: number, adquisicion: number): number {
    return adquisicion > 0 ? Math.round((depreciacion / adquisicion) * 100) : 0;
  }

  exportar(): void {
    alert('Exportacion simulada: Se generaria un archivo Excel con el inventario valorizado por cuenta.');
  }
}
