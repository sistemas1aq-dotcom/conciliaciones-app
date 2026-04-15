import { Injectable } from '@angular/core';
import {
  Sede, Ubicacion, CentroCosto, CatalogoItem, EstadoConservacion,
  EstructuraContable, ActivoFijo, InventarioContable, Actividad,
  ConciliacionAF, ResumenInventario,
} from '../models/activo-fijo.model';
import {
  SEDES, UBICACIONES, CENTROS_COSTO, CATALOGO, ESTADOS_CONSERVACION,
  ESTRUCTURA_CONTABLE, ACTIVOS_FIJOS, INVENTARIO_CONTABLE, ACTIVIDADES,
  CONCILIACIONES_AF,
} from '../data/mock-activos';

@Injectable({ providedIn: 'root' })
export class ActivoFijoService {

  // In-memory clones so mutations don't affect the original imports
  private sedes: Sede[] = structuredClone(SEDES);
  private ubicaciones: Ubicacion[] = structuredClone(UBICACIONES);
  private centrosCosto: CentroCosto[] = structuredClone(CENTROS_COSTO);
  private catalogo: CatalogoItem[] = structuredClone(CATALOGO);
  private estadosConservacion: EstadoConservacion[] = structuredClone(ESTADOS_CONSERVACION);
  private estructuraContable: EstructuraContable[] = structuredClone(ESTRUCTURA_CONTABLE);
  private activosFijos: ActivoFijo[] = structuredClone(ACTIVOS_FIJOS);
  private inventarioContable: InventarioContable[] = structuredClone(INVENTARIO_CONTABLE);
  private actividades: Actividad[] = structuredClone(ACTIVIDADES);
  private conciliaciones: ConciliacionAF[] = structuredClone(CONCILIACIONES_AF);

  // ======================== GENERIC CRUD HELPERS ========================

  private nextId(arr: { id: number }[]): number {
    return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;
  }

