@echo off
setlocal
chcp 65001 > nul

echo ===================================================================
echo   [CUSWAY] Windows Task Scheduler Registration
echo ===================================================================

set SCRIPT_DIR=%~dp0
set WORKSPACE_ROOT=%SCRIPT_DIR%..
set PYTHON_PATH=python

if exist "C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" (
    set "PYTHON_PATH=C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set "PYTHON_PATH=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
) else if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PYTHON_PATH=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
)

echo [*] Python executable: %PYTHON_PATH%
echo [*] Registering scheduled task: CUSWAY_Autonomous_Marketing_Bot (Every 2 hours)...

schtasks /create /tn "CUSWAY_Autonomous_Marketing_Bot" /tr "\"%PYTHON_PATH%\" \"%WORKSPACE_ROOT%\backend\agents\autonomous_marketing_agent.py\" --run-once" /sc minute /mo 120 /f /ru "%USERNAME%"

echo.
echo ===================================================================
echo   CUSWAY Marketing Task Registered Successfully!
echo ===================================================================
echo.
pause
