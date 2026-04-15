import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivoFijoService } from '../../../services/activo-fijo.service';

interface ExcelRow {
  fila: number;
  estado: string;
  numRegistro: string;
  activoFijo: string;
  sn: string;
  concatenado: string;
  errores: string;
}

@Component({
  selector: 'app-estructura-contable',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Estructura Contable</h1>
          <p class="text-sm text-gray-500">Carga y gestion de estructura contable</p>
        </div>
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Plantilla
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex gap-0">
          <button (click)="activeTab = 'carga'" [class]="activeTab === 'carga' ? 'px-6 py-3 text-sm font-medium border-b-2 border-[#2563eb] text-[#2563eb]' : 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">Carga Excel</button>
          <button (click)="activeTab = 'campos'" [class]="activeTab === 'campos' ? 'px-6 py-3 text-sm font-medium border-b-2 border-[#2563eb] text-[#2563eb]' : 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">Campos adicionales</button>
        </nav>
      </div>

      @if (activeTab === 'carga') {
        <!-- File Upload -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            <p class="text-sm text-gray-600 mb-1">Arrastre un archivo Excel aqui o haga clic para seleccionar</p>
            <p class="text-xs text-gray-400">Formatos: .xlsx, .xls (max 10MB)</p>
            <input type="file" class="hidden" accept=".xlsx,.xls">
            <button class="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Seleccionar archivo</button>
          </div>

          <div class="flex items-center gap-3 mt-4">
            <button class="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition">Validar / Previsualizar</button>
            <button class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition">Procesar (Guardar)</button>
          </div>
        </div>

        <!-- Preview Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700">Previsualizacion de datos</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-[#1a3a5f] text-white">
                  <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Fila</th>
                  <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Estado</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">NumRegistro</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Activo_Fijo</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">SN</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Concatenado</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Errores</th>
                </tr>
              </thead>
              <tbody>
                @for (row of mockExcelData; track row.fila) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td class="px-4 py-3 text-center font-mono text-xs">{{ row.fila }}</td>
                    <td class="px-4 py-3 text-center">
                      @if (row.estado === 'OK') {
                        <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">OK</span>
                      } @else {
                        <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">ERROR</span>
                      }
                    </td>
                    <td class="px-4 py-3 font-mono text-xs">{{ row.numRegistro }}</td>
                    <td class="px-4 py-3 text-xs">{{ row.activoFijo }}</td>
                    <td class="px-4 py-3 font-mono text-xs">{{ row.sn }}</td>
                    <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ row.concatenado }}</td>
                    <td class="px-4 py-3 text-xs text-red-600">{{ row.errores }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (activeTab === 'campos') {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div class="text-center text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <p class="text-sm">Configuracion de campos adicionales para la estructura contable.</p>
            <p class="text-xs mt-1">Esta seccion permite definir campos personalizados.</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class EstructuraContableComponent implements OnInit {
  activeTab: 'carga' | 'campos' = 'carga';

  mockExcelData: ExcelRow[] = [];

  constructor(private svc: ActivoFijoService) {}

  ngOnInit() {
    // Genera preview a partir de los primeros registros contables reales
    const contables = this.svc.getInventarioContable().slice(0, 20);
    this.mockExcelData = contables.map((c, i) => {
      const tieneSerie = !!c.responsable;
      const tieneCuenta = !!c.cuentaContable;
      const estado = tieneSerie && tieneCuenta ? 'OK' : 'ERROR';
      let errores = '';
      if (!tieneCuenta) errores = 'Cuenta contable no informada';
      else if (!tieneSerie) errores = 'Responsable no asignado';
      return {
        fila: i + 1,
        estado,
        numRegistro: c.codigoActivo,
        activoFijo: (c.descripcion || '').substring(0, 50),
        sn: c.responsable || '',
        concatenado: `${c.codigoActivo}-${c.cuentaContable || 'N/A'}`,
        errores,
      };
    });
  }
}
