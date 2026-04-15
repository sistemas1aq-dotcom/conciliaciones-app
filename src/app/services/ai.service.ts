import { Injectable } from '@angular/core';
import { MensajeChat } from '../models/activo-fijo.model';
import { ACTIVOS_FIJOS, INVENTARIO_CONTABLE, CONCILIACIONES_AF, ESTADOS_CONSERVACION } from '../data/mock-activos';

@Injectable({ providedIn: 'root' })
export class AiService {

  readonly preguntasSugeridas = [
    '¿Cuántas equivocaciones en BD que no permitan correr más rápido?',
    'Prever y corregir la duplicidad de códigos',
    '¿Cuántos activos fijos tiene la empresa?',
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
    return { texto: `🔍 **Análisis de Errores en BD - Sistema de Activos Fijos**

Se detectaron **8 problemas** que impactan el rendimiento:

🔴 **4 errores de impacto ALTO:**
  • **Índice faltante** en \`inventario_fisico\`: Sin índice en "codigo_barra". Búsquedas por código de barras hacen full table scan sobre 50K+ registros.
    ➡️ \`CREATE INDEX idx_inv_codigo_barra ON inventario_fisico(codigo_barra);\`

  • **Sin constraint UNIQUE** en \`activos_fijos\`: El campo BAR_NUE no tiene restricción de unicidad, permitiendo códigos de barra duplicados.
    ➡️ \`ALTER TABLE activos_fijos ADD CONSTRAINT uq_bar_nue UNIQUE(bar_nue);\`

  • **Tipo VARCHAR en valor_contable**: Comparaciones numéricas fallan. "9500.00" > "85000.00" devuelve TRUE.
    ➡️ \`ALTER TABLE inventario_contable ALTER COLUMN val_cont TYPE DECIMAL(15,2);\`

  • **LOCK TABLE en conciliación**: El proceso batch bloquea la tabla 20+ minutos durante conciliación masiva.
    ➡️ \`Migrar a SELECT FOR UPDATE SKIP LOCKED y procesar por lotes de 500.\`

🟡 **4 errores de impacto MEDIO:**
  • Tabla \`movimientos_activo\` sin particionar (3M+ registros)
  • Query N+1 en reporte de depreciación (1 query por activo)
  • 42 registros referencian ubicaciones eliminadas
  • Encoding mixto en descripciones de catálogo

💡 **Impacto estimado:** Corregir los 4 errores críticos mejoraría el rendimiento de consultas en **45-65%** y eliminaría bloqueos durante inventario.`, tipo: 'alerta' };
  }

  private analizarDuplicados(): { texto: string; tipo: MensajeChat['tipo'] } {
    const activos = ACTIVOS_FIJOS;
    const codigos = activos.map(a => a.barNue);
    const duplicados = codigos.filter((c, i) => codigos.indexOf(c) !== i);

    return { texto: `🔄 **Análisis de Duplicidad de Códigos en Activos Fijos**

Se analizaron **${activos.length} activos** registrados en el sistema:

${duplicados.length === 0 ? '✅ **No se encontraron códigos de barra duplicados** en la base actual.\n\nSin embargo, se detectaron **posibles duplicados por descripción similar:**' : `⚠️ Se encontraron **${duplicados.length} códigos duplicados**:`}

**1.** Descripción "Laptop Dell Latitude 5540" aparece con variantes:
   - AF-000001 (Oficina Gerencia) y potencial duplicado con diferente código empresa
   ✅ **Corrección:** Consolidar bajo un único BAR_NUE

**2.** "Extintor PQS 12 Kg" registrado en múltiples ubicaciones con código genérico
   - Cada unidad física debe tener código único
   ✅ **Corrección:** Asignar código individual por unidad

**3.** Series S/N repetidas en equipos marca "Nacional"
   - 5 activos tienen serie vacía o genérica
   ✅ **Corrección:** Asignar serie ficticia incremental NAC-0001, NAC-0002...

📋 **Plan de Corrección:**
1. Agregar UNIQUE constraint en BAR_NUE
2. Implementar validación pre-registro de código de barras
3. Script de detección de duplicados por (descripción + serie + ubicación)
4. Alerta automática al intentar registrar código existente

⚠️ **Riesgo:** Los duplicados causan **doble contabilización** y distorsionan el valor patrimonial en reportes financieros.`, tipo: 'tabla' };
  }

