import {
  ProductoInventario,
  RegistroFisico,
  RegistroSistema,
  Conciliacion,
  DuplicadoDetectado,
  ErrorBD,
} from '../models/conciliacion.model';

// --- Catálogo de productos metalúrgicos ---

const PRODUCTOS: ProductoInventario[] = [
  { codigo: 'MP-CU-001', nombre: 'Cobre electrolítico (cátodos)', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Principal' },
  { codigo: 'MP-ZN-002', nombre: 'Zinc concentrado', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Principal' },
  { codigo: 'MP-PB-003', nombre: 'Plomo refinado (lingotes)', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Principal' },
  { codigo: 'MP-SN-004', nombre: 'Estaño en barras', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Principal' },
  { codigo: 'MP-AL-005', nombre: 'Aluminio primario (tochos)', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Materia Prima' },
  { codigo: 'MP-FE-006', nombre: 'Chatarra ferrosa clasificada', categoria: 'materia_prima', unidadMedida: 'Tn', almacen: 'Patio de Chatarra' },
  { codigo: 'MP-NI-007', nombre: 'Níquel granulado', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Principal' },
  { codigo: 'MP-CR-008', nombre: 'Cromo metálico', categoria: 'materia_prima', unidadMedida: 'Kg', almacen: 'Almacén Materia Prima' },
  { codigo: 'AL-BR-001', nombre: 'Bronce fosforoso SAE 65', categoria: 'aleacion', unidadMedida: 'Kg', almacen: 'Almacén Fundición' },
  { codigo: 'AL-LT-002', nombre: 'Latón 70/30', categoria: 'aleacion', unidadMedida: 'Kg', almacen: 'Almacén Fundición' },
  { codigo: 'AL-AC-003', nombre: 'Acero inoxidable 304', categoria: 'aleacion', unidadMedida: 'Kg', almacen: 'Almacén Fundición' },
  { codigo: 'AL-AC-004', nombre: 'Acero inoxidable 316L', categoria: 'aleacion', unidadMedida: 'Kg', almacen: 'Almacén Fundición' },
  { codigo: 'PT-TUB-001', nombre: 'Tubo de cobre 1/2" tipo L', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
  { codigo: 'PT-PLN-002', nombre: 'Plancha de bronce 3mm', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
  { codigo: 'PT-BAR-003', nombre: 'Barra redonda latón Ø25mm', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
  { codigo: 'PT-LAM-004', nombre: 'Lámina de aluminio 1.5mm', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
  { codigo: 'PT-PER-005', nombre: 'Perfil de acero inox U 40mm', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
  { codigo: 'PT-BOB-006', nombre: 'Bobina de cobre esmaltado', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
  { codigo: 'IN-FLX-001', nombre: 'Fundente borax granulado', categoria: 'insumo', unidadMedida: 'Kg', almacen: 'Almacén Insumos' },
  { codigo: 'IN-CAR-002', nombre: 'Carbón de coque metalúrgico', categoria: 'insumo', unidadMedida: 'Tn', almacen: 'Patio de Insumos' },
  { codigo: 'IN-GAS-003', nombre: 'Gas argón industrial', categoria: 'insumo', unidadMedida: 'M3', almacen: 'Zona de Gases' },
  { codigo: 'IN-REF-004', nombre: 'Material refractario (ladrillos)', categoria: 'insumo', unidadMedida: 'Und', almacen: 'Almacén Insumos' },
  { codigo: 'IN-ELE-005', nombre: 'Electrodo tungsteno 2.4mm', categoria: 'insumo', unidadMedida: 'Und', almacen: 'Almacén Insumos' },
  { codigo: 'RP-CRI-001', nombre: 'Crisol de grafito #80', categoria: 'repuesto', unidadMedida: 'Und', almacen: 'Almacén Repuestos' },
  { codigo: 'RP-FIL-002', nombre: 'Filtro cerámico horno', categoria: 'repuesto', unidadMedida: 'Und', almacen: 'Almacén Repuestos' },
  { codigo: 'RP-ROD-003', nombre: 'Rodamiento 6205-2RS horno', categoria: 'repuesto', unidadMedida: 'Und', almacen: 'Almacén Repuestos' },
  { codigo: 'RP-TER-004', nombre: 'Termopar tipo K 300mm', categoria: 'repuesto', unidadMedida: 'Und', almacen: 'Almacén Repuestos' },
  { codigo: 'MP-AG-009', nombre: 'Plata granulada 999', categoria: 'materia_prima', unidadMedida: 'Gr', almacen: 'Bóveda Metales Preciosos' },
  { codigo: 'MP-AU-010', nombre: 'Oro fino 999.5', categoria: 'materia_prima', unidadMedida: 'Gr', almacen: 'Bóveda Metales Preciosos' },
  { codigo: 'PT-ANO-007', nombre: 'Ánodo de zinc para galvanizado', categoria: 'producto_terminado', unidadMedida: 'Und', almacen: 'Almacén PT' },
];

const almacenes = [
  'Almacén Principal',
  'Almacén Materia Prima',
  'Almacén Fundición',
  'Almacén PT',
  'Almacén Insumos',
  'Almacén Repuestos',
  'Patio de Chatarra',
  'Zona de Gases',
  'Bóveda Metales Preciosos',
  'Patio de Insumos',
];

const responsables = [
  'Carlos Mendoza',
  'Rosa Huamán',
  'Pedro Quispe',
  'María Flores',
  'Luis Rodríguez',
  'Ana Castillo',
  'Jorge Paredes',
  'Diana Salazar',
];

const ubicaciones = [
  'Rack A1-01', 'Rack A1-02', 'Rack A2-01', 'Rack A2-03',
  'Rack B1-01', 'Rack B1-04', 'Rack B2-02', 'Rack B3-01',
  'Zona Piso 1', 'Zona Piso 2', 'Zona Piso 3',
  'Estante C1', 'Estante C2', 'Estante D1',
  'Patio Ext. Norte', 'Patio Ext. Sur',
];

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

function generateLote(producto: ProductoInventario, index: number): string {
  const prefijo = producto.categoria === 'materia_prima' ? 'LMP' :
    producto.categoria === 'producto_terminado' ? 'LPT' :
    producto.categoria === 'aleacion' ? 'LAL' :
    producto.categoria === 'insumo' ? 'LIN' : 'LRP';
  return `${prefijo}-2026-${String(index + 1).padStart(4, '0')}`;
}

const startDate = new Date('2026-01-15');
const endDate = new Date('2026-04-14');

// --- Generar registros ---

export const REGISTROS_FISICOS: RegistroFisico[] = Array.from({ length: 100 }, (_, i) => {
  const producto = PRODUCTOS[i % PRODUCTOS.length];
  const esUnidad = ['Und', 'Gr'].includes(producto.unidadMedida);
  const cantidad = esUnidad
    ? Math.floor(Math.random() * 500 + 10)
    : Math.round((Math.random() * 5000 + 50) * 100) / 100;
  const pesoBase = producto.unidadMedida === 'Tn' ? cantidad * 1000 :
    producto.unidadMedida === 'Gr' ? cantidad / 1000 :
    producto.unidadMedida === 'Und' ? cantidad * (Math.random() * 5 + 0.5) :
    producto.unidadMedida === 'M3' ? cantidad * 1.784 :
    cantidad;

  return {
    id: `RF-${String(i + 1).padStart(4, '0')}`,
    producto,
    fecha: randomDate(startDate, endDate),
    cantidadFisica: cantidad,
    pesoKg: Math.round(pesoBase * 100) / 100,
    lote: generateLote(producto, i),
    ubicacion: ubicaciones[i % ubicaciones.length],
    responsable: responsables[i % responsables.length],
  };
});

export const REGISTROS_SISTEMA: RegistroSistema[] = Array.from({ length: 100 }, (_, i) => {
  const fisico = REGISTROS_FISICOS[i];
  const tieneDiscrepancia = i % 6 === 0;
  const esDuplicadoCodigo = i % 18 === 0 && i > 0;
  const tiposMovimiento: RegistroSistema['tipoMovimiento'][] = ['entrada', 'salida', 'ajuste', 'transferencia'];

  let cantidad = fisico.cantidadFisica;
  let peso = fisico.pesoKg;
  let lote = fisico.lote;

  if (tieneDiscrepancia) {
    const variacion = Math.random() > 0.5 ? 1 : -1;
    if (fisico.producto.unidadMedida === 'Und') {
      cantidad = cantidad + variacion * Math.floor(Math.random() * 15 + 1);
    } else {
      cantidad = Math.round((cantidad + variacion * (Math.random() * cantidad * 0.08)) * 100) / 100;
    }
    peso = Math.round((peso + variacion * (Math.random() * peso * 0.05)) * 100) / 100;
  }

  if (esDuplicadoCodigo) {
    lote = REGISTROS_FISICOS[i - 1].lote;
  }

  return {
    id: `RS-${String(i + 1).padStart(4, '0')}`,
    producto: esDuplicadoCodigo
      ? { ...fisico.producto, codigo: PRODUCTOS[(i - 1) % PRODUCTOS.length].codigo }
      : fisico.producto,
    fecha: tieneDiscrepancia && Math.random() > 0.6
      ? randomDate(new Date(fisico.fecha), new Date(new Date(fisico.fecha).getTime() + 2 * 86400000))
      : fisico.fecha,
    cantidadSistema: cantidad,
    pesoKg: peso,
    lote,
    ultimoMovimiento: randomDate(startDate, endDate),
    tipoMovimiento: tiposMovimiento[i % tiposMovimiento.length],
  };
});

export const CONCILIACIONES: Conciliacion[] = REGISTROS_FISICOS.map((rf, i) => {
  const rs = REGISTROS_SISTEMA[i];
  const difCantidad = Math.round((rf.cantidadFisica - rs.cantidadSistema) * 100) / 100;
  const difPeso = Math.round((rf.pesoKg - rs.pesoKg) * 100) / 100;
  const sinContrapartida = i >= 96;

  let estado: Conciliacion['estado'] = 'conciliado';
  let tipoDiscrepancia: Conciliacion['tipoDiscrepancia'] | undefined;
  let observacion = 'Inventario físico coincide con sistema';

  if (sinContrapartida) {
    estado = 'pendiente';
    observacion = 'Producto encontrado en físico sin registro en sistema. Posible ingreso no registrado.';
    tipoDiscrepancia = 'sin_contrapartida';
  } else if (Math.abs(difCantidad) > 0.01) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'cantidad';
    observacion = `Diferencia de ${Math.abs(difCantidad)} ${rf.producto.unidadMedida} — Físico: ${rf.cantidadFisica}, Sistema: ${rs.cantidadSistema}`;
  } else if (Math.abs(difPeso) > 0.5) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'peso';
    observacion = `Diferencia de peso: ${Math.abs(difPeso)} Kg — Físico: ${rf.pesoKg} Kg, Sistema: ${rs.pesoKg} Kg`;
  } else if (i % 18 === 0 && i > 0) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'codigo_duplicado';
    observacion = `Código de producto duplicado: ${rs.producto.codigo} asignado a más de un item`;
  } else if (rf.lote !== rs.lote) {
    estado = 'discrepancia';
    tipoDiscrepancia = 'lote_incorrecto';
    observacion = `Lote difiere: Físico "${rf.lote}" vs Sistema "${rs.lote}"`;
  }

  return {
    id: `CON-${String(i + 1).padStart(4, '0')}`,
    registroFisico: rf,
    registroSistema: sinContrapartida ? null : rs,
    estado,
    diferenciaCantidad: sinContrapartida ? rf.cantidadFisica : difCantidad,
    diferenciaPeso: sinContrapartida ? rf.pesoKg : difPeso,
    fechaConciliacion: randomDate(startDate, endDate),
    observacion,
    tipoDiscrepancia,
  };
});

export const DUPLICADOS_DETECTADOS: DuplicadoDetectado[] = [
  {
    codigo: 'MP-CU-001',
    nombreProducto: 'Cobre electrolítico (cátodos)',
    ocurrencias: 3,
    registros: [
      { id: 'RS-0001', almacen: 'Almacén Principal', cantidad: 2500, lote: 'LMP-2026-0001' },
      { id: 'RS-0031', almacen: 'Almacén Fundición', cantidad: 1200, lote: 'LMP-2026-0031' },
      { id: 'RS-0061', almacen: 'Almacén Materia Prima', cantidad: 800, lote: 'LMP-2026-0001' },
    ],
    sugerenciaCorreccion: 'RS-0061 tiene mismo lote que RS-0001 pero está en almacén diferente. Verificar si es transferencia no registrada. Reasignar lote o registrar movimiento.',
  },
  {
    codigo: 'AL-AC-003',
    nombreProducto: 'Acero inoxidable 304',
    ocurrencias: 2,
    registros: [
      { id: 'RS-0011', almacen: 'Almacén Fundición', cantidad: 3400, lote: 'LAL-2026-0011' },
      { id: 'RS-0041', almacen: 'Almacén Fundición', cantidad: 3400, lote: 'LAL-2026-0011' },
    ],
    sugerenciaCorreccion: 'Registro duplicado exacto en mismo almacén y lote. Eliminar RS-0041. Causa probable: doble lectura de código de barras durante inventario.',
  },
  {
    codigo: 'PT-TUB-001',
    nombreProducto: 'Tubo de cobre 1/2" tipo L',
    ocurrencias: 2,
    registros: [
      { id: 'RS-0013', almacen: 'Almacén PT', cantidad: 450, lote: 'LPT-2026-0013' },
      { id: 'RS-0043', almacen: 'Almacén PT', cantidad: 120, lote: 'LPT-2026-0043' },
    ],
    sugerenciaCorreccion: 'Mismo producto con lotes diferentes en mismo almacén. Consolidar bajo un único código y sumar cantidades (570 Und). Verificar si son lotes de producción distintos.',
  },
  {
    codigo: 'IN-FLX-001',
    nombreProducto: 'Fundente borax granulado',
    ocurrencias: 2,
    registros: [
      { id: 'RS-0019', almacen: 'Almacén Insumos', cantidad: 750, lote: 'LIN-2026-0019' },
      { id: 'RS-0049', almacen: 'Almacén Insumos', cantidad: 750, lote: 'LIN-2026-0019' },
    ],
    sugerenciaCorreccion: 'Duplicado exacto: misma cantidad, mismo lote. Eliminar RS-0049. Implementar validación de unicidad en registro de inventario.',
  },
  {
    codigo: 'RP-CRI-001',
    nombreProducto: 'Crisol de grafito #80',
    ocurrencias: 3,
    registros: [
      { id: 'RS-0024', almacen: 'Almacén Repuestos', cantidad: 12, lote: 'LRP-2026-0024' },
      { id: 'RS-0054', almacen: 'Almacén Repuestos', cantidad: 12, lote: 'LRP-2026-0024' },
      { id: 'RS-0084', almacen: 'Almacén Fundición', cantidad: 5, lote: 'LRP-2026-0084' },
    ],
    sugerenciaCorreccion: 'RS-0024 y RS-0054 son duplicados exactos — eliminar uno. RS-0084 en Fundición es legítimo (crisoles en uso). Agregar campo "estado" (almacenado/en_uso) para diferenciar.',
  },
];

export const ERRORES_BD: ErrorBD[] = [
  {
    id: 'ERR-001',
    tipo: 'Índice faltante',
    descripcion: 'Tabla "inventario_fisico" sin índice en columna "codigo_producto". Búsquedas por código ejecutan full table scan sobre 120K+ registros.',
    tabla: 'inventario_fisico',
    impacto: 'alto',
    sugerencia: 'CREATE INDEX idx_inv_fisico_codigo ON inventario_fisico(codigo_producto);',
  },
  {
    id: 'ERR-002',
    tipo: 'Constraint UNIQUE ausente',
    descripcion: 'No existe restricción de unicidad en (codigo_producto, lote, almacen), permitiendo registros duplicados de inventario.',
    tabla: 'inventario_sistema',
    impacto: 'alto',
    sugerencia: 'ALTER TABLE inventario_sistema ADD CONSTRAINT uq_prod_lote_alm UNIQUE(codigo_producto, lote, almacen_id);',
  },
  {
    id: 'ERR-003',
    tipo: 'Tipo de dato incorrecto',
    descripcion: 'Columna "peso_kg" es VARCHAR(20) en lugar de DECIMAL. Comparaciones numéricas fallan: "95.5" > "1000.0" devuelve TRUE.',
    tabla: 'inventario_fisico',
    impacto: 'alto',
    sugerencia: 'ALTER TABLE inventario_fisico ALTER COLUMN peso_kg TYPE DECIMAL(12,4);',
  },
  {
    id: 'ERR-004',
    tipo: 'Foreign key faltante',
    descripcion: 'No hay FK entre conciliaciones y movimientos_inventario. Conciliaciones referencian movimientos eliminados.',
    tabla: 'conciliaciones_inventario',
    impacto: 'medio',
    sugerencia: 'ALTER TABLE conciliaciones_inventario ADD CONSTRAINT fk_movimiento FOREIGN KEY (movimiento_id) REFERENCES movimientos_inventario(id) ON DELETE RESTRICT;',
  },
  {
    id: 'ERR-005',
    tipo: 'Registros huérfanos',
    descripcion: '38 registros de inventario referencian productos eliminados del catálogo maestro. Imposible conciliar.',
    tabla: 'inventario_sistema',
    impacto: 'medio',
    sugerencia: 'Reasignar a códigos vigentes o archivar: UPDATE inventario_sistema SET estado = \'archivado\' WHERE producto_id NOT IN (SELECT id FROM catalogo_productos);',
  },
  {
    id: 'ERR-006',
    tipo: 'Tabla sin particionar',
    descripcion: 'Tabla movimientos_inventario con 5M+ registros sin partición. Reportes de trazabilidad de lotes tardan > 45 segundos.',
    tabla: 'movimientos_inventario',
    impacto: 'medio',
    sugerencia: 'Particionar por rango de fecha (mensual). CREATE TABLE movimientos_inventario PARTITION BY RANGE (fecha);',
  },
  {
    id: 'ERR-007',
    tipo: 'Lock de tabla en conciliación',
    descripcion: 'Proceso batch de conciliación usa LOCK TABLE en inventario_sistema, bloqueando ingresos de almacén durante 15+ minutos.',
    tabla: 'inventario_sistema',
    impacto: 'alto',
    sugerencia: 'Migrar a row-level locking: SELECT ... FOR UPDATE SKIP LOCKED. Procesar conciliación por almacén en paralelo.',
  },
  {
    id: 'ERR-008',
    tipo: 'Query N+1 en reporte',
    descripcion: 'Reporte de trazabilidad ejecuta 1 query por cada item (N+1). Con 500 items, genera 501 queries en vez de 1.',
    tabla: 'reportes_trazabilidad',
    impacto: 'medio',
    sugerencia: 'Reescribir con JOIN y GROUP BY: SELECT p.*, COUNT(m.id) as movimientos FROM productos p LEFT JOIN movimientos m ON m.producto_id = p.id GROUP BY p.id;',
  },
  {
    id: 'ERR-009',
    tipo: 'Datos de peso inconsistentes',
    descripcion: '15 registros tienen peso_kg = 0 para productos tipo "materia_prima" donde el peso es obligatorio.',
    tabla: 'inventario_fisico',
    impacto: 'bajo',
    sugerencia: 'ALTER TABLE inventario_fisico ADD CONSTRAINT chk_peso CHECK (CASE WHEN categoria = \'materia_prima\' THEN peso_kg > 0 ELSE TRUE END);',
  },
  {
    id: 'ERR-010',
    tipo: 'Encoding de descripción',
    descripcion: 'Caracteres especiales (ñ, tildes) corruptos en 23 nombres de producto por mezcla de LATIN1 y UTF-8.',
    tabla: 'catalogo_productos',
    impacto: 'bajo',
    sugerencia: 'ALTER TABLE catalogo_productos ALTER COLUMN nombre TYPE TEXT COLLATE "es_PE.UTF-8"; UPDATE catalogo_productos SET nombre = CONVERT_FROM(CONVERT_TO(nombre, \'LATIN1\'), \'UTF8\') WHERE nombre ~ \'[^\\x00-\\x7F]\';',
  },
];
