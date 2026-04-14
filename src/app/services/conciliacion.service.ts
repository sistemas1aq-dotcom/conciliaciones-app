import { Injectable } from '@angular/core';
import { CONCILIACIONES, REGISTROS_FISICOS, REGISTROS_SISTEMA, DUPLICADOS_DETECTADOS, ERRORES_BD } from '../data/mock-data';
import { Conciliacion, ResumenConciliacion, DuplicadoDetectado, ErrorBD } from '../models/conciliacion.model';

@Injectable({ providedIn: 'root' })
export class ConciliacionService {

  getConciliaciones(): Conciliacion[] {
    return CONCILIACIONES;
  }

  getConciliacionesFiltradas(filtros: {
    estado?: string;
    almacen?: string;
    categoria?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Conciliacion[] {
    let resultado = [...CONCILIACIONES];

    if (filtros.estado && filtros.estado !== 'todos') {
      resultado = resultado.filter(c => c.estado === filtros.estado);
    }
    if (filtros.almacen && filtros.almacen !== 'todos') {
      resultado = resultado.filter(c => c.registroFisico?.producto.almacen === filtros.almacen);
    }
    if (filtros.categoria && filtros.categoria !== 'todos') {
      resultado = resultado.filter(c => c.registroFisico?.producto.categoria === filtros.categoria);
    }
    if (filtros.fechaDesde) {
      resultado = resultado.filter(c => (c.registroFisico?.fecha ?? '') >= filtros.fechaDesde!);
    }
    if (filtros.fechaHasta) {
      resultado = resultado.filter(c => (c.registroFisico?.fecha ?? '') <= filtros.fechaHasta!);
    }

    return resultado;
  }

  getResumen(): ResumenConciliacion {
    const conciliados = CONCILIACIONES.filter(c => c.estado === 'conciliado').length;
    const pendientes = CONCILIACIONES.filter(c => c.estado === 'pendiente').length;
    const discrepancias = CONCILIACIONES.filter(c => c.estado === 'discrepancia').length;
    const totalItemsFisico = REGISTROS_FISICOS.reduce((s, r) => s + r.cantidadFisica, 0);
    const totalItemsSistema = REGISTROS_SISTEMA.reduce((s, r) => s + r.cantidadSistema, 0);
    const pesoFisico = REGISTROS_FISICOS.reduce((s, r) => s + r.pesoKg, 0);
    const pesoSistema = REGISTROS_SISTEMA.reduce((s, r) => s + r.pesoKg, 0);

    return {
      totalProcesados: CONCILIACIONES.length,
      conciliados,
      pendientes,
      discrepancias,
      porcentajeCoincidencia: Math.round((conciliados / CONCILIACIONES.length) * 10000) / 100,
      totalItemsFisico: Math.round(totalItemsFisico * 100) / 100,
      totalItemsSistema: Math.round(totalItemsSistema * 100) / 100,
      pesoTotalFisicoKg: Math.round(pesoFisico * 100) / 100,
      pesoTotalSistemaKg: Math.round(pesoSistema * 100) / 100,
      diferenciaPesoKg: Math.round((pesoFisico - pesoSistema) * 100) / 100,
    };
  }

  getDuplicados(): DuplicadoDetectado[] {
    return DUPLICADOS_DETECTADOS;
  }

  getErroresBD(): ErrorBD[] {
    return ERRORES_BD;
  }

  getAlmacenes(): string[] {
    return [...new Set(REGISTROS_FISICOS.map(r => r.producto.almacen))];
  }

  getCategorias(): { value: string; label: string }[] {
    return [
      { value: 'materia_prima', label: 'Materia Prima' },
      { value: 'producto_terminado', label: 'Producto Terminado' },
      { value: 'aleacion', label: 'Aleación' },
      { value: 'insumo', label: 'Insumo' },
      { value: 'repuesto', label: 'Repuesto' },
    ];
  }

  getConciliacionesPorMes(): { mes: string; conciliados: number; discrepancias: number; pendientes: number }[] {
    const meses: Record<string, { conciliados: number; discrepancias: number; pendientes: number }> = {};
    CONCILIACIONES.forEach(c => {
      const fecha = c.registroFisico?.fecha ?? c.fechaConciliacion;
      const mes = fecha.substring(0, 7);
      if (!meses[mes]) meses[mes] = { conciliados: 0, discrepancias: 0, pendientes: 0 };
      if (c.estado === 'conciliado') meses[mes].conciliados++;
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
      tipos[c.tipoDiscrepancia!] = (tipos[c.tipoDiscrepancia!] || 0) + 1;
    });
    return Object.entries(tipos).map(([tipo, cantidad]) => ({ tipo, cantidad }));
  }

  getDiscrepanciasPorAlmacen(): { almacen: string; total: number; discrepancias: number }[] {
    const data: Record<string, { total: number; discrepancias: number }> = {};
    CONCILIACIONES.forEach(c => {
      const alm = c.registroFisico?.producto.almacen ?? 'N/A';
      if (!data[alm]) data[alm] = { total: 0, discrepancias: 0 };
      data[alm].total++;
      if (c.estado === 'discrepancia') data[alm].discrepancias++;
    });
    return Object.entries(data).map(([almacen, d]) => ({ almacen, ...d })).sort((a, b) => b.discrepancias - a.discrepancias);
  }
}
