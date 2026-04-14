import { TransaccionBancaria, TransaccionContable, Conciliacion, DuplicadoDetectado, ErrorBD } from '../models/conciliacion.model';

const bancos = ['BCP', 'BBVA', 'Interbank', 'Scotiabank', 'BanBif'];
const cuentas = ['001-234-567890', '002-345-678901', '003-456-789012', '004-567-890123'];
const centrosCosto = ['CC-001', 'CC-002', 'CC-003', 'CC-004', 'CC-005'];
const cuentasContables = ['101.01', '101.02', '401.01', '421.01', '601.01', '701.01'];

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

const descripciones = [
  'Pago proveedor servicios TI',
  'Cobro factura cliente ABC',
  'Transferencia nómina',
  'Pago alquiler oficina',
  'Depósito cliente XYZ',
  'Pago servicios públicos',
  'Cobro cuota préstamo',
  'Comisión bancaria',
  'Transferencia intercompany',
  'Pago impuestos SUNAT',
  'Devolución cliente',
  'Pago seguro empresarial',
  'Ingreso por ventas',
  'Pago publicidad digital',
  'Reembolso gastos viaje',
  'Pago consultoría externa',
  'Cobro penalidad contrato',
  'Anticipo proveedor',
  'Liquidación CTS',
  'Pago gratificación',
];

const startDate = new Date('2026-01-15');
const endDate = new Date('2026-04-14');

export const TRANSACCIONES_BANCARIAS: TransaccionBancaria[] = Array.from({ length: 100 }, (_, i) => {
  const monto = Math.round((Math.random() * 50000 + 100) * 100) / 100;
  return {
    id: `TB-${String(i + 1).padStart(4, '0')}`,
    fecha: randomDate(startDate, endDate),
    referencia: `REF-${generateId()}`,
    descripcion: descripciones[i % descripciones.length],
    monto,
    tipo: Math.random() > 0.4 ? 'debito' as const : 'credito' as const,
    banco: bancos[i % bancos.length],
    numeroCuenta: cuentas[i % cuentas.length],
  };
});

export const TRANSACCIONES_CONTABLES: TransaccionContable[] = Array.from({ length: 100 }, (_, i) => {
  const bancaria = TRANSACCIONES_BANCARIAS[i];
  const tieneDiscrepancia = i % 7 === 0;
  const esDuplicado = i % 15 === 0;
  let monto = bancaria.monto;
  let fecha = bancaria.fecha;
  let codigo = `AST-${String(i + 1).padStart(4, '0')}`;

  if (tieneDiscrepancia) {
    monto = Math.round((monto + (Math.random() * 500 - 250)) * 100) / 100;
  }
  if (esDuplicado && i > 0) {
    codigo = `AST-${String(i).padStart(4, '0')}`;
  }

  return {
    id: `TC-${String(i + 1).padStart(4, '0')}`,
    fecha: tieneDiscrepancia && Math.random() > 0.5
      ? randomDate(new Date(fecha), new Date(new Date(fecha).getTime() + 3 * 86400000))
      : fecha,
    codigoAsiento: codigo,
    descripcion: bancaria.descripcion,
    monto,
    tipo: bancaria.tipo,
    cuentaContable: cuentasContables[i % cuentasContables.length],
    centroCosto: centrosCosto[i % centrosCosto.length],
  };
});

