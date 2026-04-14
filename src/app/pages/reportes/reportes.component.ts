import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ConciliacionService } from '../../services/conciliacion.service';
import { DuplicadoDetectado, ErrorBD } from '../../models/conciliacion.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reportes</h1>
        <p class="text-sm text-gray-500">Reportes de discrepancias, duplicados y errores</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button (click)="tabActivo = 'discrepancias'" [class]="tabActivo === 'discrepancias' ? 'bg-white shadow-sm text-aquarius-700' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 rounded-md text-sm font-medium transition-all">Discrepancias</button>
        <button (click)="tabActivo = 'duplicados'" [class]="tabActivo === 'duplicados' ? 'bg-white shadow-sm text-aquarius-700' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 rounded-md text-sm font-medium transition-all">Duplicados</button>
        <button (click)="tabActivo = 'errores'" [class]="tabActivo === 'errores' ? 'bg-white shadow-sm text-aquarius-700' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 rounded-md text-sm font-medium transition-all">Errores BD</button>
      </div>

      <!-- Discrepancias -->
      @if (tabActivo === 'discrepancias') {
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-700">Reporte de Discrepancias por Tipo</h3>
          </div>
          <div class="p-4 space-y-4">
            @for (tipo of discrepanciasPorTipo; track tipo.tipo) {
              <div class="flex items-center gap-4">
                <div class="w-32 text-sm text-gray-600 capitalize">{{ tipo.tipo.replace('_', ' ') }}</div>
                <div class="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div class="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    [style.width.%]="tipo.cantidad / maxDiscrepancia * 100"
                    [class]="getBarColor(tipo.tipo)">
                    <span class="text-xs font-bold text-white">{{ tipo.cantidad }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
          <div class="p-4 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-3 bg-red-50 rounded-lg">
                <p class="text-2xl font-bold text-red-600">{{ totalDiscrepancias }}</p>
                <p class="text-xs text-gray-500">Total discrepancias</p>
              </div>
              <div class="text-center p-3 bg-amber-50 rounded-lg">
                <p class="text-2xl font-bold text-amber-600">{{ discrepanciasPorTipo.length }}</p>
                <p class="text-xs text-gray-500">Tipos identificados</p>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ tasaDiscrepancia }}%</p>
                <p class="text-xs text-gray-500">Tasa de discrepancia</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Duplicados -->
      @if (tabActivo === 'duplicados') {
        <div class="space-y-4">
          @for (dup of duplicados; track dup.codigo) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-amber-900">Código: {{ dup.codigo }}</p>
                    <p class="text-xs text-amber-700">{{ dup.ocurrencias }} ocurrencias detectadas</p>
                  </div>
                </div>
                <span class="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Duplicado</span>
              </div>
              <div class="p-4">
                <table class="w-full text-sm mb-3">
                  <thead>
                    <tr class="text-gray-500 text-xs">
                      <th class="text-left pb-2">ID</th>
                      <th class="text-left pb-2">Fecha</th>
                      <th class="text-right pb-2">Monto</th>
                      <th class="text-left pb-2">Fuente</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (reg of dup.registros; track reg.id) {
                      <tr class="border-t border-gray-100">
                        <td class="py-2 font-mono text-xs">{{ reg.id }}</td>
                        <td class="py-2">{{ reg.fecha }}</td>
                        <td class="py-2 text-right font-mono">S/ {{ reg.monto.toFixed(2) }}</td>
                        <td class="py-2">{{ reg.fuente }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
                <div class="bg-green-50 rounded-lg p-3 flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p class="text-xs text-green-800">{{ dup.sugerenciaCorreccion }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Errores BD -->
      @if (tabActivo === 'errores') {
        <div class="space-y-3">
          @for (error of errores; track error.id) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  [class]="{
                    'bg-red-100': error.impacto === 'alto',
                    'bg-amber-100': error.impacto === 'medio',
                    'bg-blue-100': error.impacto === 'bajo'
                  }">
                  <svg class="w-4 h-4" [class]="{'text-red-600': error.impacto === 'alto', 'text-amber-600': error.impacto === 'medio', 'text-blue-600': error.impacto === 'bajo'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-semibold text-gray-900 text-sm">{{ error.tipo }}</h4>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{{ error.tabla }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                        [class]="{
                          'bg-red-100 text-red-700': error.impacto === 'alto',
                          'bg-amber-100 text-amber-700': error.impacto === 'medio',
                          'bg-blue-100 text-blue-700': error.impacto === 'bajo'
                        }">{{ error.impacto | uppercase }}</span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ error.descripcion }}</p>
                  <div class="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                    {{ error.sugerencia }}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ReportesComponent implements OnInit {
  tabActivo = 'discrepancias';
  duplicados: DuplicadoDetectado[] = [];
  errores: ErrorBD[] = [];
  discrepanciasPorTipo: { tipo: string; cantidad: number }[] = [];
  totalDiscrepancias = 0;
  maxDiscrepancia = 1;
  tasaDiscrepancia = 0;

  constructor(private conciliacionService: ConciliacionService) {}

  ngOnInit(): void {
    this.duplicados = this.conciliacionService.getDuplicados();
    this.errores = this.conciliacionService.getErroresBD();
    this.discrepanciasPorTipo = this.conciliacionService.getDiscrepanciasPorTipo();
    this.totalDiscrepancias = this.discrepanciasPorTipo.reduce((s, d) => s + d.cantidad, 0);
    this.maxDiscrepancia = Math.max(...this.discrepanciasPorTipo.map(d => d.cantidad), 1);
    const resumen = this.conciliacionService.getResumen();
    this.tasaDiscrepancia = Math.round((resumen.discrepancias / resumen.totalProcesadas) * 10000) / 100;
  }

  getBarColor(tipo: string): string {
    const colors: Record<string, string> = {
      monto: 'bg-red-500',
      fecha: 'bg-amber-500',
      duplicado: 'bg-purple-500',
      sin_contrapartida: 'bg-blue-500',
      codigo_erroneo: 'bg-orange-500',
    };
    return colors[tipo] || 'bg-gray-500';
  }
}
