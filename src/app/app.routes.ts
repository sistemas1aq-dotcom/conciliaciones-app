import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },

  // Maestros
  { path: 'maestros/sedes', loadComponent: () => import('./pages/maestros/sedes/sedes.component').then(m => m.SedesComponent), canActivate: [authGuard] },
  { path: 'maestros/ubicaciones', loadComponent: () => import('./pages/maestros/ubicaciones/ubicaciones.component').then(m => m.UbicacionesComponent), canActivate: [authGuard] },
  { path: 'maestros/centros-costo', loadComponent: () => import('./pages/maestros/centros-costo/centros-costo.component').then(m => m.CentrosCostoComponent), canActivate: [authGuard] },
  { path: 'maestros/catalogo', loadComponent: () => import('./pages/maestros/catalogo/catalogo.component').then(m => m.CatalogoComponent), canActivate: [authGuard] },
  { path: 'maestros/base-inventario', loadComponent: () => import('./pages/base-inventario/base-inventario.component').then(m => m.BaseInventarioComponent), canActivate: [authGuard] },
  { path: 'maestros/estados-conservacion', loadComponent: () => import('./pages/maestros/estados-conservacion/estados-conservacion.component').then(m => m.EstadosConservacionComponent), canActivate: [authGuard] },
  { path: 'maestros/estructura-contable', loadComponent: () => import('./pages/maestros/estructura-contable/estructura-contable.component').then(m => m.EstructuraContableComponent), canActivate: [authGuard] },
  { path: 'maestros/inventario-contable', loadComponent: () => import('./pages/inventario-contable/inventario-contable.component').then(m => m.InventarioContableComponent), canActivate: [authGuard] },

  // Cronograma
  { path: 'cronograma/actividades', loadComponent: () => import('./pages/actividades/actividades.component').then(m => m.ActividadesComponent), canActivate: [authGuard] },
  { path: 'cronograma/entregables', loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent), canActivate: [authGuard], data: { titulo: 'Entregables Relacionados' } },
  { path: 'cronograma/docs-iso', loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent), canActivate: [authGuard], data: { titulo: 'Documentos ISO Relacionados' } },

  // Inventario
  { path: 'inventario/base-capturas', loadComponent: () => import('./pages/base-capturas/base-capturas.component').then(m => m.BaseCapturasComponent), canActivate: [authGuard] },
  { path: 'inventario/procesar-depurar', loadComponent: () => import('./pages/procesar-depurar/procesar-depurar.component').then(m => m.ProcesarDepurarComponent), canActivate: [authGuard] },
  { path: 'inventario/importacion', loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent), canActivate: [authGuard], data: { titulo: 'Importación' } },
  { path: 'inventario/inventario-final', loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent), canActivate: [authGuard], data: { titulo: 'Inventario Final' } },
  { path: 'inventario/registro-fotografico', loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent), canActivate: [authGuard], data: { titulo: 'Registro Fotográfico' } },

  // IA
  { path: 'ai-assistant', loadComponent: () => import('./pages/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent), canActivate: [authGuard] },

  // Conciliación
  { path: 'conciliaciones', loadComponent: () => import('./pages/conciliaciones/conciliaciones.component').then(m => m.ConciliacionesComponent), canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
