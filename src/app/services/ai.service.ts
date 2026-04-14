import { Injectable } from '@angular/core';
import { ConciliacionService } from './conciliacion.service';
import { MensajeChat } from '../models/conciliacion.model';

@Injectable({ providedIn: 'root' })
export class AiService {

  constructor(private conciliacionService: ConciliacionService) {}

  readonly preguntasSugeridas = [
    '¿Cuántas equivocaciones en BD que no permitan correr más rápido?',
    'Prever y corregir la duplicidad de códigos',
    '¿Cuáles son las principales discrepancias de inventario?',
    '¿Qué productos tienen mayor riesgo de faltante?',
    'Resumen de conciliaciones del mes',
    '¿Qué patrones de error se repiten en almacén?',
    '¿Cuántos items están pendientes de conciliar?',
    '¿Qué almacenes tienen más discrepancias?',
    '¿Cuál es la diferencia de peso total físico vs sistema?',
    'Predicción de mermas para el próximo mes',
  ];

  procesarPregunta(pregunta: string): MensajeChat {
    const lower = pregunta.toLowerCase();
    let respuesta: { texto: string; datos?: any; tipo?: MensajeChat['tipo'] };

    if (lower.includes('equivocacion') || lower.includes('bd') || lower.includes('correr') || lower.includes('rápido') || lower.includes('rapido') || lower.includes('rendimiento') || lower.includes('base de datos')) {
      respuesta = this.analizarErroresBD();
    } else if (lower.includes('duplici') || lower.includes('duplicado') || lower.includes('código') || lower.includes('codigo')) {
      respuesta = this.analizarDuplicados();
    } else if (lower.includes('discrepancia') || lower.includes('principal') || lower.includes('diferencia')) {
      respuesta = this.analizarDiscrepancias();
    } else if (lower.includes('riesgo') || lower.includes('faltante') || lower.includes('merma')) {
      respuesta = this.analizarRiesgos();
    } else if (lower.includes('resumen') || lower.includes('mes')) {
      respuesta = this.generarResumenMes();
    } else if (lower.includes('patrón') || lower.includes('patron') || lower.includes('repite') || lower.includes('error')) {
      respuesta = this.analizarPatrones();
    } else if (lower.includes('pendiente')) {
      respuesta = this.analizarPendientes();
    } else if (lower.includes('almacén') || lower.includes('almacen')) {
      respuesta = this.analizarPorAlmacen();
    } else if (lower.includes('peso')) {
      respuesta = this.analizarPesos();
    } else if (lower.includes('predicción') || lower.includes('prediccion') || lower.includes('próximo') || lower.includes('proximo')) {
      respuesta = this.predecirErrores();
    } else {
      respuesta = this.respuestaGeneral(pregunta);
    }

    return {
      id: Math.random().toString(36).substring(2),
      texto: respuesta.texto,
      esUsuario: false,
      timestamp: new Date(),
      datos: respuesta.datos,
      tipo: respuesta.tipo || 'texto',
    };
  }

