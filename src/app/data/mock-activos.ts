import {
  Sede, Ubicacion, CentroCosto, CatalogoItem, EstadoConservacion,
  EstructuraContable, ActivoFijo, InventarioContable, Actividad, ConciliacionAF,
} from '../models/activo-fijo.model';

// ===================== MAESTROS =====================

export const SEDES: Sede[] = [
  { id: 1, codigo: 'SD-001', descripcion: 'Planta Principal - Callao', direccion: 'Av. Argentina 2850, Callao', activo: true },
  { id: 2, codigo: 'SD-002', descripcion: 'Oficina Administrativa - Lima', direccion: 'Av. Javier Prado Este 1234, San Isidro', activo: true },
  { id: 3, codigo: 'SD-003', descripcion: 'Almacén Central - Lurín', direccion: 'Zona Industrial Lurín, Lote 45', activo: true },
  { id: 4, codigo: 'SD-004', descripcion: 'Planta de Fundición - Ventanilla', direccion: 'Parque Industrial Ventanilla, Mz. F Lt. 12', activo: true },
  { id: 5, codigo: 'SD-005', descripcion: 'Sucursal Arequipa', direccion: 'Parque Industrial de Arequipa, Lote 8', activo: false },
];

export const UBICACIONES: Ubicacion[] = [
  { id: 1, codigo: 'UB-001', descripcion: 'Oficina Gerencia General', sedeId: 2, sedNombre: 'Oficina Administrativa - Lima', activo: true },
  { id: 2, codigo: 'UB-002', descripcion: 'Área de Producción - Horno 1', sedeId: 1, sedNombre: 'Planta Principal - Callao', activo: true },
  { id: 3, codigo: 'UB-003', descripcion: 'Área de Producción - Horno 2', sedeId: 1, sedNombre: 'Planta Principal - Callao', activo: true },
  { id: 4, codigo: 'UB-004', descripcion: 'Laboratorio de Calidad', sedeId: 1, sedNombre: 'Planta Principal - Callao', activo: true },
  { id: 5, codigo: 'UB-005', descripcion: 'Almacén de Materia Prima', sedeId: 3, sedNombre: 'Almacén Central - Lurín', activo: true },
  { id: 6, codigo: 'UB-006', descripcion: 'Almacén de Producto Terminado', sedeId: 3, sedNombre: 'Almacén Central - Lurín', activo: true },
  { id: 7, codigo: 'UB-007', descripcion: 'Oficina Contabilidad', sedeId: 2, sedNombre: 'Oficina Administrativa - Lima', activo: true },
  { id: 8, codigo: 'UB-008', descripcion: 'Sala de Servidores / TI', sedeId: 2, sedNombre: 'Oficina Administrativa - Lima', activo: true },
  { id: 9, codigo: 'UB-009', descripcion: 'Taller de Mantenimiento', sedeId: 1, sedNombre: 'Planta Principal - Callao', activo: true },
  { id: 10, codigo: 'UB-010', descripcion: 'Zona de Despacho', sedeId: 3, sedNombre: 'Almacén Central - Lurín', activo: true },
  { id: 11, codigo: 'UB-011', descripcion: 'Área de Fundición', sedeId: 4, sedNombre: 'Planta de Fundición - Ventanilla', activo: true },
  { id: 12, codigo: 'UB-012', descripcion: 'Oficina RRHH', sedeId: 2, sedNombre: 'Oficina Administrativa - Lima', activo: true },
];

export const CENTROS_COSTO: CentroCosto[] = [
  { id: 1, codigo: 'CC-100', descripcion: 'Gerencia General', activo: true },
  { id: 2, codigo: 'CC-200', descripcion: 'Producción', activo: true },
  { id: 3, codigo: 'CC-300', descripcion: 'Calidad', activo: true },
  { id: 4, codigo: 'CC-400', descripcion: 'Logística y Almacén', activo: true },
  { id: 5, codigo: 'CC-500', descripcion: 'Administración y Finanzas', activo: true },
  { id: 6, codigo: 'CC-600', descripcion: 'Tecnología de Información', activo: true },
  { id: 7, codigo: 'CC-700', descripcion: 'Recursos Humanos', activo: true },
  { id: 8, codigo: 'CC-800', descripcion: 'Mantenimiento', activo: true },
  { id: 9, codigo: 'CC-900', descripcion: 'Comercial / Ventas', activo: true },
  { id: 10, codigo: 'CC-110', descripcion: 'Fundición', activo: true },
];

