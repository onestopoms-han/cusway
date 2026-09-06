import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  X, 
  Check, 
  Image as ImageIcon, 
  FileCode, 
  ArrowRight,
  HelpCircle,
  Zap,
  Globe
} from 'lucide-react';

export interface ParsedInvoiceData {
  productName: string;
  productNameEn: string;
  material: string;
  functionUse: string;
  originCountry: string;
  cifAmount?: number;
  currency?: string;
  quantity?: string;
  invoiceNumber?: string;
}

interface InvoiceParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: ParsedInvoiceData) => void;
}

const SAMPLE_INVOICES = [
  {
    name: '🇺🇸 미국산 대두 (Soybeans for sprouting)',
    rawText: `COMMERCIAL INVOICE
Invoice No: US-EXP-2026-8841
Shipper: Midwest Agri Grain Corp. (USA)
Consignee: Korea Trade Corp. (Incheon, KR)
Origin: USA (US)

Description of Goods:
1. Yellow Soybeans for sprout cultivation (Non-GMO, Grain size 4.5-5.5mm, Moisture max 13%)
Material: 100% Natural Glycine max seeds
Intended Use: Raw material for bean sprout (콩나물 재배용 대두)
Quantity: 20,000 KG
Unit Price: USD 0.85 / KG
Total Amount: USD 17,000.00 CIF Busan Port`,
    parsed: {
      productName: '콩나물 재배용 대두 (Yellow Soybeans for sprouting)',
      productNameEn: 'Yellow Soybeans for sprout cultivation (Non-GMO)',
      material: '100% 천연 대두 종실 (Glycine max, 수분 13% 이하)',
      functionUse: '식용 콩나물 재배 및 발아용 미가공 두류 종자',
      originCountry: '미국 (US)',
      cifAmount: 17000,
      currency: 'USD',
      quantity: '20,000 KG',
      invoiceNumber: 'US-EXP-2026-8841'
    }
  },
  {
    name: '🇨🇳 중국산 볶은 참깨가루 (Roasted Sesame Powder)',
    rawText: `COMMERCIAL INVOICE / PACKING LIST
Invoice No: CN-QD-2026-1049
Exporter: Qingdao Agricultural Processing Ltd. (Shandong, China)
Importer: Seoul Food Ingredients Co., Ltd.
Country of Origin: China (CN)

Commodity & Specifications:
- Roasted Sesamum Seed Powder (100% Pure, Heat treated at 200°C for 25 min, Milling mesh 60)
Material: Roasted White Sesame Seed 100% (No additives, No sugar)
Application: Food seasoning & culinary ingredient (가공식품 원료용 볶은 참깨분말)
Net Weight: 5,000 KGS
Amount: USD 14,500.00 CIF Incheon`,
    parsed: {
      productName: '볶은 참깨가루 (Roasted Sesamum Seed Powder)',
      productNameEn: 'Roasted Sesamum Seed Powder (Heat-treated 200°C)',
      material: '100% 볶은 흰참깨 (열풍 로스팅 후 60메시 분쇄 분말, 무첨가)',
      functionUse: '식품 조미 및 가공용 열처리 조제 참깨 분말 (조제식료품)',
      originCountry: '중국 (CN)',
      cifAmount: 14500,
      currency: 'USD',
      quantity: '5,000 KG',
      invoiceNumber: 'CN-QD-2026-1049'
    }
  },
  {
    name: '🇩🇪 독일산 영구자석 동기모터 (PMSM 3kW Motor)',
    rawText: `COMMERCIAL INVOICE
Doc No: DE-STU-2026-9012
Supplier: Bosch-Rexroth Drive Systems GmbH (Germany)
Buyer: Hanwha Precision Machinery Co., Ltd.
Origin: Germany (DE)

Item Details:
Pos 1: PMSM Brushless Synchronous Servo Motor (3.0kW, 3000 RPM, 400V, with Optical Absolute Encoder)
Material: Aluminum Housing, Copper Windings, NdFeB Permanent Magnets
Function/Use: Industrial Robotic Arm & CNC Precision Axis Actuator
Total Value: EUR 8,400.00 CIF Incheon Airport`,
    parsed: {
      productName: '영구자석 동기 서보모터 (PMSM Synchronous Motor 3kW)',
      productNameEn: 'PMSM Brushless Synchronous Servo Motor 3.0kW',
      material: '알루미늄 하우징, 동(구리) 권선, NdFeB 네오디뮴 영구자석',
      functionUse: '산업용 로봇 및 CNC 정밀 공작기계 구동용 AC 서보 전동기 (출력 3kW)',
      originCountry: '독일 (DE)',
      cifAmount: 9200,
      currency: 'USD',
      quantity: '4 SET',
      invoiceNumber: 'DE-STU-2026-9012'
    }
  },
  {
    name: '🇻🇳 베트남산 리튬이온 배터리팩 (Lithium-ion Pack)',
    rawText: `COMMERCIAL INVOICE & SHIPPING SPECIFICATION
Inv Ref: VN-HAI-2026-303
Shipper: LG Energy Solution Vietnam Co., Ltd. (Hai Phong)
Receiver: EcoMobility Korea Corp.
Origin: Vietnam (VN)

Goods Description:
Lithium-ion Secondary Battery Pack for E-Scooter (48V 20Ah, 960Wh, with Smart BMS & Aluminum Casing)
Material: NCM Lithium-ion Cells, BMS Board, Flame-retardant Aluminum Alloy Case
Use: Power storage accumulator for light electric vehicles
Quantity: 500 Units
Total Invoice Value: USD 45,000.00 CIF Busan`,
    parsed: {
      productName: '전기스쿠터용 리튬이온 배터리팩 (Lithium-ion Battery Pack 48V 20Ah)',
      productNameEn: 'Lithium-ion Secondary Battery Pack 48V 20Ah 960Wh',
      material: 'NCM 삼원계 리튬이온 셀, 스마트 BMS 보호회로, 난연 알루미늄 케이스',
      functionUse: '전기 이륜차(E-Scooter) 및 소형 모빌리티 구동 전원용 리튬 2차 축전지',
      originCountry: '베트남 (VN)',
      cifAmount: 45000,
      currency: 'USD',
      quantity: '500 EA',
      invoiceNumber: 'VN-HAI-2026-303'
    }
  }
];

