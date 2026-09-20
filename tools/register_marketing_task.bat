@echo off
setlocal
chcp 65001 > nul

echo ===================================================================
echo   [CUSWAY] Windows Task Scheduler Registration
echo ===================================================================

set SCRIPT_DIR=%~dp0
set WORKSPACE_ROOT=%SCRIPT_DIR%..
set TASK_BAT=%SCRIPT_DIR%run_marketing_task.bat

echo [*] Target Task Batch: %TASK_BAT%
echo [*] Registering scheduled task: CUSWAY_Autonomous_Marketing_Bot (Every 2 hours)...

schtasks /create /tn "CUSWAY_Autonomous_Marketing_Bot" /tr "%TASK_BAT%" /sc minute /mo 120 /f

echo.
echo ===================================================================
echo   CUSWAY Marketing Task Registered Successfully!
echo ===================================================================
echo.
pause

