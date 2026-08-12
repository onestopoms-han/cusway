from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from .db import engine, Base, get_db
from .models import User, Precedent, CashbackRequest, PaymentHistory
from .seed import seed_data

# DB 생성 및 초기 데이터 적재
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CUSWAY Backend API", version="1.0")

@app.on_event("startup")
def startup_event():
    # 백엔드 서버 기동 시 비동기적으로(안정적으로) 데이터베이스 적재 실행
    try:
        seed_data()
    except Exception as e:
        print(f"[STARTUP] Seeding warning/error: {str(e)}")

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

@app.post("/api/hs/classify")
def hs_classify_rag_api(req: HsClassifyRequest, db: Session = Depends(get_db)):
    from backend.rag.llm_chain import query_rag_hs_classification
    try:
        result = query_rag_hs_classification(
            product_name=req.product_name,
            material=req.material,
            function_use=req.function_use,
            db=db
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG AI 분석 도중 오류가 발생했습니다: {str(e)}")


