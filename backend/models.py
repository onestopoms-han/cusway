from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) # Simple test password storage
    company_name = Column(String, nullable=False)
    plan = Column(String, default="Basic") # Free, Basic, Business
    status = Column(String, default="Active") # Active, Suspended
    accrued_points = Column(Integer, default=15000)
    join_date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))
    
    # B2B Consensus Weighting System Columns
    user_type = Column(String, default="general_user")  # 'broker', 'practitioner', 'general_user'
    years_of_experience = Column(Integer, default=0)
    credibility_weight = Column(Float, default=1.0)
    phone_number = Column(String, default="")

class Precedent(Base):
    __tablename__ = "precedents"

    id = Column(String, primary_key=True, index=True) # VAL-001...
    category = Column(String, nullable=False)
    category_ko = Column(String, nullable=False)
    case_number = Column(String, nullable=False)
    title = Column(String, nullable=False)
    authority = Column(String, nullable=False)
    date = Column(String, nullable=False)
    key_issue = Column(Text, nullable=False)
    factual_background = Column(Text, nullable=False)
    holding_ko = Column(Text, nullable=False)
    customs_argument = Column(Text, nullable=False)
    importer_argument = Column(Text, nullable=False)
    reasoning_snippet = Column(Text, nullable=False)
    implication_ko = Column(Text, nullable=False)

class CashbackRequest(Base):
    __tablename__ = "cashback_requests"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    type = Column(String, nullable=False) # hs or valuation
    type_ko = Column(String, nullable=False)
    hs_code_or_issue = Column(String, nullable=False)
    item_name = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    points = Column(Integer, default=5000)
    status = Column(String, default="검토 대기중") # 검토 대기중, 승인 완료, 반려
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))

class PaymentHistory(Base):
    __tablename__ = "payment_histories"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    plan_name = Column(String, nullable=False)
    original_price = Column(Integer, nullable=False)
    points_used = Column(Integer, default=0)
    final_price = Column(Integer, nullable=False)
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))

class ExplanatoryNote(Base):
    __tablename__ = "explanatory_notes"

    id = Column(Integer, primary_key=True, index=True)
    heading = Column(String, index=True, nullable=False) # e.g. 01.02 or 84.83
    content_ko = Column(Text, nullable=False)
    content_en = Column(Text, nullable=True)
    section = Column(String, nullable=True)
    chapter = Column(String, nullable=True)


class CustomsPrecedent(Base):
    __tablename__ = "customs_precedents"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, index=True, nullable=False)
    hs_code = Column(String, index=True, nullable=False)
    product_name = Column(String, nullable=False)
    material = Column(Text, nullable=True)
    function_use = Column(Text, nullable=True)
    decision_reason = Column(Text, nullable=False)
    issuing_body = Column(String, default="관세평가분류원")
    date = Column(String, nullable=True)


class HSCodeMaster(Base):
    __tablename__ = "hs_code_master"

    hs_code = Column(String, primary_key=True, index=True)
    hscode_length = Column(Integer, nullable=False)
    name_ko = Column(String, nullable=False)
    name_en = Column(String, nullable=True)


class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=True) # 조회를 수행한 관세사 계정
    search_type = Column(String, nullable=False) # 'hs' 또는 'valuation'
    query_text = Column(String, nullable=False) # 입력 품명 또는 HS Code
    searched_at = Column(DateTime, default=datetime.utcnow) # 검색 일시


class HSRateMaster(Base):
    __tablename__ = "hs_rate_master"

    id = Column(Integer, primary_key=True, index=True)
    hs_code = Column(String, index=True, nullable=False)            # HSK 10단위 (예: 2009891090)
    country_code = Column(String, nullable=False)                   # 원산지 국가 (예: US, CN, VN, IT)
    base_rate = Column(Float, nullable=True)                        # 기본 세율 (A)
    wto_rate = Column(Float, nullable=True)                         # WTO 협정세율 (C)
    fta_rate = Column(Float, nullable=True)                         # FTA 특혜세율 (F)
    fta_name = Column(String, nullable=True)                        # FTA 명칭 (예: 한-미 FTA, 한-EU FTA)
    recommended_rate = Column(Float, nullable=True)                 # 추천 최저세율
    specific_rate = Column(Float, nullable=True)                    # 종량세액 (단위당 세액, 예: 1625.0)
    specific_unit = Column(String, nullable=True)                   # 종량세 단위 (예: 원/kg, 원/m, 원/개)
    duty_type = Column(String, default="AD_VALOREM")                # 'AD_VALOREM'(종가세), 'ALTERNATIVE'(선택세), 'SPECIFIC'(종량세)
    duty_formula = Column(String, nullable=True)                    # 과세 산식 요약 (예: 90% 또는 1,625원/kg 중 고액)


class HSRequirement(Base):
    __tablename__ = "hs_requirements"

    id = Column(Integer, primary_key=True, index=True)
    hs_code = Column(String, index=True, nullable=False)            # HSK 10단위
    law_name = Column(String, nullable=False)                       # 법률명 (예: 식품위생법)
    agency_name = Column(String, nullable=True)                     # 관할 기관 (예: 식약처)
    check_type = Column(String, nullable=False)                     # '세관장확인' 또는 '통합공고'
    description = Column(Text, nullable=True)                       # 요건 세부내용 요약


class RequirementProcedure(Base):
    __tablename__ = "requirement_procedures"

    id = Column(Integer, primary_key=True, index=True)
    law_name = Column(String, unique=True, index=True, nullable=False) # 적용 법률명
    pre_clearance_steps = Column(Text, nullable=False)              # 통관 전 행정절차 (JSON/Markdown)
    required_documents = Column(Text, nullable=False)               # 구비 서류
    processing_agency = Column(String, nullable=True)               # 관할 신청기관 및 시스템 URL
    average_duration = Column(String, nullable=True)                # 평균 소요 기간


class BrokerConfirmation(Base):
    __tablename__ = "broker_confirmations"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    product_name = Column(String, index=True, nullable=False)
    material = Column(Text, nullable=True)
    function_use = Column(Text, nullable=True)
    confirmed_hs_code = Column(String, index=True, nullable=False)
    legal_reasoning = Column(Text, nullable=True)
    user_weight = Column(Float, default=1.0)
    confirmed_at = Column(DateTime, default=datetime.utcnow)


class CustomsNews(Base):
    __tablename__ = "customs_news"

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, nullable=False)
    title = Column(String, unique=True, index=True, nullable=False)
    date = Column(String, nullable=False)
    agency = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    link = Column(String, nullable=False)
    full_content = Column(Text, nullable=True)
    attached_files = Column(Text, nullable=True)