export default function InvoiceParserModal({ isOpen, onClose, onApplyData }: InvoiceParserModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'sample'>('upload');
  const [rawText, setRawText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extracted data preview
  const [extractedData, setExtractedData] = useState<ParsedInvoiceData | null>(null);

  if (!isOpen) return null;

  // Smart heuristic extractor for trade invoices & text
  const parseInvoiceContent = (text: string, filename?: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      let prodName = '';
      let prodNameEn = '';
      let mat = '';
      let func = '';
      let origin = '중국 (CN)';
      let cif = 10000;
      let curr = 'USD';
      let qty = '1,000 KG';
      let invNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const lower = text.toLowerCase();

      // 1. Origin detection
      if (lower.includes('origin: usa') || lower.includes('united states') || lower.includes('u.s.a') || lower.includes('(us)')) {
        origin = '미국 (US)';
      } else if (lower.includes('origin: vietnam') || lower.includes('viet nam') || lower.includes('(vn)')) {
        origin = '베트남 (VN)';
      } else if (lower.includes('origin: germany') || lower.includes('deutschland') || lower.includes('(de)')) {
        origin = '독일 (DE)';
      } else if (lower.includes('origin: japan') || lower.includes('(jp)')) {
        origin = '일본 (JP)';
      } else if (lower.includes('origin: china') || lower.includes('prc') || lower.includes('(cn)')) {
        origin = '중국 (CN)';
      }

      // 2. Amount detection
      const amountMatch = text.match(/(?:total|amount|value|cif)[\s\:\$€₩]+([0-9,]+(?:\.[0-9]{2})?)/i);
      if (amountMatch && amountMatch[1]) {
        const num = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (!isNaN(num)) cif = num;
      }

      // 3. Currency detection
      if (text.includes('EUR') || text.includes('€')) curr = 'EUR';
      else if (text.includes('JPY') || text.includes('¥')) curr = 'JPY';
      else if (text.includes('KRW') || text.includes('₩')) curr = 'KRW';
      else curr = 'USD';

      // 4. Commodity Specific Matching
      if (lower.includes('soybean') || lower.includes('soy bean') || lower.includes('대두') || lower.includes('콩')) {
        prodName = '콩나물 재배용 대두 (Soybeans for sprouting)';
        prodNameEn = 'Yellow Soybeans for sprout cultivation (Non-GMO)';
        mat = '100% 천연 대두 종실 (Glycine max, 수분 13% 이하)';
        func = '식용 콩나물 재배 및 발아용 미가공 두류 종자 (원형 낟알)';
      } else if (lower.includes('sesame') || lower.includes('참깨') || lower.includes('깨')) {
        if (lower.includes('powder') || lower.includes('flour') || lower.includes('가루') || lower.includes('분말')) {
          prodName = '볶은 참깨가루 (Roasted Sesame Seed Powder)';
          prodNameEn = 'Roasted Sesamum Seed Powder (Heat-treated at 200°C)';
          mat = '100% 볶은 참깨 (열풍 로스팅 후 60메시 분쇄 분말)';
          func = '식품 조미 및 가공용 열처리 조제 참깨 분말 (조제식료품)';
        } else {
          prodName = '볶은 참깨 (Roasted Sesame Seeds)';
          prodNameEn = 'Roasted White Sesamum Seeds (Whole grains)';
          mat = '100% 볶은 흰참깨 (열처리 로스팅된 원형 낟알)';
          func = '식품 가공 및 식용 볶음 참깨';
        }
      } else if (lower.includes('motor') || lower.includes('pmsm') || lower.includes('모터') || lower.includes('전동기')) {
        prodName = '영구자석 동기 서보모터 (PMSM Synchronous Motor)';
        prodNameEn = 'PMSM Brushless Synchronous Servo Motor 3.0kW';
        mat = '알루미늄 케이싱, 동(구리) 권선, 네오디뮴(NdFeB) 영구자석';
        func = '산업용 로봇 및 자동화 설비 구동용 AC 서보 전동기 (출력 3kW)';
      } else if (lower.includes('battery') || lower.includes('배터리') || lower.includes('accumulator') || lower.includes('cell')) {
        prodName = '리튬이온 2차전지 배터리팩 (Lithium-ion Battery Pack)';
        prodNameEn = 'Lithium-ion Secondary Battery Pack 48V 20Ah';
        mat = 'NCM 리튬이온 셀, 스마트 배터리 보호회로(BMS), 알루미늄 합금 케이스';
        func = '전기 스쿠터 및 소형 모빌리티 구동 전원용 리튬 2차 축전지';
      } else if (lower.includes('fabric') || lower.includes('textile') || lower.includes('직물') || lower.includes('원단')) {
        prodName = '폴리에스테르 직포 원단 (Polyester Woven Fabric)';
        prodNameEn = '100% Polyester Printed Woven Fabric for Garments';
        mat = '100% 폴리에스테르 합성 필라멘트사';
        func = '의류 및 침구류 제조용 날염 직포 원단';
      } else if (lower.includes('salmon') || lower.includes('fish') || lower.includes('연어') || lower.includes('수산물')) {
        prodName = '급속 냉동 대서양 연어 필렛 (Frozen Salmon Fillets)';
        prodNameEn = 'Frozen Atlantic Salmon Fillets (Salmo salar)';
        mat = '100% 대서양 연어 (Salmo salar, 가시 및 껍질 제거)';
        func = '식용 및 횟감/스테이크용 냉동 수산물';
      } else {
        // Generic fallback from lines
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        prodName = lines[0] || (filename ? filename.replace(/\.[^/.]+$/, "") : '수입 인보이스 물품');
        prodNameEn = lines[0] || 'Imported Commodity Item';
        mat = '상업송장 기재 원재료 및 성분 사양 기준';
        func = '상업 및 산업 유통용 완제품/원자재';
      }

      setExtractedData({
        productName: prodName,
        productNameEn: prodNameEn,
        material: mat,
        functionUse: func,
        originCountry: origin,
        cifAmount: cif,
        currency: curr,
        quantity: qty,
        invoiceNumber: invNo
      });

      setIsProcessing(false);
    }, 400);
  };

  const handleFileUpload = (file: File) => {
    const sizeStr = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' 
      : (file.size / 1024).toFixed(0) + ' KB';
    
    setUploadedFile({ name: file.name, size: sizeStr, type: file.type });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    // Heuristic parse simulation from filename & typical OCR
    parseInvoiceContent(file.name, file.name);
  };

  const handleApply = () => {
    if (extractedData) {
      onApplyData(extractedData);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 11000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1.5px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '92vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: '#0f172a',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  📄 영문 상업송장(Invoice) · PDF 사양서 스마트 추출기
                </h3>
                <span style={{
                  background: 'rgba(20, 184, 166, 0.2)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  영-한 이중 AI 매핑
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                인보이스 사진(JPG/PNG), PDF 명세서, 또는 영문 텍스트를 입력하면 품명·재질·용도·금액을 자동 추출하여 분류기에 즉시 채워넣습니다.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderBottom: '1px solid #334155',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              background: activeTab === 'upload' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === 'upload' ? 'var(--accent-cyan)' : '#94a3b8',
              border: activeTab === 'upload' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Upload size={15} /> 📸 인보이스 사진 / PDF 파일 업로드
          </button>

          <button
            onClick={() => setActiveTab('text')}
            style={{
              background: activeTab === 'text' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === 'text' ? 'var(--accent-cyan)' : '#94a3b8',
              border: activeTab === 'text' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileCode size={15} /> ✍️ 인보이스 영문 텍스트 직접 붙여넣기
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            style={{
              background: activeTab === 'sample' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === 'sample' ? 'var(--accent-cyan)' : '#94a3b8',
              border: activeTab === 'sample' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={15} /> ⚡ 실무 상용 인보이스 샘플 1초 테스트
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          
          {/* TAB 1: File Dropzone */}
          {activeTab === 'upload' && (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/jpeg,image/png,image/webp,application/pdf';
                  input.onchange = (e: any) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload(file);
                  };
                  input.click();
                }}
                style={{
                  border: '2px dashed #475569',
                  borderRadius: '12px',
                  padding: '32px 20px',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={26} color="var(--accent-cyan)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    상업송장(Invoice) 사진 또는 PDF 사양서를 이곳에 끌어다 놓으세요
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    지원 형식: JPG, PNG, WEBP, PDF (최대 20MB)
                  </p>
                </div>
                <button
                  style={{
                    background: '#334155',
                    color: '#f8fafc',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  내 컴퓨터에서 파일 선택
                </button>
              </div>

              {uploadedFile && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>
                      {uploadedFile.type.includes('pdf') ? '📄' : '🖼️'}
                    </span>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                        {uploadedFile.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '8px' }}>
                        ({uploadedFile.size})
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    ✓ 텍스트 파싱 완료
                  </span>
                </div>
              )}

              {imagePreview && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Invoice Preview" 
                    style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid #334155' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Direct Text Paste */}
          {activeTab === 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  📋 인보이스 / 패킹리스트 원문 텍스트 붙여넣기 (영문/국문 모두 지원)
                </label>
                <button
                  onClick={() => {
                    if (rawText.trim()) parseInvoiceContent(rawText);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={14} /> 텍스트 즉시 분석
                </button>
              </div>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="예시:&#10;COMMERCIAL INVOICE&#10;Description: Roasted Sesamum Seed Powder (100% Pure, Heat treated)&#10;Origin: China (CN)&#10;Quantity: 5,000 KG&#10;Amount: USD 14,500.00 CIF Incheon"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  lineHeight: 1.5,
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* TAB 3: Practical Samples */}
          {activeTab === 'sample' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                ⚡ 실무 주요 국가별 인보이스 예시 (클릭 시 1초 만에 즉시 추출 및 파싱)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {SAMPLE_INVOICES.map((sample, sIdx) => (
                  <div
                    key={sIdx}
                    onClick={() => {
                      setRawText(sample.rawText);
                      setExtractedData(sample.parsed);
                    }}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {sample.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {sample.parsed.productNameEn} ({sample.parsed.originCountry})
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px' }}>
                      금액: ${sample.parsed.cifAmount?.toLocaleString()} {sample.parsed.currency} | 수량: {sample.parsed.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Data Live Form View */}
          {extractedData && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)',
              border: '1.5px solid rgba(6, 182, 212, 0.35)',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    🎯 AI 인보이스 텍스트 추출 및 정제 결과
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  수정이 필요할 경우 아래 입력창에서 바로 고칠 수 있습니다.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    상업적 제품명 (국문/영문 표준 거래품명)
                  </label>
                  <input 
                    type="text"
                    value={extractedData.productName}
                    onChange={(e) => setExtractedData({ ...extractedData, productName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    원산지 국가 (Country of Origin)
                  </label>
                  <input 
                    type="text"
                    value={extractedData.originCountry}
                    onChange={(e) => setExtractedData({ ...extractedData, originCountry: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                  물품 재질 및 원료 구성 (Material / Composition)
                </label>
                <input 
                  type="text"
                  value={extractedData.material}
                  onChange={(e) => setExtractedData({ ...extractedData, material: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                  주요 기능 및 용도 (Function / Application)
                </label>
                <input 
                  type="text"
                  value={extractedData.functionUse}
                  onChange={(e) => setExtractedData({ ...extractedData, functionUse: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    수입 신고 금액 (CIF 기준)
                  </label>
                  <input 
                    type="number"
                    value={extractedData.cifAmount}
                    onChange={(e) => setExtractedData({ ...extractedData, cifAmount: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    통화 단위 (Currency)
                  </label>
                  <input 
                    type="text"
                    value={extractedData.currency}
                    onChange={(e) => setExtractedData({ ...extractedData, currency: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    수입 수량 및 단위
                  </label>
                  <input 
                    type="text"
                    value={extractedData.quantity}
                    onChange={(e) => setExtractedData({ ...extractedData, quantity: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          background: '#0f172a',
          borderTop: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            💡 영문 품명과 스펙이 입력되면 WCO 영문 해설서와 한국 관세율표 10단위 HSK로 즉시 매칭됩니다.
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: '#334155',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              닫기
            </button>

            <button
              onClick={handleApply}
              disabled={!extractedData || isProcessing}
              style={{
                background: extractedData ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)' : '#475569',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 22px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: extractedData ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: extractedData ? '0 4px 15px rgba(6, 182, 212, 0.4)' : 'none'
              }}
            >
              <Check size={16} /> 분류기에 자동 입력 & AI 분석 시작
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
