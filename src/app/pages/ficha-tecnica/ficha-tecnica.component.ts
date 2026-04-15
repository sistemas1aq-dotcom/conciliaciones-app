import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ActivoFijoService } from '../../services/activo-fijo.service';
import { ActivoFijo, InventarioContable } from '../../models/activo-fijo.model';

@Component({
  selector: 'app-ficha-tecnica',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ficha Tecnica</h1>
          <p class="text-sm text-gray-500">Detalle completo del activo fijo</p>
        </div>
        <div class="flex gap-2">
          <button (click)="imprimir()"
            class="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Imprimir
          </button>
          <button (click)="exportarPdf()"
            class="w-full sm:w-auto bg-aquarius-600 hover:bg-aquarius-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Exportar PDF
          </button>
        </div>
      </div>

      <!-- Busqueda -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-600 mb-1">Buscar activo</label>
            <input type="text" [(ngModel)]="busqueda" (ngModelChange)="buscar()" placeholder="Codigo de barras o descripcion..."
              class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500" />
          </div>
          @if (resultadosBusqueda.length > 0 && busqueda.length > 0) {
            <div class="sm:w-64">
              <label class="block text-xs font-medium text-gray-600 mb-1">Seleccionar</label>
              <select (change)="seleccionarActivo($event)" class="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-aquarius-500">
                @for (r of resultadosBusqueda; track r.id) {
                  <option [value]="r.id">{{ r.barNue }} - {{ r.catDescripcion }}</option>
                }
              </select>
            </div>
          }
        </div>
      </div>

      <!-- Ficha del activo -->
      @if (activoSeleccionado) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna izquierda: datos -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Datos Generales -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-[#1a3a5f] text-white px-4 py-3">
                <h2 class="font-semibold text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Datos Generales
                </h2>
              </div>
              <div class="p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Codigo de Barras</p>
                    <p class="text-sm font-mono font-medium text-aquarius-700">{{ activoSeleccionado.barNue }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Codigo Empresa</p>
                    <p class="text-sm font-mono">{{ activoSeleccionado.codEmpresa }}</p>
                  </div>
                  <div class="sm:col-span-2">
                    <p class="text-xs text-gray-500 font-medium">Descripcion</p>
                    <p class="text-sm font-medium text-gray-900">{{ activoSeleccionado.catDescripcion }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Marca</p>
                    <p class="text-sm">{{ activoSeleccionado.marca }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Modelo</p>
                    <p class="text-sm">{{ activoSeleccionado.modelo }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Serie</p>
                    <p class="text-sm font-mono">{{ activoSeleccionado.serie }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Empresa</p>
                    <p class="text-sm">{{ activoSeleccionado.empresa }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ubicacion -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-[#1a3a5f] text-white px-4 py-3">
                <h2 class="font-semibold text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Ubicacion
                </h2>
              </div>
              <div class="p-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Sede</p>
                    <p class="text-sm">{{ activoSeleccionado.empresa }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Ubicacion</p>
                    <p class="text-sm">{{ activoSeleccionado.ubicacion }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Centro de Costo</p>
                    <p class="text-sm">{{ activoSeleccionado.centroCosto }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-[#1a3a5f] text-white px-4 py-3">
                <h2 class="font-semibold text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Estado
                </h2>
              </div>
              <div class="p-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Conservacion</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
                      [class]="{
                        'bg-green-100 text-green-700': activoSeleccionado.estadoConservacion === 'Bueno' || activoSeleccionado.estadoConservacion === 'Nuevo',
                        'bg-amber-100 text-amber-700': activoSeleccionado.estadoConservacion === 'Regular',
                        'bg-red-100 text-red-700': activoSeleccionado.estadoConservacion === 'Malo' || activoSeleccionado.estadoConservacion === 'Chatarra'
                      }">
                      {{ activoSeleccionado.estadoConservacion }}
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Responsable</p>
                    <p class="text-sm">{{ activoSeleccionado.responsable }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">Fecha Lectura</p>
                    <p class="text-sm">{{ activoSeleccionado.fecLectura }}</p>
                  </div>
                </div>
                @if (activoSeleccionado.observaciones) {
                  <div class="mt-4">
                    <p class="text-xs text-gray-500 font-medium">Observaciones</p>
                    <p class="text-sm text-gray-700 mt-1">{{ activoSeleccionado.observaciones }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Informacion Contable -->
            @if (contableSeleccionado) {
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="bg-[#1a3a5f] text-white px-4 py-3">
                  <h2 class="font-semibold text-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Informacion Contable
                  </h2>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Valor Adquisicion</p>
                      <p class="text-sm font-mono font-medium">S/ {{ contableSeleccionado.valorAdquisicion | number:'1.2-2' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Depreciacion Acumulada</p>
                      <p class="text-sm font-mono text-red-600">S/ {{ contableSeleccionado.depreciacionAcumulada | number:'1.2-2' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Valor Neto</p>
                      <p class="text-sm font-mono font-bold text-green-600">S/ {{ contableSeleccionado.valorNeto | number:'1.2-2' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Vida Util (anios)</p>
                      <p class="text-sm">{{ contableSeleccionado.vidaUtil }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Cuenta Contable</p>
                      <p class="text-sm font-mono">{{ contableSeleccionado.cuentaContable }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 font-medium">Fecha Adquisicion</p>
                      <p class="text-sm">{{ contableSeleccionado.fechaAdquisicion }}</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Columna derecha: imagen -->
          <div class="space-y-4">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-[#1a3a5f] text-white px-4 py-3">
                <h2 class="font-semibold text-sm">Imagen del Activo</h2>
              </div>
              <div class="p-4">
                <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div class="text-center text-gray-400">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p class="text-sm mt-2">Sin imagen disponible</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resumen rapido -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Resumen</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Inventariador</span>
                  <span class="font-medium">{{ activoSeleccionado.inventariador }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Creacion</span>
                  <span class="font-medium">{{ activoSeleccionado.creacion }}</span>
                </div>
                @if (contableSeleccionado) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">% Depreciado</span>
                    <span class="font-medium">{{ porcentajeDepreciacion }}%</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FichaTecnicaComponent implements OnInit {
  busqueda = '';
  resultadosBusqueda: ActivoFijo[] = [];
  activoSeleccionado: ActivoFijo | null = null;
  contableSeleccionado: InventarioContable | null = null;
  porcentajeDepreciacion = 0;

  private activos: ActivoFijo[] = [];
  private contables: InventarioContable[] = [];

  constructor(private activoService: ActivoFijoService) {}

  ngOnInit(): void {
    this.activos = this.activoService.getActivosFijos();
    this.contables = this.activoService.getInventarioContable();
    if (this.activos.length > 0) {
      this.cargarActivo(this.activos[0]);
    }
  }

  buscar(): void {
    if (!this.busqueda.trim()) {
      this.resultadosBusqueda = [];
      return;
    }
    this.resultadosBusqueda = this.activoService.searchActivosFijos(this.busqueda).slice(0, 10);
    if (this.resultadosBusqueda.length > 0) {
      this.cargarActivo(this.resultadosBusqueda[0]);
    }
  }

  seleccionarActivo(event: Event): void {
    const id = parseInt((event.target as HTMLSelectElement).value, 10);
    const activo = this.activos.find(a => a.id === id);
    if (activo) this.cargarActivo(activo);
  }

  private cargarActivo(activo: ActivoFijo): void {
    this.activoSeleccionado = activo;
    this.contableSeleccionado = this.contables.find(c => c.codigoActivo === activo.barNue) || null;
    if (this.contableSeleccionado && this.contableSeleccionado.valorAdquisicion > 0) {
      this.porcentajeDepreciacion = Math.round((this.contableSeleccionado.depreciacionAcumulada / this.contableSeleccionado.valorAdquisicion) * 100);
    } else {
      this.porcentajeDepreciacion = 0;
    }
  }

  imprimir(): void {
    alert('Impresion simulada: Se abriria el dialogo de impresion del navegador.');
  }

  exportarPdf(): void {
    alert('Exportacion simulada: Se generaria un PDF con la ficha tecnica del activo.');
  }
}
