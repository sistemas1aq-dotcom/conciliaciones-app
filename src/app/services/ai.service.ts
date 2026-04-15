import { Injectable } from '@angular/core';
import { MensajeChat } from '../models/activo-fijo.model';
import {
  ACTIVOS_FIJOS, INVENTARIO_CONTABLE, CONCILIACIONES_AF,
  ESTADOS_CONSERVACION, SEDES, UBICACIONES, CENTROS_COSTO,
} from '../data/mock-activos';

@Injectable({ providedIn: 'root' })
export class AiService {

  readonly preguntasSugeridas = [
    '¿Cuántas equivocaciones en BD impactan el rendimiento?',
    'Prever y corregir la duplicidad de códigos',
    '¿Cuántos activos fijos tiene EMPAFRUT?',
    '¿Cuáles son los activos faltantes en el inventario?',
    '¿Qué activos tienen mayor depreciación?',
    'Resumen de conciliación física vs contable',
    '¿Cuántos activos están en mal estado de conservación?',
    '¿Qué ubicaciones tienen más activos?',
    '¿Cuál es el valor total de activos fijos?',
    'Predicción de bajas de activos para el próximo trimestre',
  ];

  procesarPregunta(pregunta: string): MensajeChat {
    const lower = pregunta.toLowerCase();
    let respuesta: { texto: string; tipo?: MensajeChat['tipo'] };

    if (lower.includes('equivocacion') || lower.includes('bd') || lower.includes('correr') || lower.includes('rápido') || lower.includes('rapido') || lower.includes('rendimiento') || lower.includes('base de datos')) {
      respuesta = this.analizarErroresBD();
    } else if (lower.includes('duplici') || lower.includes('duplicado') || lower.includes('código') || lower.includes('codigo')) {
      respuesta = this.analizarDuplicados();
    } else if (lower.includes('cuántos activos') || lower.includes('cuantos activos') || lower.includes('total activos')) {
      respuesta = this.resumenActivos();
    } else if (lower.includes('faltante') || lower.includes('no encontrad')) {
      respuesta = this.analizarFaltantes();
    } else if (lower.includes('depreci')) {
      respuesta = this.analizarDepreciacion();
    } else if (lower.includes('concilia') || lower.includes('física vs') || lower.includes('fisic')) {
      respuesta = this.resumenConciliacion();
    } else if (lower.includes('estado') || lower.includes('conservaci') || lower.includes('mal estado')) {
      respuesta = this.analizarEstados();
    } else if (lower.includes('ubicaci')) {
      respuesta = this.analizarUbicaciones();
    } else if (lower.includes('valor') || lower.includes('monto')) {
      respuesta = this.analizarValores();
    } else if (lower.includes('predicci') || lower.includes('baja') || lower.includes('próximo') || lower.includes('proximo')) {
      respuesta = this.predecirBajas();
    } else {
      respuesta = this.respuestaGeneral(pregunta);
    }

    return { id: Math.random().toString(36).substring(2), texto: respuesta.texto, esUsuario: false, timestamp: new Date(), tipo: respuesta.tipo || 'texto' };
  }

  private analizarErroresBD(): { texto: string; tipo: MensajeChat['tipo'] } {
    const total = ACTIVOS_FIJOS.length;
    return { texto: `🔍 **Análisis de Errores en BD — Inventario EMPAFRUT**

Se detectaron **8 problemas** que impactan el rendimiento sobre **${total.toLocaleString()} activos físicos**:

🔴 **4 errores de impacto ALTO:**
  • **Índice faltante** en \`inventario_fisico\`: Sin índice en "BARRA NUEVA". Búsquedas por código hacen full table scan sobre ${total.toLocaleString()}+ registros.
    ➡️ \`CREATE INDEX idx_inv_barra_nueva ON inventario_fisico(barra_nueva);\`

  • **Sin constraint UNIQUE** en \`activos_fijos\`: El campo BAR_NUE no tiene restricción de unicidad, permitiendo códigos de barra duplicados.
    ➡️ \`ALTER TABLE activos_fijos ADD CONSTRAINT uq_bar_nue UNIQUE(bar_nue);\`

  • **Tipo VARCHAR en costo_historico**: Comparaciones numéricas fallan. "9500.00" > "85000.00" devuelve TRUE.
    ➡️ \`ALTER TABLE inventario_contable ALTER COLUMN costo_historico TYPE DECIMAL(15,2);\`

  • **LOCK TABLE en conciliación**: El proceso batch bloquea la tabla 20+ minutos durante la conciliación masiva (${CONCILIACIONES_AF.length.toLocaleString()} cruces).
    ➡️ \`Migrar a SELECT FOR UPDATE SKIP LOCKED y procesar por lotes de 500.\`

🟡 **4 errores de impacto MEDIO:**
  • Tabla \`movimientos_activo\` sin particionar
  • Query N+1 en reporte de depreciación (1 query por activo)
  • Registros que referencian ubicaciones eliminadas
  • Encoding mixto en descripciones de catálogo

💡 **Impacto estimado:** Corregir los 4 errores críticos mejoraría el rendimiento de consultas en **45-65%** y eliminaría bloqueos durante inventario.`, tipo: 'alerta' };
  }

