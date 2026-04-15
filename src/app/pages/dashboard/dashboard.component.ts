import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivoFijoService } from '../../services/activo-fijo.service';
import { ResumenInventario } from '../../models/activo-fijo.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard — Activos Fijos</h1>
          <p class="text-sm text-gray-500">Resumen ejecutivo del inventario general de activos fijos</p>
        </div>
        <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{{ today }}</span>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ resumen.totalActivos }}</p>
          <p class="text-xs text-gray-500">Total activos</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-green-600">{{ resumen.conciliados }}</p>
          <p class="text-xs text-gray-500">Conciliados</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-red-600">{{ resumen.faltantes }}</p>
          <p class="text-xs text-gray-500">Faltantes</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-amber-600">{{ resumen.sobrantes }}</p>
          <p class="text-xs text-gray-500">Sobrantes</p>
        </div>
      </div>

      <!-- Valor -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gradient-to-r from-[#1a3a5f] to-[#2563eb] rounded-xl p-5 text-white shadow-lg">
          <p class="text-xs opacity-80">Valor Total Adquisición</p>
          <p class="text-xl font-bold mt-1">S/ {{ resumen.valorTotal.toLocaleString() }}</p>
        </div>
        <div class="bg-gradient-to-r from-[#1e4d8c] to-[#1a3a5f] rounded-xl p-5 text-white shadow-lg">
          <p class="text-xs opacity-80">Depreciación Acumulada</p>
          <p class="text-xl font-bold mt-1">S/ {{ resumen.depreciacionTotal.toLocaleString() }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-5 text-white shadow-lg">
          <p class="text-xs opacity-80">Valor Neto en Libros</p>
          <p class="text-xl font-bold mt-1">S/ {{ resumen.valorNetoTotal.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Conciliación por Estado</h3>
          <div class="flex justify-center"><div class="w-64 h-64"><canvas #doughnutChart></canvas></div></div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Activos por Estado de Conservación</h3>
          <canvas #barChart></canvas>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a routerLink="/maestros/base-inventario" class="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <div class="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
            <span class="text-xs font-medium text-blue-700">Base Inventario</span>
          </a>
          <a routerLink="/maestros/inventario-contable" class="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
            <div class="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
            <span class="text-xs font-medium text-purple-700">Inv. Contable</span>
          </a>
          <a routerLink="/ai-assistant" class="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
            <div class="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M14.25 3.104v5.714a2.25 2.25 0 00.659 1.591L19 14.5"/></svg></div>
            <span class="text-xs font-medium text-emerald-700">Asistente IA</span>
          </a>
          <a routerLink="/cronograma/actividades" class="flex items-center gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
            <div class="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
            <span class="text-xs font-medium text-amber-700">Actividades</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;

  resumen!: ResumenInventario;
  today = new Date().toLocaleDateString('es-PE');

  constructor(private svc: ActivoFijoService) {}

  ngOnInit(): void {
    this.resumen = this.svc.getResumen();
  }

  ngAfterViewInit(): void {
    new Chart(this.doughnutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Conciliados', 'Faltantes', 'Sobrantes', 'Discrepancias'],
        datasets: [{ data: [this.resumen.conciliados, this.resumen.faltantes, this.resumen.sobrantes, this.resumen.discrepancias], backgroundColor: ['#22c55e','#ef4444','#f59e0b','#8b5cf6'], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } },
    });

    const estados = this.svc.getActivosPorEstadoConservacion();
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: estados.map(e => e.estado),
        datasets: [{ label: 'Activos', data: estados.map(e => e.cantidad), backgroundColor: '#2563eb', borderRadius: 4 }],
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } },
    });
  }
}
