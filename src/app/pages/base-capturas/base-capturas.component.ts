import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Captura {
  id: number;
  usuario: string;
  fechaHora: string;
  barra: string;
  empresa: string;
  sede: string;
  ubicacion: string;
  centroCosto: string;
  responsable: string;
  catalogo: string;
  serie: string;
  estado: string;
  proceso: string;
  motivo: string;
}

@Component({
  selector: 'app-base-capturas',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">BASE DE CAPTURAS</h1>
          <p class="text-sm text-gray-500">Registro de capturas de inventario</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex flex-wrap items-end gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Cod. Empresa</label>
            <input [(ngModel)]="filterEmpresa" type="text" placeholder="Ej: 509567" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-40">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Cod. Sucursal</label>
            <input [(ngModel)]="filterSucursal" type="text" placeholder="Ej: 001" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-32">
          </div>
          <button (click)="applyFilter()" class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition">Filtrar</button>
          <button (click)="clearFilter()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Limpiar</button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[#1a3a5f] text-white">
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Usuario</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Fecha/Hora</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Barra</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Empresa</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Sede</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Ubicacion</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">C. Costo</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Responsable</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Catalogo</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Serie</th>
                <th class="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider">Estado</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Proceso</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Motivo</th>
              </tr>
            </thead>
            <tbody>
              @for (item of paginatedData; track item.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="px-3 py-2.5 text-xs">{{ item.usuario }}</td>
                  <td class="px-3 py-2.5 text-xs whitespace-nowrap">{{ item.fechaHora }}</td>
                  <td class="px-3 py-2.5 font-mono text-xs font-bold text-blue-700">{{ item.barra }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.empresa }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.sede }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.ubicacion }}</td>
                  <td class="px-3 py-2.5 text-xs font-mono">{{ item.centroCosto }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.responsable }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.catalogo }}</td>
                  <td class="px-3 py-2.5 font-mono text-xs">{{ item.serie }}</td>
                  <td class="px-3 py-2.5 text-center">
                    @if (item.estado === 'Valido') {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Valido</span>
                    } @else if (item.estado === 'Error') {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Error</span>
                    } @else {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                    }
                  </td>
                  <td class="px-3 py-2.5 text-xs">{{ item.proceso }}</td>
                  <td class="px-3 py-2.5 text-xs text-gray-600">{{ item.motivo }}</td>
                </tr>
              } @empty {
                <tr><td colspan="13" class="px-4 py-8 text-center text-gray-400">No se encontraron capturas</td></tr>
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
export class BaseCapturasComponent implements OnInit {
  protected Math = Math;
  filterEmpresa = '';
  filterSucursal = '';
  allData: Captura[] = [];
  filteredData: Captura[] = [];
  paginatedData: Captura[] = [];
  currentPage = 1;
  pageSize = 15;
  totalPages = 1;
  pages: number[] = [];

  private usuarios = ['jgarcia', 'mtorres', 'alopez', 'cramirez', 'lflores'];
  private sedes = ['Planta Principal', 'Oficinas Admin', 'Almacen Central', 'Fundicion'];
  private ubicaciones = ['Gerencia', 'Produccion H1', 'Laboratorio', 'Almacen MP', 'TI', 'Contabilidad', 'RRHH', 'Mantenimiento'];
  private catalogos = ['Eq. Computo', 'Mobiliario', 'Maquinaria', 'Vehiculo', 'Herramienta', 'Eq. Lab'];
  private responsables = ['C. Mendoza', 'R. Huaman', 'P. Quispe', 'M. Flores', 'L. Rodriguez', 'A. Castillo'];
  private motivos = ['', '', '', 'Barra duplicada', '', 'Ubicacion no encontrada', '', '', 'Serie ya registrada', ''];

  ngOnInit() {
    this.generateMockData();
    this.applyFilter();
  }

  generateMockData() {
    this.allData = Array.from({ length: 24 }, (_, i) => {
      const hasError = i % 7 === 3;
      const isPending = i % 9 === 5;
      return {
        id: i + 1,
        usuario: this.usuarios[i % this.usuarios.length],
        fechaHora: `2026-04-${String(1 + (i % 14)).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String(i * 7 % 60).padStart(2, '0')}`,
        barra: `AF-${String(i + 1).padStart(6, '0')}`,
        empresa: '509567',
        sede: this.sedes[i % this.sedes.length],
        ubicacion: this.ubicaciones[i % this.ubicaciones.length],
        centroCosto: `CC-${String((i % 9 + 1) * 100)}`,
        responsable: this.responsables[i % this.responsables.length],
        catalogo: this.catalogos[i % this.catalogos.length],
        serie: `SN${String(Math.random()).substring(2, 12)}`,
        estado: hasError ? 'Error' : (isPending ? 'Pendiente' : 'Valido'),
        proceso: hasError ? 'Rechazado' : (isPending ? 'En cola' : 'Procesado'),
        motivo: hasError ? this.motivos.filter(m => m)[i % this.motivos.filter(m => m).length] : '',
      };
    });
  }

  applyFilter() {
    this.filteredData = this.allData.filter(c => {
      if (this.filterEmpresa && !c.empresa.includes(this.filterEmpresa)) return false;
      if (this.filterSucursal && !c.sede.toLowerCase().includes(this.filterSucursal.toLowerCase())) return false;
      return true;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilter() {
    this.filterEmpresa = '';
    this.filterSucursal = '';
    this.applyFilter();
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