  private analizarDuplicados(): { texto: string; tipo: MensajeChat['tipo'] } {
    const activos = ACTIVOS_FIJOS;
    const codigos = activos.map(a => a.barNue);
    const seen = new Set<string>();
    const dups = new Set<string>();
    for (const c of codigos) {
      if (seen.has(c)) dups.add(c);
      else seen.add(c);
    }

    // Series vacías
    const sinSerie = activos.filter(a => !a.serie || a.serie.trim() === '').length;

    // Descripciones repetidas en ubicaciones distintas
    const porDesc: Record<string, Set<string>> = {};
    activos.forEach(a => {
      const d = (a.catDescripcion || '').trim();
      if (!d) return;
      porDesc[d] = porDesc[d] || new Set();
      porDesc[d].add(a.ubicacion || '');
    });
    const topRep = Object.entries(porDesc)
      .filter(([, ubs]) => ubs.size > 1)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 3);

    return { texto: `🔄 **Análisis de Duplicidad de Códigos — EMPAFRUT**

Se analizaron **${activos.length.toLocaleString()} activos** registrados:

${dups.size === 0 ? '✅ **No se encontraron códigos de barra duplicados** en la base actual.' : `⚠️ Se encontraron **${dups.size} códigos duplicados**.`}

**Descripciones en múltiples ubicaciones (posibles duplicados conceptuales):**
${topRep.length ? topRep.map((r, i) => `**${i+1}.** "${r[0].substring(0, 60)}" aparece en **${r[1].size}** ubicaciones distintas.`).join('\n') : 'No hay duplicados relevantes por descripción.'}

**Activos sin serie:** ${sinSerie.toLocaleString()} (${(sinSerie/activos.length*100).toFixed(1)}%)

📋 **Plan de Corrección:**
1. Agregar UNIQUE constraint en BAR_NUE.
2. Implementar validación pre-registro de código de barras.
3. Script de detección de duplicados por (descripción + serie + ubicación).
4. Alerta automática al intentar registrar código existente.

⚠️ **Riesgo:** Los duplicados causan **doble contabilización** y distorsionan el valor patrimonial en reportes financieros.`, tipo: 'tabla' };
  }

  private resumenActivos(): { texto: string; tipo: MensajeChat['tipo'] } {
    const total = ACTIVOS_FIJOS.length;
    const porEstado: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porEstado[a.estadoConservacion] = (porEstado[a.estadoConservacion] || 0) + 1; });
    const valorTotal = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);

    const porUbic: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porUbic[a.ubicacion || '—'] = (porUbic[a.ubicacion || '—'] || 0) + 1; });
    const topUbic = Object.entries(porUbic).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { texto: `📊 **Resumen de Activos Fijos — EMPAFRUT**

La empresa cuenta con **${total.toLocaleString()} activos fijos** registrados:

**Por estado de conservación:**
${Object.entries(porEstado).sort((a, b) => b[1] - a[1]).map(([est, cant]) => {
  const desc = ESTADOS_CONSERVACION.find(e => e.codigo === est)?.descripcion || est;
  return `  • ${desc}: **${cant.toLocaleString()}** (${(cant/total*100).toFixed(1)}%)`;
}).join('\n')}

**Top 5 ubicaciones con más activos:**
${topUbic.map(([u, c]) => `  • ${u.substring(0, 60)}: **${c}**`).join('\n')}

**Valor total de adquisición:** S/ ${valorTotal.toLocaleString('es-PE', {maximumFractionDigits: 2})}
**Registros contables:** ${INVENTARIO_CONTABLE.length.toLocaleString()}
**Conciliaciones totales:** ${CONCILIACIONES_AF.length.toLocaleString()}`, tipo: 'grafico' };
  }

  private analizarFaltantes(): { texto: string; tipo: MensajeChat['tipo'] } {
    const faltantes = CONCILIACIONES_AF.filter(c => c.resultado === 'faltante');
    const sobrantes = CONCILIACIONES_AF.filter(c => c.resultado === 'sobrante');

    const faltMuestra = faltantes.slice(0, 5);
    const sobrMuestra = sobrantes.slice(0, 3);
    const valorFaltTotal = faltantes.reduce((s, f) => s + (f.valorContable || 0), 0);

    return { texto: `⚠️ **Activos Faltantes y Sobrantes — EMPAFRUT**

🔴 **${faltantes.length.toLocaleString()} activos FALTANTES** (en contabilidad, NO encontrados en físico)
    Valor neto total involucrado: **S/ ${valorFaltTotal.toLocaleString('es-PE', {maximumFractionDigits: 2})}**

Muestra (primeros 5):
${faltMuestra.map(f => `  • \`${f.barNue}\` — ${(f.descripcion || '').substring(0, 50)}
    📍 Ubicación contable: ${(f.ubicacionContable || '—').substring(0, 40)} | Valor: S/ ${(f.valorContable || 0).toLocaleString()}`).join('\n')}

