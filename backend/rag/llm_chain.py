import os
import json
import urllib.request
import urllib.error
from sqlalchemy.orm import Session

from backend.rag.retriever import retrieve_relevant_notes
from src.data.rules import KOREAN_HS_RULES # Import local rules as robust fallback

def query_rag_hs_classification(product_name: str, material: str, function_use: str, db: Session):
    """
    RAG chain to search explanatory notes database, invoke OpenAI GPT model,
    and return structured HS classification results.
    """
    # 1. Retrieve raw reference texts from SQLite
    combined_query = f"{product_name} {material} {function_use}"
    relevant_notes = retrieve_relevant_notes(combined_query, db)
    
    # Structure references block
    references_text = ""
    for note in relevant_notes:
        references_text += f"\n[호 세호 코드: {note.heading}]\n- 부/류명: {note.section} / {note.chapter}\n- 해설내용: {note.content_ko[:1200]}\n"

    # 2. Check OpenAI API Key. If missing, use local KOREAN_HS_RULES dataset fallback
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("[RAG-LLM] OPENAI_API_KEY not found. Fallback to local rule match.")
        return run_local_fallback_match(product_name, material, function_use)

    # 3. Build Prompt for GPT
    prompt = f"""
당신은 대한민국 관세청 및 WCO 기준에 부합하는 최고의 품목분류 AI 관세사입니다.
제시된 수입 대상 물품명, 재질 및 주요 용도를 분석하고, 아래 제공된 관세율표 해설서 원문(RAG 검색)을 법적 근거로 삼아 정밀 세번 판정을 내리십시오.

[수입 대상 품목 정보]
- 물품명: {product_name}
- 재질/성분: {material}
- 주요 용도 및 기능: {function_use}

[참조 관세율표 해설서 (RAG retrieved)]
{references_text}

반드시 아래 JSON 구조로만 반환하십시오. 다른 설명이나 텍스트를 절대 추가하지 마십시오. 마크다운 ```json 코드 블록도 붙이지 마십시오. 오직 순수한 JSON 문자열이어야 합니다.

{{
  "recommendedHsCode": "10자리 세번 (예: 8483.40-1000)",
  "headingName": "4단위 호의 용어 요약 (예: 기어와 기어링, 볼스크류)",
  "subheadingName": "6단위 소호의 용어 요약 (예: 볼스크류)",
  "confidence": 95,
  "technicalTerms": "관세 기술 표준 용어 (예: Ball Screw for Steering)",
  "appliedGris": ["적용 통칙 번호 (예: 통칙 제1호, 통칙 제6호)"],
  "legalReasoning": "법적 품목분류 판정 논리 상세 (참조 해설 조문을 인용하여 논리적으로 서술)",
  "sectionNote": "부의 주(Note) 내용 중 본 품목에 관계된 부분",
  "chapterNote": "류의 주(Note) 내용 중 본 품목에 관계된 부분",
  "exclusionNote": "본 분류의 오적용을 방지하는 주요 제외 주석 요약",
  "headingExplanation": "호 해설서 전문 요약 및 대비 방안",
  "precedents": [
    {{
      "id": "PREC-001",
      "title": "관련 분류 결정례 제목",
      "code": "결정례 분류 코드 (10자리)",
      "issuingBody": "관세평가분류원 또는 WCO",
      "date": "2026-01-01",
      "similarity": 95,
      "reasoningSnippet": "결정례의 주요 판결 요지"
    }}
  ]
}}
"""

    # 4. Invoke OpenAI Chat Completion API via HTTP Request (No extra thick sdk weight needed)
    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        data = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a professional Korean Customs Broker chatbot."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }
        
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, timeout=40) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            gpt_output = res_json["choices"][0]["message"]["content"].strip()
            
            # Clean possible markdown wrap
            if gpt_output.startswith("```json"):
                gpt_output = gpt_output.split("```json")[1].split("```")[0].strip()
            elif gpt_output.startswith("```"):
                gpt_output = gpt_output.split("```")[1].split("```")[0].strip()
                
            return json.loads(gpt_output)
    except Exception as e:
        print(f"[RAG-LLM] GPT call failed: {str(e)}. Fallback to local rule match.")
        return run_local_fallback_match(product_name, material, function_use)

def run_local_fallback_match(product_name: str, material: str, function_use: str):
    """
    Fallback mechanism matching input texts with offline KOREAN_HS_RULES.
    """
    input_lower = f"{product_name} {material} {function_use}".lower()
    
    found = None
    for rule in KOREAN_HS_RULES:
        if any(keyword in input_lower for keyword in rule["keywordTrigger"]):
            found = rule
            break
            
    if not found:
        found = KOREAN_HS_RULES[0] # Default fallback is Pasta
        
    return {
        "recommendedHsCode": found["recommendedHsCode"],
        "headingName": found["headingName"],
        "subheadingName": found["subheadingName"],
        "confidence": found["confidence"],
        "technicalTerms": found["technicalTerms"],
        "appliedGris": found["appliedGris"],
        "legalReasoning": found["legalReasoning"],
        "sectionNote": found["sectionNote"],
        "chapterNote": found["chapterNote"],
        "exclusionNote": found["exclusionNote"],
        "headingExplanation": found["headingExplanation"],
        "precedents": [
            {
                "id": p["id"],
                "title": p["title"],
                "code": p["code"],
                "issuingBody": p["issuingBody"],
                "date": p["date"],
                "similarity": p["similarity"],
                "reasoningSnippet": p["reasoningSnippet"]
            } for p in found["precedents"]
        ]
    }
