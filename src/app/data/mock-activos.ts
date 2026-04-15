import {
  Sede, Ubicacion, CentroCosto, CatalogoItem, EstadoConservacion,
  EstructuraContable, ActivoFijo, InventarioContable, Actividad, ConciliacionAF,
} from '../models/activo-fijo.model';

import ACTIVOS_JSON from './activos-fijos.json';
import CONTABLE_JSON from './inventario-contable.json';
import CONC_JSON from './conciliaciones.json';

// ============================================================================
//  DATOS REALES - EMPAFRUT
//  Generado automáticamente desde:
//    ATF-PR-01-FO-03 Base de Inventario Final - EMPAFRUT.xlsx
//    ATF-PR-01-FO-02 Base Contable Final - EMPAFRUT.xlsx
//  No editar a mano; re-ejecutar "python3 generar_mock.py".
// ============================================================================

// === Maestros (pequeños): inline en TS ===

export const SEDES: Sede[] = [
  {
    "id": 1,
    "codigo": "SD-001",
    "descripcion": "PLANTA 1",
    "direccion": "Fundo Agrícola EMPAFRUT",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "SD-002",
    "descripcion": "PLANTA 2",
    "direccion": "Fundo Agrícola EMPAFRUT",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "SD-003",
    "descripcion": "PLANTA 3",
    "direccion": "Fundo Agrícola EMPAFRUT",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "SD-004",
    "descripcion": "PLANTA 4",
    "direccion": "Fundo Agrícola EMPAFRUT",
    "activo": true
  }
];

