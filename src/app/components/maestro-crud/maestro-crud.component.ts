import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// ---------- Public interfaces ----------

export interface ColumnaDef {
  field: string;
  header: string;
  width?: string;
}

export interface CampoDef {
  field: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
  options?: { value: any; label: string }[];
}

// ---------- Component ----------

@Component({
  selector: 'app-maestro-crud',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- HEADER -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">

      <!-- Title bar -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">{{ titulo }}</h2>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Plantilla
          </button>
          <button
            class="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Carga masiva
          </button>
          <button
            (click)="abrirNuevo()"
            class="flex items-center gap-1 px-4 py-1.5 text-sm text-white rounded hover:opacity-90"
            style="background-color: #1a3a5f;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo
          </button>
        </div>
      </div>

      <!-- Search bar -->
      <div class="px-6 py-3 border-b border-gray-100">
        <div class="relative max-w-sm">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filtrar()"
            placeholder="Buscar..."
            class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="background-color: #1a3a5f;">
              @for (col of columnas; track col.field) {
                <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                    [style.width]="col.width ?? 'auto'">
                  {{ col.header }}
                </th>
              }
              <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider w-28">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            @for (row of datosPaginados; track $index) {
              <tr class="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                @for (col of columnas; track col.field) {
                  <td class="px-4 py-2.5 text-gray-700">
                    @if (esBool(row[col.field])) {
                      @if (row[col.field]) {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Activo
                        </span>
                      } @else {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Inactivo
                        </span>
                      }
                    } @else {
                      {{ row[col.field] }}
                    }
                  </td>
                }
                <td class="px-4 py-2.5 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button (click)="abrirVer(row)" title="Ver detalle"
                      class="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    <button (click)="abrirEditar(row)" title="Editar"
                      class="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-amber-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columnas.length + 1" class="px-4 py-8 text-center text-gray-400">
                  No se encontraron registros.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50/60 text-sm text-gray-600">
        <span>
          Mostrando {{ inicioRango }} - {{ finRango }} de {{ datosFiltrados.length }} registros
        </span>
        <div class="flex items-center gap-2">
          <button (click)="paginaAnterior()" [disabled]="pagina === 1"
            class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Anterior
          </button>
          <span class="px-2 font-medium">{{ pagina }} / {{ totalPaginas }}</span>
          <button (click)="paginaSiguiente()" [disabled]="pagina >= totalPaginas"
            class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- ============== MODAL ============== -->
    @if (modalAbierto) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" (click)="cerrarModal()">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" (click)="$event.stopPropagation()">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
               style="background-color: #1a3a5f;">
            <h3 class="text-base font-semibold text-white">
              @if (modoVer) {
                Detalle de {{ titulo }}
              } @else if (editando) {
                Editar {{ titulo }}
              } @else {
                Nuevo {{ titulo }}
              }
            </h3>
            <button (click)="cerrarModal()" class="text-white/70 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="px-6 py-4 max-h-[65vh] overflow-y-auto">
            @for (campo of campos; track campo.field) {
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ campo.label }}</label>

                @if (campo.type === 'text' || campo.type === 'date' || campo.type === 'number') {
                  <input
                    [type]="campo.type"
                    [(ngModel)]="formData[campo.field]"
                    [disabled]="modoVer"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
                }

                @if (campo.type === 'select') {
                  <select
                    [(ngModel)]="formData[campo.field]"
                    [disabled]="modoVer"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500">
                    <option value="">-- Seleccione --</option>
                    @for (opt of campo.options; track opt.value) {
                      <option [value]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                }

                @if (campo.type === 'checkbox') {
                  <div class="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData[campo.field]"
                      [disabled]="modoVer"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span class="text-sm text-gray-600">
                      {{ formData[campo.field] ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                }
              </div>
            }

            <!-- Activo checkbox (always present for maestros) -->
            @if (!campoActivoExiste) {
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div class="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData['activo']"
                    [disabled]="modoVer"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span class="text-sm text-gray-600">
                    {{ formData['activo'] ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            }
          </div>

          <!-- Modal footer -->
          @if (!modoVer) {
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button (click)="cerrarModal()"
                class="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Cancelar
              </button>
              <button (click)="guardar()"
                class="px-4 py-2 text-sm text-white rounded-md hover:opacity-90"
                style="background-color: #1a3a5f;">
                Guardar
              </button>
            </div>
          } @else {
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button (click)="cerrarModal()"
                class="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Cerrar
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class MaestroCrudComponent implements OnInit, OnChanges {

  @Input() titulo = '';
  @Input() columnas: ColumnaDef[] = [];
  @Input() datos: any[] = [];
  @Input() campos: CampoDef[] = [];
  @Input() pageSize = 8;

  @Output() onSave = new EventEmitter<{ item: any; esNuevo: boolean }>();
  @Output() onDelete = new EventEmitter<any>();

  // State
  searchTerm = '';
  datosFiltrados: any[] = [];
  datosPaginados: any[] = [];
  pagina = 1;
  totalPaginas = 1;

  modalAbierto = false;
  modoVer = false;
  editando = false;
  formData: Record<string, any> = {};
  itemOriginal: any = null;

  get campoActivoExiste(): boolean {
    return this.campos.some(c => c.field === 'activo' || c.field === 'estado');
  }

  get inicioRango(): number {
    return this.datosFiltrados.length === 0 ? 0 : (this.pagina - 1) * this.pageSize + 1;
  }

  get finRango(): number {
    return Math.min(this.pagina * this.pageSize, this.datosFiltrados.length);
  }

  ngOnInit(): void {
    this.filtrar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos']) {
      this.filtrar();
    }
  }

  // ---------- SEARCH / FILTER ----------

  filtrar(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.datosFiltrados = [...this.datos];
    } else {
      this.datosFiltrados = this.datos.filter(row =>
        this.columnas.some(col => {
          const val = row[col.field];
          return val != null && String(val).toLowerCase().includes(term);
        })
      );
    }
    this.pagina = 1;
    this.calcularPaginacion();
  }

  // ---------- PAGINATION ----------

  private calcularPaginacion(): void {
    this.totalPaginas = Math.max(1, Math.ceil(this.datosFiltrados.length / this.pageSize));
    if (this.pagina > this.totalPaginas) this.pagina = this.totalPaginas;
    const start = (this.pagina - 1) * this.pageSize;
    this.datosPaginados = this.datosFiltrados.slice(start, start + this.pageSize);
  }

  paginaAnterior(): void {
    if (this.pagina > 1) {
      this.pagina--;
      this.calcularPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.calcularPaginacion();
    }
  }

  // ---------- MODAL ----------

  abrirNuevo(): void {
    this.formData = {};
    this.campos.forEach(c => {
      if (c.type === 'checkbox') this.formData[c.field] = true;
      else if (c.type === 'number') this.formData[c.field] = 0;
      else this.formData[c.field] = '';
    });
    if (!this.campoActivoExiste) {
      this.formData['activo'] = true;
    }
    this.editando = false;
    this.modoVer = false;
    this.itemOriginal = null;
    this.modalAbierto = true;
  }

  abrirEditar(row: any): void {
    this.formData = { ...row };
    this.editando = true;
    this.modoVer = false;
    this.itemOriginal = row;
    this.modalAbierto = true;
  }

  abrirVer(row: any): void {
    this.formData = { ...row };
    this.editando = false;
    this.modoVer = true;
    this.itemOriginal = row;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.formData = {};
    this.itemOriginal = null;
  }

  guardar(): void {
    this.onSave.emit({ item: { ...this.formData }, esNuevo: !this.editando });
    this.cerrarModal();
  }

  // ---------- HELPERS ----------

  esBool(val: any): boolean {
    return typeof val === 'boolean';
  }
}
