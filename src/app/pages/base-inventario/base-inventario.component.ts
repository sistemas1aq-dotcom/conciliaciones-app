import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivoFijo, EstadoConservacion } from '../../models/activo-fijo.model';
import { ActivoFijoService } from '../../services/activo-fijo.service';

@Component({
  selector: 'app-base-inventario',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Inventario Fisico</h1>
          <p class="text-sm text-gray-500">Base de inventario fisico de activos</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="loadData()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refrescar
          </button>
          <button (click)="openModal()" class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nuevo
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" type="text" placeholder="Buscar activo..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
        </div>
        <span class="text-xs text-gray-500">{{ filteredData.length }} registros</span>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[#1a3a5f] text-white">
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Bar_Nue</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Inventariador</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Fec. Lectura</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Ubicacion</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">C. Costo</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Responsable</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Cat. Desc</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Marca</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Modelo</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Serie</th>
                <th class="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Est. Con.</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider">Empresa</th>
                <th class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Creacion</th>
              </tr>
            </thead>
            <tbody>
              @for (item of paginatedData; track item.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="px-3 py-2.5 font-mono text-xs font-bold text-blue-700">{{ item.barNue }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.inventariador }}</td>
                  <td class="px-3 py-2.5 text-xs whitespace-nowrap">{{ item.fecLectura }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.ubicacion }}</td>
                  <td class="px-3 py-2.5 text-xs font-mono">{{ item.centroCosto }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.responsable }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.catDescripcion.substring(0, 25) }}{{ item.catDescripcion.length > 25 ? '...' : '' }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.marca }}</td>
                  <td class="px-3 py-2.5 text-xs">{{ item.modelo }}</td>
                  <td class="px-3 py-2.5 font-mono text-xs">{{ item.serie }}</td>
                  <td class="px-3 py-2.5 text-center">
                    <span class="inline-flex px-1.5 py-0.5 rounded text-xs font-bold"
                      [class]="item.estadoConservacion === 'NU' ? 'bg-blue-100 text-blue-800' :
                               item.estadoConservacion === 'BU' ? 'bg-green-100 text-green-800' :
                               item.estadoConservacion === 'RE' ? 'bg-yellow-100 text-yellow-800' :
                               item.estadoConservacion === 'MA' ? 'bg-red-100 text-red-800' :
                               item.estadoConservacion === 'OP' ? 'bg-emerald-100 text-emerald-800' :
                               'bg-gray-100 text-gray-800'">{{ item.estadoConservacion }}</span>
                  </td>
                  <td class="px-3 py-2.5 text-xs">{{ item.empresa }}</td>
                  <td class="px-3 py-2.5 text-xs whitespace-nowrap">{{ item.creacion }}</td>
                </tr>
              } @empty {
                <tr><td colspan="13" class="px-4 py-8 text-center text-gray-400">No se encontraron registros</td></tr>
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

      <!-- Modal -->
      @if (showModal) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="closeModal()">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 class="text-lg font-semibold text-gray-900">Nuevo activo</h2>
              <button (click)="closeModal()" class="p-1 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">BAR_NUE</label>
                  <input [(ngModel)]="form.barNue" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cod. Empresa</label>
                  <input [(ngModel)]="form.codEmpresa" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fec. Lectura</label>
                  <input [(ngModel)]="form.fecLectura" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ubicacion</label>
                  <input [(ngModel)]="form.ubicacion" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Centro Costo</label>
                  <input [(ngModel)]="form.centroCosto" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <input [(ngModel)]="form.responsable" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion Catalogo</label>
                <input [(ngModel)]="form.catDescripcion" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input [(ngModel)]="form.marca" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input [(ngModel)]="form.modelo" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Serie</label>
                  <input [(ngModel)]="form.serie" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado Conservacion</label>
                <select [(ngModel)]="form.estadoConservacion" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">-- Seleccione --</option>
                  @for (ec of estadosConservacion; track ec.id) {
                    <option [value]="ec.codigo">{{ ec.codigo }} - {{ ec.descripcion }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea [(ngModel)]="form.observaciones" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition">
                  <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p class="text-xs text-gray-500">Arrastre o haga clic para subir imagen</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
              <button (click)="closeModal()" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
              <button (click)="save()" class="px-4 py-2 text-sm bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition">Guardar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class BaseInventarioComponent implements OnInit {
  protected Math = Math;
  data: ActivoFijo[] = [];
  filteredData: ActivoFijo[] = [];
  paginatedData: ActivoFijo[] = [];
  estadosConservacion: EstadoConservacion[] = [];
  searchTerm = '';
  showModal = false;
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  pages: number[] = [];

  form: ActivoFijo = {
    id: 0, barNue: '', codEmpresa: '', fecLectura: '', ubicacion: '', centroCosto: '',
    responsable: '', catDescripcion: '', marca: '', modelo: '', serie: '',
    estadoConservacion: '', empresa: 'AQUARIUS', observaciones: '', imagen: null,
    creacion: new Date().toISOString().split('T')[0], inventariador: '',
  };

  constructor(private svc: ActivoFijoService) {}

  ngOnInit() {
    this.estadosConservacion = this.svc.getEstadosConservacion();
    this.loadData();
  }

  loadData() {
    this.data = this.svc.getActivosFijos();
    this.applyFilter();
  }

  applyFilter() {
    const t = this.searchTerm.toLowerCase();
    this.filteredData = t
      ? this.data.filter(a => a.barNue.toLowerCase().includes(t) || a.catDescripcion.toLowerCase().includes(t) || a.marca.toLowerCase().includes(t) || a.ubicacion.toLowerCase().includes(t) || a.responsable.toLowerCase().includes(t) || a.serie.toLowerCase().includes(t))
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

  openModal() {
    this.form = {
      id: 0, barNue: '', codEmpresa: '', fecLectura: '', ubicacion: '', centroCosto: '',
      responsable: '', catDescripcion: '', marca: '', modelo: '', serie: '',
      estadoConservacion: '', empresa: 'AQUARIUS', observaciones: '', imagen: null,
      creacion: new Date().toISOString().split('T')[0], inventariador: '',
    };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (!this.form.barNue || !this.form.catDescripcion) return;
    this.svc.addActivoFijo(this.form);
    this.closeModal();
    this.loadData();
  }
}
