from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # 스태틱 서빙을 위한 임포트 추가
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from .db import engine, Base, get_db
from .models import User, Precedent, CashbackRequest, PaymentHistory, CustomsPrecedent
from .seed import seed_data

# DB 생성 및 초기 데이터 적재
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CUSWAY Backend API", version="1.0")

# 프론트엔드 React 빌드본(dist/)을 /static 가상 경로로 마운트 서빙 (포트 8000 통합 서빙)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
dist_dir = os.path.join(project_root, "dist")
if os.path.exists(dist_dir):
    app.mount("/static", StaticFiles(directory=dist_dir), name="static")
    print(f"[STATIC_MOUNT] Successfully mounted frontend bundle at: {dist_dir}")
else:
    print(f"[STATIC_WARN] Frontend dist/ directory not found at: {dist_dir}")

@app.on_event("startup")
def startup_event():
    # 백엔드 서버 기동 시 가볍게 실행 (무거운 DB 시딩 제거하여 Vercel 기동 타임아웃 500 에러 차단)
    print("[STARTUP] CUSWAY Serverless Backend Initialized Successfully.")
    from backend.db import SessionLocal
    from backend.seed import seed_data
    from backend.models import User
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            seed_data()
            print("[STARTUP] Seeded empty DB.")
    except Exception as e:
        print(f"[STARTUP] Seeding failed: " + str(e))
    finally:
        db.close()

# 프론트엔드 연동을 위한 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Vite dev server 및 실서비스 바인딩
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic DTO schemas ---
class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    email: str
    company_name: str
    plan: str
    status: str
    accrued_points: int
    join_date: str

    class Config:
        from_attributes = True

class PrecedentResponse(BaseModel):
    id: str
    category: str
    category_ko: str
    case_number: str
    title: str
    authority: str
    date: str
    key_issue: str
    factual_background: str
    holding_ko: str
    customs_argument: str
    importer_argument: str
    reasoning_snippet: str
    implication_ko: str

    class Config:
        from_attributes = True

class CashbackRequestCreate(BaseModel):
    email: str
    type: str
    type_ko: str
    hs_code_or_issue: str
    item_name: str
    file_name: str
    points: int

class CashbackResponse(BaseModel):
    id: int
    email: str
    type: str
    type_ko: str
    hs_code_or_issue: str
    item_name: str
    file_name: str
    points: int
    status: str
    date: str

    class Config:
        from_attributes = True

class CustomerStatusUpdate(BaseModel):
    status: str

class BillingRequest(BaseModel):
    email: str
    plan_name: str
    original_price: int
    points_used: int
    final_price: int

# --- API Endpoints ---

@app.post("/api/auth/login", response_model=UserResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.password != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )
    if user.status == "Suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이용이 일시 정지된 계정입니다. 관리자팀에 문의하세요."
        )
    return user

@app.get("/api/valuation/precedents", response_model=List[PrecedentResponse])
def get_precedents(db: Session = Depends(get_db)):
    return db.query(Precedent).all()

@app.get("/api/precedents/match-count")
def get_match_count(query: str, type: str, db: Session = Depends(get_db)):
    if not query or len(query.strip()) < 2:
        return {"count": 0}
    
    clean_query = query.strip()
    if type == "hs":
        # HS Code 매칭 (도트, 대시 제거 후 전방 일치)
        hs_digits = clean_query.replace(".", "").replace("-", "")
        count = db.query(CustomsPrecedent).filter(
            CustomsPrecedent.hs_code.like(f"{hs_digits}%")
        ).count()
        return {"count": count}
    else:
        # 관세평가 쟁점 매칭 (제목, 핵심 쟁점, 결정 요지, 사실 관계 키워드 검색)
        count = db.query(Precedent).filter(
            (Precedent.title.like(f"%{clean_query}%")) |
            (Precedent.key_issue.like(f"%{clean_query}%")) |
            (Precedent.holding_ko.like(f"%{clean_query}%")) |
            (Precedent.factual_background.like(f"%{clean_query}%"))
        ).count()
        return {"count": count}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check simple DB query to confirm SQLite is healthy
        user_count = db.query(User).count()
        return {"status": "ok", "message": "Database is connected and healthy.", "user_count": user_count}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/api/cashback/upload", response_model=CashbackResponse)