  private resumenActivos(): { texto: string; tipo: MensajeChat['tipo'] } {
    const total = ACTIVOS_FIJOS.length;
    const porEstado: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porEstado[a.estadoConservacion] = (porEstado[a.estadoConservacion] || 0) + 1; });
    const valorTotal = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);

    return { texto: `📊 **Resumen de Activos Fijos de la Empresa**

La empresa cuenta con **${total} activos fijos** registrados:

**Por estado de conservación:**
${Object.entries(porEstado).map(([est, cant]) => {
  const desc = ESTADOS_CONSERVACION.find(e => e.codigo === est)?.descripcion || est;
  return `  • ${desc}: **${cant}** (${(cant/total*100).toFixed(1)}%)`;
}).join('\n')}

**Por ubicación principal:**
  • Planta Principal - Callao: **12 activos** (maquinaria, hornos, compresores)
  • Oficina Administrativa: **10 activos** (cómputo, mobiliario, servidores)
  • Almacén Central: **6 activos** (montacargas, cámaras, equipos despacho)
  • Planta Fundición: **4 activos** (puente grúa, moldes)
  • Laboratorio: **4 activos** (espectrómetro, durómetro, balanza, microscopio)

**Valor total de adquisición:** S/ ${valorTotal.toLocaleString()}
**Activos por categoría:** Maquinaria (35%), Equipos cómputo (20%), Mobiliario (15%), Vehículos (12%), Lab (10%), Otros (8%)`, tipo: 'grafico' };
  }

  private analizarFaltantes(): { texto: string; tipo: MensajeChat['tipo'] } {
    const faltantes = CONCILIACIONES_AF.filter(c => c.resultado === 'faltante');
    const sobrantes = CONCILIACIONES_AF.filter(c => c.resultado === 'sobrante');

    return { texto: `⚠️ **Activos Faltantes y Sobrantes en Inventario**

🔴 **${faltantes.length} activos FALTANTES** (en contabilidad pero no encontrados físicamente):
${faltantes.map(f => `  • \`${f.barNue}\` — ${f.descripcion}
    📍 Ubicación contable: ${f.ubicacionContable} | Valor: S/ ${f.valorContable.toLocaleString()}`).join('\n')}

🟡 **${sobrantes.length} activos SOBRANTES** (encontrados físicamente sin registro contable):
${sobrantes.slice(0, 3).map(s => `  • \`${s.barNue}\` — ${s.descripcion}
    📍 Ubicación física: ${s.ubicacionFisica}`).join('\n')}
  ${sobrantes.length > 3 ? `• ... y ${sobrantes.length - 3} más` : ''}

💡 **Acciones recomendadas:**
1. **Faltantes:** Verificar si fueron trasladados, dados de baja sin registro, o sustraídos
2. **Sobrantes:** Regularizar altas contables para los activos encontrados
3. Notificar a Contabilidad para ajustes patrimoniales
4. Revisar cámaras de seguridad en ubicaciones de faltantes`, tipo: 'alerta' };
  }

  private analizarDepreciacion(): { texto: string; tipo: MensajeChat['tipo'] } {
    const sorted = [...INVENTARIO_CONTABLE].sort((a, b) => b.depreciacionAcumulada - a.depreciacionAcumulada);
    const top5 = sorted.slice(0, 5);
    const totalDep = INVENTARIO_CONTABLE.reduce((s, i) => s + i.depreciacionAcumulada, 0);
    const totalValor = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);

    return { texto: `📉 **Análisis de Depreciación de Activos Fijos**

**Top 5 activos con mayor depreciación acumulada:**
${top5.map((a, i) => `**${i+1}.** ${a.descripcion}
   Valor adquisición: S/ ${a.valorAdquisicion.toLocaleString()} | Dep. acumulada: S/ ${a.depreciacionAcumulada.toLocaleString()}
   Valor neto: **S/ ${a.valorNeto.toLocaleString()}** | Vida útil: ${a.vidaUtil} años`).join('\n\n')}

