import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Add backend directory to sys.path
workspace_root = os.path.dirname(os.path.abspath(__file__))
sys.path.append(workspace_root)

from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.db import SessionLocal

def main():
    db = SessionLocal()
    from backend.rag.llm_chain import query_rag_hs_classification
    try:
        print("Running query_rag_hs_classification...")
        res = query_rag_hs_classification(
            product_name="자율주행 음식 배달 로봇 카트",
            material="플라스틱 및 알루미늄 프레임, BLDC 전동 모터 4개, 배터리 팩, 라이다 센서, 초음파 센서, GPS 모듈, AI 제어 보드",
            function_use="실내외에서 자율주행으로 음식을 목적지까지 안전하게 운송 배달하는 전동 로봇 카트",
            db=db,
            custom_key="",
            feedback_prompt="이전 분류 결과에 모순이 있습니다."
        )
        print("Result:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == '__main__':
    main()