export const CONCILIACIONES: Conciliacion[] = TRANSACCIONES_BANCARIAS.map((tb, i) => {
  const tc = TRANSACCIONES_CONTABLES[i];
  const diferencia = Math.round((tb.monto - tc.monto) * 100) / 100;
  const sinContrapartida = i >= 95;

  let estado: Conciliacion['estado'] = 'conciliado';
  let tipoDiscrepancia: Conciliacion['tipoDiscrepancia'] | undefined;
  let observacion = 'Conciliación automática exitosa';

  if (sinContrapartida) {
    estado = 'pendiente';
    observacion = 'Sin contrapartida contable encontrada';
    tipoDiscrepancia = 'sin_contrapartida';
  } else if (Math.abs(diferencia) > 0.01) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'monto';
    observacion = `Diferencia de monto: S/ ${Math.abs(diferencia).toFixed(2)}`;
  } else if (tb.fecha !== tc.fecha) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'fecha';
    observacion = `Diferencia de fechas: ${tb.fecha} vs ${tc.fecha}`;
  } else if (i % 15 === 0 && i > 0) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'duplicado';
    observacion = `Código asiento duplicado: ${tc.codigoAsiento}`;
  }

  return {
    id: `CON-${String(i + 1).padStart(4, '0')}`,
    transaccionBancaria: sinContrapartida ? tb : tb,
    transaccionContable: sinContrapartida ? null : tc,
    estado,
    diferencia: sinContrapartida ? tb.monto : diferencia,
    fechaConciliacion: randomDate(startDate, endDate),
    observacion,
    tipoDiscrepancia,
  };
});

export const DUPLICADOS_DETECTADOS: DuplicadoDetectado[] = [
  {
    codigo: 'AST-0015',
    ocurrencias: 2,
    registros: [
      { id: 'TC-0015', fecha: '2026-02-10', monto: 12500.00, fuente: 'Contabilidad' },
      { id: 'TC-0016', fecha: '2026-02-10', monto: 12500.00, fuente: 'Contabilidad' },
    ],
    sugerenciaCorreccion: 'Renumerar TC-0016 como AST-0016. Posible ingreso duplicado por error de digitación.',
  },
  {
    codigo: 'AST-0030',
    ocurrencias: 2,
    registros: [
      { id: 'TC-0030', fecha: '2026-02-25', monto: 8750.50, fuente: 'Contabilidad' },
      { id: 'TC-0031', fecha: '2026-02-25', monto: 8750.50, fuente: 'Contabilidad' },
    ],
    sugerenciaCorreccion: 'Renumerar TC-0031 como AST-0031. Verificar si es asiento de reversión.',
  },
  {
    codigo: 'AST-0045',
    ocurrencias: 2,
    registros: [
      { id: 'TC-0045', fecha: '2026-03-05', monto: 23100.00, fuente: 'Contabilidad' },
      { id: 'TC-0046', fecha: '2026-03-05', monto: 23100.00, fuente: 'Contabilidad' },
    ],
    sugerenciaCorreccion: 'Renumerar TC-0046 como AST-0046. Posible doble contabilización.',
  },
  {
    codigo: 'AST-0060',
    ocurrencias: 3,
    registros: [
      { id: 'TC-0060', fecha: '2026-03-15', monto: 5400.00, fuente: 'Contabilidad' },
      { id: 'TC-0061', fecha: '2026-03-15', monto: 5400.00, fuente: 'Contabilidad' },
      { id: 'TC-0062', fecha: '2026-03-16', monto: 5400.00, fuente: 'Contabilidad' },
    ],
    sugerenciaCorreccion: 'Triple entrada detectada. Eliminar TC-0061 y TC-0062. Mantener solo TC-0060 con código AST-0060.',
  },
  {
    codigo: 'REF-DUPLICADA',
    ocurrencias: 2,
    registros: [
      { id: 'TB-0022', fecha: '2026-02-18', monto: 15000.00, fuente: 'Banco BCP' },
      { id: 'TB-0023', fecha: '2026-02-18', monto: 15000.00, fuente: 'Banco BCP' },
    ],
    sugerenciaCorreccion: 'Transacción bancaria duplicada. Verificar extracto bancario original.',
  },
];

