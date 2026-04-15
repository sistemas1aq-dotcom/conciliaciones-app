import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-procesar-depurar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">PROCESAR Y DEPURAR</h1>
          <p class="text-sm text-gray-500">Validacion, depuracion y procesamiento de datos</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Actualizar
          </button>
          <button class="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition">Revalidar</button>
          <button class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm hover:bg-blue-700 transition">Procesar</button>
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Exportar errores
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex gap-0">
          <button (click)="activeTab = 'dashboard'" [class]="activeTab === 'dashboard' ? 'px-6 py-3 text-sm font-medium border-b-2 border-[#2563eb] text-[#2563eb]' : 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">Dashboard</button>
          <button (click)="activeTab = 'errores'" [class]="activeTab === 'errores' ? 'px-6 py-3 text-sm font-medium border-b-2 border-[#2563eb] text-[#2563eb]' : 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">Errores/Depuracion</button>
          <button (click)="activeTab = 'validos'" [class]="activeTab === 'validos' ? 'px-6 py-3 text-sm font-medium border-b-2 border-[#2563eb] text-[#2563eb]' : 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent'">Validos</button>
        </nav>
      </div>

      @if (activeTab === 'dashboard') {
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500 uppercase font-medium">Total registros</span>
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ kpi.total }}</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500 uppercase font-medium">Activos barridos</span>
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ kpi.barridos }}</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500 uppercase font-medium">Correctos</span>
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-green-600">{{ kpi.correctos }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ kpi.correctosPct }}% del total</p>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500 uppercase font-medium">Con error</span>
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-red-600">{{ kpi.conError }}</p>
          </div>
        </div>

        <!-- Charts row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Correctos vs Errores -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Correctos vs Errores</h3>
            <div class="flex items-end gap-8 justify-center h-48">
              <div class="flex flex-col items-center gap-2">
                <div class="w-20 bg-green-500 rounded-t-lg transition-all" [style.height.px]="(kpi.correctos / kpi.total) * 160"></div>
                <span class="text-xs font-medium text-gray-600">Correctos</span>
                <span class="text-lg font-bold text-green-600">{{ kpi.correctos }}</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-20 bg-red-500 rounded-t-lg transition-all" [style.height.px]="(kpi.conError / kpi.total) * 160"></div>
                <span class="text-xs font-medium text-gray-600">Errores</span>
                <span class="text-lg font-bold text-red-600">{{ kpi.conError }}</span>
              </div>
            </div>
          </div>

          <!-- Top errores por codigo -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Top errores por codigo</h3>
            <div class="space-y-3">
              @for (err of topErrores; track err.codigo) {
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-gray-700">{{ err.codigo }}</span>
                    <span class="text-xs font-bold text-gray-900">{{ err.cantidad }}</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div class="bg-red-500 h-2.5 rounded-full transition-all" [style.width.%]="(err.cantidad / topErrores[0].cantidad) * 100"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Charts row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Top ubicaciones -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Top ubicaciones (staging)</h3>
            <div class="space-y-3">
              @for (ub of topUbicaciones; track ub.nombre) {
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-gray-700">{{ ub.nombre }}</span>
                    <span class="text-xs font-bold text-gray-900">{{ ub.cantidad }}</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div class="bg-blue-500 h-2.5 rounded-full transition-all" [style.width.%]="(ub.cantidad / topUbicaciones[0].cantidad) * 100"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Top catalogos -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Top catalogos (staging)</h3>
            <div class="space-y-3">
              @for (cat of topCatalogos; track cat.nombre) {
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-gray-700">{{ cat.nombre }}</span>
                    <span class="text-xs font-bold text-gray-900">{{ cat.cantidad }}</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div class="bg-indigo-500 h-2.5 rounded-full transition-all" [style.width.%]="(cat.cantidad / topCatalogos[0].cantidad) * 100"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (activeTab === 'errores') {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-[#1a3a5f] text-white">
                  <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Fila</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Barra</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Descripcion</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Codigo Error</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Detalle</th>
                  <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (err of errorRows; track err.fila) {
                  <tr class="border-b border-gray-100 hover:bg-red-50/30 transition">
                    <td class="px-4 py-3 text-center font-mono text-xs">{{ err.fila }}</td>
                    <td class="px-4 py-3 font-mono text-xs font-bold text-red-700">{{ err.barra }}</td>
                    <td class="px-4 py-3 text-xs">{{ err.descripcion }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-100 text-red-800">{{ err.codigoError }}</span>
                    </td>
                    <td class="px-4 py-3 text-xs text-red-600">{{ err.detalle }}</td>
                    <td class="px-4 py-3 text-center">
                      <button class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Corregir">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (activeTab === 'validos') {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-[#1a3a5f] text-white">
                  <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Fila</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Barra</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Descripcion</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Ubicacion</th>
                  <th class="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">C. Costo</th>
                  <th class="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (v of validRows; track v.fila) {
                  <tr class="border-b border-gray-100 hover:bg-green-50/30 transition">
                    <td class="px-4 py-3 text-center font-mono text-xs">{{ v.fila }}</td>
                    <td class="px-4 py-3 font-mono text-xs font-bold text-green-700">{{ v.barra }}</td>
                    <td class="px-4 py-3 text-xs">{{ v.descripcion }}</td>
                    <td class="px-4 py-3 text-xs">{{ v.ubicacion }}</td>
                    <td class="px-4 py-3 text-xs font-mono">{{ v.centroCosto }}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Valido</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProcesarDepurarComponent implements OnInit {
  activeTab: 'dashboard' | 'errores' | 'validos' = 'dashboard';

  kpi = { total: 35, barridos: 35, correctos: 28, conError: 7, correctosPct: 80 };

  topErrores = [
    { codigo: 'ERR-UBI', cantidad: 3 },
    { codigo: 'ERR-SER', cantidad: 2 },
    { codigo: 'ERR-DUP', cantidad: 1 },
    { codigo: 'ERR-CAT', cantidad: 1 },
  ];

  topUbicaciones = [
    { nombre: 'Produccion - Horno 1', cantidad: 5 },
    { nombre: 'Sala de Servidores / TI', cantidad: 5 },
    { nombre: 'Laboratorio de Calidad', cantidad: 4 },
    { nombre: 'Taller de Mantenimiento', cantidad: 4 },
    { nombre: 'Oficina Gerencia', cantidad: 4 },
  ];

  topCatalogos = [
    { nombre: 'Equipos de Computo', cantidad: 8 },
    { nombre: 'Maquinaria Industrial', cantidad: 6 },
    { nombre: 'Mobiliario', cantidad: 5 },
    { nombre: 'Equipos de Laboratorio', cantidad: 4 },
    { nombre: 'Vehiculos', cantidad: 3 },
  ];

  errorRows = [
    { fila: 3, barra: 'AF-000003', descripcion: 'Monitor Samsung 27" Curvo', codigoError: 'ERR-UBI', detalle: 'Ubicacion no registrada en maestro' },
    { fila: 8, barra: 'AF-000008', descripcion: 'Silla ergonomica gerencial', codigoError: 'ERR-SER', detalle: 'Serie duplicada con AF-000012' },
    { fila: 15, barra: 'AF-000015', descripcion: 'Fresadora universal', codigoError: 'ERR-UBI', detalle: 'Ubicacion no coincide con sede' },
    { fila: 19, barra: 'AF-000019', descripcion: 'Camion Volquete CAT 740', codigoError: 'ERR-CAT', detalle: 'Catalogo no vigente' },
    { fila: 22, barra: 'AF-000022', descripcion: 'Durometro Rockwell', codigoError: 'ERR-DUP', detalle: 'Barra duplicada en otra lectura' },
    { fila: 27, barra: 'AF-000027', descripcion: 'Aire acondicionado split', codigoError: 'ERR-SER', detalle: 'Serie no informada' },
    { fila: 30, barra: 'AF-000030', descripcion: 'Taladro de columna', codigoError: 'ERR-UBI', detalle: 'Ubicacion fuera del alcance del proyecto' },
  ];

  validRows = [
    { fila: 1, barra: 'AF-000001', descripcion: 'Laptop Dell Latitude 5540', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100' },
    { fila: 2, barra: 'AF-000002', descripcion: 'Laptop HP ProBook 450 G10', ubicacion: 'Oficina Contabilidad', centroCosto: 'CC-500' },
    { fila: 4, barra: 'AF-000004', descripcion: 'Impresora Multifuncional HP', ubicacion: 'Oficina Contabilidad', centroCosto: 'CC-500' },
    { fila: 5, barra: 'AF-000005', descripcion: 'Servidor Dell PowerEdge R750', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600' },
    { fila: 6, barra: 'AF-000006', descripcion: 'UPS APC Smart 3000VA', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600' },
    { fila: 7, barra: 'AF-000007', descripcion: 'Escritorio ejecutivo madera', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100' },
    { fila: 9, barra: 'AF-000009', descripcion: 'Archivador metalico 4 gavetas', ubicacion: 'Oficina Contabilidad', centroCosto: 'CC-500' },
    { fila: 10, barra: 'AF-000010', descripcion: 'Mesa de reuniones 12 personas', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100' },
    { fila: 11, barra: 'AF-000011', descripcion: 'Horno de fundicion electrico', ubicacion: 'Produccion - Horno 1', centroCosto: 'CC-200' },
    { fila: 12, barra: 'AF-000012', descripcion: 'Horno de fundicion a gas', ubicacion: 'Produccion - Horno 2', centroCosto: 'CC-200' },
    { fila: 13, barra: 'AF-000013', descripcion: 'Prensa hidraulica 100 Tn', ubicacion: 'Produccion - Horno 1', centroCosto: 'CC-200' },
    { fila: 14, barra: 'AF-000014', descripcion: 'Torno CNC industrial', ubicacion: 'Taller de Mantenimiento', centroCosto: 'CC-800' },
  ];

  ngOnInit() {}
}
