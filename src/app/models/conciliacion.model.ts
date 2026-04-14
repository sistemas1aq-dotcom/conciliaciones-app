export interface TransaccionBancaria {
  id: string;
  fecha: string;
  referencia: string;
  descripcion: string;
  monto: number;
  tipo: 'debito' | 'credito';
  banco: string;
  numeroCuenta: string;
}

export interface TransaccionContable {
  id: string;
  fecha: string;
  codigoAsiento: string;
  descripcion: string;
  monto: number;
  tipo: 'debito' | 'credito';
  cuentaContable: string;
  centroCosto: string;
}

export interface Conciliacion {
  id: string;
  transaccionBancaria: TransaccionBancaria | null;
  transaccionContable: TransaccionContable | null;
  estado: 'conciliado' | 'pendiente' | 'discrepancia';
  diferencia: number;
  fechaConciliacion: string;
  observacion: string;
  tipoDiscrepancia?: 'monto' | 'fecha' | 'duplicado' | 'sin_contrapartida' | 'codigo_erroneo';
}

export interface ResumenConciliacion {
  totalProcesadas: number;
  conciliadas: number;
  pendientes: number;
  discrepancias: number;
  porcentajeCoincidencia: number;
  montoTotalBanco: number;
  montoTotalContable: number;
  diferenciaNeta: number;
}

export interface DuplicadoDetectado {
  codigo: string;
  ocurrencias: number;
  registros: { id: string; fecha: string; monto: number; fuente: string }[];
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