**Totales:**
  • Valor total adquisición: **S/ ${totalValor.toLocaleString()}**
  • Depreciación acumulada: **S/ ${totalDep.toLocaleString()}**
  • Valor neto total: **S/ ${(totalValor - totalDep).toLocaleString()}**
  • % depreciado: **${(totalDep / totalValor * 100).toFixed(1)}%**

💡 **Activos próximos a depreciación total:** 3 laptops y 1 impresora completarán su vida útil en 2028.`, tipo: 'tabla' };
  }

  private resumenConciliacion(): { texto: string; tipo: MensajeChat['tipo'] } {
    const conc = CONCILIACIONES_AF;
    const ok = conc.filter(c => c.resultado === 'conciliado').length;
    const sob = conc.filter(c => c.resultado === 'sobrante').length;
    const fal = conc.filter(c => c.resultado === 'faltante').length;
    const disc = conc.filter(c => c.resultado === 'discrepancia').length;

    return { texto: `📋 **Resumen de Conciliación — Inventario Físico vs Contable**

De **${conc.length}** activos procesados:
  • ✅ Conciliados: **${ok}** (${(ok/conc.length*100).toFixed(1)}%)
  • ⚠️ Discrepancias: **${disc}** (ubicación o estado difiere)
  • 🟡 Sobrantes: **${sob}** (en físico, no en contable)
  • 🔴 Faltantes: **${fal}** (en contable, no en físico)

**Discrepancias más comunes:**
  • Ubicación física ≠ ubicación contable: **${Math.floor(disc * 0.5)}** casos
  • Estado conservación difiere: **${Math.ceil(disc * 0.3)}** casos
  • Traslado sin registro: **${Math.ceil(disc * 0.2)}** casos

**Tasa de conciliación:** ${(ok/conc.length*100).toFixed(1)}%
**Meta:** ≥ 95%

💡 Corrigiendo las discrepancias de ubicación (actualizar traslados en sistema) se alcanzaría **${((ok + Math.floor(disc*0.5))/conc.length*100).toFixed(1)}%**.`, tipo: 'grafico' };
  }

  private analizarEstados(): { texto: string; tipo: MensajeChat['tipo'] } {
    const porEstado: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porEstado[a.estadoConservacion] = (porEstado[a.estadoConservacion] || 0) + 1; });
    const malos = (porEstado['MA'] || 0) + (porEstado['AV'] || 0) + (porEstado['BA'] || 0);

    return { texto: `🔧 **Estado de Conservación de Activos Fijos**

| Estado | Cantidad | % |
|--------|----------|---|
${Object.entries(porEstado).map(([est, cant]) => {
  const desc = ESTADOS_CONSERVACION.find(e => e.codigo === est)?.descripcion || est;
  return `| ${desc} | ${cant} | ${(cant/ACTIVOS_FIJOS.length*100).toFixed(1)}% |`;
}).join('\n')}

⚠️ **${malos} activos** en estado crítico (Malo/Averiado/Baja).

💡 **Recomendaciones:**
  • Programar mantenimiento preventivo para activos en estado "Regular"
  • Evaluar baja contable para activos en estado "Malo" con valor neto = 0
  • Los activos "Averiados" de maquinaria requieren evaluación técnica urgente
  • Actualizar estado en sistema después de cada mantenimiento`, tipo: 'tabla' };
  }

  private analizarUbicaciones(): { texto: string; tipo: MensajeChat['tipo'] } {
    const porUbic: Record<string, number> = {};
    ACTIVOS_FIJOS.forEach(a => { porUbic[a.ubicacion] = (porUbic[a.ubicacion] || 0) + 1; });
    const sorted = Object.entries(porUbic).sort((a, b) => b[1] - a[1]);

    return { texto: `📍 **Distribución de Activos por Ubicación**

| Ubicación | Activos |
|-----------|---------|
${sorted.map(([ub, cant]) => `| ${ub} | ${cant} |`).join('\n')}

**Total ubicaciones con activos:** ${sorted.length}

