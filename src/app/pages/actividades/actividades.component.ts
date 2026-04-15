import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Actividad } from '../../models/activo-fijo.model';
import { ActivoFijoService } from '../../services/activo-fijo.service';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Actividades</h1>
          <p class="text-sm text-gray-500">Cronograma de actividades del proyecto</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex flex-wrap items-end gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-medium text-gray-600 mb-1">Proyecto</label>
            <select [(ngModel)]="filterProyecto" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Todos los proyectos</option>
              <option value="INVENTARIO GENERAL DE ACTIVOS FIJOS">INVENTARIO GENERAL DE ACTIVOS FIJOS</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input [(ngModel)]="filterDesde" type="date" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
            <input [(ngModel)]="filterHasta" type="date" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Buscar</label>
            <input [(ngModel)]="searchTerm" type="text" placeholder="Buscar..." class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <button (click)="applyFilter()" class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition">Ver</button>
        </div>
      </div>

      <!-- Activity form -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Titulo de la actividad</label>
            <input [(ngModel)]="form.titulo" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Inicio</label>
            <input [(ngModel)]="form.inicio" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Fin</label>
            <input [(ngModel)]="form.fin" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Descripcion</label>
            <textarea [(ngModel)]="form.descripcion" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input [(ngModel)]="formFinalizada" type="checkbox" id="finalizada" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <label for="finalizada" class="text-sm text-gray-700">Marcada como finalizada</label>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-4">
          <button (click)="clearForm()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Limpiar</button>
          <button (click)="saveActividad()" class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition">Guardar</button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[#1a3a5f] text-white">
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Titulo</th>
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Inicio</th>
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Fin</th>
                <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Estado</th>
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">ISO</th>
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Entregables</th>
                <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (item of paginatedData; track item.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-medium">{{ item.titulo }}</td>
                  <td class="px-4 py-3 text-xs whitespace-nowrap">{{ item.inicio }}</td>
                  <td class="px-4 py-3 text-xs whitespace-nowrap">{{ item.fin }}</td>
                  <td class="px-4 py-3 text-center">
                    @if (item.estado === 'finalizada') {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Finalizada</span>
                    } @else if (item.estado === 'en_progreso') {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En progreso</span>
                    } @else {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                    }
                  </td>
                  <td class="px-4 py-3 text-xs">{{ item.iso || '-' }}</td>
                  <td class="px-4 py-3 text-xs">{{ item.entregables }}</td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button (click)="editActividad(item)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="deleteActividad(item.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="7" class="px-4 py-8 text-center text-gray-400">No se encontraron actividades</td></tr>
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
export class ActividadesComponent implements OnInit {
  protected Math = Math;
  data: Actividad[] = [];
  filteredData: Actividad[] = [];
  paginatedData: Actividad[] = [];
  searchTerm = '';
  filterProyecto = '';
  filterDesde = '';
  filterHasta = '';
  formFinalizada = false;
  editing = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pages: number[] = [];

  form: Actividad = { id: 0, titulo: '', inicio: '', fin: '', descripcion: '', estado: 'pendiente', iso: '', entregables: '', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' };

  constructor(private svc: ActivoFijoService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.data = this.svc.getActividades();
    this.applyFilter();
  }

  applyFilter() {
    const t = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(a => {
      if (t && !a.titulo.toLowerCase().includes(t) && !a.descripcion.toLowerCase().includes(t)) return false;
      if (this.filterProyecto && a.proyecto !== this.filterProyecto) return false;
      if (this.filterDesde && a.inicio < this.filterDesde) return false;
      if (this.filterHasta && a.fin > this.filterHasta) return false;
      return true;
    });
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

  clearForm() {
    this.editing = false;
    this.formFinalizada = false;
    this.form = { id: 0, titulo: '', inicio: '', fin: '', descripcion: '', estado: 'pendiente', iso: '', entregables: '', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' };
  }

  editActividad(item: Actividad) {
    this.editing = true;
    this.form = { ...item };
    this.formFinalizada = item.estado === 'finalizada';
  }

  saveActividad() {
    if (!this.form.titulo) return;
    this.form.estado = this.formFinalizada ? 'finalizada' : (this.form.estado === 'finalizada' ? 'pendiente' : this.form.estado);
    if (this.editing) {
      this.svc.updateActividad(this.form);
    } else {
      this.svc.addActividad(this.form);
    }
    this.clearForm();
    this.loadData();
  }

  deleteActividad(id: number) {
    if (confirm('Desea eliminar esta actividad?')) {
      this.svc.deleteActividad(id);
      this.loadData();
    }
  }
}