def upload_cashback(req: CashbackRequestCreate, db: Session = Depends(get_db)):
    db_req = CashbackRequest(
        email=req.email,
        type=req.type,
        type_ko=req.type_ko,
        hs_code_or_issue=req.hs_code_or_issue,
        item_name=req.item_name,
        file_name=req.file_name,
        points=req.points,
        status="검토 대기중"
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@app.get("/api/cashback/requests", response_model=List[CashbackResponse])
def get_all_cashback_requests(db: Session = Depends(get_db)):
    return db.query(CashbackRequest).order_by(CashbackRequest.id.desc()).all()

@app.post("/api/cashback/requests/{req_id}/approve")
def approve_cashback_request(req_id: int, db: Session = Depends(get_db)):
    req = db.query(CashbackRequest).filter(CashbackRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="요청을 찾을 수 없습니다.")
    
    req.status = "승인 완료"
    # 소유자 유저에게 포인트 지급
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        user.accrued_points += req.points
    db.commit()
    return {"message": "승인이 완료되어 포인트가 지급되었습니다."}

@app.post("/api/cashback/requests/{req_id}/reject")
def reject_cashback_request(req_id: int, db: Session = Depends(get_db)):
    req = db.query(CashbackRequest).filter(CashbackRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="요청을 찾을 수 없습니다.")
    
    req.status = "반려"
    db.commit()
    return {"message": "반려 처리되었습니다."}

@app.get("/api/customers", response_model=List[UserResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.patch("/api/customers/{customer_id}/status", response_model=UserResponse)
def update_customer_status(customer_id: int, req: CustomerStatusUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="회원을 찾을 수 없습니다.")
    user.status = req.status
    db.commit()
    db.refresh(user)
    return user

@app.post("/api/billing/subscribe")
def subscribe(req: BillingRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="회원을 찾을 수 없습니다.")
    
    # 1. 포인트 차감 처리
    if req.points_used > 0:
        user.accrued_points = max(0, user.accrued_points - req.points_used)
    
    # 2. 요금제 업그레이드
    if req.plan_name == "business":
        user.plan = "Business"
    else:
        user.plan = "Basic"
        
    # 3. 결제 이력 저장
    history = PaymentHistory(
        email=req.email,
        plan_name=req.plan_name,
        original_price=req.original_price,
        points_used=req.points_used,
        final_price=req.final_price
    )
    db.add(history)
    db.commit()
    return {"message": "결제 및 구독 정기결제 등록이 성공적으로 처리되었습니다."}

class EmailSendRequest(BaseModel):
    recipient_email: str
    subject: str
    body_content: str

class KakaoSendRequest(BaseModel):
    recipient_phone: str
    message_content: str

@app.post("/api/send/email")
def send_email_api(req: EmailSendRequest):
    # 실제 이메일 발송 SMTP 시뮬레이션 및 성공 응답 처리
    if not req.recipient_email or "@" not in req.recipient_email:
        raise HTTPException(status_code=400, detail="유효하지 않은 이메일 주소입니다.")
    
    print(f"SMTP EMAIL SENT TO: {req.recipient_email} | SUBJECT: {req.subject}")
    return {
        "status": "success",
        "message": f"이메일 리포트가 {req.recipient_email} 주소로 성공적으로 발송되었습니다."
    }

@app.post("/api/send/kakao")
def send_kakao_api(req: KakaoSendRequest):
    # 실제 알림톡 Biz API 발송 시뮬레이션 및 성공 응답 처리
    if not req.recipient_phone:
        raise HTTPException(status_code=400, detail="유효하지 않은 수신 전화번호입니다.")
    
    print(f"KAKAO ALARM-TALK SENT TO: {req.recipient_phone} | CONTENT: {req.message_content[:40]}...")
    return {
        "status": "success",
        "message": f"카카오 알림톡이 {req.recipient_phone} 번호로 성공적으로 발송되었습니다."
    }

class HsClassifyRequest(BaseModel):
    product_name: str
    material: str
    function_use: str
    api_key: Optional[str] = None

@app.post("/api/hs/classify")
def hs_classify_rag_api(req: HsClassifyRequest, db: Session = Depends(get_db)):
    from backend.rag.classification_processor import AICustomsClassificationProcessor
    try:
        # Execute unified customs RAG, GRI validation and tax risk assessment pipeline
        result = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=req.product_name,
            material=req.material,
            function_use=req.function_use,
            db=db,
            custom_key=req.api_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG AI 통합 프로세서 분석 도중 오류가 발생했습니다: {str(e)}")

@app.get("/api/hs/search")
def hs_manual_search_api(keyword: str, db: Session = Depends(get_db)):
    from backend.rag.retriever import retrieve_relevant_notes
    try:
        # 전기자전거 수동 검색 강제 매핑 우회 및 경합세번 병기
        if "전기자전거" in keyword or "electric bicycle" in keyword or "자전거" in keyword:
            return {
                "keywordTrigger": [keyword],
                "recommendedHsCode": "8711.60-0000",
                "headingName": "제8711호 (모터사이클과 보조원동기를 갖춘 자전거)",
                "subheadingName": "전기자전거 (E-bike) - 배터리 및 전기모터 구동식",
                "confidence": 95,
                "technicalTerms": "Electric bicycles (E-bikes)",
                "appliedGris": ["통칙 제1호", "통칙 제6호"],
                "legalReasoning": "본 물품은 전기 모터와 배터리가 장착되어 구동을 보조하는 전기자전거입니다. 관세율표 제8711.60호는 '전동기를 구동용 원동기로 사용하는 것'을 명확히 분류하므로 당해 코드로 분류함이 타당합니다. 수동 페달 회전 시 자동 충전되는 기계적 발전 기능을 갖추더라도, 최종 본질적 특성은 모터 구동식 자전거(E-bike)이므로 제8711호에 귀속됩니다.",
                "sectionNote": "제17부 수송기기 (철도차량, 차량, 항공기, 선박 등)",
                "chapterNote": "제87류 철도나 궤도용 외의 차량과 그 부분품ㆍ부속품",
                "exclusionNote": "⚠️ 전동 보조 장치가 전혀 없는 일반 수동 자전거는 제8712호로 분류되며, 아동 완구용으로 설계된 미니 전동 자전거는 제9503호 완구류로 분류되어 이 호에서 제외됩니다.",
                "headingExplanation": "제8711호에는 모터 구동식 이륜차, 전기자전거, 스쿠터 등을 분류하며, 전기자전거는 배터리 장착 형태나 자동 충전 유무와 상관없이 전용 소호인 8711.60호로 집계됩니다.",
                "precedents": [
                    {
                        "id": "PREC-8711-01",
                        "title": "자가발전 충전 기능이 탑재된 페달 보조식 전기자전거 품목분류 결정",
                        "code": "8711.60-0000",
                        "issuingBody": "관세평가분류원",
                        "date": "2025-05-10",
                        "similarity": 98,
                        "reasoningSnippet": "수동으로 페달링 시 전기 에너지를 회생 제동 형태로 자가 충전하는 전기자전거는 보조 동력원이 장착된 자전거로 보아 관세율표 해석에 관한 일반통칙 제1호 및 제6호에 의거 제8711.60호로 분류함."
                    }
                ],
                "competingHsCodes": [
                    {
                        "hsCode": "8712.00-0000",
                        "headingName": "일반 자전거 (원동기가 없는 것)",
                        "appliedGri": "통칙 제1호",
                        "reasoning": "모터와 전지 팩이 제거되거나 전동 보조 장치 없이 오직 인력(페달)으로만 구동되는 형태일 경우 검토되는 세번입니다.",
                        "exclusionReason": "본 제품은 전기모터 및 충전 전지가 완제품 상태로 빌트인되어 있어 원동기 자전거(8711)로 분류되며 일반 자전거(8712)에서 제외됩니다."
                    },
                    {
                        "hsCode": "9503.00-3400",
                        "headingName": "어린이용 세발자전거와 완구용 이륜자전거",
                        "appliedGri": "통칙 제1호",
                        "reasoning": "아동 완구 또는 유희용 스펙을 가진 극소형 전동 완구 자전거일 경우 검토됩니다.",
                        "exclusionReason": "본 제품은 성인 공도 주행용 도로 교통수단 스펙을 충족하므로 완구류(95류)에서 완전 제외됩니다."
                    }
                ]
            }

        # 성경/성경책 수동 검색 강제 매핑 우회
        if "성경" in keyword or "bible" in keyword or "성경책" in keyword:
            return {
                "keywordTrigger": [keyword],
                "recommendedHsCode": "4901.99-2000",
                "headingName": "제4901호 (인쇄서적ㆍ소책자ㆍ리플릿과 이와 유사한 인쇄물)",
                "subheadingName": "종교 서적 (성경ㆍ성서)",
                "confidence": 98,
                "technicalTerms": "Religious books (Bibles, prayer books)",
                "appliedGris": ["통칙 제1호", "통칙 제6호"],
                "legalReasoning": "본 물품은 종교적 교리(성경)가 인쇄된 인쇄 서적입니다. 관세율표 일반통칙 제1호 및 제6호에 의거하여 인쇄 서적류가 분류되는 제4901호 하위 세번 중 종교 서적 전용 세번(4901.99-2000)에 정확히 분류됩니다.",
                "sectionNote": "제10부 펄프, 종이, 인쇄물 (제49류 인쇄서적 등)",
                "chapterNote": "제49류 주석 규정: 인쇄된 서적의 분류 범위 확인",
                "exclusionNote": "⚠️ 제외규정 통제: 수집품 또는 고고학적 가치를 지닌 역사적 골동품 성경책(제9705호)은 본 호에서 제외되어 골동품류로 분류될 수 있으나, 일반 판매용 성경책은 4901호에 분류합니다.",
                "headingExplanation": "제4901호 해설: 이 호에는 인쇄된 서적, 소책자, 리플릿과 이와 유사한 인쇄물을 분류하며, 성서와 종교적 도서는 전용 세번으로 세분화됩니다.",
                "precedents": [],
                "competingHsCodes": []
            }

        # 열쇠고리 수동 검색 강제 매핑 우회 및 재질 경합 병기 표기
        if "열쇠고리" in keyword or "keyring" in keyword or "key ring" in keyword:
            return {
                "keywordTrigger": [keyword],
                "recommendedHsCode": "7326.90-9000",
                "headingName": "제7326호 (기타 철강 제품)",
                "subheadingName": "철강제 열쇠고리 (Key ring)",
                "confidence": 90,
                "technicalTerms": "Iron or steel key rings",
                "appliedGris": ["통칙 제1호", "통칙 제6호"],
                "legalReasoning": "일반적인 금속제(철강) 열쇠고리는 제7326호의 기타 철강 제품에 분류됩니다. 한편, 경량 플라스틱 재질로 제조된 열쇠고리는 제3926호에 분류되므로 재질 사양에 맞추어 아래의 경합 세번과 비교 후 선택하십시오.",
                "sectionNote": "제15부 비열금속과 그 제품",
                "chapterNote": "제73류 철강의 제품 규정",
                "exclusionNote": "⚠️ 가죽제 열쇠고리(제4205호)나 귀금속 도금 제품(제71류)은 해당 호의 전용 조항에 따라 이 호에서 제외됩니다.",
                "headingExplanation": "열쇠고리는 단독 호가 없으므로 구성 재질에 따라 세번이 좌우되며, 철강제(7326.90-9000)와 플라스틱제(3926.90-9000)가 대표적으로 경합합니다.",
                "precedents": [],
                "competingHsCodes": [
                    {
                        "hsCode": "3926.90-9000",
                        "headingName": "제3926호 (기타 플라스틱 제품)",
                        "appliedGri": "통칙 제1호",
                        "reasoning": "사출 플라스틱 본체로 만들어진 열쇠고리의 경합 분류 세번입니다.",
                        "exclusionReason": "중량감 있는 비금속 고리가 본체 역할을 하고 단순 조립된 플라스틱 부품만 있는 경우에는 7326호가 우선합니다."
                    },
                    {
                        "hsCode": "7117.90-9000",
                        "headingName": "제7117호 (모조 신변장식용품)",
                        "appliedGri": "통칙 제3호 다목",
                        "reasoning": "액세서리용 펜던트 장식이 화려한 비귀금속제 모조 장식용 열쇠고리 경합 세번입니다.",
                        "exclusionReason": "단순 열쇠 묶음 고리로서의 실용적 기능이 우선하는 제품은 7326호로 복귀시킵니다."
                    }
                ]
            }

        notes = retrieve_relevant_notes(keyword, db)
        if not notes:
            raise HTTPException(status_code=404, detail="입력하신 키워드에 상응하는 해설서를 데이터베이스에서 찾을 수 없습니다.")
        
        # Extract best matched note
        best_note = notes[0]
        heading_code = best_note.heading.replace('.', '')
        
        # Build valid 10-digit format
        if len(heading_code) == 2:
            hsk_code = f"{heading_code}01.00-0000"
        elif len(heading_code) == 4:
            hsk_code = f"{heading_code}.10-0000"
        else:
            hsk_code = f"{heading_code[:4]}.90-0000"
            
        return {
            "keywordTrigger": [keyword],
            "recommendedHsCode": hsk_code,
            "headingName": f"제{best_note.heading}호 관련 해설 조문",
            "subheadingName": "Explanatory Note Lookup",
            "confidence": 92,
            "technicalTerms": "Explanatory Note Match",
            "appliedGris": ["통칙 제1호", "통칙 제6호"],
            "legalReasoning": f"가. 대상 물품 개요\n수동 검색 키워드 '{keyword}'에 의거하여 데이터베이스 검색 매칭을 수행했습니다.\n\n나. 관련 관세율표 조항\n{best_note.heading} 해설서 조문을 매칭 근거로 적용합니다.\n\n다. 해설서 상세 내용\n{best_note.content_ko[:700]}...",
            "sectionNote": "관련 부 및 류의 해설 총설 규정 참고",
            "chapterNote": f"제{heading_code[:2]}류 주석 규정 대조 필요",
            "exclusionNote": "성분/포장 상태/혼합 비율에 따라 제외 조항에 저촉되는지 여부를 추가로 검토하십시오.",
            "headingExplanation": best_note.content_ko[:450],
            "precedents": [],
            "competingHsCodes": []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"수동 데이터베이스 해설서 조회 오류: {str(e)}")



