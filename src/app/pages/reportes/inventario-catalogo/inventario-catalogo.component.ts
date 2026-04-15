import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivoFijoService } from '../../../services/activo-fijo.service';
import { ActivoFijo, InventarioContable } from '../../../models/activo-fijo.model';

interface FilaCatalogo {
  catalogo: string;
  codigo: string;
  descripcion: string;
  marca: string;
  modelo: string;
  ubicacion: string;
  estado: string;
  valor: number;
}

interface GrupoCatalogo {
  catalogo: string;
  items: FilaCatalogo[];
  totalValor: number;
  expandido: boolean;
}

@Component({
  selector: 'app-inventario-catalogo',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventario por Catalogo</h1>
          <p class="text-sm text-gray-500">Reporte de activos agrupados por categoria de catalogo</p>
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
            <label class="block text-xs font-medium text-gray-600 mb-1">Catalogo</label>
            <select [(ngModel)]="catalogoSeleccionado" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
              <option value="todos">Todos los catalogos</option>
              @for (c of catalogosDisponibles; track c) {
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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Total Items</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalItems }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-500 font-medium">Total Valor</p>
          <p class="text-lg font-bold text-green-600 mt-1">S/ {{ totalValor | number:'1.2-2' }}</p>
        </div>
      </div>

      <!-- Tabla agrupada -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-[#1a3a5f] text-white">
              <tr>
                <th class="text-left px-4 py-3 font-semibold min-w-[160px]">Catalogo</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[120px]">Codigo</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[180px]">Descripcion</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[100px]">Marca</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[100px]">Modelo</th>
                <th class="text-left px-4 py-3 font-semibold min-w-[120px]">Ubicacion</th>
                <th class="text-center px-4 py-3 font-semibold">Estado</th>
                <th class="text-right px-4 py-3 font-semibold min-w-[110px]">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (grupo of grupos; track grupo.catalogo) {
                <!-- Fila de grupo -->
                <tr class="bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" (click)="grupo.expandido = !grupo.expandido">
                  <td class="px-4 py-3 font-semibold text-aquarius-700 text-xs" colspan="7">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 transition-transform" [class.rotate-90]="grupo.expandido" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                      {{ grupo.catalogo }} ({{ grupo.items.length }} items)
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right font-mono font-semibold text-xs text-green-600">S/ {{ grupo.totalValor | number:'1.2-2' }}</td>
                </tr>
                <!-- Items del grupo -->
                @if (grupo.expandido) {
                  @for (item of grupo.items; track item.codigo) {
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-2 text-xs text-gray-400 pl-10">{{ item.catalogo }}</td>
                      <td class="px-4 py-2 font-mono text-xs text-aquarius-700 font-medium">{{ item.codigo }}</td>
                      <td class="px-4 py-2 max-w-[180px] truncate text-xs" [title]="item.descripcion">{{ item.descripcion }}</td>
                      <td class="px-4 py-2 text-xs">{{ item.marca }}</td>
                      <td class="px-4 py-2 text-xs">{{ item.modelo }}</td>
                      <td class="px-4 py-2 text-xs">{{ item.ubicacion }}</td>
                      <td class="px-4 py-2 text-center">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          [class]="{
                            'bg-green-100 text-green-700': item.estado === 'Bueno' || item.estado === 'Nuevo',
                            'bg-amber-100 text-amber-700': item.estado === 'Regular',
                            'bg-red-100 text-red-700': item.estado === 'Malo' || item.estado === 'Chatarra'
                          }">
                          {{ item.estado }}
                        </span>
                      </td>
                      <td class="px-4 py-2 text-right font-mono text-xs">S/ {{ item.valor | number:'1.2-2' }}</td>
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
export class InventarioCatalogoComponent implements OnInit {
  catalogoSeleccionado = 'todos';
  catalogosDisponibles: string[] = [];

  grupos: GrupoCatalogo[] = [];
  totalItems = 0;
  totalValor = 0;

  private activos: ActivoFijo[] = [];
  private contables: InventarioContable[] = [];

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    this.activos = this.activoService.getActivosFijos();
    this.contables = this.activoService.getInventarioContable();

    // Extraer catalogos unicos de las descripciones de catalogo
    const catalogos = this.activoService.getCatalogo();
    this.catalogosDisponibles = catalogos.map(c => c.descripcion).sort();
    if (this.catalogosDisponibles.length === 0) {
      this.catalogosDisponibles = [...new Set(this.activos.map(a => a.catDescripcion.split(' ')[0]))].sort();
    }

    this.generar();
  }

  generar(): void {
    // Crear un mapa de valor contable por codigo
    const mapaValores = new Map<string, number>();
    for (const c of this.contables) {
      mapaValores.set(c.codigoActivo, c.valorNeto);
    }

    // Construir filas
    let filas: FilaCatalogo[] = this.activos.map(a => {
      // Usar la descripcion del catalogo como grupo
      const catalogo = a.catDescripcion;
      return {
        catalogo,
        codigo: a.barNue,
        descripcion: a.catDescripcion,
        marca: a.marca,
        modelo: a.modelo,
        ubicacion: a.ubicacion,
        estado: a.estadoConservacion,
        valor: mapaValores.get(a.barNue) || 0,
      };
    });

    if (this.catalogoSeleccionado !== 'todos') {
      filas = filas.filter(f => f.catalogo === this.catalogoSeleccionado);
    }

    // Agrupar
    const mapa = new Map<string, FilaCatalogo[]>();
    for (const fila of filas) {
      const arr = mapa.get(fila.catalogo) || [];
      arr.push(fila);
      mapa.set(fila.catalogo, arr);
    }

    this.grupos = Array.from(mapa.entries()).map(([catalogo, items]) => ({
      catalogo,
      items,
      totalValor: items.reduce((s, i) => s + i.valor, 0),
      expandido: false,
    })).sort((a, b) => a.catalogo.localeCompare(b.catalogo));

    this.totalItems = filas.length;
    this.totalValor = filas.reduce((s, f) => s + f.valor, 0);
  }

  exportar(): void {
    alert('Exportacion simulada: Se generaria un archivo Excel con el inventario por catalogo.');
  }
}
