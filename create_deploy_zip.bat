@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Creating deploy.zip...
echo.

REM Create temp directory
if exist temp_deploy rmdir /s /q temp_deploy
mkdir temp_deploy
mkdir temp_deploy\assets

REM Copy files
copy /y frontend\dist\index.html temp_deploy\
copy /y frontend\dist\assets\index-BuVgxeW8.css temp_deploy\assets\
copy /y frontend\dist\assets\index-Rr_AaBd8.js temp_deploy\assets\

REM Create tar.gz using tar (Git Bash or WSL)
cd temp_deploy
tar -czf ../deploy.tar.gz * 2>nul
cd ..

if exist deploy.tar.gz (
    echo Created: deploy.tar.gz
    echo.
    echo Upload this file to EdgeOne
) else (
    echo Failed to create deploy.tar.gz
    echo Please upload files manually:
    echo   - frontend\dist\index.html
    echo   - frontend\dist\assets\index-BuVgxeW8.css
    echo   - frontend\dist\assets\index-Rr_AaBd8.js
)

REM Cleanup
rmdir /s /q temp_deploy

pause
