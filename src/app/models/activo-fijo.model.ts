// === MAESTROS ===

export interface Sede {
  id: number;
  codigo: string;
  descripcion: string;
  direccion: string;
  activo: boolean;
}

export interface Ubicacion {
  id: number;
  codigo: string;
  descripcion: string;
  sedeId: number;
  sedNombre: string;
  activo: boolean;
}

export interface CentroCosto {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface CatalogoItem {
  id: number;
  codigo: string;
  descripcion: string;
  cuenta: string;
  activo: boolean;
}

export interface EstadoConservacion {
  id: number;
  codigo: string;
  descripcion: string;
  estado: boolean;
  sistema: boolean;
}

export interface EstructuraContable {
  id: number;
  codigo: string;
  descripcion: string;
  cuentaContable: string;
  tipo: string;
  activo: boolean;
}

// === INVENTARIO ===

export interface ActivoFijo {
  id: number;
  barNue: string;
  codEmpresa: string;
  fecLectura: string;
  ubicacion: string;
  centroCosto: string;
  responsable: string;
  catDescripcion: string;
  marca: string;
  modelo: string;
  serie: string;
  estadoConservacion: string;
  empresa: string;
  observaciones: string;
  imagen: string | null;
  creacion: string;
  inventariador: string;
}

export interface InventarioContable {
  id: number;
  codigoActivo: string;
  descripcion: string;
  cuentaContable: string;
  fechaAdquisicion: string;
  valorAdquisicion: number;
  depreciacionAcumulada: number;
  valorNeto: number;
  vidaUtil: number;
  ubicacion: string;
  estado: string;
  responsable: string;
}

// === CRONOGRAMA ===

export interface Actividad {
  id: number;
  titulo: string;
  inicio: string;
  fin: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'finalizada';
  iso: string;
  entregables: string;
  proyecto: string;
}

// === CONCILIACIÓN ===

export interface ConciliacionAF {
  id: string;
  barNue: string;
  descripcion: string;
  ubicacionFisica: string;
  ubicacionContable: string;
  estadoFisico: string;
  estadoContable: string;
  valorContable: number;
  encontradoFisico: boolean;
  encontradoContable: boolean;
  resultado: 'conciliado' | 'sobrante' | 'faltante' | 'discrepancia';
  observacion: string;
}

// === IA ===

export interface MensajeChat {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: Date;
  tipo?: 'texto' | 'tabla' | 'grafico' | 'alerta';
}

// === RESUMEN ===

export interface ResumenInventario {
  totalActivos: number;
  inventariados: number;
  pendientes: number;
  conciliados: number;
  sobrantes: number;
  faltantes: number;
  discrepancias: number;
  valorTotal: number;
  depreciacionTotal: number;
  valorNetoTotal: number;
}