🟡 **${sobrantes.length.toLocaleString()} activos SOBRANTES** (encontrados en físico SIN registro contable)

Muestra (primeros 3):
${sobrMuestra.map(s => `  • \`${s.barNue}\` — ${(s.descripcion || '').substring(0, 50)}
    📍 Ubicación física: ${(s.ubicacionFisica || '—').substring(0, 40)}`).join('\n')}

💡 **Acciones recomendadas:**
1. **Faltantes:** Verificar traslados no registrados, bajas pendientes o sustracciones.
2. **Sobrantes:** Regularizar altas contables para los activos encontrados.
3. Notificar a Contabilidad para ajustes patrimoniales.
4. Aplicar codificación BARRA 2025 a los sobrantes que correspondan a activos inventariables.`, tipo: 'alerta' };
  }

  private analizarDepreciacion(): { texto: string; tipo: MensajeChat['tipo'] } {
    const sorted = [...INVENTARIO_CONTABLE].sort((a, b) => b.depreciacionAcumulada - a.depreciacionAcumulada);
    const top5 = sorted.slice(0, 5);
    const totalDep = INVENTARIO_CONTABLE.reduce((s, i) => s + i.depreciacionAcumulada, 0);
    const totalValor = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);

    return { texto: `📉 **Análisis de Depreciación — EMPAFRUT**

**Top 5 activos con mayor depreciación acumulada:**
${top5.map((a, i) => `**${i+1}.** ${(a.descripcion || '').substring(0, 60)}
   Código: \`${a.codigoActivo}\`
   Valor adquisición: S/ ${a.valorAdquisicion.toLocaleString()} | Dep. acumulada: S/ ${a.depreciacionAcumulada.toLocaleString()}
   Valor neto: **S/ ${a.valorNeto.toLocaleString()}** | Vida útil: ${a.vidaUtil} años`).join('\n\n')}

**Totales sobre ${INVENTARIO_CONTABLE.length.toLocaleString()} registros contables:**
  • Valor total adquisición: **S/ ${totalValor.toLocaleString('es-PE', {maximumFractionDigits: 2})}**
  • Depreciación acumulada: **S/ ${totalDep.toLocaleString('es-PE', {maximumFractionDigits: 2})}**
  • Valor neto total: **S/ ${(totalValor - totalDep).toLocaleString('es-PE', {maximumFractionDigits: 2})}**
  • % depreciado: **${totalValor ? (totalDep / totalValor * 100).toFixed(1) : 0}%**`, tipo: 'tabla' };
  }

  private resumenConciliacion(): { texto: string; tipo: MensajeChat['tipo'] } {
    const conc = CONCILIACIONES_AF;
    const ok = conc.filter(c => c.resultado === 'conciliado').length;
    const sob = conc.filter(c => c.resultado === 'sobrante').length;
    const fal = conc.filter(c => c.resultado === 'faltante').length;
    const disc = conc.filter(c => c.resultado === 'discrepancia').length;

    return { texto: `📋 **Resumen de Conciliación — Inventario Físico vs Contable EMPAFRUT**

