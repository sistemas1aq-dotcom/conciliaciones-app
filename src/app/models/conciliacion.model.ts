export interface ProductoInventario {
  codigo: string;
  nombre: string;
  categoria: 'materia_prima' | 'producto_terminado' | 'insumo' | 'repuesto' | 'aleacion';
  unidadMedida: string;
  almacen: string;
}

export interface RegistroFisico {
  id: string;
  producto: ProductoInventario;
  fecha: string;
  cantidadFisica: number;
  pesoKg: number;
  lote: string;
  ubicacion: string;
  responsable: string;
}

export interface RegistroSistema {
  id: string;
  producto: ProductoInventario;
  fecha: string;
  cantidadSistema: number;
  pesoKg: number;
  lote: string;
  ultimoMovimiento: string;
  tipoMovimiento: 'entrada' | 'salida' | 'ajuste' | 'transferencia';
}

export interface Conciliacion {
  id: string;
  registroFisico: RegistroFisico | null;
  registroSistema: RegistroSistema | null;
  estado: 'conciliado' | 'pendiente' | 'discrepancia';
  diferenciaCantidad: number;
  diferenciaPeso: number;
  fechaConciliacion: string;
  observacion: string;
  tipoDiscrepancia?: 'cantidad' | 'peso' | 'codigo_duplicado' | 'sin_contrapartida' | 'lote_incorrecto' | 'ubicacion';
}

export interface ResumenConciliacion {
  totalProcesados: number;
  conciliados: number;
  pendientes: number;
  discrepancias: number;
  porcentajeCoincidencia: number;
  totalItemsFisico: number;
  totalItemsSistema: number;
  pesoTotalFisicoKg: number;
  pesoTotalSistemaKg: number;
  diferenciaPesoKg: number;
}

export interface DuplicadoDetectado {
  codigo: string;
  nombreProducto: string;
  ocurrencias: number;
  registros: { id: string; almacen: string; cantidad: number; lote: string }[];
  sugerenciaCorreccion: string;
}

export interface ErrorBD {
  id: string;
  tipo: string;
  descripcion: string;
  tabla: string;
  impacto: 'alto' | 'medio' | 'bajo';
  sugerencia: string;
}

export interface MensajeChat {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: Date;
  datos?: any;
  tipo?: 'texto' | 'tabla' | 'grafico' | 'alerta';
}
