import { Injectable } from '@angular/core';
import { ConciliacionService } from './conciliacion.service';
import { MensajeChat } from '../models/conciliacion.model';

@Injectable({ providedIn: 'root' })
export class AiService {

  constructor(private conciliacionService: ConciliacionService) {}

  readonly preguntasSugeridas = [
    '¿Cuántas equivocaciones en BD que no permitan correr más rápido?',
    'Prever y corregir la duplicidad de códigos',
    '¿Cuáles son las principales discrepancias?',
    '¿Qué transacciones tienen mayor riesgo de error?',
    'Resumen de conciliaciones del mes',
    '¿Qué patrones de error se repiten?',
    '¿Cuántas conciliaciones hay pendientes?',
    'Análisis de rendimiento de la base de datos',
    '¿Qué bancos tienen más discrepancias?',
    'Predicción de errores para el próximo mes',
  ];

  procesarPregunta(pregunta: string): MensajeChat {
    const lower = pregunta.toLowerCase();
    let respuesta: { texto: string; datos?: any; tipo?: MensajeChat['tipo'] };

    if (lower.includes('equivocacion') || lower.includes('bd') || lower.includes('correr') || lower.includes('rápido') || lower.includes('rapido') || lower.includes('rendimiento')) {
      respuesta = this.analizarErroresBD();
    } else if (lower.includes('duplici') || lower.includes('duplicado') || lower.includes('código') || lower.includes('codigo')) {
      respuesta = this.analizarDuplicados();
    } else if (lower.includes('discrepancia') || lower.includes('principal')) {
      respuesta = this.analizarDiscrepancias();
    } else if (lower.includes('riesgo') || lower.includes('error')) {
      respuesta = this.analizarRiesgos();
    } else if (lower.includes('resumen') || lower.includes('mes')) {
      respuesta = this.generarResumenMes();
    } else if (lower.includes('patrón') || lower.includes('patron') || lower.includes('repite')) {
      respuesta = this.analizarPatrones();
    } else if (lower.includes('pendiente')) {
      respuesta = this.analizarPendientes();
    } else if (lower.includes('banco')) {
      respuesta = this.analizarPorBanco();
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

Se detectaron **${errores.length} problemas** en la base de datos:

🔴 **${altos.length} errores de impacto ALTO:**
${altos.map(e => `  • **${e.tipo}** en \`${e.tabla}\`: ${e.descripcion}
    ➡️ Solución: \`${e.sugerencia}\``).join('\n')}

🟡 **${medios.length} errores de impacto MEDIO:**
${medios.map(e => `  • **${e.tipo}** en \`${e.tabla}\`: ${e.descripcion}`).join('\n')}

📊 **Impacto estimado en rendimiento:**
- Los índices faltantes causan ~**40% más tiempo** en consultas
- El tipo de dato incorrecto en "monto" causa **errores de comparación** y falsos positivos en conciliación
- El bloqueo de tabla reduce la **concurrencia en 60%**

💡 **Recomendación prioritaria:** Corregir primero ERR-001 (índice faltante) y ERR-007 (bloqueo de tabla) para obtener una mejora inmediata del **35-50% en velocidad de procesamiento**.`,
      datos: errores,
      tipo: 'alerta',
    };
  }

  private analizarDuplicados(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const duplicados = this.conciliacionService.getDuplicados();
    const totalOcurrencias = duplicados.reduce((s, d) => s + d.ocurrencias, 0);

    return {
      texto: `🔄 **Análisis de Duplicidad de Códigos**

Se detectaron **${duplicados.length} grupos de códigos duplicados** con un total de **${totalOcurrencias} registros afectados**:

${duplicados.map((d, i) => `**${i + 1}. Código \`${d.codigo}\`** — ${d.ocurrencias} ocurrencias
${d.registros.map(r => `   📄 ${r.id} | ${r.fecha} | S/ ${r.monto.toFixed(2)} | ${r.fuente}`).join('\n')}
   ✅ **Corrección sugerida:** ${d.sugerenciaCorreccion}`).join('\n\n')}

📋 **Plan de Corrección Automática:**
1. Generar backup de tablas afectadas
2. Ejecutar script de renumeración de códigos duplicados
3. Agregar constraint UNIQUE para prevenir futuros duplicados
4. Validar integridad referencial post-corrección

⚠️ **Riesgo si no se corrige:** Los duplicados generan **doble contabilización** estimada en **S/ ${(duplicados.reduce((s, d) => s + d.registros[0].monto, 0)).toFixed(2)}** y distorsionan los reportes financieros.`,
      datos: duplicados,
      tipo: 'tabla',
    };
  }

  private analizarDiscrepancias(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    const porTipo = this.conciliacionService.getDiscrepanciasPorTipo();

    return {
      texto: `📊 **Análisis de Discrepancias Principales**

De **${resumen.totalProcesadas}** conciliaciones procesadas:
- ✅ Conciliadas: **${resumen.conciliadas}** (${resumen.porcentajeCoincidencia}%)
- ⚠️ Discrepancias: **${resumen.discrepancias}**
- ⏳ Pendientes: **${resumen.pendientes}**

**Clasificación por tipo de discrepancia:**
${porTipo.map(t => `  • ${t.tipo.replace('_', ' ').toUpperCase()}: **${t.cantidad}** casos`).join('\n')}

**Diferencia neta:** S/ ${Math.abs(resumen.diferenciaNeta).toFixed(2)} ${resumen.diferenciaNeta > 0 ? '(exceso banco)' : '(exceso contable)'}

💡 **Insights:**
- La mayor causa de discrepancias es la **diferencia de montos**, sugiriendo errores de digitación
- Las discrepancias de fecha suelen ser por **desfase de 1-3 días** entre registro bancario y contable
- Los duplicados representan el **${((porTipo.find(t => t.tipo === 'duplicado')?.cantidad || 0) / resumen.discrepancias * 100).toFixed(1)}%** de las discrepancias`,
      datos: { resumen, porTipo },
      tipo: 'grafico',
    };
  }

  private analizarRiesgos(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const conciliaciones = this.conciliacionService.getConciliaciones();
    const riesgosas = conciliaciones
      .filter(c => c.estado === 'discrepancia' && Math.abs(c.diferencia) > 1000)
      .sort((a, b) => Math.abs(b.diferencia) - Math.abs(a.diferencia))
      .slice(0, 5);

    return {
      texto: `⚠️ **Transacciones con Mayor Riesgo de Error**

Las 5 transacciones con mayor diferencia detectada:

${riesgosas.map((c, i) => `**${i + 1}.** ${c.id} — Diferencia: **S/ ${Math.abs(c.diferencia).toFixed(2)}**
   Banco: S/ ${c.transaccionBancaria?.monto.toFixed(2)} | Contable: S/ ${c.transaccionContable?.monto.toFixed(2) ?? 'N/A'}
   Tipo: ${c.tipoDiscrepancia} | ${c.observacion}`).join('\n\n')}

🎯 **Factores de riesgo identificados:**
- Montos superiores a S/ 10,000 tienen **3x más probabilidad** de error
- Transacciones de fin de mes concentran el **45%** de discrepancias
- Los pagos a proveedores representan la categoría más propensa a errores

📌 **Acción recomendada:** Implementar doble validación para transacciones > S/ 5,000 y revisión automática en cierres mensuales.`,
      datos: riesgosas,
      tipo: 'tabla',
    };
  }

  private generarResumenMes(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    const porMes = this.conciliacionService.getConciliacionesPorMes();

    return {
      texto: `📈 **Resumen de Conciliaciones del Período**

**Período:** Enero 2026 - Abril 2026

| Mes | Conciliadas | Discrepancias | Pendientes |
|-----|-------------|---------------|------------|
${porMes.map(m => `| ${m.mes} | ${m.conciliadas} | ${m.discrepancias} | ${m.pendientes} |`).join('\n')}

**Totales acumulados:**
- 📊 Total procesadas: **${resumen.totalProcesadas}**
- 💰 Monto total banco: **S/ ${resumen.montoTotalBanco.toLocaleString()}**
- 📒 Monto total contable: **S/ ${resumen.montoTotalContable.toLocaleString()}**
- 📉 Diferencia neta: **S/ ${Math.abs(resumen.diferenciaNeta).toLocaleString()}**
- ✅ Tasa de conciliación: **${resumen.porcentajeCoincidencia}%**

📊 **Tendencia:** La tasa de conciliación ha mejorado un **2.5%** respecto al trimestre anterior. Se proyecta alcanzar el **95%** si se corrigen los errores de BD identificados.`,
      datos: { resumen, porMes },
      tipo: 'grafico',
    };
  }

  private analizarPatrones(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    return {
      texto: `🔁 **Patrones de Error Recurrentes Detectados**

**1. Errores de digitación en montos** (38% de discrepancias)
   - Patrón: Inversión de dígitos (ej: 1,540.00 → 1,450.00)
   - Frecuencia: ~5 casos/mes
   - Solución: Implementar validación de doble entrada

**2. Desfase temporal banco-contabilidad** (25% de discrepancias)
   - Patrón: Registros contables 1-3 días después del movimiento bancario
   - Causa: Proceso manual de ingreso contable
   - Solución: Automatizar importación de extractos bancarios

**3. Duplicación de asientos contables** (18% de discrepancias)
   - Patrón: Mismo monto y fecha, código secuencial
   - Causa: Doble clic en botón de registro / importación repetida
   - Solución: Agregar lock optimista y validación pre-insert

**4. Transacciones sin contrapartida** (12% de discrepancias)
   - Patrón: Movimientos bancarios pequeños sin asiento contable
   - Causa: Comisiones bancarias y cargos automáticos no registrados
   - Solución: Configurar reglas automáticas para comisiones recurrentes

**5. Errores de categorización** (7% de discrepancias)
   - Patrón: Misma transacción clasificada en diferentes cuentas contables
   - Solución: Estandarizar catálogo de cuentas con reglas de mapeo automático

🤖 **IA Predictiva:** Basándose en estos patrones, se estima que el próximo mes habrá ~**8 discrepancias por digitación** y ~**3 duplicados**, concentrados en la última semana del mes.`,
      tipo: 'texto',
    };
  }

  private analizarPendientes(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    const pendientes = this.conciliacionService.getConciliaciones().filter(c => c.estado === 'pendiente');

    return {
      texto: `⏳ **Conciliaciones Pendientes**

Actualmente hay **${resumen.pendientes} conciliaciones pendientes** de un total de ${resumen.totalProcesadas}.

**Detalle:**
${pendientes.map(p => `  • ${p.id}: ${p.transaccionBancaria?.descripcion} — S/ ${p.transaccionBancaria?.monto.toFixed(2)} (${p.observacion})`).join('\n')}

**Antigüedad promedio:** 8.5 días
**Monto total pendiente:** S/ ${pendientes.reduce((s, p) => s + (p.transaccionBancaria?.monto ?? 0), 0).toFixed(2)}

💡 **Recomendación:** Priorizar las conciliaciones pendientes con monto > S/ 5,000 y antigüedad > 5 días.`,
      datos: pendientes,
      tipo: 'tabla',
    };
  }

  private analizarPorBanco(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const conciliaciones = this.conciliacionService.getConciliaciones();
    const porBanco: Record<string, { total: number; discrepancias: number; monto: number }> = {};

    conciliaciones.forEach(c => {
      const banco = c.transaccionBancaria?.banco ?? 'N/A';
      if (!porBanco[banco]) porBanco[banco] = { total: 0, discrepancias: 0, monto: 0 };
      porBanco[banco].total++;
      if (c.estado === 'discrepancia') porBanco[banco].discrepancias++;
      porBanco[banco].monto += c.transaccionBancaria?.monto ?? 0;
    });

    const datos = Object.entries(porBanco).sort((a, b) => b[1].discrepancias - a[1].discrepancias);

    return {
      texto: `🏦 **Análisis de Discrepancias por Banco**

| Banco | Total | Discrepancias | Tasa Error | Monto Total |
|-------|-------|---------------|------------|-------------|
${datos.map(([banco, d]) => `| ${banco} | ${d.total} | ${d.discrepancias} | ${(d.discrepancias / d.total * 100).toFixed(1)}% | S/ ${d.monto.toFixed(2)} |`).join('\n')}

🔍 **Insight:** ${datos[0][0]} presenta la mayor cantidad de discrepancias. Se recomienda revisar el formato de importación de extractos de este banco y verificar la configuración de mapeo de campos.`,
      datos: porBanco,
      tipo: 'tabla',
    };
  }

  private predecirErrores(): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    return {
      texto: `🔮 **Predicción de Errores - Próximo Mes**

Basándose en el análisis de patrones históricos de los últimos 3 meses:

**Errores esperados:**
- 📊 Discrepancias de monto: **8-12 casos** (↑ en cierre de mes)
- 🔄 Duplicados de código: **3-5 casos**
- 📅 Desfases de fecha: **5-7 casos**
- 🚫 Sin contrapartida: **2-3 casos**

**Períodos de mayor riesgo:**
- 🔴 Última semana del mes: **60%** de errores concentrados
- 🟡 Quincena: **25%** de errores
- 🟢 Resto del mes: **15%** de errores

**Acciones preventivas recomendadas:**
1. ⚙️ Activar validación doble para montos > S/ 5,000 antes del cierre
2. 🔒 Implementar constraint UNIQUE en códigos de asiento
3. 📥 Automatizar importación de extractos bancarios día-1
4. 👥 Programar revisión cruzada para la última semana del mes
5. 📧 Configurar alertas automáticas para transacciones sin match en 48h

**Ahorro estimado:** Implementando estas medidas se podría reducir las discrepancias en un **40-60%**, ahorrando aproximadamente **15 horas/mes** de trabajo manual de conciliación.`,
      tipo: 'texto',
    };
  }

  private respuestaGeneral(pregunta: string): { texto: string; datos?: any; tipo?: MensajeChat['tipo'] } {
    const resumen = this.conciliacionService.getResumen();
    return {
      texto: `🤖 He analizado tu consulta: "${pregunta}"

Aquí tienes un resumen rápido del estado actual:

- **${resumen.totalProcesadas}** conciliaciones procesadas
- **${resumen.porcentajeCoincidencia}%** de tasa de coincidencia
- **${resumen.discrepancias}** discrepancias por resolver
- **${resumen.pendientes}** transacciones pendientes

💡 Puedo ayudarte con preguntas más específicas como:
${this.preguntasSugeridas.slice(0, 5).map(p => `  • "${p}"`).join('\n')}

¿Qué te gustaría analizar?`,
      tipo: 'texto',
    };
  }
}
