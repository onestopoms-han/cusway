@echo off
chcp 65001 > nul
echo ===================================================================
echo   [CUSWAY] Windows 작업 스케줄러 100%% 무인 마케팅 에이전트 등록기
echo ===================================================================

set SCRIPT_DIR=%~dp0
set WORKSPACE_ROOT=%SCRIPT_DIR%..
set PYTHON_PATH=python

echo [*] Windows 작업 스케줄러에 CUSWAY 자율 마케팅 작업 등록 중 (매 2시간마다 자동 실행)...
schtasks /create /tn "CUSWAY_Autonomous_Marketing_Bot" /tr "\"%PYTHON_PATH%\" \"%WORKSPACE_ROOT%\backend\agents\autonomous_marketing_agent.py\" --run-once" /sc minute /mo 120 /f /ru "%USERNAME%"

echo.
echo [✅ 완료] Windows 작업 스케줄러에 2시간 주기 자율 마케팅 에이전트 작업이 성공적으로 등록되었습니다!
echo 대표님이 신경 쓰지 않아도 PC가 켜져 있으면 2시간마다 질문 탐지 및 댓글 작성을 자동 수행합니다.
echo.
pause