export const UBICACIONES: Ubicacion[] = [
  {
    "id": 1,
    "codigo": "1010101",
    "descripcion": "ZONA DE RECEPCION - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "1010102",
    "descripcion": "ZONA DE DESCARTE - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "1010103",
    "descripcion": "ZONA DE GASIFICADO - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "1010104",
    "descripcion": "ZONA DE ABASTECIMIENTO - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 5,
    "codigo": "1010105",
    "descripcion": "SALA DE PROCESO - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 6,
    "codigo": "1010106",
    "descripcion": "ZONA DE PALETIZADO - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 7,
    "codigo": "1010107",
    "descripcion": "ZONA DE CONDENSADORES - UVA 1",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 8,
    "codigo": "1010201",
    "descripcion": "ZONA DE RECEPCION - MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 9,
    "codigo": "1010202",
    "descripcion": "ZONA DE DESCARTE - MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 10,
    "codigo": "1010203",
    "descripcion": "ZONA DE ABASTECIMIENTO - MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 11,
    "codigo": "1010204",
    "descripcion": "SALA DE PROCESO DE MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 12,
    "codigo": "1010205",
    "descripcion": "ZONA DE PALETIZADO - MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 13,
    "codigo": "1010206",
    "descripcion": "ZONA DE MAQUINAS - MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 14,
    "codigo": "1010301",
    "descripcion": "ZONA DE PASILLO - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 15,
    "codigo": "1010302",
    "descripcion": "TUNEL DE ENFRIAMIENTO A - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 16,
    "codigo": "1010303",
    "descripcion": "TUNEL DE ENFRIAMIENTO B - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 17,
    "codigo": "1010304",
    "descripcion": "TUNEL DE ENFRIAMIENTO C - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 18,
    "codigo": "1010305",
    "descripcion": "TUNEL DE ENFRIAMIENTO D - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 19,
    "codigo": "1010306",
    "descripcion": "TUNEL DE ENFRIAMIENTO E - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 20,
    "codigo": "1010307",
    "descripcion": "TUNEL DE ENFRIAMIENTO F - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 21,
    "codigo": "1010308",
    "descripcion": "TUNEL DE ENFRIAMIENTO G - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 22,
    "codigo": "1010309",
    "descripcion": "TUNEL DE ENFRIAMIENTO H - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 23,
    "codigo": "1010310",
    "descripcion": "CAMARA EUROPA A",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 24,
    "codigo": "1010311",
    "descripcion": "CAMARA EUROPA B",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 25,
    "codigo": "1010312",
    "descripcion": "SALA DE EMBARQUE - EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 26,
    "codigo": "1010313",
    "descripcion": "ZONA DE CONDENSADORES - CAM. EUROPA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 27,
    "codigo": "1010401",
    "descripcion": "ZONA DE PASILLO - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 28,
    "codigo": "1010402",
    "descripcion": "TUNEL DE ENFRIAMIENTO 1 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 29,
    "codigo": "1010403",
    "descripcion": "TUNEL DE ENFRIAMIENTO 2 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 30,
    "codigo": "1010404",
    "descripcion": "TUNEL DE ENFRIAMIENTO 3 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 31,
    "codigo": "1010405",
    "descripcion": "TUNEL DE ENFRIAMIENTO 4 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 32,
    "codigo": "1010406",
    "descripcion": "TUNEL DE ENFRIAMIENTO 5 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 33,
    "codigo": "1010407",
    "descripcion": "TUNEL DE ENFRIAMIENTO 6 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 34,
    "codigo": "1010408",
    "descripcion": "TUNEL DE ENFRIAMIENTO 7 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 35,
    "codigo": "1010409",
    "descripcion": "TUNEL DE ENFRIAMIENTO 8 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 36,
    "codigo": "1010410",
    "descripcion": "TUNEL DE ENFRIAMIENTO 9 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 37,
    "codigo": "1010411",
    "descripcion": "CAMARA 1 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 38,
    "codigo": "1010412",
    "descripcion": "CAMARA 2 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 39,
    "codigo": "1010413",
    "descripcion": "CAMARA 3 - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 40,
    "codigo": "1010414",
    "descripcion": "CAMARA 4 - USA (JAPON)",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 41,
    "codigo": "1010415",
    "descripcion": "SALA DE EMBARQUE - USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 42,
    "codigo": "1010416",
    "descripcion": "SALA DE EMBARQUE - JAPON",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 43,
    "codigo": "1010417",
    "descripcion": "CAMARA CONTRAMUESTRA USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 44,
    "codigo": "1010501",
    "descripcion": "ZONA DE HIDROTERMICA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 45,
    "codigo": "1010502",
    "descripcion": "AREA DE EMPAQUE DE USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 46,
    "codigo": "1010503",
    "descripcion": "ALMACEN USA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 47,
    "codigo": "1010601",
    "descripcion": "SALA DE MAQUINAS",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 48,
    "codigo": "1010701",
    "descripcion": "AREA DE CALDERO",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 49,
    "codigo": "1010801",
    "descripcion": "CISTERNAS (POZAS DE AGUA)",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 50,
    "codigo": "1011001",
    "descripcion": "BOMBEO DE AGUA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 51,
    "codigo": "1020201",
    "descripcion": "ZONA DE CAJAS - MANGO Y PALTA",
    "sedeId": 1,
    "sedNombre": "PLANTA 1",
    "activo": true
  },
  {
    "id": 52,
    "codigo": "2010101",
    "descripcion": "ZONA DE RECEPCION Y ABASTECIMIENTO - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 53,
    "codigo": "2010102",
    "descripcion": "SALA DE PROCESOS - CITRICOS",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 54,
    "codigo": "2010103",
    "descripcion": "ZONA DE ETIQUETADO Y PALETIZADO - CITRICOS",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 55,
    "codigo": "2010104",
    "descripcion": "TUNEL DE ENFRIAMIENTO 1 - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 56,
    "codigo": "2010105",
    "descripcion": "TUNEL DE ENFRIAMIENTO 2 - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 57,
    "codigo": "2010106",
    "descripcion": "TUNEL DE ENFRIAMIENTO 3 - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 58,
    "codigo": "2010107",
    "descripcion": "CAMARA 1 - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 59,
    "codigo": "2010108",
    "descripcion": "CAMARA 2 - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 60,
    "codigo": "2010109",
    "descripcion": "CAMARA 3 - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 61,
    "codigo": "2010110",
    "descripcion": "AREA DE DESAPACHO - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 62,
    "codigo": "2010111",
    "descripcion": "ZONA DE CONDENSADORES - CITRICO",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 63,
    "codigo": "2010112",
    "descripcion": "ZONA DE PASILLO - CITRICOS",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 64,
    "codigo": "2010201",
    "descripcion": "ZONA DE RECEPCION - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 65,
    "codigo": "2010202",
    "descripcion": "AREA DE GASIFICADO - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 66,
    "codigo": "2010203",
    "descripcion": "ZONA DE ABASTECIEMIENTO - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 67,
    "codigo": "2010204",
    "descripcion": "SALA DE PROCESOS - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 68,
    "codigo": "2010205",
    "descripcion": "ZONA DE PALETIZADO - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 69,
    "codigo": "2010206",
    "descripcion": "AREA DE PASILLO - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 70,
    "codigo": "2010208",
    "descripcion": "CAMARA 2 - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 71,
    "codigo": "2010209",
    "descripcion": "TUNEL DE ENFRIAMIENTO 1 - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 72,
    "codigo": "2010210",
    "descripcion": "TUNEL DE ENFRIAMIENTO 2 - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 73,
    "codigo": "2010211",
    "descripcion": "TUNEL DE ENFRIAMIENTO 3 - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 74,
    "codigo": "2010212",
    "descripcion": "TUNEL DE ENFRIAMIENTO 4 - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 75,
    "codigo": "2010213",
    "descripcion": "TUNEL DE ENFRIAMIENTO 5 - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 76,
    "codigo": "2010215",
    "descripcion": "ZONA DE DESCARTE - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 77,
    "codigo": "2010216",
    "descripcion": "ZONA DE CONDENSADORES - UVA 2",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 78,
    "codigo": "2010301",
    "descripcion": "ALMACEN CENTRAL",
    "sedeId": 2,
    "sedNombre": "PLANTA 2",
    "activo": true
  },
  {
    "id": 79,
    "codigo": "3010101",
    "descripcion": "ZONA DE RECEPCION - MANDARINA",
    "sedeId": 3,
    "sedNombre": "PLANTA 3",
    "activo": true
  },
  {
    "id": 80,
    "codigo": "3010102",
    "descripcion": "AREA DE DRENCHADO - MANDARINA",
    "sedeId": 3,
    "sedNombre": "PLANTA 3",
    "activo": true
  },
  {
    "id": 81,
    "codigo": "3010103",
    "descripcion": "CAMARA DESVERDIZADO",
    "sedeId": 3,
    "sedNombre": "PLANTA 3",
    "activo": true
  },
  {
    "id": 82,
    "codigo": "3010104",
    "descripcion": "EXTERIORES CITRICOS",
    "sedeId": 3,
    "sedNombre": "PLANTA 3",
    "activo": true
  },
  {
    "id": 83,
    "codigo": "3010301",
    "descripcion": "SUB ESTACION - CITRICOS",
    "sedeId": 3,
    "sedNombre": "PLANTA 3",
    "activo": true
  },
  {
    "id": 84,
    "codigo": "3010302",
    "descripcion": "ALMACEN DE INSUMOS (PLANTA 3)",
    "sedeId": 3,
    "sedNombre": "PLANTA 3",
    "activo": true
  },
  {
    "id": 85,
    "codigo": "4010101",
    "descripcion": "PTAR",
    "sedeId": 4,
    "sedNombre": "PLANTA 4",
    "activo": true
  },
  {
    "id": 86,
    "codigo": "4010102",
    "descripcion": "ALMACEN (PLANTA 4)",
    "sedeId": 4,
    "sedNombre": "PLANTA 4",
    "activo": true
  }
];

