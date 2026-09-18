@echo off
chcp 65001 > nul
echo ===================================================================
echo   [CUSWAY] 100%% 무인 자율 게릴라 마케팅 에이전트 실행기
echo ===================================================================

set SCRIPT_DIR=%~dp0
set WORKSPACE_ROOT=%SCRIPT_DIR%..
set PYTHON_PATH=python

echo [*] CUSWAY 자율 마케팅 에이전트를 가동합니다...
"%PYTHON_PATH%" "%WORKSPACE_ROOT%\backend\agents\autonomous_marketing_agent.py" --run-once

echo.
echo [✅ 완료] 자율 마케팅 정찰 및 댓글 작성 사이클이 완료되었습니다.
echo.
pause