export const CATALOGO: CatalogoItem[] = [
  { id: 1, codigo: 'CAT-EQC', descripcion: 'Equipos de Cómputo', cuenta: '336.01', activo: true },
  { id: 2, codigo: 'CAT-MOB', descripcion: 'Mobiliario de Oficina', cuenta: '335.01', activo: true },
  { id: 3, codigo: 'CAT-MAQ', descripcion: 'Maquinaria Industrial', cuenta: '333.01', activo: true },
  { id: 4, codigo: 'CAT-VEH', descripcion: 'Vehículos', cuenta: '334.01', activo: true },
  { id: 5, codigo: 'CAT-HER', descripcion: 'Herramientas y Equipos Menores', cuenta: '337.01', activo: true },
  { id: 6, codigo: 'CAT-EQL', descripcion: 'Equipos de Laboratorio', cuenta: '336.02', activo: true },
  { id: 7, codigo: 'CAT-INF', descripcion: 'Infraestructura / Edificaciones', cuenta: '332.01', activo: true },
  { id: 8, codigo: 'CAT-EQS', descripcion: 'Equipos de Seguridad', cuenta: '336.03', activo: true },
  { id: 9, codigo: 'CAT-HOR', descripcion: 'Hornos Industriales', cuenta: '333.02', activo: true },
  { id: 10, codigo: 'CAT-MOL', descripcion: 'Moldes y Matrices', cuenta: '333.03', activo: true },
];

export const ESTADOS_CONSERVACION: EstadoConservacion[] = [
  { id: 1, codigo: 'NU', descripcion: 'NUEVO', estado: true, sistema: true },
  { id: 2, codigo: 'BU', descripcion: 'BUENO', estado: true, sistema: true },
  { id: 3, codigo: 'RE', descripcion: 'REGULAR', estado: true, sistema: true },
  { id: 4, codigo: 'MA', descripcion: 'MALO', estado: true, sistema: true },
  { id: 5, codigo: 'OP', descripcion: 'OPERATIVO', estado: true, sistema: true },
  { id: 6, codigo: 'AV', descripcion: 'AVERIADO', estado: true, sistema: false },
  { id: 7, codigo: 'BA', descripcion: 'BAJA', estado: false, sistema: false },
  { id: 8, codigo: 'PR', descripcion: 'PRUEBA', estado: false, sistema: false },
  { id: 9, codigo: 'UB', descripcion: 'USADO PARA BAJA', estado: true, sistema: false },
];

export const ESTRUCTURA_CONTABLE: EstructuraContable[] = [
  { id: 1, codigo: '332', descripcion: 'Edificaciones', cuentaContable: '332.01', tipo: 'Inmueble', activo: true },
  { id: 2, codigo: '333', descripcion: 'Maquinaria y Equipo de Explotación', cuentaContable: '333.01', tipo: 'Maquinaria', activo: true },
  { id: 3, codigo: '334', descripcion: 'Unidades de Transporte', cuentaContable: '334.01', tipo: 'Vehículo', activo: true },
  { id: 4, codigo: '335', descripcion: 'Muebles y Enseres', cuentaContable: '335.01', tipo: 'Mobiliario', activo: true },
  { id: 5, codigo: '336', descripcion: 'Equipos Diversos', cuentaContable: '336.01', tipo: 'Equipo', activo: true },
  { id: 6, codigo: '337', descripcion: 'Herramientas y Unidades de Reemplazo', cuentaContable: '337.01', tipo: 'Herramienta', activo: true },
  { id: 7, codigo: '338', descripcion: 'Otros Activos Fijos', cuentaContable: '338.01', tipo: 'Otro', activo: true },
  { id: 8, codigo: '339', descripcion: 'Trabajos en Curso', cuentaContable: '339.01', tipo: 'En curso', activo: true },
];

// ===================== INVENTARIO FÍSICO (BASE INVENTARIO) =====================

const responsables = ['Carlos Mendoza', 'Rosa Huamán', 'Pedro Quispe', 'María Flores', 'Luis Rodríguez', 'Ana Castillo', 'Jorge Paredes', 'Diana Salazar'];
const marcas = ['Dell', 'HP', 'Lenovo', 'Samsung', 'CATERPILLAR', 'Toyota', 'Komatsu', 'Siemens', 'ABB', 'Bosch', 'Fluke', 'Mitutoyo', 'S/M', 'Nacional', 'Atlas Copco'];
const inventariadores = ['Inv. García', 'Inv. Torres', 'Inv. López', 'Inv. Ramírez'];