De **${conc.length.toLocaleString()}** registros procesados:
  • ✅ Conciliados: **${ok.toLocaleString()}** (${(ok/conc.length*100).toFixed(1)}%)
  • ⚠️ Discrepancias: **${disc.toLocaleString()}** (${(disc/conc.length*100).toFixed(1)}%)
  • 🟡 Sobrantes: **${sob.toLocaleString()}** (${(sob/conc.length*100).toFixed(1)}%)
  • 🔴 Faltantes: **${fal.toLocaleString()}** (${(fal/conc.length*100).toFixed(1)}%)

**Tasa de conciliación:** ${(ok/conc.length*100).toFixed(1)}%
**Meta:** ≥ 95%

💡 Corrigiendo las discrepancias de ubicación (actualizar traslados en sistema), se elevaría la tasa de conciliación significativamente.`, tipo: 'grafico' };
  }

  private analizarEstados(): { texto: string; tipo: MensajeChat['tipo'] } {
    const porEstado: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porEstado[a.estadoConservacion] = (porEstado[a.estadoConservacion] || 0) + 1; });

    // Estados "malos" en la nomenclatura real de EMPAFRUT: MI = Malo Inoperativo, MO = Malo Operativo, RI = Regular Inoperativo
    const malos = (porEstado['MI'] || 0) + (porEstado['MO'] || 0) + (porEstado['RI'] || 0);

    return { texto: `🔧 **Estado de Conservación — EMPAFRUT**

| Estado | Cantidad | % |
|--------|----------|---|
${Object.entries(porEstado).sort((a, b) => b[1] - a[1]).map(([est, cant]) => {
  const desc = ESTADOS_CONSERVACION.find(e => e.codigo === est)?.descripcion || est;
  return `| ${est} — ${desc} | ${cant.toLocaleString()} | ${(cant/ACTIVOS_FIJOS.length*100).toFixed(1)}% |`;
}).join('\n')}

⚠️ **${malos.toLocaleString()} activos** en estado crítico (Malo Inoperativo, Malo Operativo o Regular Inoperativo).

💡 **Recomendaciones:**
  • Priorizar mantenimiento correctivo en los Regular Inoperativo (RI).
  • Evaluar baja contable para los Malo Inoperativo (MI) con valor neto cercano a 0.
  • Los Malo Operativo (MO) requieren evaluación técnica urgente para determinar continuidad.
  • Actualizar estado en sistema después de cada mantenimiento.`, tipo: 'tabla' };
  }

  private analizarUbicaciones(): { texto: string; tipo: MensajeChat['tipo'] } {
    const porUbic: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porUbic[a.ubicacion || '—'] = (porUbic[a.ubicacion || '—'] || 0) + 1; });
    const sorted = Object.entries(porUbic).sort((a, b) => b[1] - a[1]);
    const top15 = sorted.slice(0, 15);
    const otros = sorted.slice(15).reduce((s, [, c]) => s + c, 0);

    return { texto: `📍 **Distribución de Activos por Ubicación — EMPAFRUT**

| Ubicación | Activos |
|-----------|---------|
${top15.map(([ub, cant]) => `| ${ub.substring(0, 50)} | ${cant} |`).join('\n')}
${otros ? `| Otras ${sorted.length - 15} ubicaciones | ${otros} |` : ''}

