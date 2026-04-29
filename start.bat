@echo off
echo ==========================================
echo Demarrage de MadaEvasion
echo ==========================================

echo Demarrage du Backend...
start cmd /k "cd backend && npm install && node index.js"

echo Demarrage du Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Le projet est en cours de demarrage dans de nouvelles fenetres.
echo - Le Backend sera sur http://localhost:5000
echo - Le Frontend s'ouvrira (ou sera sur le port 5173 par defaut)
echo.
pause
