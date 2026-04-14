import { Injectable } from '@angular/core';
import { CONCILIACIONES, TRANSACCIONES_BANCARIAS, TRANSACCIONES_CONTABLES, DUPLICADOS_DETECTADOS, ERRORES_BD } from '../data/mock-data';
import { Conciliacion, ResumenConciliacion, DuplicadoDetectado, ErrorBD } from '../models/conciliacion.model';

@Injectable({ providedIn: 'root' })
export class ConciliacionService {

  getConciliaciones(): Conciliacion[] {
    return CONCILIACIONES;
  }

  getConciliacionesFiltradas(filtros: {
    estado?: string;
    banco?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    montoMin?: number;
    montoMax?: number;
  }): Conciliacion[] {
    let resultado = [...CONCILIACIONES];

    if (filtros.estado && filtros.estado !== 'todos') {
      resultado = resultado.filter(c => c.estado === filtros.estado);
    }
    if (filtros.banco && filtros.banco !== 'todos') {
      resultado = resultado.filter(c => c.transaccionBancaria?.banco === filtros.banco);
    }
    if (filtros.fechaDesde) {
      resultado = resultado.filter(c => (c.transaccionBancaria?.fecha ?? '') >= filtros.fechaDesde!);
    }
    if (filtros.fechaHasta) {
      resultado = resultado.filter(c => (c.transaccionBancaria?.fecha ?? '') <= filtros.fechaHasta!);
    }
    if (filtros.montoMin !== undefined) {
      resultado = resultado.filter(c => (c.transaccionBancaria?.monto ?? 0) >= filtros.montoMin!);
    }
    if (filtros.montoMax !== undefined) {
      resultado = resultado.filter(c => (c.transaccionBancaria?.monto ?? 0) <= filtros.montoMax!);
    }

    return resultado;
  }

  getResumen(): ResumenConciliacion {
    const conciliadas = CONCILIACIONES.filter(c => c.estado === 'conciliado').length;
    const pendientes = CONCILIACIONES.filter(c => c.estado === 'pendiente').length;
    const discrepancias = CONCILIACIONES.filter(c => c.estado === 'discrepancia').length;
    const montoTotalBanco = TRANSACCIONES_BANCARIAS.reduce((s, t) => s + t.monto, 0);
    const montoTotalContable = TRANSACCIONES_CONTABLES.reduce((s, t) => s + t.monto, 0);

    return {
      totalProcesadas: CONCILIACIONES.length,
      conciliadas,
      pendientes,
      discrepancias,
      porcentajeCoincidencia: Math.round((conciliadas / CONCILIACIONES.length) * 10000) / 100,
      montoTotalBanco: Math.round(montoTotalBanco * 100) / 100,
      montoTotalContable: Math.round(montoTotalContable * 100) / 100,
      diferenciaNeta: Math.round((montoTotalBanco - montoTotalContable) * 100) / 100,
    };
  }

  getDuplicados(): DuplicadoDetectado[] {
    return DUPLICADOS_DETECTADOS;
  }

  getErroresBD(): ErrorBD[] {
    return ERRORES_BD;
  }

  getBancos(): string[] {
    return [...new Set(TRANSACCIONES_BANCARIAS.map(t => t.banco))];
  }

  getConciliacionesPorMes(): { mes: string; conciliadas: number; discrepancias: number; pendientes: number }[] {
    const meses: Record<string, { conciliadas: number; discrepancias: number; pendientes: number }> = {};
    CONCILIACIONES.forEach(c => {
      const fecha = c.transaccionBancaria?.fecha ?? c.fechaConciliacion;
      const mes = fecha.substring(0, 7);
      if (!meses[mes]) meses[mes] = { conciliadas: 0, discrepancias: 0, pendientes: 0 };
      if (c.estado === 'conciliado') meses[mes].conciliadas++;
      else if (c.estado === 'discrepancia') meses[mes].discrepancias++;
      else meses[mes].pendientes++;
    });
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, data]) => ({ mes, ...data }));
  }

  getDiscrepanciasPorTipo(): { tipo: string; cantidad: number }[] {
    const tipos: Record<string, number> = {};
    CONCILIACIONES.filter(c => c.tipoDiscrepancia).forEach(c => {
      const t = c.tipoDiscrepancia!;
      tipos[t] = (tipos[t] || 0) + 1;
    });
    return Object.entries(tipos).map(([tipo, cantidad]) => ({ tipo, cantidad }));
  }
}