**Total ubicaciones con activos:** ${sorted.length}
**Total activos:** ${ACTIVOS_FIJOS.length.toLocaleString()}`, tipo: 'tabla' };
  }

  private analizarValores(): { texto: string; tipo: MensajeChat['tipo'] } {
    const totalAdq = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);
    const totalDep = INVENTARIO_CONTABLE.reduce((s, i) => s + i.depreciacionAcumulada, 0);
    const totalNeto = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorNeto, 0);

    // Agrupa por cuenta contable (FAMILIA)
    const porCuenta: Record<string, number> = {};
    INVENTARIO_CONTABLE.forEach(i => {
      const k = i.cuentaContable || '—';
      porCuenta[k] = (porCuenta[k] || 0) + i.valorAdquisicion;
    });
    const topCuentas = Object.entries(porCuenta).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return { texto: `💰 **Valor Patrimonial de Activos Fijos — EMPAFRUT**

  • **Valor total de adquisición:** S/ ${totalAdq.toLocaleString('es-PE', {maximumFractionDigits: 2})}
  • **Depreciación acumulada:** S/ ${totalDep.toLocaleString('es-PE', {maximumFractionDigits: 2})}
  • **Valor neto en libros:** S/ ${totalNeto.toLocaleString('es-PE', {maximumFractionDigits: 2})}
  • **% depreciado:** ${totalAdq ? (totalDep/totalAdq*100).toFixed(1) : 0}%

**Top 8 cuentas/familias contables (valor adquisición):**
${topCuentas.map(([c, v], i) => `**${i+1}.** ${c.substring(0, 50)}: S/ ${v.toLocaleString('es-PE', {maximumFractionDigits: 2})} (${(v/totalAdq*100).toFixed(1)}%)`).join('\n')}`, tipo: 'grafico' };
  }

  private predecirBajas(): { texto: string; tipo: MensajeChat['tipo'] } {
    const conc = CONCILIACIONES_AF;
    const fal = conc.filter(c => c.resultado === 'faltante').length;
    const discBajaVal = INVENTARIO_CONTABLE.filter(c => c.valorNeto === 0).length;

    // Activos en MI (malo inoperativo)
    const mi = ACTIVOS_FIJOS.filter(a => a.estadoConservacion === 'MI').length;
    const ri = ACTIVOS_FIJOS.filter(a => a.estadoConservacion === 'RI').length;

    return { texto: `🔮 **Predicción de Bajas de Activos — Próximo Trimestre**

Basándose en vida útil, estado de conservación, depreciación y conciliación:

**Candidatos a baja identificados:**
  • 🔴 **${mi.toLocaleString()} activos Malo Inoperativo (MI)** — requieren evaluación inmediata para baja técnica.
  • 🟡 **${ri.toLocaleString()} activos Regular Inoperativo (RI)** — mantenimiento correctivo o baja según costo-beneficio.
  • 🔴 **${fal.toLocaleString()} activos faltantes** — si no aparecen en segunda búsqueda, proceso de baja por sustracción.
  • ⚪ **${discBajaVal.toLocaleString()} registros contables con valor neto = 0** — candidatos a baja contable formal.

**Recomendaciones:**
1. 🏭 Evaluación técnica por planta de los activos en estado MI.
2. 📋 Iniciar proceso de baja contable para activos con valor neto = 0.
3. 🔍 Cerrar cruce de faltantes antes del cierre contable del trimestre.
4. 📊 Presupuestar reposiciones según criticidad por línea de producción.`, tipo: 'texto' };
  }

  private respuestaGeneral(pregunta: string): { texto: string; tipo: MensajeChat['tipo'] } {
    const total = ACTIVOS_FIJOS.length;
    const conc = CONCILIACIONES_AF.filter(c => c.resultado === 'conciliado').length;
    const valorTotal = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);

    return { texto: `🤖 He analizado tu consulta: "${pregunta}"

**Resumen del sistema de Activos Fijos — EMPAFRUT:**
  • **${total.toLocaleString()}** activos físicos registrados
  • **${INVENTARIO_CONTABLE.length.toLocaleString()}** registros contables
  • **${conc.toLocaleString()}** conciliados (${total ? (conc/total*100).toFixed(0) : 0}% del total físico)
  • **Valor total adquisición:** S/ ${valorTotal.toLocaleString('es-PE', {maximumFractionDigits: 2})}
  • **Sedes:** ${SEDES.length} | **Ubicaciones:** ${UBICACIONES.length} | **Centros de costo:** ${CENTROS_COSTO.length}

💡 Puedo ayudarte con:
${this.preguntasSugeridas.slice(0, 5).map(p => `  • "${p}"`).join('\n')}

¿Qué aspecto de los activos fijos quieres analizar?`, tipo: 'texto' };
  }
}
