@echo off

start cmd /k "cd backend && npm run dev"
timeout /t 5 >nul
start cmd /k "ngrok http 3000"
timeout /t 5 >nul
start cmd /k "cd frontend && npm run dev"