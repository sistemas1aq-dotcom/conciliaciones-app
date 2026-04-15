#!/usr/bin/env bash
# Script de despliegue a Vercel vía GitHub.
# Uso: ./deploy.sh   (en Linux/Mac)
#       bash deploy.sh   (en Windows Git Bash)

set -e

echo "→ Limpiando locks de git (si existen)..."
rm -f .git/index.lock 2>/dev/null || true

echo "→ Añadiendo cambios..."
git add -A

echo "→ Creando commit..."
git commit -m "data: cargar activos reales EMPAFRUT (3137 físicos / 2308 contables)

- Inventario físico: 3,137 registros desde Base Inventario EMPAFRUT
- Base contable: 2,308 registros desde Base Contable EMPAFRUT
- Conciliaciones: 3,330 cruces automáticos
- Maestros: 4 sedes, 86 ubicaciones, 9 centros de costo, 187 catálogos
- Script reproducible: BD EXCEL/generar_mock.py
- Datos grandes en JSON + resolveJsonModule en tsconfig" || echo "  (sin cambios para commitear)"

echo "→ Haciendo push a origin main..."
git push origin main

echo ""
echo "✓ Push completado. Vercel desplegará automáticamente en ~1-2 minutos."
echo "  Revisa el estado en: https://vercel.com/dashboard"