🏭 Las ubicaciones productivas (Hornos, Taller, Fundición) concentran el **${(sorted.filter(([u]) => u.includes('Horno') || u.includes('Taller') || u.includes('Fundición')).reduce((s, [,c]) => s+c, 0) / ACTIVOS_FIJOS.length * 100).toFixed(0)}%** de activos y el mayor valor patrimonial.`, tipo: 'tabla' };
  }

  private analizarValores(): { texto: string; tipo: MensajeChat['tipo'] } {
    const totalAdq = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);
    const totalDep = INVENTARIO_CONTABLE.reduce((s, i) => s + i.depreciacionAcumulada, 0);
    const totalNeto = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorNeto, 0);

    return { texto: `💰 **Valor Patrimonial de Activos Fijos**

  • **Valor total de adquisición:** S/ ${totalAdq.toLocaleString()}
  • **Depreciación acumulada:** S/ ${totalDep.toLocaleString()}
  • **Valor neto en libros:** S/ ${totalNeto.toLocaleString()}
  • **% depreciado:** ${(totalDep/totalAdq*100).toFixed(1)}%

**Por categoría (valor adquisición):**
  • Maquinaria y hornos: ~S/ ${(185000+320000+95000+75000+250000).toLocaleString()} (mayor concentración)
  • Vehículos y transporte: ~S/ ${(65000+72000+450000+120000).toLocaleString()}
  • Equipos de laboratorio: ~S/ ${(95000+38000+12000+48000).toLocaleString()}
  • Equipos de cómputo: ~S/ ${(3500+2800+1200+2500+28000+4500+3800+4500+6800).toLocaleString()}
  • Mobiliario: ~S/ ${(1800+950+680+3200).toLocaleString()}

📊 Los activos de **maquinaria pesada** representan más del **60%** del valor patrimonial total.`, tipo: 'grafico' };
  }

  private predecirBajas(): { texto: string; tipo: MensajeChat['tipo'] } {
    return { texto: `🔮 **Predicción de Bajas de Activos — Próximo Trimestre**

Basándose en vida útil, estado de conservación y depreciación:

**Activos candidatos a baja:**
  • 🔴 **3 equipos de cómputo** — Depreciación > 90%, vida útil cumplida en 2028
  • 🔴 **1 impresora** — Estado "Regular", 4+ años de uso, reparaciones frecuentes
  • 🟡 **2 mobiliarios** — Estado "Regular", valor neto bajo

**Estimación de impacto contable:**
  • Valor neto total a dar de baja: ~S/ 2,500
  • Ahorro en mantenimiento: ~S/ 1,200/año
  • Inversión reposición: ~S/ 15,000

**Recomendaciones:**
1. 💻 Programa de renovación tecnológica para laptops > 4 años
2. 🏭 Evaluación técnica de fresadora (estado Regular, alto costo reposición)
3. 📋 Iniciar proceso de baja contable para activos con valor neto = 0
4. 📊 Presupuestar reposiciones en plan anual 2027

**Activos a monitorear:** El Horno 1 (ABB IF-500E) tiene 15+ años. Si bien su estado es "Operativo", considerar evaluación de eficiencia energética.`, tipo: 'texto' };
  }

  private respuestaGeneral(pregunta: string): { texto: string; tipo: MensajeChat['tipo'] } {
    const total = ACTIVOS_FIJOS.length;
    const conc = CONCILIACIONES_AF.filter(c => c.resultado === 'conciliado').length;
    const valorTotal = INVENTARIO_CONTABLE.reduce((s, i) => s + i.valorAdquisicion, 0);

    return { texto: `🤖 He analizado tu consulta: "${pregunta}"

**Resumen del sistema de Activos Fijos:**
  • **${total}** activos registrados
  • **${conc}** conciliados (${(conc/total*100).toFixed(0)}% del total)
  • **Valor total:** S/ ${valorTotal.toLocaleString()}
  • **Sedes:** 5 | **Ubicaciones:** 12 | **Centros de costo:** 10

💡 Puedo ayudarte con:
${this.preguntasSugeridas.slice(0, 5).map(p => `  • "${p}"`).join('\n')}

¿Qué aspecto de los activos fijos quieres analizar?`, tipo: 'texto' };
  }
}
