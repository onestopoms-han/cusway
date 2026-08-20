@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ===================================
echo  CUSWAY Auto Deploy Script (Windows)
echo ===================================

echo [1/4] Running production build test...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please fix compiler/type errors before deploying.
    pause
    exit /b %errorlevel%
)

echo [2/4] Staging changes...
git add backend/*.py backend/rag/*.py backend/utils/* src/* tests/* requirements.txt package.json vercel.json .gitignore cusway.db

echo [3/4] Committing changes...
if "%1"=="" (
    set /p commit_msg="Enter commit message (default: 'update service'): "
) else (
    set commit_msg=%~1
)
if "%commit_msg%"=="" set commit_msg=update service
git commit -m "%commit_msg%"

echo [4/4] Pushing to GitHub...
git push origin main

echo ===================================
echo  Deploy completed! Vercel will build soon.
echo ===================================
if "%1"=="" pause
