import os
import sys

# Vercel Serverless 실행 환경 내에서 최상위 경로를 파이썬 패스에 주입하여 모듈 누락 에러 방지
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from backend.main import app
