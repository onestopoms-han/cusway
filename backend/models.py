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



