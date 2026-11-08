@echo off
title Smart Campus - Database Seeder
echo ========================================================
echo   Seeding Smart Campus Database with Demo Data
echo ========================================================
cd backend
node src/utils/seedData.js
pause
