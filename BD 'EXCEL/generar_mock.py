"""
Genera el archivo mock-activos.ts con TODOS los registros reales de los dos Excels.

Salida: ../src/app/data/mock-activos.ts

Interfaces soportadas (deben coincidir con activo-fijo.model.ts):
  Sede, Ubicacion, CentroCosto, CatalogoItem, EstadoConservacion,
  EstructuraContable, ActivoFijo, InventarioContable, Actividad, ConciliacionAF
"""
import pandas as pd
import json
import math
import re
import os
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.abspath(os.path.join(HERE, "..", "src", "app", "data", "mock-activos.ts"))

ARCH_FISICO   = os.path.join(HERE, "ATF-PR-01-FO-03 Base de Inventario Final - EMPAFRUT (1).xlsx")
ARCH_CONTABLE = os.path.join(HERE, "ATF-PR-01-FO-02 Base Contable Final - EMPAFRUT (1).xlsx")

# =========================================================================
# UTILIDADES
# =========================================================================
def clean(v):
    if v is None: return ""
    try:
        if isinstance(v, float) and math.isnan(v): return ""
    except Exception: pass
    s = str(v).strip()
    if s.lower() == "nan": return ""
    return s

def clean_upper(v): return clean(v).upper()

def num(v):
    if v is None or v == "" : return 0
    try:
        if isinstance(v, float) and math.isnan(v): return 0
    except Exception: pass
    try:
        return float(str(v).replace(",", "").strip())
    except Exception:
        return 0

def to_fecha(v):
    if v is None or v == "" : return ""
    if isinstance(v, datetime):
        return v.strftime("%Y-%m-%d")
    try:
        if isinstance(v, float) and math.isnan(v): return ""
    except Exception: pass
    try:
        d = pd.to_datetime(v, errors="coerce")
        if pd.isna(d): return ""
        return d.strftime("%Y-%m-%d")
    except Exception:
        return ""

# =========================================================================
# LEER EXCELS
# =========================================================================
print("→ Leyendo inventario físico...")
df_fis = pd.read_excel(ARCH_FISICO, sheet_name="BASE INVENTARIO", header=8)
df_fis = df_fis.dropna(subset=["BARRA NUEVA"]).reset_index(drop=True)
print(f"  Físico: {len(df_fis)} filas")

print("→ Leyendo base contable...")
df_con = pd.read_excel(ARCH_CONTABLE, sheet_name="BD", header=5)
df_con = df_con.dropna(subset=["CÓDIGO ACTIVO FIJO"]).reset_index(drop=True)
print(f"  Contable: {len(df_con)} filas")

# =========================================================================
# MAESTROS - extraídos de data real
# =========================================================================
print("→ Construyendo maestros...")

# SEDES = PLANTA
plantas = sorted(set(clean_upper(x) for x in df_fis["PLANTA"] if clean(x)))
SEDES = [
    {"id": i+1, "codigo": f"SD-{str(i+1).zfill(3)}", "descripcion": p,
     "direccion": "Fundo Agrícola EMPAFRUT", "activo": True}
    for i, p in enumerate(plantas)
]
sede_by_name = {s["descripcion"]: s["id"] for s in SEDES}

# UBICACIONES = CODIGO UBICACION + DESCRIPCION UBICACION
ubi_map = {}
for _, r in df_fis.iterrows():
    cod = clean(r.get("CODIGO DE UBICACION"))
    des = clean_upper(r.get("DESCRIPCION DE UBICACION"))
    pla = clean_upper(r.get("PLANTA"))
    if not cod: continue
    if cod not in ubi_map:
        ubi_map[cod] = {"codigo": cod, "descripcion": des, "sedNombre": pla}

UBICACIONES = []
for i, u in enumerate(sorted(ubi_map.values(), key=lambda x: x["codigo"])):
    UBICACIONES.append({
        "id": i+1,
        "codigo": u["codigo"],
        "descripcion": u["descripcion"],
        "sedeId": sede_by_name.get(u["sedNombre"], 1),
        "sedNombre": u["sedNombre"] or "EMPAFRUT",
        "activo": True,
    })

# CENTROS DE COSTO
cc_map = {}
for _, r in df_fis.iterrows():
    cod = clean(r.get("CODIGO DE CENTRO DE COSTO"))
    des = clean_upper(r.get("DESCRIPCION DE CENTRO DE COSTO"))
    if not cod: continue
    cc_map.setdefault(cod, des)

CENTROS_COSTO = [
    {"id": i+1, "codigo": k, "descripcion": v, "activo": True}
    for i, (k, v) in enumerate(sorted(cc_map.items()))
]

# CATÁLOGO (CODIGO CATALOGO + DESCRIPCION CATALOGO + FAMILIA)
cat_map = {}
for _, r in df_fis.iterrows():
    cod = clean(r.get("CODIGO CATALOGO"))
    des = clean_upper(r.get("DESCRIPCION DE CATALOGO"))
    fam = clean(r.get("CODIGO DE FAMILIA"))
    if not cod: continue
    cat_map.setdefault(cod, {"desc": des, "fam": fam})

CATALOGO = [
    {"id": i+1, "codigo": k, "descripcion": v["desc"], "cuenta": v["fam"] or "—", "activo": True}
    for i, (k, v) in enumerate(sorted(cat_map.items()))
]

# ESTADOS DE CONSERVACIÓN - reales + estándar
est_codes_real = sorted(set(clean_upper(x) for x in df_fis["ESTADO DE CONSERVACION"] if clean(x)))
# Diccionario de equivalencias
EST_DICT = {
    "BO": "BUENO OPERATIVO",
    "BI": "BUENO INOPERATIVO",
    "MI": "MALO INOPERATIVO",
    "MO": "MALO OPERATIVO",
    "RI": "REGULAR INOPERATIVO",
    "RO": "REGULAR OPERATIVO",
    "NU": "NUEVO",
    "BU": "BUENO",
    "RE": "REGULAR",
    "MA": "MALO",
    "OP": "OPERATIVO",
    "AV": "AVERIADO",
    "BA": "BAJA",
}
ESTADOS_CONSERVACION = []
for i, c in enumerate(est_codes_real):
    ESTADOS_CONSERVACION.append({
        "id": i+1, "codigo": c,
        "descripcion": EST_DICT.get(c, c),
        "estado": True,
        "sistema": True,
    })

# ESTRUCTURA CONTABLE = por CATEGORIA / CLASE
ec_map = {}
for _, r in df_con.iterrows():
    cat = clean_upper(r.get("CATEGORIA"))
    cla = clean_upper(r.get("CLASE"))
    fam = clean_upper(r.get("FAMILIA"))
    if not cat: continue
    ec_map.setdefault(cat, {"clase": cla, "familia": fam})

ESTRUCTURA_CONTABLE = []
for i, (k, v) in enumerate(sorted(ec_map.items())):
    ESTRUCTURA_CONTABLE.append({
        "id": i+1, "codigo": k,
        "descripcion": v["clase"] or k,
        "cuentaContable": v["familia"] or "—",
        "tipo": v["clase"] or "ACTIVO FIJO",
        "activo": True,
    })

print(f"  Sedes: {len(SEDES)}  Ubicaciones: {len(UBICACIONES)}  CC: {len(CENTROS_COSTO)}")
print(f"  Catálogo: {len(CATALOGO)}  Estados: {len(ESTADOS_CONSERVACION)}  Estructura: {len(ESTRUCTURA_CONTABLE)}")

# =========================================================================
# ACTIVOS FÍSICOS
# =========================================================================
print("→ Procesando inventario físico...")
ACTIVOS_FIJOS = []
for i, r in df_fis.iterrows():
    barnue = clean_upper(r.get("BARRA NUEVA"))
    if not barnue: continue
    ACTIVOS_FIJOS.append({
        "id": len(ACTIVOS_FIJOS)+1,
        "barNue": barnue,
        "codEmpresa": "EMPAFRUT",
        "fecLectura": "2025-06-30",
        "ubicacion": clean_upper(r.get("DESCRIPCION DE UBICACION")),
        "centroCosto": clean(r.get("CODIGO DE CENTRO DE COSTO")),
        "responsable": clean_upper(r.get("NOMBRES DE RESPONSABLE")),
        "catDescripcion": clean_upper(r.get("DESCRIPCION DE CATALOGO")),
        "marca": clean_upper(r.get("Marca")),
        "modelo": clean_upper(r.get("Modelo")),
        "serie": clean(r.get("Serie")),
        "estadoConservacion": clean_upper(r.get("ESTADO DE CONSERVACION")) or "BO",
        "empresa": "EMPAFRUT",
        "observaciones": clean(r.get("Observaciones")),
        "imagen": None,
        "creacion": "2025-06-01",
        "inventariador": "EQUIPO AQUARIUS",
    })
print(f"  Activos físicos: {len(ACTIVOS_FIJOS)}")

# =========================================================================
# INVENTARIO CONTABLE
# =========================================================================
print("→ Procesando inventario contable...")
INVENTARIO_CONTABLE = []
cont_by_cod = {}       # codigoActivo → registro
cont_by_barra = {}     # barra2025 → registro

for i, r in df_con.iterrows():
    cod = clean_upper(r.get("CÓDIGO ACTIVO FIJO"))
    if not cod: continue

    barra_2025 = clean_upper(r.get("BARRA 2025"))
    fecha_adq  = to_fecha(r.get("FECHA ADQUISICIÓN") or r.get("FECHA_ADQUISION"))
    costo      = num(r.get("COSTO HISTORICO") or r.get("VALOR_INICIAL"))
    dep_acum   = num(r.get("DEPRECIACION ACUMULADA") or r.get("TOTAL_DEPRECIACIÓN"))
    valor_neto = num(r.get("VALOR NETO") or r.get("VALOR_NETO"))
    vida_meses = num(r.get("VIDA_UTIL_MESES"))

    reg = {
        "id": len(INVENTARIO_CONTABLE)+1,
        "codigoActivo": cod,
        "descripcion": clean_upper(r.get("DESCRIPCIÓN ACTIVO FIJO")),
        "cuentaContable": clean(r.get("FAMILIA")) or clean(r.get("CATEGORIA")),
        "fechaAdquisicion": fecha_adq,
        "valorAdquisicion": round(costo, 2),
        "depreciacionAcumulada": round(dep_acum, 2),
        "valorNeto": round(valor_neto, 2),
        "vidaUtil": int(vida_meses // 12) if vida_meses else 5,
        "ubicacion": clean_upper(r.get("DIMENSIÓN_3")) or clean_upper(r.get("OBSERVACIONES_GENERAL")),
        "estado": clean_upper(r.get("CONDICIÓN CONCILIADOR"))[:20] or "CONCILIADO",
        "responsable": clean_upper(r.get("USUARIO")),
    }
    INVENTARIO_CONTABLE.append(reg)

    # Índices para conciliación
    cont_by_cod[cod] = reg
    if barra_2025:
        cont_by_barra[barra_2025] = reg

print(f"  Contables: {len(INVENTARIO_CONTABLE)}")

# =========================================================================
# CONCILIACIONES
# =========================================================================
print("→ Construyendo conciliaciones...")
CONCILIACIONES_AF = []

# Mapa físico por barra
fis_by_barra = {a["barNue"]: a for a in ACTIVOS_FIJOS}

# 1) Recorrer activos físicos y cruzar con contabilidad (BARRA 2025)
usados_contables = set()
cont_idx = 0
for af in ACTIVOS_FIJOS:
    barra = af["barNue"]
    c = cont_by_barra.get(barra)
    if c:
        usados_contables.add(c["codigoActivo"])

    # Leemos condición directa del Excel físico
    fila_fis = df_fis[df_fis["BARRA NUEVA"].astype(str).str.upper() == barra]
    cond = ""
    if len(fila_fis):
        cond = clean_upper(fila_fis.iloc[0].get("CONDICIÓN"))

    if cond == "CONCILIADO" or c is not None:
        if c:
            # comparar ubicación y estado
            ub_fis = af["ubicacion"]
            ub_con = c["ubicacion"]
            es_fis = af["estadoConservacion"]
            es_con = c["estado"]
            if ub_fis and ub_con and ub_fis != ub_con:
                resultado = "discrepancia"
                obs = "Ubicación física difiere de la registrada en sistema contable."
            elif es_fis and "MI" in es_fis or "RI" in es_fis:
                resultado = "discrepancia"
                obs = "Estado de conservación requiere revisión (inoperativo/regular)."
            else:
                resultado = "conciliado"
                obs = "Activo localizado, estado y ubicación coinciden."
            valor = c["valorNeto"]
            ub_con_f = c["ubicacion"] or "—"
            es_con_f = c["estado"] or "—"
        else:
            resultado = "conciliado"
            obs = "Activo con condición CONCILIADO en base inventario (sin cruce directo)."
            valor = 0
            ub_con_f = "—"
            es_con_f = "—"
    elif cond == "SOBRANTE":
        resultado = "sobrante"
        obs = "Activo encontrado físicamente sin registro contable (SOBRANTE)."
        valor = 0
        ub_con_f = "—"
        es_con_f = "—"
    elif cond == "BIENES DE CONTROL":
        resultado = "discrepancia"
        obs = "Bien de control: registrado para seguimiento sin activación contable."
        valor = 0
        ub_con_f = "—"
        es_con_f = "—"
    elif cond == "HERRAMIENTAS":
        resultado = "discrepancia"
        obs = "Herramienta: no forma parte del activo fijo estándar."
        valor = 0
        ub_con_f = "—"
        es_con_f = "—"
    else:
        resultado = "conciliado"
        obs = "Registro físico sin condición declarada."
        valor = 0
        ub_con_f = "—"
        es_con_f = "—"

    CONCILIACIONES_AF.append({
        "id": f"CON-{str(len(CONCILIACIONES_AF)+1).zfill(5)}",
        "barNue": barra,
        "descripcion": af["catDescripcion"],
        "ubicacionFisica": af["ubicacion"] or "—",
        "ubicacionContable": ub_con_f,
        "estadoFisico": af["estadoConservacion"] or "—",
        "estadoContable": es_con_f,
        "valorContable": valor,
        "encontradoFisico": True,
        "encontradoContable": c is not None,
        "resultado": resultado,
        "observacion": obs,
    })

# 2) Contables NO encontrados en físico → FALTANTES (solo REGISTROS PENDIENTES DE CONCILIAR)
for c in INVENTARIO_CONTABLE:
    if c["codigoActivo"] in usados_contables: continue
    # Solo los marcados como pendientes de conciliar se consideran faltantes
    if "PENDIENTES" in c["estado"].upper() or "1.2" in c["estado"]:
        CONCILIACIONES_AF.append({
            "id": f"CON-{str(len(CONCILIACIONES_AF)+1).zfill(5)}",
            "barNue": c["codigoActivo"],
            "descripcion": c["descripcion"],
            "ubicacionFisica": "—",
            "ubicacionContable": c["ubicacion"] or "—",
            "estadoFisico": "—",
            "estadoContable": c["estado"] or "—",
            "valorContable": c["valorNeto"],
            "encontradoFisico": False,
            "encontradoContable": True,
            "resultado": "faltante",
            "observacion": "Activo registrado en contabilidad pero NO encontrado en inventario físico.",
        })

print(f"  Conciliaciones: {len(CONCILIACIONES_AF)}")

# =========================================================================
# ACTIVIDADES (estáticas, contexto del proyecto)
# =========================================================================
ACTIVIDADES = [
    {"id": 1, "titulo": "Levantamiento físico - PLANTA 1", "inicio": "2025-05-10", "fin": "2025-05-25",
     "descripcion": "Inventario físico completo en Planta 1 - EMPAFRUT.",
     "estado": "finalizada", "iso": "ISO 55001",
     "entregables": "Base inventario, registro fotográfico",
     "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"},
    {"id": 2, "titulo": "Levantamiento físico - PLANTA 2", "inicio": "2025-05-26", "fin": "2025-06-10",
     "descripcion": "Inventario físico en Planta 2 (Uva, Cítricos, Mango, Palta).",
     "estado": "finalizada", "iso": "ISO 55001",
     "entregables": "Base inventario, fotos",
     "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"},
    {"id": 3, "titulo": "Conciliación contable vs físico", "inicio": "2025-06-11", "fin": "2025-07-15",
     "descripcion": "Cruce de la base contable con el inventario físico levantado.",
     "estado": "finalizada", "iso": "ISO 55001",
     "entregables": "Reporte de conciliación y acta",
     "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"},
    {"id": 4, "titulo": "Identificación de sobrantes y faltantes", "inicio": "2025-07-16", "fin": "2025-08-05",
     "descripcion": "Clasificación de registros sobrantes, faltantes y bienes de control.",
     "estado": "finalizada", "iso": "ISO 55001",
     "entregables": "Listados de sobrantes/faltantes",
     "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"},
    {"id": 5, "titulo": "Etiquetado y codificación", "inicio": "2025-08-06", "fin": "2025-08-25",
     "descripcion": "Colocación de etiquetas BARRA 2025 en todos los activos.",
     "estado": "en_progreso", "iso": "",
     "entregables": "Registro fotográfico",
     "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"},
    {"id": 6, "titulo": "Informe final y presentación", "inicio": "2026-03-15", "fin": "2026-04-30",
     "descripcion": "Consolidación de resultados y recomendaciones para EMPAFRUT.",
     "estado": "en_progreso", "iso": "ISO 55001",
     "entregables": "Informe final, presentación ejecutiva",
     "proyecto": "INVENTARIO GENERAL DE ACTIVOS FIJOS - EMPAFRUT"},
]

# =========================================================================
# SERIALIZAR A TS
# =========================================================================
print(f"→ Escribiendo {OUT}...")

def js(data):
    return json.dumps(data, ensure_ascii=False, indent=2)

header = """import {
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

"""

# === Datos grandes se emiten como JSON para evitar que TS calcule
#     uniones literales enormes (error TS2590). Se importan con
#     resolveJsonModule y se castean al tipo correcto.

DATA_DIR = os.path.dirname(OUT)
os.makedirs(DATA_DIR, exist_ok=True)

def dump_json(name, data):
    p = os.path.join(DATA_DIR, name)
    with open(p, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False)
    return name

f_activos     = dump_json("activos-fijos.json", ACTIVOS_FIJOS)
f_contable    = dump_json("inventario-contable.json", INVENTARIO_CONTABLE)
f_conc        = dump_json("conciliaciones.json", CONCILIACIONES_AF)

body = ""
body += f"// === Maestros (pequeños): inline en TS ===\n\n"
body += f"export const SEDES: Sede[] = {js(SEDES)};\n\n"
body += f"export const UBICACIONES: Ubicacion[] = {js(UBICACIONES)};\n\n"
body += f"export const CENTROS_COSTO: CentroCosto[] = {js(CENTROS_COSTO)};\n\n"
body += f"export const CATALOGO: CatalogoItem[] = {js(CATALOGO)};\n\n"
body += f"export const ESTADOS_CONSERVACION: EstadoConservacion[] = {js(ESTADOS_CONSERVACION)};\n\n"
body += f"export const ESTRUCTURA_CONTABLE: EstructuraContable[] = {js(ESTRUCTURA_CONTABLE)};\n\n"
body += f"export const ACTIVIDADES: Actividad[] = {js(ACTIVIDADES)};\n\n"

body += "// === Tablas grandes (cargadas desde JSON para rendimiento) ===\n"
body += "export const ACTIVOS_FIJOS: ActivoFijo[] = ACTIVOS_JSON as ActivoFijo[];\n"
body += "export const INVENTARIO_CONTABLE: InventarioContable[] = CONTABLE_JSON as InventarioContable[];\n"
body += "export const CONCILIACIONES_AF: ConciliacionAF[] = CONC_JSON as ConciliacionAF[];\n"

with open(OUT, "w", encoding="utf-8") as f:
    f.write(header + body)

print(f"✓ OK - {OUT}")
print(f"  SEDES={len(SEDES)}  UBIC={len(UBICACIONES)}  CC={len(CENTROS_COSTO)}  CAT={len(CATALOGO)}")
print(f"  ACTIVOS={len(ACTIVOS_FIJOS)}  CONTABLES={len(INVENTARIO_CONTABLE)}  CONC={len(CONCILIACIONES_AF)}")
