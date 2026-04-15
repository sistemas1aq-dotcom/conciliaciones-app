@echo off
REM Renombra la rama local "master" a "main" y actualiza origin.
REM Ejecutar una sola vez, luego usar deploy.bat normalmente.

echo Limpiando locks de git...
if exist .git\index.lock del /F .git\index.lock

echo Renombrando rama local master -> main...
git branch -m master main

echo Haciendo push de la rama main a origin...
git push -u origin main

echo.
echo Si todo salio bien, ahora en GitHub ve a Settings -> Branches
echo y cambia la rama por defecto a "main" (si aun esta en master).
echo Luego puedes borrar la rama master remota con:
echo   git push origin --delete master
echo.
pause
