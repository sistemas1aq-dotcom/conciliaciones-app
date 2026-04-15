import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-overlay',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" (click)="close.emit()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="bg-[#1a3a5f] text-white p-5 rounded-t-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">?</div>
            <div>
              <h2 class="text-lg font-bold">Ayuda — SIGPRO</h2>
              <p class="text-xs text-blue-200">{{ currentHelp.titulo }}</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-white/70 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-5 space-y-4">
          <!-- Contextual help -->
          <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 class="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ currentHelp.titulo }}
            </h3>
            <p class="text-sm text-blue-800">{{ currentHelp.descripcion }}</p>
            @if (currentHelp.pasos.length > 0) {
              <div class="mt-3 space-y-1">
                @for (paso of currentHelp.pasos; track paso; let i = $index) {
                  <div class="flex items-start gap-2 text-sm text-blue-700">
                    <span class="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{{ i + 1 }}</span>
                    <span>{{ paso }}</span>
                  </div>
                }
              </div>
            }
          </div>

          <!-- General shortcuts -->
          <div>
            <h3 class="font-semibold text-gray-700 text-sm mb-3">Navegación Rápida</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              @for (item of shortcuts; track item.label) {
                <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" [style.background]="item.color">
                    {{ item.icon }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800 text-xs">{{ item.label }}</p>
                    <p class="text-[10px] text-gray-500">{{ item.desc }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- FAQ -->
          <div>
            <h3 class="font-semibold text-gray-700 text-sm mb-3">Preguntas Frecuentes</h3>
            <div class="space-y-2">
              @for (faq of faqs; track faq.q) {
                <details class="group bg-gray-50 rounded-lg">
                  <summary class="p-3 text-sm font-medium text-gray-700 cursor-pointer hover:text-aquarius-600 list-none flex items-center justify-between">
                    {{ faq.q }}
                    <svg class="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </summary>
                  <p class="px-3 pb-3 text-xs text-gray-600">{{ faq.a }}</p>
                </details>
              }
            </div>
          </div>

          <!-- AI tip -->
          <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M14.25 3.104v5.714a2.25 2.25 0 00.659 1.591L19 14.5"/></svg>
              <span class="font-semibold text-emerald-800 text-sm">Asistente IA disponible</span>
            </div>
            <p class="text-xs text-emerald-700">Puedes hacer preguntas en lenguaje natural al Asistente IA. Ejemplo: "¿Cuántas equivocaciones en BD?", "Prever duplicidad de códigos", "¿Qué activos están en mal estado?"</p>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 text-center">
          <p class="text-[10px] text-gray-400">SIGPRO v2026.1.01 — Aquarius Consulting — Ayuda contextual</p>
        </div>
      </div>
    </div>
  `,
})
export class HelpOverlayComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  get currentHelp() {
    const url = this.router.url;
    return this.helpMap.find(h => url.includes(h.path)) || this.helpMap[0];
  }

  shortcuts = [
    { label: 'Dashboard', desc: 'Resumen general', icon: 'D', color: '#2563eb' },
    { label: 'Base Inventario', desc: 'Registro de activos físicos', icon: 'BI', color: '#0891b2' },
    { label: 'Inventario Contable', desc: 'Datos contables SAP/ERP', icon: 'IC', color: '#7c3aed' },
    { label: 'Conciliación Auto', desc: 'Cruce físico vs contable', icon: 'CA', color: '#059669' },
    { label: 'Ficha Técnica', desc: 'Detalle completo de activo', icon: 'FT', color: '#dc2626' },
    { label: 'Asistente IA', desc: 'Análisis inteligente', icon: 'IA', color: '#0d9488' },
  ];

  faqs = [
    { q: '¿Cómo registro un nuevo activo fijo?', a: 'Ir a Maestros > Base Inventario > clic en "+ Nuevo". Complete todos los campos del formulario incluyendo código de barras, ubicación, marca, modelo y estado de conservación.' },
    { q: '¿Cómo ejecuto una conciliación automática?', a: 'Ir a Procesos Contables > Conciliación Automática > clic en "Ejecutar Conciliación". El sistema cruzará automáticamente el inventario físico con el contable.' },
    { q: '¿Qué significan los estados de conservación?', a: 'NU=Nuevo, BU=Bueno, RE=Regular, MA=Malo, OP=Operativo, AV=Averiado, BA=Baja, UB=Usado para Baja. Se asignan durante el inventario físico.' },
    { q: '¿Cómo exporto un reporte?', a: 'Cada pantalla con datos tiene un botón "Exportar". Los reportes se generan en formato Excel (.xlsx) con los filtros aplicados.' },
    { q: '¿Cómo uso el Asistente IA?', a: 'Ir a la sección "Asistente IA" en el menú lateral. Escriba su pregunta en lenguaje natural. El sistema analiza los datos del inventario y responde con análisis detallados.' },
  ];

  helpMap = [
    { path: '/dashboard', titulo: 'Dashboard', descripcion: 'Vista general con indicadores clave del inventario de activos fijos. Muestra el total de activos, estado de conciliación, valores patrimoniales y gráficos de distribución.', pasos: ['Revise los KPIs superiores para el estado general', 'Los gráficos muestran la distribución por estado', 'Use las acciones rápidas para navegar a módulos específicos'] },
    { path: '/base-inventario', titulo: 'Base Inventario (Inventario Físico)', descripcion: 'Registro de activos encontrados durante el levantamiento de inventario físico. Cada activo se identifica por código de barras.', pasos: ['Clic en "+ Nuevo" para registrar un activo', 'Complete todos los campos del formulario', 'Adjunte foto del activo si está disponible', 'Use "Buscar" para encontrar activos por código o descripción'] },
    { path: '/inventario-contable', titulo: 'Inventario Contable', descripcion: 'Base de datos contable importada desde SAP/ERP. Contiene los activos registrados en libros con sus valores de adquisición, depreciación y valor neto.', pasos: ['Use "Actualizar" para refrescar datos del ERP', 'Busque activos por código o denominación', 'Los valores están en la moneda indicada (PEN/USD)'] },
    { path: '/estados-conservacion', titulo: 'Estados de Conservación', descripcion: 'Catálogo maestro de estados posibles para clasificar la condición física de cada activo durante el inventario.', pasos: ['Clic en "+ Nuevo" para agregar un estado', 'Use "Carga masiva" para importar desde Excel', 'Los estados marcados como "Sistema" no pueden eliminarse'] },
    { path: '/actividades', titulo: 'Actividades del Cronograma', descripcion: 'Planificación y seguimiento de las actividades del proyecto de inventario general de activos fijos.', pasos: ['Seleccione el proyecto', 'Complete el formulario de nueva actividad', 'Marque como finalizada cuando corresponda'] },
    { path: '/conciliacion-automatica', titulo: 'Conciliación Automática', descripcion: 'Proceso automatizado que cruza el inventario físico contra el inventario contable para identificar coincidencias, sobrantes, faltantes y discrepancias.', pasos: ['Clic en "Ejecutar Conciliación"', 'Revise los resultados en la tabla', 'Los faltantes requieren investigación inmediata', 'Exporte el resultado para auditoría'] },
    { path: '/conciliacion-manual', titulo: 'Conciliación Manual', descripcion: 'Permite conciliar manualmente activos que no pudieron ser cruzados automáticamente, seleccionando la contrapartida física y contable.', pasos: ['Seleccione un activo del panel izquierdo (físico)', 'Seleccione su contrapartida del panel derecho (contable)', 'Clic en "Conciliar Seleccionados"', 'Puede deshacer si cometió un error'] },
    { path: '/ficha-tecnica', titulo: 'Ficha Técnica del Activo', descripcion: 'Vista detallada de un activo fijo con toda su información: datos generales, ubicación, estado, información contable y fotografía.', pasos: ['Busque el activo por código o descripción', 'Revise cada sección de la ficha', 'Use "Imprimir" para generar copia física'] },
    { path: '/ai-assistant', titulo: 'Asistente de Inteligencia Artificial', descripcion: 'Chat inteligente que analiza los datos del inventario y responde preguntas en lenguaje natural. Puede detectar errores, predecir problemas y sugerir correcciones.', pasos: ['Escriba su pregunta en el campo de texto', 'Use las preguntas sugeridas como guía', 'El asistente analiza datos reales del sistema'] },
    { path: '/registro-fotografico', titulo: 'Registro Fotográfico', descripcion: 'Galería de fotografías de los activos fijos tomadas durante el inventario físico. Permite búsqueda por código y descarga masiva.', pasos: ['Busque por código de barras', 'Filtre por año', 'Use "Descarga Masiva" para exportar fotos'] },
    { path: '/', titulo: 'Sistema SIGPRO — Ayuda General', descripcion: 'Sistema de Gestión de Proyectos para el Inventario General de Activos Fijos. Permite registrar, conciliar y reportar sobre los activos patrimoniales de la empresa.', pasos: ['Navegue usando el menú lateral', 'Cada sección tiene funcionalidades CRUD', 'Use el Asistente IA para análisis avanzados'] },
  ];
}