  private analizarErroresBD(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const errores = this.conciliacionService.getErroresBD();
    const altos = errores.filter(e => e.impacto === 'alto');
    const medios = errores.filter(e => e.impacto === 'medio');

    return {
      texto: `🔍 **Análisis de Errores en BD que Impactan el Rendimiento**

Se detectaron **${errores.length} problemas** en la base de datos del sistema de inventarios:

🔴 **${altos.length} errores de impacto ALTO:**
${altos.map(e => `  • **${e.tipo}** en \`${e.tabla}\`: ${e.descripcion}
    ➡️ Solución: \`${e.sugerencia}\``).join('\n')}

🟡 **${medios.length} errores de impacto MEDIO:**
${medios.map(e => `  • **${e.tipo}** en \`${e.tabla}\`: ${e.descripcion}`).join('\n')}

📊 **Impacto estimado en rendimiento del inventario:**
- El índice faltante en inventario_fisico causa **full table scan** en 120K+ registros, ralentizando búsquedas por código de producto
- El tipo VARCHAR en peso_kg genera **comparaciones erróneas** ("95.5" > "1000.0" = TRUE), creando falsos positivos en conciliación
- El LOCK TABLE durante conciliación batch **bloquea ingresos de almacén 15+ minutos**, deteniendo operaciones de planta
- La query N+1 en trazabilidad genera **501 queries** donde debería haber 1

💡 **Recomendación prioritaria:** Corregir primero ERR-001 (índice) y ERR-007 (lock de tabla) para mejorar velocidad de conciliación en **40-60%** y eliminar bloqueos en almacén.`,
      datos: errores,
      tipo: 'alerta',
    };
  }

  private analizarDuplicados(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const duplicados = this.conciliacionService.getDuplicados();
    const totalOcurrencias = duplicados.reduce((s, d) => s + d.ocurrencias, 0);

    return {
      texto: `🔄 **Análisis de Duplicidad de Códigos en Inventario**

Se detectaron **${duplicados.length} grupos de códigos duplicados** con un total de **${totalOcurrencias} registros afectados**:

${duplicados.map((d, i) => `**${i + 1}. \`${d.codigo}\` — ${d.nombreProducto}** (${d.ocurrencias} ocurrencias)
${d.registros.map(r => `   📦 ${r.id} | ${r.almacen} | Cant: ${r.cantidad} | Lote: ${r.lote}`).join('\n')}
   ✅ **Corrección:** ${d.sugerenciaCorreccion}`).join('\n\n')}

📋 **Plan de Corrección Automática:**
1. Generar snapshot de tablas inventario_fisico e inventario_sistema
2. Ejecutar script de deduplicación por (codigo, lote, almacen)
3. Consolidar cantidades donde corresponda
4. Agregar constraint UNIQUE(codigo_producto, lote, almacen_id) para prevenir futuros duplicados
5. Implementar validación en escáner de código de barras para detectar doble lectura

⚠️ **Riesgo:** Los duplicados distorsionan el stock real. Se estiman **${duplicados.reduce((s, d) => s + (d.registros.length > 1 ? d.registros[1].cantidad : 0), 0)} unidades fantasma** en el sistema que no existen físicamente.`,
      datos: duplicados,
      tipo: 'tabla',
    };
  }

  private analizarDiscrepancias(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    const porTipo = this.conciliacionService.getDiscrepanciasPorTipo();

    const etiquetas: Record<string, string> = {
      cantidad: 'Diferencia de Cantidad',
      peso: 'Diferencia de Peso',
      codigo_duplicado: 'Código Duplicado',
      sin_contrapartida: 'Sin Contrapartida',
      lote_incorrecto: 'Lote Incorrecto',
      ubicacion: 'Ubicación Errónea',
    };

    return {
      texto: `📊 **Análisis de Discrepancias de Inventario**

De **${resumen.totalProcesados}** items conciliados (inventario físico vs sistema):
- ✅ Conciliados: **${resumen.conciliados}** (${resumen.porcentajeCoincidencia}%)
- ⚠️ Discrepancias: **${resumen.discrepancias}**
- ⏳ Pendientes: **${resumen.pendientes}**

**Clasificación por tipo de discrepancia:**
${porTipo.map(t => `  • ${etiquetas[t.tipo] || t.tipo}: **${t.cantidad}** casos`).join('\n')}

**Diferencias acumuladas:**
- Peso físico total: **${resumen.pesoTotalFisicoKg.toLocaleString()} Kg**
- Peso en sistema: **${resumen.pesoTotalSistemaKg.toLocaleString()} Kg**
- Diferencia neta: **${Math.abs(resumen.diferenciaPesoKg).toLocaleString()} Kg** ${resumen.diferenciaPesoKg > 0 ? '(excedente físico)' : '(faltante físico)'}

💡 **Insights metalúrgicos:**
- La mayor causa es **diferencia de cantidad**, sugiriendo errores en conteo físico o despachos no registrados
- Las diferencias de peso en materias primas pueden deberse a **humedad, oxidación o merma natural** del material
- Los códigos duplicados provienen de **doble lectura de escáner** durante inventario físico`,
      datos: { resumen, porTipo },
      tipo: 'grafico',
    };
  }

  private analizarRiesgos(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const conciliaciones = this.conciliacionService.getConciliaciones();
    const riesgosas = conciliaciones
      .filter(c => c.estado === 'discrepancia' && c.diferenciaCantidad < 0)
      .sort((a, b) => a.diferenciaCantidad - b.diferenciaCantidad)
      .slice(0, 5);

    return {
      texto: `⚠️ **Productos con Mayor Riesgo de Faltante/Merma**

Los 5 productos con mayor diferencia negativa (sistema dice tener más de lo que hay físicamente):

${riesgosas.map((c, i) => `**${i + 1}.** \`${c.registroFisico?.producto.codigo}\` — ${c.registroFisico?.producto.nombre}
   📦 Físico: **${c.registroFisico?.cantidadFisica} ${c.registroFisico?.producto.unidadMedida}** | Sistema: **${c.registroSistema?.cantidadSistema} ${c.registroFisico?.producto.unidadMedida}**
   📉 Faltante: **${Math.abs(c.diferenciaCantidad)} ${c.registroFisico?.producto.unidadMedida}** | Almacén: ${c.registroFisico?.producto.almacen}
   🏷️ Lote: ${c.registroFisico?.lote}`).join('\n\n')}

🎯 **Causas probables en metalurgia:**
- **Merma de proceso:** Pérdida natural en fundición (escoria, volatilización)
- **Despachos no registrados:** Salidas urgentes a planta sin vale de salida
- **Error de pesaje:** Balanzas descalibradas en zona de carga
- **Robo/sustracción:** Revisar cámaras en almacenes con faltantes recurrentes

📌 **Acción recomendada:**
1. Recalibrar balanzas de Almacén Principal y Patio de Chatarra
2. Implementar doble validación en despachos > 100 Kg
3. Auditoría cruzada mensual por almacén`,
      datos: riesgosas,
      tipo: 'tabla',
    };
  }

  private generarResumenMes(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    const porMes = this.conciliacionService.getConciliacionesPorMes();

    return {
      texto: `📈 **Resumen de Conciliación de Inventarios — Período Ene-Abr 2026**

| Mes | Conciliados | Discrepancias | Pendientes |
|-----|-------------|---------------|------------|
${porMes.map(m => `| ${m.mes} | ${m.conciliados} | ${m.discrepancias} | ${m.pendientes} |`).join('\n')}

**Totales acumulados:**
- 📊 Items procesados: **${resumen.totalProcesados}**
- ⚖️ Peso total inventario físico: **${resumen.pesoTotalFisicoKg.toLocaleString()} Kg**
- 💻 Peso total en sistema: **${resumen.pesoTotalSistemaKg.toLocaleString()} Kg**
- 📉 Diferencia de peso neta: **${Math.abs(resumen.diferenciaPesoKg).toLocaleString()} Kg**
- ✅ Tasa de coincidencia: **${resumen.porcentajeCoincidencia}%**

📊 **Tendencia:** La tasa de conciliación se mantiene estable. Con la corrección de errores de BD identificados y la implementación de lectura por código de barras, se proyecta alcanzar **96%+** de coincidencia.

🏭 **Nota metalúrgica:** La merma natural aceptable en proceso de fundición es 2-3% en peso. Valores superiores requieren revisión de procedimientos.`,
      datos: { resumen, porMes },
      tipo: 'grafico',
    };
  }

  private analizarPatrones(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    return {
      texto: `🔁 **Patrones de Error Recurrentes en Inventario Metalúrgico**

**1. Diferencias de peso en materias primas** (35% de discrepancias)
   - Patrón: Peso físico < peso sistema en cobre y zinc
   - Causa: Merma por oxidación y humedad en almacenamiento prolongado
   - Solución: Aplicar factor de merma del 1.5% automático para MP almacenadas > 30 días

**2. Conteo incorrecto en productos terminados** (28% de discrepancias)
   - Patrón: Diferencias de ±5-15 unidades en tubos, barras y planchas
   - Causa: Conteo manual propenso a error en lotes grandes
   - Solución: Implementar conteo por peso (pesar lote completo / peso unitario)

**3. Duplicación de códigos en sistema** (18% de discrepancias)
   - Patrón: Mismo producto registrado 2-3 veces con lotes iguales
   - Causa: Doble lectura de escáner y re-importación de archivos Excel
   - Solución: Constraint UNIQUE + validación pre-insert + lock en proceso de carga

**4. Materiales sin contrapartida en sistema** (12% de discrepancias)
   - Patrón: Materiales encontrados físicamente sin registro digital
   - Causa: Ingresos urgentes de chatarra y materia prima sin documentación
   - Solución: App móvil para registro inmediato en punto de recepción

**5. Lotes cruzados entre almacenes** (7% de discrepancias)
   - Patrón: Transferencias internas sin actualizar sistema
   - Causa: Movimientos entre Almacén Fundición y Almacén PT sin vale
   - Solución: Registro obligatorio de transferencia con escáner en origen y destino

🤖 **Predicción:** Con estos patrones, se estima para mayo 2026: ~**6 discrepancias de peso**, ~**4 duplicados**, ~**3 sin contrapartida**, concentrados en la última semana del mes (cierre de inventario).`,
      tipo: 'texto',
    };
  }

  private analizarPendientes(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    const pendientes = this.conciliacionService.getConciliaciones().filter(c => c.estado === 'pendiente');

    return {
      texto: `⏳ **Items Pendientes de Conciliar**

Hay **${resumen.pendientes} items** encontrados en inventario físico sin registro en el sistema:

${pendientes.map(p => `  • \`${p.registroFisico?.producto.codigo}\` — ${p.registroFisico?.producto.nombre}
    📦 ${p.registroFisico?.cantidadFisica} ${p.registroFisico?.producto.unidadMedida} | ⚖️ ${p.registroFisico?.pesoKg} Kg
    📍 ${p.registroFisico?.ubicacion} | 🏭 ${p.registroFisico?.producto.almacen}`).join('\n')}

**Peso total pendiente:** ${pendientes.reduce((s, p) => s + (p.registroFisico?.pesoKg ?? 0), 0).toFixed(2)} Kg

💡 **Acciones recomendadas:**
1. Verificar si son ingresos recientes no procesados en sistema
2. Revisar guías de remisión de los últimos 5 días
3. Consultar con almacenero responsable sobre origen del material
4. Registrar en sistema con documento de regularización`,
      datos: pendientes,
      tipo: 'tabla',
    };
  }

  private analizarPorAlmacen(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const porAlmacen = this.conciliacionService.getDiscrepanciasPorAlmacen();

    return {
      texto: `🏭 **Análisis de Discrepancias por Almacén**

| Almacén | Total Items | Discrepancias | Tasa Error |
|---------|-------------|---------------|------------|
${porAlmacen.map(a => `| ${a.almacen} | ${a.total} | ${a.discrepancias} | ${a.total > 0 ? (a.discrepancias / a.total * 100).toFixed(1) : 0}% |`).join('\n')}

🔍 **Insight:** ${porAlmacen[0]?.almacen} presenta la mayor cantidad de discrepancias.

**Recomendaciones por almacén:**
- **Almacén Fundición:** Alto movimiento genera más errores. Implementar registro en tiempo real.
- **Patio de Chatarra:** Material a granel difícil de cuantificar. Usar pesaje con báscula de piso.
- **Bóveda Metales Preciosos:** Requiere doble conteo y verificación supervisada obligatoria.
- **Almacén PT:** Implementar FIFO estricto y etiquetado por lote de producción.`,
      datos: porAlmacen,
      tipo: 'tabla',
    };
  }

  private analizarPesos(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();

    return {
      texto: `⚖️ **Análisis de Diferencia de Peso — Físico vs Sistema**

**Peso total inventario físico:** ${resumen.pesoTotalFisicoKg.toLocaleString()} Kg
**Peso total en sistema:** ${resumen.pesoTotalSistemaKg.toLocaleString()} Kg
**Diferencia neta:** ${Math.abs(resumen.diferenciaPesoKg).toLocaleString()} Kg ${resumen.diferenciaPesoKg > 0 ? '(excedente físico — hay más material del que dice el sistema)' : '(faltante físico — el sistema dice que hay más de lo que realmente existe)'}

📊 **Desglose por causas:**
- Merma natural de proceso: ~1.5-2.5% (fundición, escoria, volatilización)
- Error de pesaje: ~0.3-0.5% (calibración de balanzas)
- Despachos no registrados: variable
- Humedad/oxidación en almacenamiento: ~0.5-1.0% en cobre y zinc

🏭 **Referencia metalúrgica:**
| Material | Merma aceptable | Merma detectada |
|----------|----------------|-----------------|
| Cobre | 1.5% | ~2.1% ⚠️ |
| Zinc | 2.0% | ~1.8% ✅ |
| Chatarra ferrosa | 3.0% | ~2.5% ✅ |
| Aluminio | 2.5% | ~3.2% ⚠️ |

💡 **Cobre y aluminio** muestran mermas por encima del rango aceptable. Revisar proceso de fundición y condiciones de almacenamiento.`,
      tipo: 'grafico',
    };
  }

  private predecirErrores(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    return {
      texto: `🔮 **Predicción de Discrepancias — Próximo Mes (Mayo 2026)**

Basándose en patrones de los últimos 3 meses de inventario:

**Discrepancias esperadas:**
- ⚖️ Diferencias de peso: **6-8 casos** (mayor riesgo en cobre y aluminio)
- 📦 Diferencias de cantidad: **8-12 casos** (pico en cierre mensual)
- 🔄 Duplicados de código: **3-4 casos** (días de inventario masivo)
- 🚫 Sin contrapartida: **2-4 casos** (ingresos no registrados)
- 🏷️ Lotes cruzados: **2-3 casos** (transferencias internas)

**Períodos de mayor riesgo:**
- 🔴 Última semana (cierre inventario): **55%** de errores
- 🟡 Días de recepción de materia prima (lunes/miércoles): **25%**
- 🟢 Resto del mes: **20%**

**Materiales con mayor riesgo:**
1. 🥇 Chatarra ferrosa — alta rotación, difícil medición exacta
2. 🥈 Cobre cátodos — merma por oxidación + alto valor
3. 🥉 Insumos de fundición — consumo irregular

**Acciones preventivas:**
1. 📱 Activar validación móvil para ingresos > 500 Kg
2. ⚖️ Calibrar balanzas antes del cierre mensual
3. 🔒 Constraint UNIQUE en BD para prevenir duplicados
4. 👥 Programar conteo cruzado con 2 personas para metales preciosos
5. 📊 Dashboard de alertas en tiempo real para diferencias > 2%

**Ahorro estimado:** Reducción del **45-60%** en discrepancias, equivalente a ~**8 horas/mes** de trabajo manual de ajuste y ~**S/ 12,000** en mermas no controladas.`,
      tipo: 'texto',
    };
  }

  private respuestaGeneral(pregunta: string): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    return {
      texto: `🤖 He analizado tu consulta: "${pregunta}"

Resumen actual del inventario metalúrgico:

- **${resumen.totalProcesados}** items conciliados (físico vs sistema)
- **${resumen.porcentajeCoincidencia}%** de tasa de coincidencia
- **${resumen.discrepancias}** discrepancias por resolver
- **${resumen.pendientes}** items pendientes de contrapartida
- ⚖️ Diferencia de peso neta: **${Math.abs(resumen.diferenciaPesoKg).toLocaleString()} Kg**

💡 Puedo ayudarte con análisis más específicos:
${this.preguntasSugeridas.slice(0, 5).map(p => `  • "${p}"`).join('\n')}

¿Qué aspecto del inventario te gustaría analizar?`,
      tipo: 'texto',
    };
  }
}
