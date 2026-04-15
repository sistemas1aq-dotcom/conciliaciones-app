import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ubicacion, Sede } from '../../../models/activo-fijo.model';
import { ActivoFijoService } from '../../../services/activo-fijo.service';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ubicaciones</h1>
          <p class="text-sm text-gray-500">Gestionar ubicaciones por sede</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Plantilla</button>
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Carga masiva</button>
          <button (click)="openModal()" class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nuevo
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" type="text" placeholder="Buscar ubicacion..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
        <span class="text-xs text-gray-500">{{ filteredData.length }} registros</span>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[#1a3a5f] text-white">
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Codigo</th>
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Descripcion</th>
                <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Sede</th>
                <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Estado</th>
                <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (item of paginatedData; track item.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-mono text-xs">{{ item.codigo }}</td>
                  <td class="px-4 py-3">{{ item.descripcion }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ item.sedNombre }}</td>
                  <td class="px-4 py-3 text-center">
                    @if (item.activo) {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                    } @else {
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactivo</span>
                    }
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button (click)="editItem(item)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="deleteItem(item.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">No se encontraron registros</td></tr>
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

      @if (showModal) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="closeModal()">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">{{ editing ? 'Editar Ubicacion' : 'Nueva Ubicacion' }}</h2>
              <button (click)="closeModal()" class="p-1 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Codigo</label>
                <input [(ngModel)]="form.codigo" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <input [(ngModel)]="form.descripcion" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                <select [(ngModel)]="form.sedeId" (ngModelChange)="onSedeChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option [ngValue]="0">-- Seleccione --</option>
                  @for (s of sedes; track s.id) {
                    <option [ngValue]="s.id">{{ s.descripcion }}</option>
                  }
                </select>
              </div>
              <div class="flex items-center gap-2">
                <input [(ngModel)]="form.activo" type="checkbox" id="activo" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
                <label for="activo" class="text-sm text-gray-700">Activo</label>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button (click)="closeModal()" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
              <button (click)="save()" class="px-4 py-2 text-sm bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition">Guardar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class UbicacionesComponent implements OnInit {
  protected Math = Math;
  data: Ubicacion[] = [];
  filteredData: Ubicacion[] = [];
  paginatedData: Ubicacion[] = [];
  sedes: Sede[] = [];
  searchTerm = '';
  showModal = false;
  editing = false;
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  pages: number[] = [];

  form: Ubicacion = { id: 0, codigo: '', descripcion: '', sedeId: 0, sedNombre: '', activo: true };

  constructor(private svc: ActivoFijoService) {}

  ngOnInit() {
    this.sedes = this.svc.getSedes();
    this.loadData();
  }

  loadData() {
    this.data = this.svc.getUbicaciones();
    this.applyFilter();
  }

  applyFilter() {
    const t = this.searchTerm.toLowerCase();
    this.filteredData = t
      ? this.data.filter(u => u.codigo.toLowerCase().includes(t) || u.descripcion.toLowerCase().includes(t) || u.sedNombre.toLowerCase().includes(t))
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

  onSedeChange() {
    const sede = this.sedes.find(s => s.id === this.form.sedeId);
    this.form.sedNombre = sede ? sede.descripcion : '';
  }

  openModal() {
    this.editing = false;
    this.form = { id: 0, codigo: '', descripcion: '', sedeId: 0, sedNombre: '', activo: true };
    this.showModal = true;
  }

  editItem(item: Ubicacion) {
    this.editing = true;
    this.form = { ...item };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (!this.form.codigo || !this.form.descripcion) return;
    this.onSedeChange();
    if (this.editing) {
      this.svc.updateUbicacion(this.form);
    } else {
      this.svc.addUbicacion(this.form);
    }
    this.closeModal();
    this.loadData();
  }

  deleteItem(id: number) {
    if (confirm('Desea eliminar este registro?')) {
      this.svc.deleteUbicacion(id);
      this.loadData();
    }
  }
}
