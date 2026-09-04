@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ===================================
echo  CUSWAY Auto Deploy Script (Windows)
echo ===================================

echo [1/5] Running DB Integrity Audit...
python tools/audit_hs_master.py
if %errorlevel% neq 0 (
    echo [ERROR] Database Integrity Audit failed! Mismatches detected. Git staging cancelled.
    pause
    exit /b %errorlevel%
)

echo [2/5] Running production build test...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please fix compiler/type errors before deploying.
    pause
    exit /b %errorlevel%
)

echo [3/5] Staging changes...
git add api/* backend/*.py backend/rag/*.py backend/utils/* src/* public/* index.html tests/* requirements.txt package.json vercel.json .gitignore cusway.db

echo [4/5] Committing changes...
if "%1"=="" (
    set /p commit_msg="Enter commit message (default: 'update service'): "
) else (
    set commit_msg=%~1
)
if "%commit_msg%"=="" set commit_msg=update service
git commit -m "%commit_msg%"

echo [5/5] Pushing to GitHub...
git push origin main

echo ===================================
echo  Deploy completed! Vercel will build soon.
echo ===================================
if "%1"=="" pause
