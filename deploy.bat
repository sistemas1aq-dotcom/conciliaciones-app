@echo off
REM Script de despliegue a Vercel via GitHub (Windows)
REM Uso: doble click o "deploy.bat" en cmd

echo Limpiando locks de git...
if exist .git\index.lock del /F .git\index.lock

echo Anadiendo cambios...
git add -A

echo Creando commit...
git commit -m "data: cargar activos reales EMPAFRUT (3137 fisicos / 2308 contables)"

echo Haciendo push a origin (rama actual)...
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
echo   Rama: %BRANCH%
git push origin %BRANCH%

echo.
echo Push completado. Vercel desplegara automaticamente en ~1-2 minutos.
echo Revisa el estado en: https://vercel.com/dashboard
pause