export const CENTROS_COSTO: CentroCosto[] = [
  {
    "id": 1,
    "codigo": "1",
    "descripcion": "UVA",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "2",
    "descripcion": "MANGO",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "3",
    "descripcion": "PALTA",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "4",
    "descripcion": "CITRICOS",
    "activo": true
  },
  {
    "id": 5,
    "codigo": "5",
    "descripcion": "TRATAMIENTO DE AGUA",
    "activo": true
  },
  {
    "id": 6,
    "codigo": "6",
    "descripcion": "OPERACIONES Y MANTENIMIENTO",
    "activo": true
  },
  {
    "id": 7,
    "codigo": "7",
    "descripcion": "MANGO Y PALTA",
    "activo": true
  },
  {
    "id": 8,
    "codigo": "8",
    "descripcion": "CITRICOS - MANDARINA",
    "activo": true
  },
  {
    "id": 9,
    "codigo": "9",
    "descripcion": "UVA - MANGO - PALTA",
    "activo": true
  }
];

export const CATALOGO: CatalogoItem[] = [
  {
    "id": 1,
    "codigo": "10101",
    "descripcion": "MAQUINA ENMALLADORA GIRO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "10102",
    "descripcion": "MAQUINA ENCERADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "10103",
    "descripcion": "MAQUINA ETIQUETADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "10104",
    "descripcion": "MAQUINA CALIBRADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 5,
    "codigo": "10107",
    "descripcion": "MAQUINA DE SECADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 6,
    "codigo": "10108",
    "descripcion": "TANQUE AGITADOR DE CERA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 7,
    "codigo": "10109",
    "descripcion": "TANQUE CERA Y FUNGICIDA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 8,
    "codigo": "10110",
    "descripcion": "CODIFICADOR INKJECT",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 9,
    "codigo": "10111",
    "descripcion": "MAQUINA CAMARA DE VISION OPTICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 10,
    "codigo": "10112",
    "descripcion": "TINA HIDROTERMICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 11,
    "codigo": "10113",
    "descripcion": "LAVADORA DE JABAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 12,
    "codigo": "10114",
    "descripcion": "VOLCADOR DE JABAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 13,
    "codigo": "10115",
    "descripcion": "VOLCADOR DE BINES",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 14,
    "codigo": "10116",
    "descripcion": "TINA DE DESINFECCION Y ENJUAGE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 15,
    "codigo": "10117",
    "descripcion": "TINA DE PREPARACIÓN Y DESINFECCIÓN",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 16,
    "codigo": "10118",
    "descripcion": "BALANZA DINAMICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 17,
    "codigo": "10120",
    "descripcion": "TINA DE INMERSION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 18,
    "codigo": "10122",
    "descripcion": "BANDEJA DE ESCOBILLA DE LIMPIEZA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 19,
    "codigo": "10124",
    "descripcion": "FLEJADORA AUTOMATICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 20,
    "codigo": "10125",
    "descripcion": "SHUTER CON CEPILLO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 21,
    "codigo": "10127",
    "descripcion": "TABLERO DE MANDO PARA FLEJADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 22,
    "codigo": "10128",
    "descripcion": "MAQUINA DRENCHADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 23,
    "codigo": "10129",
    "descripcion": "TUNEL DE SECADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 24,
    "codigo": "10130",
    "descripcion": "ESTRUCTURA DE ENCERADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 25,
    "codigo": "10201",
    "descripcion": "COMPRESOR DE AIRE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 26,
    "codigo": "10202",
    "descripcion": "COMPRESOR DE TORNILLO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 27,
    "codigo": "10203",
    "descripcion": "TANQUE PULMON",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 28,
    "codigo": "10204",
    "descripcion": "EVAPORADOR DE FRIO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 29,
    "codigo": "10205",
    "descripcion": "UNIDAD CONDENSADORA DE FRIO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 30,
    "codigo": "10206",
    "descripcion": "TUNEL DE ENFRIAMIENTO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 31,
    "codigo": "10208",
    "descripcion": "VENTILADOR CENTRIFUGO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 32,
    "codigo": "10210",
    "descripcion": "HUMIDIFICADOR DE AIRE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 33,
    "codigo": "10211",
    "descripcion": "CALDERO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 34,
    "codigo": "10212",
    "descripcion": "QUEMADOR DE GAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 35,
    "codigo": "10213",
    "descripcion": "SECADOR DE AIRE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 36,
    "codigo": "10214",
    "descripcion": "VENTILADOR SOPLADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 37,
    "codigo": "10215",
    "descripcion": "CORTINA DE AIRE INDUSTRIAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 38,
    "codigo": "10216",
    "descripcion": "INYECTOR DE AIRE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 39,
    "codigo": "10217",
    "descripcion": "SISTEMA DE CALECFACCION A GAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 40,
    "codigo": "10218",
    "descripcion": "CAMARA FRIGORIFICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 41,
    "codigo": "10219",
    "descripcion": "TURBOVENTILADORES",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 42,
    "codigo": "10220",
    "descripcion": "EVAPORADOR ENFRIADOR PORTÁTIL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 43,
    "codigo": "10221",
    "descripcion": "EXTRACTOR HELICOIDAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 44,
    "codigo": "10301",
    "descripcion": "APILADOR ELECTRICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 45,
    "codigo": "10302",
    "descripcion": "TRANSPALETA ELECTRICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 46,
    "codigo": "10303",
    "descripcion": "TECLE ELECTRICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 47,
    "codigo": "10305",
    "descripcion": "CARRETILLA HIDRAULICA (STOCKA)",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 48,
    "codigo": "10306",
    "descripcion": "NIVELADOR HIDRAULICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 49,
    "codigo": "10307",
    "descripcion": "RAMPA NIVELADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 50,
    "codigo": "10401",
    "descripcion": "CELDA DE MEDIA TENSION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 51,
    "codigo": "10402",
    "descripcion": "GRUPO ELECTROGENO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 52,
    "codigo": "10403",
    "descripcion": "TRANSFORMADOR DE AISLAMIENTO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 53,
    "codigo": "10404",
    "descripcion": "TRANSFORMADOR TRIFASICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 54,
    "codigo": "10405",
    "descripcion": "TRANSFORMADOR MONOFASICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 55,
    "codigo": "10406",
    "descripcion": "BANCO DE CONDENSADORES",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 56,
    "codigo": "10407",
    "descripcion": "ESTABILIZADOR DE VOLTAJE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 57,
    "codigo": "10408",
    "descripcion": "TABLERO ELECTRICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 58,
    "codigo": "10409",
    "descripcion": "BATERIA INDUSTRIAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 59,
    "codigo": "10410",
    "descripcion": "CARGADOR DE BATERIAS INDUSTRIALES",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 60,
    "codigo": "10411",
    "descripcion": "TABLERO DE CONTROL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 61,
    "codigo": "10412",
    "descripcion": "TABLERO DE DISTRIBUCION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 62,
    "codigo": "10413",
    "descripcion": "CAMARA 2 VIAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 63,
    "codigo": "10414",
    "descripcion": "CELDA DE CARGA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 64,
    "codigo": "10415",
    "descripcion": "ESTABILIZADOR MONOFÁSICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 65,
    "codigo": "10416",
    "descripcion": "PANEL DE ETIQUETADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 66,
    "codigo": "10501",
    "descripcion": "ELECTROBOMBA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 67,
    "codigo": "10502",
    "descripcion": "BOMBA CENTRIFUGA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 68,
    "codigo": "10505",
    "descripcion": "BOMBA DOSIFICADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 69,
    "codigo": "10506",
    "descripcion": "BOMBA NEUMATICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 70,
    "codigo": "10507",
    "descripcion": "BOMBA DE SUCCION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 71,
    "codigo": "10508",
    "descripcion": "BOMBA DE RETROLAVADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 72,
    "codigo": "10510",
    "descripcion": "BOMBA PERISTALTICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 73,
    "codigo": "10511",
    "descripcion": "BOMBA HIDRAULICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 74,
    "codigo": "10512",
    "descripcion": "BOMBA MULTIETAPA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 75,
    "codigo": "10513",
    "descripcion": "MOTOBOMBA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 76,
    "codigo": "10514",
    "descripcion": "BOMBA DE DISTRIBUCION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 77,
    "codigo": "10515",
    "descripcion": "BOMBA VERTICAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 78,
    "codigo": "10601",
    "descripcion": "ESMERIL / AMOLADORA ANGULAR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 79,
    "codigo": "10602",
    "descripcion": "TALADRO PERCUTOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 80,
    "codigo": "10604",
    "descripcion": "MAQUINA DE SOLDAR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 81,
    "codigo": "10605",
    "descripcion": "TALADRO DE BANCO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 82,
    "codigo": "10606",
    "descripcion": "ESMERIL DE BANCO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 83,
    "codigo": "10607",
    "descripcion": "PODADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 84,
    "codigo": "10608",
    "descripcion": "PISTOLA DE CALOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 85,
    "codigo": "10609",
    "descripcion": "TRONZADORA DE METALES (SIERRA)",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 86,
    "codigo": "10610",
    "descripcion": "HIDROLAVADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 87,
    "codigo": "10611",
    "descripcion": "MEZCLADORA DE CONCRETO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 88,
    "codigo": "10701",
    "descripcion": "TANQUE DE RECUPERACION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 89,
    "codigo": "10702",
    "descripcion": "TANQUE SALMUERA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 90,
    "codigo": "10703",
    "descripcion": "TANQUE DE AGUA FRIA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 91,
    "codigo": "10704",
    "descripcion": "TANQUE ABLANDADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 92,
    "codigo": "10705",
    "descripcion": "TANQUE DE PETROLEO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 93,
    "codigo": "10707",
    "descripcion": "CILINDRO DE AIRE COMPRIMIDO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 94,
    "codigo": "10801",
    "descripcion": "TAMIZ",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 95,
    "codigo": "10802",
    "descripcion": "REACTOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 96,
    "codigo": "10803",
    "descripcion": "TANQUE CISTERNA DE AGUA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 97,
    "codigo": "10804",
    "descripcion": "TANQUE HIDRONEUMATICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 98,
    "codigo": "10805",
    "descripcion": "FILTRO DE LECHO PROFUNDO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 99,
    "codigo": "10806",
    "descripcion": "LAMPARA UV",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 100,
    "codigo": "10807",
    "descripcion": "CONTROLADOR UV",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 101,
    "codigo": "10808",
    "descripcion": "SOPLADOR (BLOWER)",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 102,
    "codigo": "10809",
    "descripcion": "FILTRO DE GRAVA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 103,
    "codigo": "10810",
    "descripcion": "SISTEMA DE PRESURIZACIÓN",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 104,
    "codigo": "10811",
    "descripcion": "TANQUE DE CARBON ACTIVADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 105,
    "codigo": "10812",
    "descripcion": "SISTEMA OZONIFICADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 106,
    "codigo": "10813",
    "descripcion": "PRE FILTRO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 107,
    "codigo": "10814",
    "descripcion": "DECANTADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 108,
    "codigo": "10815",
    "descripcion": "VALVULA SOLENOIDE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 109,
    "codigo": "10901",
    "descripcion": "RACK INDUSTRIAL PESADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 110,
    "codigo": "10902",
    "descripcion": "RACK SHUTTLE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 111,
    "codigo": "10903",
    "descripcion": "EQUIPO SULFODOLSIFICADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 112,
    "codigo": "10904",
    "descripcion": "CABINA DE CONTROL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 113,
    "codigo": "10905",
    "descripcion": "CANASTILLA HIDROTERMICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 114,
    "codigo": "10906",
    "descripcion": "CABINA DE DESINFECCION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 115,
    "codigo": "10907",
    "descripcion": "BOBINA DE EVAPORADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 116,
    "codigo": "11001",
    "descripcion": "FAJA DE PRODUCTO TERMINADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 117,
    "codigo": "11002",
    "descripcion": "FAJA DE DESCARTE DE MESA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 118,
    "codigo": "11003",
    "descripcion": "FAJA RECEPTORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 119,
    "codigo": "11004",
    "descripcion": "FAJA DE SALIDA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 120,
    "codigo": "11005",
    "descripcion": "FAJA RECOLECTORA SEPARADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 121,
    "codigo": "11006",
    "descripcion": "FAJA ELEVADOR CENTRAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 122,
    "codigo": "11007",
    "descripcion": "FAJA DISTRIBUIDORA DE SELECCION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 123,
    "codigo": "11008",
    "descripcion": "FAJA DE ENTREGA A MESA DE SELECCIÓN",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 124,
    "codigo": "11009",
    "descripcion": "FAJA TRANSVERSAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 125,
    "codigo": "11010",
    "descripcion": "FAJA DE ENTREGA A SINGULADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 126,
    "codigo": "11011",
    "descripcion": "FAJA DE RETORNO DE FRUTAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 127,
    "codigo": "11012",
    "descripcion": "FAJA ESCALONADA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 128,
    "codigo": "11013",
    "descripcion": "FAJA DISTRIBUIDORA DE SELECCIÓN",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 129,
    "codigo": "11014",
    "descripcion": "FAJA SINGULADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 130,
    "codigo": "11015",
    "descripcion": "FAJA DE ROTACION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 131,
    "codigo": "11016",
    "descripcion": "FAJA DE RECUPERACION SPILL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 132,
    "codigo": "11017",
    "descripcion": "FAJA DESCARTE POR FOTOGRAFIA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 133,
    "codigo": "11018",
    "descripcion": "FAJA DESCARTE POR COLOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 134,
    "codigo": "11019",
    "descripcion": "FAJA DESCARTE GRANELERA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 135,
    "codigo": "11020",
    "descripcion": "FAJA GRANELERA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 136,
    "codigo": "11021",
    "descripcion": "FAJA DE DESCARTE DE PRODUCTOS TERMINADOS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 137,
    "codigo": "11022",
    "descripcion": "TRANSPORTADOR MESA DE EMPAQUE (ESTRUCTURA)",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 138,
    "codigo": "11023",
    "descripcion": "TRANSPORTADOR DE POLINES",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 139,
    "codigo": "11024",
    "descripcion": "TRANSPORTADOR DE JABAS HORIZONTAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 140,
    "codigo": "11025",
    "descripcion": "ELEVADOR DE POLINES DE JABAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 141,
    "codigo": "11026",
    "descripcion": "TRANSPORTADOR SUPERIOR DE TINA DE DESINFECCIÓN",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 142,
    "codigo": "11027",
    "descripcion": "TRANSPORTADOR SALIDA DE PRODUCTOS TERMINADOS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 143,
    "codigo": "11028",
    "descripcion": "TRANSPORTADOR DE RODILLOS SELECCIONADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 144,
    "codigo": "11029",
    "descripcion": "TRANSPORTADOR DE DESCARTE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 145,
    "codigo": "11030",
    "descripcion": "FAJA DE JABAS VACIAS Y DESCARTE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 146,
    "codigo": "11031",
    "descripcion": "FAJA DE PRODUCTO EN PROCESO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 147,
    "codigo": "11032",
    "descripcion": "FAJA DE DESCARTE LARGA DE MESAS DE PRODUCTO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 148,
    "codigo": "11033",
    "descripcion": "FAJA DE ABASTECIMIENTO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 149,
    "codigo": "11034",
    "descripcion": "FAJA DE BALANZA DINAMICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 150,
    "codigo": "11035",
    "descripcion": "FAJA DE ETIQUETADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 151,
    "codigo": "11036",
    "descripcion": "FAJA DE CODIFICADORA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 152,
    "codigo": "11037",
    "descripcion": "FAJA DE TAPER ETIQUETADO PARA EMPAQUE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 153,
    "codigo": "11038",
    "descripcion": "FAJA DE EMPAQUE FINAL A PALETIZADO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 154,
    "codigo": "11039",
    "descripcion": "FAJA RETORNO FRUTA A LINEA PRINCIPAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 155,
    "codigo": "11040",
    "descripcion": "FAJA ELEVADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 156,
    "codigo": "11041",
    "descripcion": "FAJA DE DESCARTE DE LINEAS DE MESAS DE PRODUCTOS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 157,
    "codigo": "11042",
    "descripcion": "FAJA ELEVADORA DE ENTREGA JABAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 158,
    "codigo": "11043",
    "descripcion": "TRANSPORTADOR DE METAL (ADICION)",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 159,
    "codigo": "11044",
    "descripcion": "FAJA ELEVADORA DE JABAS DE DESCARTE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 160,
    "codigo": "11045",
    "descripcion": "FAJA HORIZONTAL DE JABAS DE DESCARTE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 161,
    "codigo": "11046",
    "descripcion": "TRANSPORTADOR ELEVADOR DE RODILLOS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 162,
    "codigo": "11047",
    "descripcion": "TRANSPORTADOR LATERAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 163,
    "codigo": "11048",
    "descripcion": "TRANSPORTADOR ELEVADOR DE 2 VIAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 164,
    "codigo": "11049",
    "descripcion": "TRANSPORTADOR DE FAJAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 165,
    "codigo": "11050",
    "descripcion": "MESA ROTONDA GIRATORIA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 166,
    "codigo": "11051",
    "descripcion": "TRANSPORTADOR CURVA DE ROLDANAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 167,
    "codigo": "11101",
    "descripcion": "MOTORREDUCTOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 168,
    "codigo": "11102",
    "descripcion": "MOTOR ELECTRICO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 169,
    "codigo": "11103",
    "descripcion": "REDUCTOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 170,
    "codigo": "11104",
    "descripcion": "MOTORVENTILADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 171,
    "codigo": "11105",
    "descripcion": "MOTOR DOSIFICADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 172,
    "codigo": "11106",
    "descripcion": "MOTOR PASO A PASO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 173,
    "codigo": "11107",
    "descripcion": "MOTORAGITADOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 174,
    "codigo": "11201",
    "descripcion": "BALANZA ELECTRONICA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 175,
    "codigo": "11202",
    "descripcion": "BALANZA CON PLATAFORMA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 176,
    "codigo": "11203",
    "descripcion": "SENSOR INTERRUPTOR",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 177,
    "codigo": "11204",
    "descripcion": "FLUJOMETRO",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 178,
    "codigo": "11205",
    "descripcion": "VALVULA REGULADOR DE GAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 179,
    "codigo": "11206",
    "descripcion": "VARIADOR DE AGUA TRATADA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 180,
    "codigo": "11207",
    "descripcion": "BALANZA GRAMERA",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 181,
    "codigo": "11301",
    "descripcion": "MESA DE ACERO INOXIDABLE C/ ESTRUCTURA DE METAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 182,
    "codigo": "11302",
    "descripcion": "MESA DE ACERO INOXIDABLE (100%)",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 183,
    "codigo": "11303",
    "descripcion": "MESA DE METAL",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 184,
    "codigo": "11305",
    "descripcion": "MESA DE SELECCION",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 185,
    "codigo": "11306",
    "descripcion": "MESA DE EMPAQUE",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 186,
    "codigo": "11307",
    "descripcion": "ESTRUCTURA PARA TRANSPORTE DE CAJAS",
    "cuenta": "1",
    "activo": true
  },
  {
    "id": 187,
    "codigo": "11308",
    "descripcion": "ESTRUCTURA DE TRANSPORTADOR DE JABAS DE DESCARTE",
    "cuenta": "1",
    "activo": true
  }
];

