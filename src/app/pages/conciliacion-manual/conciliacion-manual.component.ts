import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivoFijoService } from '../../services/activo-fijo.service';
import { ActivoFijo, InventarioContable } from '../../models/activo-fijo.model';

interface ConciliacionManualItem {
  id: number;
  codigoFisico: string;
  descripcionFisica: string;
  codigoContable: string;
  descripcionContable: string;
  fecha: string;
}

@Component({
  selector: 'app-conciliacion-manual',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Conciliacion Manual</h1>
        <p class="text-sm text-gray-500">Cruce manual del inventario fisico con el contable</p>
      </div>

      <!-- Split view -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Panel Izquierdo - Inventario Fisico -->
        <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-[#1a3a5f] text-white px-4 py-3">
            <h2 class="font-semibold text-sm">Inventario Fisico</h2>
          </div>
          <div class="p-3">
            <input type="text" [(ngModel)]="busquedaFisico" (ngModelChange)="filtrarFisico()" placeholder="Buscar por codigo o descripcion..."
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500 mb-3" />
            <div class="max-h-[350px] overflow-y-auto space-y-1">
              @for (item of activosFiltrados; track item.id) {
                <div (click)="seleccionarFisico(item)"
                  [class]="fiscoSeleccionado?.id === item.id ? 'bg-aquarius-600/10 border-aquarius-600' : 'border-gray-200 hover:bg-gray-50'"
                  class="border rounded-lg p-3 cursor-pointer transition-colors">
                  <p class="font-mono text-xs text-aquarius-700 font-medium">{{ item.barNue }}</p>
                  <p class="text-sm text-gray-800 truncate">{{ item.catDescripcion }}</p>
                  <p class="text-xs text-gray-500">{{ item.ubicacion }}</p>
                </div>
              }
              @if (activosFiltrados.length === 0) {
                <p class="text-sm text-gray-400 text-center py-4">Sin resultados</p>
              }
            </div>
          </div>
        </div>

        <!-- Boton central -->
        <div class="flex lg:flex-col items-center justify-center gap-2 py-2">
          <button (click)="conciliarSeleccionados()"
            [disabled]="!fiscoSeleccionado || !contableSeleccionado"
            class="bg-aquarius-600 hover:bg-aquarius-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            Conciliar Seleccionados
          </button>
        </div>

        <!-- Panel Derecho - Inventario Contable -->
        <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-[#1a3a5f] text-white px-4 py-3">
            <h2 class="font-semibold text-sm">Inventario Contable</h2>
          </div>
          <div class="p-3">
            <input type="text" [(ngModel)]="busquedaContable" (ngModelChange)="filtrarContable()" placeholder="Buscar por codigo o descripcion..."
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500 mb-3" />
            <div class="max-h-[350px] overflow-y-auto space-y-1">
              @for (item of contablesFiltrados; track item.id) {
                <div (click)="seleccionarContable(item)"
                  [class]="contableSeleccionado?.id === item.id ? 'bg-aquarius-600/10 border-aquarius-600' : 'border-gray-200 hover:bg-gray-50'"
                  class="border rounded-lg p-3 cursor-pointer transition-colors">
                  <p class="font-mono text-xs text-aquarius-700 font-medium">{{ item.codigoActivo }}</p>
                  <p class="text-sm text-gray-800 truncate">{{ item.descripcion }}</p>
                  <div class="flex items-center justify-between mt-1">
                    <p class="text-xs text-gray-500">{{ item.ubicacion }}</p>
                    <p class="text-xs font-mono text-gray-600">S/ {{ item.valorNeto | number:'1.2-2' }}</p>
                  </div>
                </div>
              }
              @if (contablesFiltrados.length === 0) {
                <p class="text-sm text-gray-400 text-center py-4">Sin resultados</p>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de conciliados manualmente -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200">
          <h3 class="font-semibold text-gray-900 text-sm">Items conciliados manualmente ({{ conciliacionesManuales.length }})</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-[#1a3a5f] text-white">
              <tr>
                <th class="text-left px-4 py-3 font-semibold">Codigo Fisico</th>
                <th class="text-left px-4 py-3 font-semibold">Descripcion Fisica</th>
                <th class="text-left px-4 py-3 font-semibold">Codigo Contable</th>
                <th class="text-left px-4 py-3 font-semibold">Descripcion Contable</th>
                <th class="text-left px-4 py-3 font-semibold">Fecha</th>
                <th class="text-center px-4 py-3 font-semibold">Accion</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (item of conciliacionesManuales; track item.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-aquarius-700 font-medium">{{ item.codigoFisico }}</td>
                  <td class="px-4 py-3 max-w-[160px] truncate">{{ item.descripcionFisica }}</td>
                  <td class="px-4 py-3 font-mono text-xs text-aquarius-700 font-medium">{{ item.codigoContable }}</td>
                  <td class="px-4 py-3 max-w-[160px] truncate">{{ item.descripcionContable }}</td>
                  <td class="px-4 py-3 text-xs text-gray-500">{{ item.fecha }}</td>
                  <td class="px-4 py-3 text-center">
                    <button (click)="deshacer(item.id)" class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                      Deshacer
                    </button>
                  </td>
                </tr>
              }
              @if (conciliacionesManuales.length === 0) {
                <tr>
                  <td colspan="6" class="px-4 py-8 text-center text-gray-400 text-sm">No hay conciliaciones manuales registradas</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ConciliacionManualComponent implements OnInit {
  activos: ActivoFijo[] = [];
  contables: InventarioContable[] = [];
  activosFiltrados: ActivoFijo[] = [];
  contablesFiltrados: InventarioContable[] = [];

  busquedaFisico = '';
  busquedaContable = '';

  fiscoSeleccionado: ActivoFijo | null = null;
  contableSeleccionado: InventarioContable | null = null;

  conciliacionesManuales: ConciliacionManualItem[] = [];
  private nextId = 1;

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    this.activos = this.activoService.getActivosFijos();
    this.contables = this.activoService.getInventarioContable();
    this.activosFiltrados = [...this.activos];
    this.contablesFiltrados = [...this.contables];
    this.cargarMock();
  }

  cargarMock(): void {
    const pairs = Math.min(3, this.activos.length, this.contables.length);
    for (let i = 0; i < pairs; i++) {
      this.conciliacionesManuales.push({
        id: this.nextId++,
        codigoFisico: this.activos[i].barNue,
        descripcionFisica: this.activos[i].catDescripcion,
        codigoContable: this.contables[i].codigoActivo,
        descripcionContable: this.contables[i].descripcion,
        fecha: '2026-04-10',
      });
    }
  }

  filtrarFisico(): void {
    const t = this.busquedaFisico.toLowerCase();
    this.activosFiltrados = this.activos.filter(a =>
      a.barNue.toLowerCase().includes(t) || a.catDescripcion.toLowerCase().includes(t)
    );
  }

  filtrarContable(): void {
    const t = this.busquedaContable.toLowerCase();
    this.contablesFiltrados = this.contables.filter(c =>
      c.codigoActivo.toLowerCase().includes(t) || c.descripcion.toLowerCase().includes(t)
    );
  }

  seleccionarFisico(item: ActivoFijo): void {
    this.fiscoSeleccionado = this.fiscoSeleccionado?.id === item.id ? null : item;
  }

  seleccionarContable(item: InventarioContable): void {
    this.contableSeleccionado = this.contableSeleccionado?.id === item.id ? null : item;
  }

  conciliarSeleccionados(): void {
    if (!this.fiscoSeleccionado || !this.contableSeleccionado) return;
    this.conciliacionesManuales.push({
      id: this.nextId++,
      codigoFisico: this.fiscoSeleccionado.barNue,
      descripcionFisica: this.fiscoSeleccionado.catDescripcion,
      codigoContable: this.contableSeleccionado.codigoActivo,
      descripcionContable: this.contableSeleccionado.descripcion,
      fecha: new Date().toISOString().split('T')[0],
    });
    this.fiscoSeleccionado = null;
    this.contableSeleccionado = null;
  }

  deshacer(id: number): void {
    this.conciliacionesManuales = this.conciliacionesManuales.filter(c => c.id !== id);
  }
}