  private nextStringId(arr: { id: string }[], prefix: string, pad: number): string {
    const nums = arr.map(i => parseInt(i.id.replace(prefix, ''), 10)).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}${String(next).padStart(pad, '0')}`;
  }

  // ======================== SEDES ========================

  getSedes(): Sede[] { return [...this.sedes]; }

  addSede(item: Omit<Sede, 'id'>): Sede {
    const nuevo: Sede = { ...item, id: this.nextId(this.sedes) };
    this.sedes.push(nuevo);
    return nuevo;
  }

  updateSede(item: Sede): void {
    const idx = this.sedes.findIndex(s => s.id === item.id);
    if (idx >= 0) this.sedes[idx] = { ...item };
  }

  deleteSede(id: number): void {
    this.sedes = this.sedes.filter(s => s.id !== id);
  }

  searchSedes(term: string): Sede[] {
    const t = term.toLowerCase();
    return this.sedes.filter(s =>
      s.codigo.toLowerCase().includes(t) ||
      s.descripcion.toLowerCase().includes(t) ||
      s.direccion.toLowerCase().includes(t)
    );
  }

  // ======================== UBICACIONES ========================

  getUbicaciones(): Ubicacion[] { return [...this.ubicaciones]; }

  addUbicacion(item: Omit<Ubicacion, 'id'>): Ubicacion {
    const nuevo: Ubicacion = { ...item, id: this.nextId(this.ubicaciones) };
    this.ubicaciones.push(nuevo);
    return nuevo;
  }

  updateUbicacion(item: Ubicacion): void {
    const idx = this.ubicaciones.findIndex(u => u.id === item.id);
    if (idx >= 0) this.ubicaciones[idx] = { ...item };
  }

  deleteUbicacion(id: number): void {
    this.ubicaciones = this.ubicaciones.filter(u => u.id !== id);
  }

  searchUbicaciones(term: string): Ubicacion[] {
    const t = term.toLowerCase();
    return this.ubicaciones.filter(u =>
      u.codigo.toLowerCase().includes(t) ||
      u.descripcion.toLowerCase().includes(t) ||
      u.sedNombre.toLowerCase().includes(t)
    );
  }

  // ======================== CENTROS DE COSTO ========================

  getCentrosCosto(): CentroCosto[] { return [...this.centrosCosto]; }

  addCentroCosto(item: Omit<CentroCosto, 'id'>): CentroCosto {
    const nuevo: CentroCosto = { ...item, id: this.nextId(this.centrosCosto) };
    this.centrosCosto.push(nuevo);
    return nuevo;
  }

  updateCentroCosto(item: CentroCosto): void {
    const idx = this.centrosCosto.findIndex(c => c.id === item.id);
    if (idx >= 0) this.centrosCosto[idx] = { ...item };
  }

  deleteCentroCosto(id: number): void {
    this.centrosCosto = this.centrosCosto.filter(c => c.id !== id);
  }

  searchCentrosCosto(term: string): CentroCosto[] {
    const t = term.toLowerCase();
    return this.centrosCosto.filter(c =>
      c.codigo.toLowerCase().includes(t) ||
      c.descripcion.toLowerCase().includes(t)
    );
  }

  // ======================== CATÁLOGO ========================

  getCatalogo(): CatalogoItem[] { return [...this.catalogo]; }

  addCatalogo(item: Omit<CatalogoItem, 'id'>): CatalogoItem {
    const nuevo: CatalogoItem = { ...item, id: this.nextId(this.catalogo) };
    this.catalogo.push(nuevo);
    return nuevo;
  }

  updateCatalogo(item: CatalogoItem): void {
    const idx = this.catalogo.findIndex(c => c.id === item.id);
    if (idx >= 0) this.catalogo[idx] = { ...item };
  }

  deleteCatalogo(id: number): void {
    this.catalogo = this.catalogo.filter(c => c.id !== id);
  }

  searchCatalogo(term: string): CatalogoItem[] {
    const t = term.toLowerCase();
    return this.catalogo.filter(c =>
      c.codigo.toLowerCase().includes(t) ||
      c.descripcion.toLowerCase().includes(t) ||
      c.cuenta.toLowerCase().includes(t)
    );
  }

  // ======================== ESTADOS DE CONSERVACIÓN ========================

  getEstadosConservacion(): EstadoConservacion[] { return [...this.estadosConservacion]; }

  addEstadoConservacion(item: Omit<EstadoConservacion, 'id'>): EstadoConservacion {
    const nuevo: EstadoConservacion = { ...item, id: this.nextId(this.estadosConservacion) };
    this.estadosConservacion.push(nuevo);
    return nuevo;
  }

  updateEstadoConservacion(item: EstadoConservacion): void {
    const idx = this.estadosConservacion.findIndex(e => e.id === item.id);
    if (idx >= 0) this.estadosConservacion[idx] = { ...item };
  }

  deleteEstadoConservacion(id: number): void {
    this.estadosConservacion = this.estadosConservacion.filter(e => e.id !== id);
  }

  searchEstadosConservacion(term: string): EstadoConservacion[] {
    const t = term.toLowerCase();
    return this.estadosConservacion.filter(e =>
      e.codigo.toLowerCase().includes(t) ||
      e.descripcion.toLowerCase().includes(t)
    );
  }

  // ======================== ESTRUCTURA CONTABLE ========================

  getEstructuraContable(): EstructuraContable[] { return [...this.estructuraContable]; }

  addEstructuraContable(item: Omit<EstructuraContable, 'id'>): EstructuraContable {
    const nuevo: EstructuraContable = { ...item, id: this.nextId(this.estructuraContable) };
    this.estructuraContable.push(nuevo);
    return nuevo;
  }

  updateEstructuraContable(item: EstructuraContable): void {
    const idx = this.estructuraContable.findIndex(e => e.id === item.id);
    if (idx >= 0) this.estructuraContable[idx] = { ...item };
  }

  deleteEstructuraContable(id: number): void {
    this.estructuraContable = this.estructuraContable.filter(e => e.id !== id);
  }

  searchEstructuraContable(term: string): EstructuraContable[] {
    const t = term.toLowerCase();
    return this.estructuraContable.filter(e =>
      e.codigo.toLowerCase().includes(t) ||
      e.descripcion.toLowerCase().includes(t) ||
      e.cuentaContable.toLowerCase().includes(t) ||
      e.tipo.toLowerCase().includes(t)
    );
  }

  // ======================== ACTIVOS FIJOS ========================

  getActivosFijos(): ActivoFijo[] { return [...this.activosFijos]; }

  addActivoFijo(item: Omit<ActivoFijo, 'id'>): ActivoFijo {
    const nuevo: ActivoFijo = { ...item, id: this.nextId(this.activosFijos) };
    this.activosFijos.push(nuevo);
    return nuevo;
  }

  updateActivoFijo(item: ActivoFijo): void {
    const idx = this.activosFijos.findIndex(a => a.id === item.id);
    if (idx >= 0) this.activosFijos[idx] = { ...item };
  }

  deleteActivoFijo(id: number): void {
    this.activosFijos = this.activosFijos.filter(a => a.id !== id);
  }

  searchActivosFijos(term: string): ActivoFijo[] {
    const t = term.toLowerCase();
    return this.activosFijos.filter(a =>
      a.barNue.toLowerCase().includes(t) ||
      a.catDescripcion.toLowerCase().includes(t) ||
      a.marca.toLowerCase().includes(t) ||
      a.ubicacion.toLowerCase().includes(t) ||
      a.responsable.toLowerCase().includes(t)
    );
  }

  // ======================== INVENTARIO CONTABLE ========================

  getInventarioContable(): InventarioContable[] { return [...this.inventarioContable]; }

  addInventarioContable(item: Omit<InventarioContable, 'id'>): InventarioContable {
    const nuevo: InventarioContable = { ...item, id: this.nextId(this.inventarioContable) };
    this.inventarioContable.push(nuevo);
    return nuevo;
  }

  updateInventarioContable(item: InventarioContable): void {
    const idx = this.inventarioContable.findIndex(i => i.id === item.id);
    if (idx >= 0) this.inventarioContable[idx] = { ...item };
  }

  deleteInventarioContable(id: number): void {
    this.inventarioContable = this.inventarioContable.filter(i => i.id !== id);
  }

  searchInventarioContable(term: string): InventarioContable[] {
    const t = term.toLowerCase();
    return this.inventarioContable.filter(i =>
      i.codigoActivo.toLowerCase().includes(t) ||
      i.descripcion.toLowerCase().includes(t) ||
      i.cuentaContable.toLowerCase().includes(t) ||
      i.ubicacion.toLowerCase().includes(t)
    );
  }

  // ======================== ACTIVIDADES ========================

  getActividades(): Actividad[] { return [...this.actividades]; }

  addActividad(item: Omit<Actividad, 'id'>): Actividad {
    const nuevo: Actividad = { ...item, id: this.nextId(this.actividades) };
    this.actividades.push(nuevo);
    return nuevo;
  }

  updateActividad(item: Actividad): void {
    const idx = this.actividades.findIndex(a => a.id === item.id);
    if (idx >= 0) this.actividades[idx] = { ...item };
  }

  deleteActividad(id: number): void {
    this.actividades = this.actividades.filter(a => a.id !== id);
  }

  searchActividades(term: string): Actividad[] {
    const t = term.toLowerCase();
    return this.actividades.filter(a =>
      a.titulo.toLowerCase().includes(t) ||
      a.descripcion.toLowerCase().includes(t) ||
      a.estado.toLowerCase().includes(t)
    );
  }

  // ======================== CONCILIACIONES ========================

  getConciliaciones(): ConciliacionAF[] { return [...this.conciliaciones]; }

  addConciliacion(item: ConciliacionAF): ConciliacionAF {
    const nuevo: ConciliacionAF = {
      ...item,
      id: this.nextStringId(this.conciliaciones, 'CON-', 4),
    };
    this.conciliaciones.push(nuevo);
    return nuevo;
  }

  updateConciliacion(item: ConciliacionAF): void {
    const idx = this.conciliaciones.findIndex(c => c.id === item.id);
    if (idx >= 0) this.conciliaciones[idx] = { ...item };
  }

  deleteConciliacion(id: string): void {
    this.conciliaciones = this.conciliaciones.filter(c => c.id !== id);
  }

  searchConciliaciones(term: string): ConciliacionAF[] {
    const t = term.toLowerCase();
    return this.conciliaciones.filter(c =>
      c.barNue.toLowerCase().includes(t) ||
      c.descripcion.toLowerCase().includes(t) ||
      c.resultado.toLowerCase().includes(t) ||
      c.ubicacionFisica.toLowerCase().includes(t)
    );
  }

  // ======================== RESUMEN ========================

  getResumen(): ResumenInventario {
    const totalActivos = this.activosFijos.length;
    const conciliados = this.conciliaciones.filter(c => c.resultado === 'conciliado').length;
    const sobrantes = this.conciliaciones.filter(c => c.resultado === 'sobrante').length;
    const faltantes = this.conciliaciones.filter(c => c.resultado === 'faltante').length;
    const discrepancias = this.conciliaciones.filter(c => c.resultado === 'discrepancia').length;
    const inventariados = conciliados + discrepancias + sobrantes;
    const pendientes = totalActivos - inventariados;

    const valorTotal = this.inventarioContable.reduce((sum, i) => sum + i.valorAdquisicion, 0);
    const depreciacionTotal = this.inventarioContable.reduce((sum, i) => sum + i.depreciacionAcumulada, 0);
    const valorNetoTotal = this.inventarioContable.reduce((sum, i) => sum + i.valorNeto, 0);

    return {
      totalActivos,
      inventariados,
      pendientes,
      conciliados,
      sobrantes,
      faltantes,
      discrepancias,
      valorTotal,
      depreciacionTotal,
      valorNetoTotal,
    };
  }

  // ======================== DASHBOARD DATA ========================

  getConciliacionesPorEstado(): { estado: string; cantidad: number }[] {
    const map = new Map<string, number>();
    for (const c of this.conciliaciones) {
      map.set(c.resultado, (map.get(c.resultado) || 0) + 1);
    }
    return Array.from(map.entries()).map(([estado, cantidad]) => ({ estado, cantidad }));
  }

  getActivosPorAlmacen(): { almacen: string; cantidad: number }[] {
    const map = new Map<string, number>();
    for (const a of this.activosFijos) {
      map.set(a.ubicacion, (map.get(a.ubicacion) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([almacen, cantidad]) => ({ almacen, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  getActivosPorEstadoConservacion(): { estado: string; cantidad: number }[] {
    const map = new Map<string, number>();
    for (const a of this.activosFijos) {
      map.set(a.estadoConservacion, (map.get(a.estadoConservacion) || 0) + 1);
    }
    return Array.from(map.entries()).map(([estado, cantidad]) => ({ estado, cantidad }));
  }

  getActivosPorCentroCosto(): { centroCosto: string; cantidad: number }[] {
    const map = new Map<string, number>();
    for (const a of this.activosFijos) {
      map.set(a.centroCosto, (map.get(a.centroCosto) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([centroCosto, cantidad]) => ({ centroCosto, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  getActivosPorMarca(): { marca: string; cantidad: number }[] {
    const map = new Map<string, number>();
    for (const a of this.activosFijos) {
      map.set(a.marca, (map.get(a.marca) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([marca, cantidad]) => ({ marca, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  getValorPorCuentaContable(): { cuenta: string; valor: number }[] {
    const map = new Map<string, number>();
    for (const i of this.inventarioContable) {
      map.set(i.cuentaContable, (map.get(i.cuentaContable) || 0) + i.valorNeto);
    }
    return Array.from(map.entries())
      .map(([cuenta, valor]) => ({ cuenta, valor: Math.round(valor * 100) / 100 }))
      .sort((a, b) => b.valor - a.valor);
  }

  getActividadesPorEstado(): { estado: string; cantidad: number }[] {
    const map = new Map<string, number>();
    for (const a of this.actividades) {
      map.set(a.estado, (map.get(a.estado) || 0) + 1);
    }
    return Array.from(map.entries()).map(([estado, cantidad]) => ({ estado, cantidad }));
  }
}