export const ESTADOS_CONSERVACION: EstadoConservacion[] = [
  {
    "id": 1,
    "codigo": "BI",
    "descripcion": "BUENO INOPERATIVO",
    "estado": true,
    "sistema": true
  },
  {
    "id": 2,
    "codigo": "BO",
    "descripcion": "BUENO OPERATIVO",
    "estado": true,
    "sistema": true
  },
  {
    "id": 3,
    "codigo": "MI",
    "descripcion": "MALO INOPERATIVO",
    "estado": true,
    "sistema": true
  },
  {
    "id": 4,
    "codigo": "MO",
    "descripcion": "MALO OPERATIVO",
    "estado": true,
    "sistema": true
  },
  {
    "id": 5,
    "codigo": "RI",
    "descripcion": "REGULAR INOPERATIVO",
    "estado": true,
    "sistema": true
  },
  {
    "id": 6,
    "codigo": "RO",
    "descripcion": "REGULAR OPERATIVO",
    "estado": true,
    "sistema": true
  }
];

export const ESTRUCTURA_CONTABLE: EstructuraContable[] = [
  {
    "id": 1,
    "codigo": "AF-ARRE-EDI-AGU",
    "descripcion": "ARRENDAMIENTO EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO EDIFICACIONES",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "AF-ARRE-EDI-ALM",
    "descripcion": "ARRENDAMIENTO EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO EDIFICACIONES",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "AF-ARRE-EDI-CA1",
    "descripcion": "ARRENDAMIENTO EDIFICACIONES",
    "cuentaContable": "ACF000001",
    "tipo": "ARRENDAMIENTO EDIFICACIONES",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "AF-ARRE-EDI-CIT",
    "descripcion": "ARRENDAMIENTO EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO EDIFICACIONES",
    "activo": true
  },
  {
    "id": 5,
    "codigo": "AF-ARRE-MAQ-ENM",
    "descripcion": "ARRENDAMIENTO MAQUINARIAS",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO MAQUINARIAS",
    "activo": true
  },
  {
    "id": 6,
    "codigo": "AF-ARRE-MAQ-FRI",
    "descripcion": "ARRENDAMIENTO MAQUINARIAS",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO MAQUINARIAS",
    "activo": true
  },
  {
    "id": 7,
    "codigo": "AF-ARRE-MAQ-PTA",
    "descripcion": "ARRENDAMIENTO MAQUINARIAS",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO MAQUINARIAS",
    "activo": true
  },
  {
    "id": 8,
    "codigo": "AF-ARRE-MAQ-SAT",
    "descripcion": "ARRENDAMIENTO MAQUINARIAS",
    "cuentaContable": "—",
    "tipo": "ARRENDAMIENTO MAQUINARIAS",
    "activo": true
  },
  {
    "id": 9,
    "codigo": "AF-DIV-INF",
    "descripcion": "EQUIPOS DIVERSOS",
    "cuentaContable": "—",
    "tipo": "EQUIPOS DIVERSOS",
    "activo": true
  },
  {
    "id": 10,
    "codigo": "AF-DIV-SEG",
    "descripcion": "EQUIPOS DIVERSOS",
    "cuentaContable": "—",
    "tipo": "EQUIPOS DIVERSOS",
    "activo": true
  },
  {
    "id": 11,
    "codigo": "AF-EDI-AGUA",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000107",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 12,
    "codigo": "AF-EDI-ALMA1",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 13,
    "codigo": "AF-EDI-ALMA2",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 14,
    "codigo": "AF-EDI-CAFU",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000099",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 15,
    "codigo": "AF-EDI-CALD",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 16,
    "codigo": "AF-EDI-CALI",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000039",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 17,
    "codigo": "AF-EDI-CITR",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 18,
    "codigo": "AF-EDI-EMP",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000046",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 19,
    "codigo": "AF-EDI-EURO",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000061",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 20,
    "codigo": "AF-EDI-FRUT",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 21,
    "codigo": "AF-EDI-HIDR",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000059",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 22,
    "codigo": "AF-EDI-PLAN",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000015",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 23,
    "codigo": "AF-EDI-PLAN4",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 24,
    "codigo": "AF-EDI-RECE",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000037",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 25,
    "codigo": "AF-EDI-TUCA1",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000076",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 26,
    "codigo": "AF-EDI-TUCA2",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000082",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 27,
    "codigo": "AF-EDI-TUCA3",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 28,
    "codigo": "AF-EDI-USA",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "ACF000054",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 29,
    "codigo": "AF-EDI-UVA",
    "descripcion": "EDIFICACIONES",
    "cuentaContable": "—",
    "tipo": "EDIFICACIONES",
    "activo": true
  },
  {
    "id": 30,
    "codigo": "AF-INTA-ICE",
    "descripcion": "INTANGIBLES",
    "cuentaContable": "—",
    "tipo": "INTANGIBLES",
    "activo": true
  },
  {
    "id": 31,
    "codigo": "AF-INTA-NEI",
    "descripcion": "INTANGIBLES",
    "cuentaContable": "—",
    "tipo": "INTANGIBLES",
    "activo": true
  },
  {
    "id": 32,
    "codigo": "AF-INTA-SAP",
    "descripcion": "INTANGIBLES",
    "cuentaContable": "—",
    "tipo": "INTANGIBLES",
    "activo": true
  },
  {
    "id": 33,
    "codigo": "AF-INTA-SOFT",
    "descripcion": "INTANGIBLES",
    "cuentaContable": "—",
    "tipo": "INTANGIBLES",
    "activo": true
  },
  {
    "id": 34,
    "codigo": "AF-INTA-SOFTPROD",
    "descripcion": "INTANGIBLES",
    "cuentaContable": "—",
    "tipo": "INTANGIBLES",
    "activo": true
  },
  {
    "id": 35,
    "codigo": "AF-MAQ-AGUA",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 36,
    "codigo": "AF-MAQ-CAL",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 37,
    "codigo": "AF-MAQ-CALD",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 38,
    "codigo": "AF-MAQ-CAMA",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 39,
    "codigo": "AF-MAQ-CITR",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 40,
    "codigo": "AF-MAQ-EURO",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 41,
    "codigo": "AF-MAQ-FUER",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 42,
    "codigo": "AF-MAQ-HIDR",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 43,
    "codigo": "AF-MAQ-MAQ",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 44,
    "codigo": "AF-MAQ-PALT",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 45,
    "codigo": "AF-MAQ-TUNA1",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 46,
    "codigo": "AF-MAQ-TUNA2",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 47,
    "codigo": "AF-MAQ-USA",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 48,
    "codigo": "AF-MAQ-UVA",
    "descripcion": "MAQUINARIAS Y EQUIPOS",
    "cuentaContable": "—",
    "tipo": "MAQUINARIAS Y EQUIPOS",
    "activo": true
  },
  {
    "id": 49,
    "codigo": "AF-OTRO-DIV",
    "descripcion": "OTROS EQUIPOS",
    "cuentaContable": "—",
    "tipo": "OTROS EQUIPOS",
    "activo": true
  },
  {
    "id": 50,
    "codigo": "AF-OTRO-EMPA",
    "descripcion": "OTROS EQUIPOS",
    "cuentaContable": "—",
    "tipo": "OTROS EQUIPOS",
    "activo": true
  },
  {
    "id": 51,
    "codigo": "AF-OTRO-MANT",
    "descripcion": "OTROS EQUIPOS",
    "cuentaContable": "—",
    "tipo": "OTROS EQUIPOS",
    "activo": true
  },
  {
    "id": 52,
    "codigo": "AF-OTRO-OFIC",
    "descripcion": "OTROS EQUIPOS",
    "cuentaContable": "—",
    "tipo": "OTROS EQUIPOS",
    "activo": true
  },
  {
    "id": 53,
    "codigo": "AF-TER",
    "descripcion": "TERRENOS",
    "cuentaContable": "ACF000010",
    "tipo": "TERRENOS",
    "activo": true
  },
  {
    "id": 54,
    "codigo": "AF-VEHI-MOT",
    "descripcion": "VEHICULOS",
    "cuentaContable": "—",
    "tipo": "VEHICULOS",
    "activo": true
  }
];

