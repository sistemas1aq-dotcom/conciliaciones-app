import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConciliacionService } from '../../services/conciliacion.service';
import { ResumenConciliacion } from '../../models/conciliacion.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-500">Resumen ejecutivo de conciliaciones</p>
        </div>
        <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Actualizado: {{ today }}</span>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span class="text-xs text-gray-400">Total</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ resumen.totalProcesadas }}</p>
          <p class="text-xs text-gray-500 mt-1">Conciliaciones procesadas</p>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-xs text-green-600 font-medium">{{ resumen.porcentajeCoincidencia }}%</span>
          </div>
          <p class="text-2xl font-bold text-green-600">{{ resumen.conciliadas }}</p>
          <p class="text-xs text-gray-500 mt-1">Conciliadas exitosamente</p>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-xs text-amber-600 font-medium">Pendientes</span>
          </div>
          <p class="text-2xl font-bold text-amber-600">{{ resumen.pendientes }}</p>
          <p class="text-xs text-gray-500 mt-1">Por resolver</p>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            </div>
            <span class="text-xs text-red-600 font-medium">Alerta</span>
          </div>
          <p class="text-2xl font-bold text-red-600">{{ resumen.discrepancias }}</p>
          <p class="text-xs text-gray-500 mt-1">Discrepancias detectadas</p>
        </div>
      </div>

      <!-- Montos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gradient-to-r from-aquarius-600 to-aquarius-500 rounded-xl p-5 text-white shadow-lg">
          <p class="text-xs opacity-80">Monto Total Banco</p>
          <p class="text-xl font-bold mt-1">S/ {{ resumen.montoTotalBanco.toLocaleString() }}</p>
        </div>
        <div class="bg-gradient-to-r from-aquarius-700 to-aquarius-600 rounded-xl p-5 text-white shadow-lg">
          <p class="text-xs opacity-80">Monto Total Contable</p>
          <p class="text-xl font-bold mt-1">S/ {{ resumen.montoTotalContable.toLocaleString() }}</p>
        </div>
        <div class="rounded-xl p-5 shadow-lg" [class]="resumen.diferenciaNeta > 0 ? 'bg-gradient-to-r from-red-600 to-red-500 text-white' : 'bg-gradient-to-r from-green-600 to-green-500 text-white'">
          <p class="text-xs opacity-80">Diferencia Neta</p>
          <p class="text-xl font-bold mt-1">S/ {{ Math.abs(resumen.diferenciaNeta).toLocaleString() }}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Conciliaciones por Mes</h3>
          <canvas #barChart></canvas>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Distribución por Estado</h3>
          <div class="flex justify-center">
            <div class="w-64 h-64">
              <canvas #doughnutChart></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a routerLink="/conciliaciones" class="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
            <div class="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            </div>
            <span class="text-xs font-medium text-blue-700">Ver Conciliaciones</span>
          </a>
          <a routerLink="/reportes" class="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
            <div class="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span class="text-xs font-medium text-purple-700">Reportes</span>
          </a>
          <a routerLink="/ai-assistant" class="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
            <div class="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 5.527a.5.5 0 01-.457.298H7.927a.5.5 0 01-.457-.298L5 14.5m14 0H5"/></svg>
            </div>
            <span class="text-xs font-medium text-emerald-700">Asistente IA</span>
          </a>
          <a routerLink="/conciliaciones" class="flex items-center gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer">
            <div class="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            </div>
            <span class="text-xs font-medium text-amber-700">Revisar Alertas</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;

  resumen!: ResumenConciliacion;
  today = new Date().toLocaleDateString('es-PE');
  Math = Math;

  constructor(private conciliacionService: ConciliacionService) {}

  ngOnInit(): void {
    this.resumen = this.conciliacionService.getResumen();
  }

  ngAfterViewInit(): void {
    this.createBarChart();
    this.createDoughnutChart();
  }

  private createBarChart(): void {
    const datos = this.conciliacionService.getConciliacionesPorMes();
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: datos.map(d => d.mes),
        datasets: [
          { label: 'Conciliadas', data: datos.map(d => d.conciliadas), backgroundColor: '#22c55e', borderRadius: 4 },
          { label: 'Discrepancias', data: datos.map(d => d.discrepancias), backgroundColor: '#ef4444', borderRadius: 4 },
          { label: 'Pendientes', data: datos.map(d => d.pendientes), backgroundColor: '#f59e0b', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
      },
    });
  }

  private createDoughnutChart(): void {
    new Chart(this.doughnutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Conciliadas', 'Discrepancias', 'Pendientes'],
        datasets: [{
          data: [this.resumen.conciliadas, this.resumen.discrepancias, this.resumen.pendientes],
          backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        cutout: '65%',
      },
    });
  }
}
