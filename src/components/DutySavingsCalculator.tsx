import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Info,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface DutySavingsCalculatorProps {
  hsCode: string;
  productName: string;
  originCountry?: string;
  initialCifAmount?: number;
  initialCurrency?: string;
}

export default function DutySavingsCalculator({
  hsCode,
  productName,
  originCountry = '중국 (CN)',
  initialCifAmount = 10000,
  initialCurrency = 'USD'
}: DutySavingsCalculatorProps) {
  const [cifAmount, setCifAmount] = useState<number>(initialCifAmount);
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [exchangeRate, setExchangeRate] = useState<number>(1350); // KRW per USD
  const [customBaseRate, setCustomBaseRate] = useState<number>(8); // Default 8%
  const [customFtaRate, setCustomFtaRate] = useState<number>(0); // Default 0%
  const [weightKg, setWeightKg] = useState<number>(1000);
  const [ftaAgreement, setFtaAgreement] = useState<string>('한-중 FTA / RCEP');

  // Detect agricultural sensitive items or high-tariff items
  const isAgriculturalSensitive = (() => {
    const clean = hsCode.replace(/[\.\-]/g, '');
    return (
      clean.startsWith('1201') || // 대두
      clean.startsWith('1207') || // 참깨
      clean.startsWith('200819') || // 볶은 참깨/견과
      clean.startsWith('0703') || // 마늘/양파
      clean.startsWith('0712') || // 건조 채소/버섯
      clean.startsWith('1006') || // 쌀
      clean.startsWith('0904')    // 고추
    );
  })();

  // Update default rates based on HS Code
  useEffect(() => {
    const clean = hsCode.replace(/[\.\-]/g, '');
    
    if (clean.startsWith('1201')) {
      // 대두
      setCustomBaseRate(487); // 양허관세 487% or 3% TRQ
      setCustomFtaRate(487); // 미양허
      setFtaAgreement('FTA 미양허 (한-중 FTA 양허제외 민감품목)');
    } else if (clean.startsWith('1207')) {
      // 참깨
      setCustomBaseRate(630); // 630%
      setCustomFtaRate(630);
      setFtaAgreement('FTA 미양허 (한-중 FTA 양허제외 민감품목)');
    } else if (clean.startsWith('2008193000')) {
      // 볶은 참깨가루
      setCustomBaseRate(45); // 45% or 40%
      setCustomFtaRate(45);
      setFtaAgreement('FTA 미양허 (한-중 FTA 양허제외 민감품목)');
    } else if (clean.startsWith('8517') || clean.startsWith('8471') || clean.startsWith('8541')) {
      // IT/반도체/전자
      setCustomBaseRate(0);
      setCustomFtaRate(0);
      setFtaAgreement('ITA 정보기술협정 / WTO 무세');
    } else if (clean.startsWith('8501')) {
      // 전동기/모터
      setCustomBaseRate(8);
      setCustomFtaRate(0);
      setFtaAgreement('한-EU / 한-중 / 한-미 FTA 0%');
    } else if (clean.startsWith('8507')) {
      // 축전지
      setCustomBaseRate(8);
      setCustomFtaRate(0);
      setFtaAgreement('한-베트남 / 한-중 FTA 0%');
    } else {
      setCustomBaseRate(8);
      setCustomFtaRate(0);
      setFtaAgreement('한-중 FTA / RCEP 0%');
    }
  }, [hsCode]);

  // Calculate duty in KRW
  const cifInKrw = currency === 'USD' 
    ? cifAmount * exchangeRate 
    : currency === 'EUR' 
      ? cifAmount * 1480 
      : currency === 'JPY' 
        ? cifAmount * 9.2 
        : cifAmount;

  const baseDuty = Math.round(cifInKrw * (customBaseRate / 100));
  const ftaDuty = Math.round(cifInKrw * (customFtaRate / 100));
  const savedDuty = Math.max(0, baseDuty - ftaDuty);

  const baseVat = Math.round((cifInKrw + baseDuty) * 0.1);
  const ftaVat = Math.round((cifInKrw + ftaDuty) * 0.1);

  const baseTotalTax = baseDuty + baseVat;
  const ftaTotalTax = ftaDuty + ftaVat;
  const totalSavedTax = Math.max(0, baseTotalTax - ftaTotalTax);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      border: '1.5px solid rgba(6, 182, 212, 0.35)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid var(--accent-cyan)',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚡ 실시간 관세 절감액 & 예상 납부 세액 1초 계산기
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              HSK <b>{hsCode}</b> ({productName || '대상 물품'})
            </span>
          </div>
        </div>

        <span style={{
          background: savedDuty > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          color: savedDuty > 0 ? '#10b981' : 'var(--accent-amber)',
          fontSize: '0.72rem',
          padding: '3px 10px',
          borderRadius: '12px',
          fontWeight: 700
        }}>
          {savedDuty > 0 ? `🎉 관세 ${savedDuty.toLocaleString()}원 절감 가능` : '세율 정밀 검토 요망'}
        </span>
      </div>

      {/* Input Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
            인보이스 CIF 금액
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input 
              type="number" 
              value={cifAmount} 
              onChange={(e) => setCifAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              style={{
                flex: 1,
                padding: '6px 10px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                padding: '6px 8px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: 'var(--accent-cyan)',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="KRW">KRW (원)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
            적용 환율 (1 USD 기준)
          </label>
          <input 
            type="number" 
            value={exchangeRate} 
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1350)}
            disabled={currency === 'KRW'}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.82rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
            기본/양허세율 (A/C)
          </label>
          <input 
            type="number" 
            value={customBaseRate} 
            onChange={(e) => setCustomBaseRate(parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: 'var(--accent-red)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
            FTA 특혜세율 (F/R)
          </label>
          <input 
            type="number" 
            value={customFtaRate} 
            onChange={(e) => setCustomFtaRate(parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#10b981',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          />
        </div>
      </div>

      {/* Sensitive Agriculture Alert if applicable */}
      {isAgriculturalSensitive && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.75rem',
          color: 'var(--accent-red)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>⚠️ 농산물 초민감 양허제외 품목 주의:</strong> 한-중 FTA 협정상 본 품목은 양허제외(미양허) 품목으로, 원산지증명서가 구비되어도 FTA 0%가 적용되지 않으며 시장접근물량(TRQ) 추천서 유무에 따라 세율이 상이합니다.
          </div>
        </div>
      )}

      {/* Real-time Calculation Comparison Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.7)',
        borderRadius: '10px',
        padding: '14px',
        border: '1px solid #334155'
      }}>
        {/* Box 1: Base Duty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
            기본세율 적용 시 ({customBaseRate}%)
          </span>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-red)' }}>
            {baseDuty.toLocaleString()}원
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
            (부가세 포함 {baseTotalTax.toLocaleString()}원)
          </span>
        </div>

        {/* Box 2: FTA Duty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
            FTA 특혜 적용 시 ({customFtaRate}%)
          </span>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
            {ftaDuty.toLocaleString()}원
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
            (부가세 포함 {ftaTotalTax.toLocaleString()}원)
          </span>
        </div>

        {/* Box 3: Total Saved */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '6px',
          padding: '6px 10px'
        }}>
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingDown size={14} /> 관세 순 절감액
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#10b981' }}>
            {savedDuty.toLocaleString()}원
          </div>
          <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>
            {customBaseRate > 0 ? `${Math.round((savedDuty / (baseDuty || 1)) * 100)}% 관세 감면 효과` : '무세 적용'}
          </span>
        </div>
      </div>

      {/* Practical Guide Footnote */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8', flexWrap: 'wrap', gap: '6px' }}>
        <span>
          💡 과세가격 환산액: <b>{cifInKrw.toLocaleString()}원</b> (CIF 기준)
        </span>
        <span>
          협정: <b>{ftaAgreement}</b> (원산지증명서 C/O 구비 필수)
        </span>
      </div>
    </div>
  );
}