export const ACTIVIDADES: Actividad[] = [
  {
    "id": 1,
    "titulo": "Levantamiento físico - PLANTA 1",
    "inicio": "2025-05-10",
    "fin": "2025-05-25",
    "descripcion": "Inventario físico completo en Planta 1 - EMPAFRUT.",
    "estado": "finalizada",
    "iso": "ISO 55001",
    "entregables": "Base inventario, registro fotográfico",
    "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"
  },
  {
    "id": 2,
    "titulo": "Levantamiento físico - PLANTA 2",
    "inicio": "2025-05-26",
    "fin": "2025-06-10",
    "descripcion": "Inventario físico en Planta 2 (Uva, Cítricos, Mango, Palta).",
    "estado": "finalizada",
    "iso": "ISO 55001",
    "entregables": "Base inventario, fotos",
    "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"
  },
  {
    "id": 3,
    "titulo": "Conciliación contable vs físico",
    "inicio": "2025-06-11",
    "fin": "2025-07-15",
    "descripcion": "Cruce de la base contable con el inventario físico levantado.",
    "estado": "finalizada",
    "iso": "ISO 55001",
    "entregables": "Reporte de conciliación y acta",
    "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"
  },
  {
    "id": 4,
    "titulo": "Identificación de sobrantes y faltantes",
    "inicio": "2025-07-16",
    "fin": "2025-08-05",
    "descripcion": "Clasificación de registros sobrantes, faltantes y bienes de control.",
    "estado": "finalizada",
    "iso": "ISO 55001",
    "entregables": "Listados de sobrantes/faltantes",
    "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"
  },
  {
    "id": 5,
    "titulo": "Etiquetado y codificación",
    "inicio": "2025-08-06",
    "fin": "2025-08-25",
    "descripcion": "Colocación de etiquetas BARRA 2025 en todos los activos.",
    "estado": "en_progreso",
    "iso": "",
    "entregables": "Registro fotográfico",
    "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"
  },
  {
    "id": 6,
    "titulo": "Informe final y presentación",
    "inicio": "2026-03-15",
    "fin": "2026-04-30",
    "descripcion": "Consolidación de resultados y recomendaciones para EMPAFRUT.",
    "estado": "en_progreso",
    "iso": "ISO 55001",
    "entregables": "Informe final, presentación ejecutiva",
    "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"
  }
];

// === Tablas grandes (cargadas desde JSON para rendimiento) ===
export const ACTIVOS_FIJOS: ActivoFijo[] = ACTIVOS_JSON as ActivoFijo[];
export const INVENTARIO_CONTABLE: InventarioContable[] = CONTABLE_JSON as InventarioContable[];
export const CONCILIACIONES_AF: ConciliacionAF[] = CONC_JSON as ConciliacionAF[];
