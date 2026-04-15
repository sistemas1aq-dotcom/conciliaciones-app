import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventarioContable } from '../../models/activo-fijo.model';
import { ActivoFijoService } from '../../services/activo-fijo.service';

@Component({
  selector: 'app-inventario-contable',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventario Contable</h1>
          <p class="text-sm text-gray-500">Base contable de activos fijos</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="loadData()" class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Actualizar
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" type="text" placeholder="Buscar activo contable..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
        <span class="text-xs text-gray-500">{{ filteredData.length }} registros</span>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[#1a3a5f] text-white">
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">NumActivo</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">NumRegistro</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Activo Fijo</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">SN</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Concatenado</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Denominacion</th>
                <th class="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider">Mon</th>
                <th class="text-right px-3 py-3 font-semibold text-xs uppercase tracking-wider">ValCont</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Sociedad</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">RUC</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Proveedor</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Centro Costo</th>
              </tr>
            </thead>
            <tbody>
              @for (item of paginatedData; track item.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="px-3 py-2.5 font-mono text-xs">{{ item.codigoActivo }}</td>
                  <td class="px-3 py-2.5 font-mono text-xs">{{ 'R' + item.id.toString().padStart(6, '0') }}</td>
                  <td class="px-3 py-2.5 text-xs whitespace-nowrap">{{ item.descripcion.substring(0, 30) }}</td>
                  <td class="px-3 py-2.5 font-mono text-xs">{{ 'SN' + (item.id * 1234567).toString().substring(0, 8) }}</td>
                  <td class="px-3 py-2.5 font-mono text-xs text-gray-600">{{ item.codigoActivo + '-' + item.cuentaContable }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.descripcion }}</td>
                  <td class="px-3 py-2.5 text-xs text-center">PEN</td>
                  <td class="px-3 py-2.5 text-xs text-right font-mono">{{ item.valorNeto.toLocaleString('es-PE', {minimumFractionDigits: 2}) }}</td>
                  <td class="px-3 py-2.5 text-xs">EMPAFRUT</td>
                  <td class="px-3 py-2.5 text-xs font-mono">20100123456</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.responsable }}</td>
                  <td class="px-3 py-2.5 text-xs whitespace-nowrap">{{ item.ubicacion.substring(0, 20) }}</td>
                </tr>
              } @empty {
                <tr><td colspan="12" class="px-4 py-8 text-center text-gray-400">No se encontraron registros</td></tr>
              }
            </tbody>
          </table>
        </div>
        @if (totalPages > 1) {
          <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span class="text-xs text-gray-500">Mostrando {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredData.length) }} de {{ filteredData.length }}</span>
            <div class="flex items-center gap-1">
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1" class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
              @for (p of pages; track p) {
                <button (click)="goToPage(p)" [class]="p === currentPage ? 'px-3 py-1 text-xs rounded bg-[#2563eb] text-white' : 'px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100'">{{ p }}</button>
              }
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages" class="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class InventarioContableComponent implements OnInit {
  protected Math = Math;
  data: InventarioContable[] = [];
  filteredData: InventarioContable[] = [];
  paginatedData: InventarioContable[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  pages: number[] = [];

  constructor(private svc: ActivoFijoService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.data = this.svc.getInventarioContable();
    this.applyFilter();
  }

  applyFilter() {
    const t = this.searchTerm.toLowerCase();
    this.filteredData = t
      ? this.data.filter(i => i.codigoActivo.toLowerCase().includes(t) || i.descripcion.toLowerCase().includes(t) || i.cuentaContable.toLowerCase().includes(t) || i.ubicacion.toLowerCase().includes(t) || i.responsable.toLowerCase().includes(t))
      : [...this.data];
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pageSize);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.updatePagination();
  }
}
