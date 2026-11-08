@echo off
setlocal
set "PATH=%~dp0.git-bin\cmd;%PATH%"

echo ========================================================
echo        Smart Campus - Push to GitHub Utility
echo ========================================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/USERNAME/REPO.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Aborting.
    pause
    exit /b 1
)

echo.
echo [1/3] Setting remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Setting branch to main...
git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Code pushed successfully to GitHub!
) else (
    echo.
    echo [NOTE] If authentication is required, GitHub may prompt you for your Personal Access Token or credentials.
)

pause