export const ERRORES_BD: ErrorBD[] = [
  {
    id: 'ERR-001',
    tipo: 'Índice faltante',
    descripcion: 'La tabla transacciones_bancarias no tiene índice en columna "fecha". Consultas de rango de fechas realizan full table scan.',
    tabla: 'transacciones_bancarias',
    impacto: 'alto',
    sugerencia: 'CREATE INDEX idx_transacciones_fecha ON transacciones_bancarias(fecha);',
  },
  {
    id: 'ERR-002',
    tipo: 'Constraint ausente',
    descripcion: 'No existe constraint UNIQUE en referencia bancaria, permitiendo duplicados.',
    tabla: 'transacciones_bancarias',
    impacto: 'alto',
    sugerencia: 'ALTER TABLE transacciones_bancarias ADD CONSTRAINT uq_referencia UNIQUE(referencia);',
  },
  {
    id: 'ERR-003',
    tipo: 'Tipo de dato incorrecto',
    descripcion: 'Columna "monto" es VARCHAR en lugar de DECIMAL, causando errores de comparación numérica.',
    tabla: 'transacciones_contables',
    impacto: 'alto',
    sugerencia: 'ALTER TABLE transacciones_contables ALTER COLUMN monto TYPE DECIMAL(15,2);',
  },
  {
    id: 'ERR-004',
    tipo: 'Foreign key faltante',
    descripcion: 'No hay FK entre conciliaciones y transacciones, permitiendo referencias huérfanas.',
    tabla: 'conciliaciones',
    impacto: 'medio',
    sugerencia: 'ALTER TABLE conciliaciones ADD CONSTRAINT fk_trans_bancaria FOREIGN KEY (trans_bancaria_id) REFERENCES transacciones_bancarias(id);',
  },
  {
    id: 'ERR-005',
    tipo: 'Registros huérfanos',
    descripcion: '12 registros en conciliaciones referencian transacciones que ya no existen.',
    tabla: 'conciliaciones',
    impacto: 'medio',
    sugerencia: 'DELETE FROM conciliaciones WHERE trans_bancaria_id NOT IN (SELECT id FROM transacciones_bancarias);',
  },
  {
    id: 'ERR-006',
    tipo: 'Tabla sin particionar',
    descripcion: 'Tabla con 2M+ registros sin particionamiento por fecha. Consultas históricas son lentas.',
    tabla: 'transacciones_historicas',
    impacto: 'medio',
    sugerencia: 'Implementar particionamiento por rango de fechas (mensual).',
  },
  {
    id: 'ERR-007',
    tipo: 'Bloqueo de tabla',
    descripcion: 'Proceso de conciliación batch usa LOCK TABLE, bloqueando consultas concurrentes.',
    tabla: 'conciliaciones',
    impacto: 'alto',
    sugerencia: 'Migrar a row-level locking con SELECT FOR UPDATE SKIP LOCKED.',
  },
  {
    id: 'ERR-008',
    tipo: 'Query ineficiente',
    descripcion: 'Consulta de reporte usa subconsulta correlacionada N+1 en lugar de JOIN.',
    tabla: 'reportes_conciliacion',
    impacto: 'medio',
    sugerencia: 'Reescribir con LEFT JOIN y GROUP BY para eliminar el problema N+1.',
  },
  {
    id: 'ERR-009',
    tipo: 'Datos inconsistentes',
    descripcion: '23 registros tienen fecha_conciliacion anterior a la fecha de transacción.',
    tabla: 'conciliaciones',
    impacto: 'bajo',
    sugerencia: 'Agregar CHECK constraint: fecha_conciliacion >= fecha_transaccion.',
  },
  {
    id: 'ERR-010',
    tipo: 'Encoding incorrecto',
    descripcion: 'Columna "descripcion" usa LATIN1 mientras el resto usa UTF-8, causando caracteres corruptos.',
    tabla: 'transacciones_bancarias',
    impacto: 'bajo',
    sugerencia: 'ALTER TABLE transacciones_bancarias ALTER COLUMN descripcion TYPE TEXT COLLATE "es_PE.UTF-8";',
  },
];