function rDate(y: number, m1: number, m2: number): string {
  const m = m1 + Math.floor(Math.random() * (m2 - m1 + 1));
  const d = 1 + Math.floor(Math.random() * 28);
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

const activosDef: Partial<ActivoFijo>[] = [
  { catDescripcion: 'Laptop Dell Latitude 5540', marca: 'Dell', modelo: 'Latitude 5540', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Laptop HP ProBook 450 G10', marca: 'HP', modelo: 'ProBook 450 G10', ubicacion: 'Oficina Contabilidad', centroCosto: 'CC-500', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Monitor Samsung 27" Curvo', marca: 'Samsung', modelo: 'C27F591', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100', estadoConservacion: 'NU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Impresora Multifuncional HP', marca: 'HP', modelo: 'LaserJet Pro M428', ubicacion: 'Oficina Contabilidad', centroCosto: 'CC-500', estadoConservacion: 'RE', empresa: 'AQUARIUS' },
  { catDescripcion: 'Servidor Dell PowerEdge R750', marca: 'Dell', modelo: 'PowerEdge R750', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'UPS APC Smart 3000VA', marca: 'APC', modelo: 'SMT3000', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Escritorio ejecutivo madera', marca: 'Nacional', modelo: 'EJ-200', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Silla ergonómica gerencial', marca: 'S/M', modelo: 'ERG-PRO', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Archivador metálico 4 gavetas', marca: 'Nacional', modelo: 'AM-4G', ubicacion: 'Oficina Contabilidad', centroCosto: 'CC-500', estadoConservacion: 'RE', empresa: 'AQUARIUS' },
  { catDescripcion: 'Mesa de reuniones 12 personas', marca: 'S/M', modelo: 'MR-12P', ubicacion: 'Oficina Gerencia General', centroCosto: 'CC-100', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Horno de fundición eléctrico 500kg', marca: 'ABB', modelo: 'IF-500E', ubicacion: 'Área de Producción - Horno 1', centroCosto: 'CC-200', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Horno de fundición a gas 1000kg', marca: 'Siemens', modelo: 'GF-1000', ubicacion: 'Área de Producción - Horno 2', centroCosto: 'CC-200', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Prensa hidráulica 100 Tn', marca: 'Komatsu', modelo: 'PH-100T', ubicacion: 'Área de Producción - Horno 1', centroCosto: 'CC-200', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Torno CNC industrial', marca: 'Siemens', modelo: 'SINUMERIK 828D', ubicacion: 'Taller de Mantenimiento', centroCosto: 'CC-800', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Fresadora universal', marca: 'Bosch', modelo: 'FU-3200', ubicacion: 'Taller de Mantenimiento', centroCosto: 'CC-800', estadoConservacion: 'RE', empresa: 'AQUARIUS' },
  { catDescripcion: 'Compresor industrial 200 PSI', marca: 'Atlas Copco', modelo: 'GA-37', ubicacion: 'Área de Producción - Horno 1', centroCosto: 'CC-200', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Montacarga Toyota 2.5 Tn', marca: 'Toyota', modelo: '8FGU25', ubicacion: 'Almacén de Materia Prima', centroCosto: 'CC-400', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Montacarga Toyota 3.0 Tn', marca: 'Toyota', modelo: '8FGU30', ubicacion: 'Zona de Despacho', centroCosto: 'CC-400', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Camión Volquete CAT 740', marca: 'CATERPILLAR', modelo: '740 EJ', ubicacion: 'Zona de Despacho', centroCosto: 'CC-400', estadoConservacion: 'RE', empresa: 'AQUARIUS' },
  { catDescripcion: 'Camioneta pickup Toyota Hilux', marca: 'Toyota', modelo: 'Hilux 4x4', ubicacion: 'Zona de Despacho', centroCosto: 'CC-900', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Espectrómetro de emisión óptica', marca: 'Fluke', modelo: 'OES-5800', ubicacion: 'Laboratorio de Calidad', centroCosto: 'CC-300', estadoConservacion: 'NU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Durómetro Rockwell', marca: 'Mitutoyo', modelo: 'HR-523', ubicacion: 'Laboratorio de Calidad', centroCosto: 'CC-300', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Balanza analítica 0.001g', marca: 'Fluke', modelo: 'BA-3200', ubicacion: 'Laboratorio de Calidad', centroCosto: 'CC-300', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Microscopio metalográfico', marca: 'Mitutoyo', modelo: 'MM-400', ubicacion: 'Laboratorio de Calidad', centroCosto: 'CC-300', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Extintor PQS 12 Kg', marca: 'Nacional', modelo: 'PQS-12', ubicacion: 'Área de Producción - Horno 1', centroCosto: 'CC-200', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Extintor CO2 10 Lb', marca: 'Nacional', modelo: 'CO2-10', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Aire acondicionado split 36000 BTU', marca: 'Samsung', modelo: 'AR36TRHQLWK', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Puente grúa 10 Tn', marca: 'Komatsu', modelo: 'PG-10T', ubicacion: 'Área de Fundición', centroCosto: 'CC-110', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Soldadora MIG/MAG 400A', marca: 'Bosch', modelo: 'MIG-400PRO', ubicacion: 'Taller de Mantenimiento', centroCosto: 'CC-800', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Taladro de columna industrial', marca: 'Bosch', modelo: 'TC-25', ubicacion: 'Taller de Mantenimiento', centroCosto: 'CC-800', estadoConservacion: 'RE', empresa: 'AQUARIUS' },
  { catDescripcion: 'Laptop Lenovo ThinkPad T14', marca: 'Lenovo', modelo: 'ThinkPad T14', ubicacion: 'Oficina RRHH', centroCosto: 'CC-700', estadoConservacion: 'NU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Switch Cisco 48 puertos PoE', marca: 'Cisco', modelo: 'SG350-48P', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Router Cisco ISR 4331', marca: 'Cisco', modelo: 'ISR4331', ubicacion: 'Sala de Servidores / TI', centroCosto: 'CC-600', estadoConservacion: 'BU', empresa: 'AQUARIUS' },
  { catDescripcion: 'Cámara de seguridad PTZ', marca: 'Samsung', modelo: 'QNP-6250R', ubicacion: 'Almacén de Materia Prima', centroCosto: 'CC-400', estadoConservacion: 'OP', empresa: 'AQUARIUS' },
  { catDescripcion: 'Molde de fundición pieza A-200', marca: 'Nacional', modelo: 'MF-A200', ubicacion: 'Área de Fundición', centroCosto: 'CC-110', estadoConservacion: 'RE', empresa: 'AQUARIUS' },
];

export const ACTIVOS_FIJOS: ActivoFijo[] = activosDef.map((def, i) => ({
  id: i + 1,
  barNue: `AF-${String(i + 1).padStart(6, '0')}`,
  codEmpresa: `EMP-${String(1000 + i)}`,
  fecLectura: rDate(2026, 1, 4),
  ubicacion: def.ubicacion!,
  centroCosto: def.centroCosto!,
  responsable: responsables[i % responsables.length],
  catDescripcion: def.catDescripcion!,
  marca: def.marca!,
  modelo: def.modelo!,
  serie: `SN${String(Math.random()).substring(2, 12).toUpperCase()}`,
  estadoConservacion: def.estadoConservacion!,
  empresa: def.empresa!,
  observaciones: '',
  imagen: null,
  creacion: rDate(2024, 1, 12),
  inventariador: inventariadores[i % inventariadores.length],
}));

// ===================== INVENTARIO CONTABLE =====================

export const INVENTARIO_CONTABLE: InventarioContable[] = ACTIVOS_FIJOS.map((af, i) => {
  const valor = [3500, 2800, 1200, 2500, 28000, 4500, 1800, 950, 680, 3200, 185000, 320000, 95000, 75000, 42000, 18000, 65000, 72000, 450000, 120000, 95000, 38000, 12000, 48000, 350, 280, 8500, 250000, 5500, 3200, 3800, 4500, 6800, 2200, 15000][i] || 5000;
  const vidaUtil = af.catDescripcion.includes('Laptop') || af.catDescripcion.includes('Monitor') || af.catDescripcion.includes('Impresora') ? 4 :
    af.catDescripcion.includes('Horno') || af.catDescripcion.includes('Prensa') || af.catDescripcion.includes('Puente') ? 20 :
    af.catDescripcion.includes('Camión') || af.catDescripcion.includes('Montacarga') || af.catDescripcion.includes('Camioneta') ? 5 :
    af.catDescripcion.includes('Escritorio') || af.catDescripcion.includes('Silla') || af.catDescripcion.includes('Archivador') || af.catDescripcion.includes('Mesa') ? 10 : 5;
  const aniosUso = 2026 - 2024;
  const depAnual = valor / vidaUtil;
  const depAcum = Math.min(depAnual * aniosUso, valor);

  return {
    id: i + 1,
    codigoActivo: af.barNue,
    descripcion: af.catDescripcion,
    cuentaContable: ['336.01','335.01','333.01','334.01','337.01','336.02','332.01','336.03','333.02','333.03'][i % 10],
    fechaAdquisicion: af.creacion,
    valorAdquisicion: valor,
    depreciacionAcumulada: Math.round(depAcum * 100) / 100,
    valorNeto: Math.round((valor - depAcum) * 100) / 100,
    vidaUtil,
    ubicacion: af.ubicacion,
    estado: af.estadoConservacion,
    responsable: af.responsable,
  };
});

// ===================== ACTIVIDADES =====================

export const ACTIVIDADES: Actividad[] = [
  { id: 1, titulo: 'Inventario físico - Planta Principal', inicio: '2026-03-01', fin: '2026-03-15', descripcion: 'Levantamiento de inventario físico de todos los activos en la Planta Principal del Callao.', estado: 'finalizada', iso: 'ISO 55001', entregables: 'Reporte de inventario, Acta de cierre', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
  { id: 2, titulo: 'Inventario físico - Oficinas Administrativas', inicio: '2026-03-16', fin: '2026-03-25', descripcion: 'Inventario de activos fijos en las oficinas administrativas de San Isidro.', estado: 'finalizada', iso: 'ISO 55001', entregables: 'Reporte de inventario', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
  { id: 3, titulo: 'Inventario físico - Almacén Central', inicio: '2026-03-26', fin: '2026-04-05', descripcion: 'Levantamiento en el almacén central de Lurín incluyendo equipos de transporte.', estado: 'en_progreso', iso: 'ISO 55001', entregables: 'Reporte de inventario, Fotos', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
  { id: 4, titulo: 'Conciliación física vs contable', inicio: '2026-04-06', fin: '2026-04-20', descripcion: 'Cruce de inventario físico levantado contra la base contable de activos fijos.', estado: 'pendiente', iso: 'ISO 55001', entregables: 'Reporte de conciliación, Acta de diferencias', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
  { id: 5, titulo: 'Etiquetado y codificación', inicio: '2026-04-10', fin: '2026-04-30', descripcion: 'Colocación de etiquetas de código de barras a todos los activos inventariados.', estado: 'pendiente', iso: '', entregables: 'Registro fotográfico', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
  { id: 6, titulo: 'Informe final de inventario', inicio: '2026-04-25', fin: '2026-05-05', descripcion: 'Elaboración del informe final consolidado con resultados de conciliación y recomendaciones.', estado: 'pendiente', iso: 'ISO 55001', entregables: 'Informe final, Presentación', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
  { id: 7, titulo: 'Inventario físico - Planta Fundición', inicio: '2026-04-15', fin: '2026-04-25', descripcion: 'Inventario de maquinaria pesada y equipos en planta de fundición Ventanilla.', estado: 'pendiente', iso: 'ISO 55001', entregables: 'Reporte de inventario', proyecto: 'INVENTARIO GENERAL DE ACTIVOS FIJOS' },
];

// ===================== CONCILIACIÓN =====================

export const CONCILIACIONES_AF: ConciliacionAF[] = ACTIVOS_FIJOS.map((af, i) => {
  const ic = INVENTARIO_CONTABLE[i];
  const sobrante = i >= 32;
  const faltante = i === 18 || i === 25;
  const discrepancia = i % 8 === 0 && i > 0;

  let resultado: ConciliacionAF['resultado'] = 'conciliado';
  let observacion = 'Activo localizado, estado y ubicación coinciden';

  if (sobrante) {
    resultado = 'sobrante';
    observacion = 'Activo encontrado en inventario físico sin registro contable. Posible alta no registrada.';
  } else if (faltante) {
    resultado = 'faltante';
    observacion = 'Activo registrado en contabilidad pero no encontrado en inventario físico.';
  } else if (discrepancia) {
    resultado = 'discrepancia';
    const causas = [
      'Ubicación física difiere de la registrada en sistema contable.',
      'Estado de conservación difiere: físico indica deterioro mayor al registrado.',
      'Activo fue trasladado a otra sede sin actualizar sistema.',
    ];
    observacion = causas[i % causas.length];
  }

  return {
    id: `CON-${String(i + 1).padStart(4, '0')}`,
    barNue: af.barNue,
    descripcion: af.catDescripcion,
    ubicacionFisica: af.ubicacion,
    ubicacionContable: ic?.ubicacion ?? '—',
    estadoFisico: af.estadoConservacion,
    estadoContable: ic?.estado ?? '—',
    valorContable: ic?.valorNeto ?? 0,
    encontradoFisico: !faltante,
    encontradoContable: !sobrante,
    resultado,
    observacion,
  };
});
