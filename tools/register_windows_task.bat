@echo off
chcp 65001 > nul
echo ===================================================================
echo   [CUSWAY] Windows 작업 스케줄러 매일 2회(09:00, 18:00) 자동 크롤링 등록기
echo ===================================================================

set SCRIPT_DIR=%~dp0
set WORKSPACE_ROOT=%SCRIPT_DIR%..
set PYTHON_PATH=python

echo [*] 작업 1: 매일 오전 09:00 크롤링 작업 생성 중...
schtasks /create /tn "CUSWAY_Daily_Crawler_Morning" /tr "\"%PYTHON_PATH%\" \"%WORKSPACE_ROOT%\tools\run_daily_crawler.py\"" /sc daily /st 09:00 /f /ru "%USERNAME%"

echo [*] 작업 2: 매일 오후 18:00 크롤링 작업 생성 중...
schtasks /create /tn "CUSWAY_Daily_Crawler_Evening" /tr "\"%PYTHON_PATH%\" \"%WORKSPACE_ROOT%\tools\run_daily_crawler.py\"" /sc daily /st 18:00 /f /ru "%USERNAME%"

echo.
echo [✅ 완료] Windows 작업 스케줄러에 매일 오전 09:00 및 오후 18:00 크롤링 작업이 성공적으로 등록되었습니다!
echo.
pause
