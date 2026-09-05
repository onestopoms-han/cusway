import React from 'react';
import { 
  X, 
  Printer, 
  Scale, 
  ShieldCheck, 
  Zap, 
  Coins, 
  QrCode, 
  Award, 
  FileText
} from 'lucide-react';

interface MarketingBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding?: any;
}

export default function MarketingBrochureModal({
  isOpen,
  onClose,
  branding
}: MarketingBrochureModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="brochure-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="brochure-modal-wrapper"
        style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '94vh',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print" style={{
          padding: '14px 22px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#0d9488" />
            <div>
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                📄 CUSWAY 공식 B2B 솔루션 소개 브로슈어 (A4 규격 인쇄/PDF)
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b', marginLeft: '8px' }}>
                (관세사무소 및 수출입기업 도입 제안서)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(13, 148, 136, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Printer size={16} /> 브로슈어 인쇄 / PDF 저장
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                cursor: 'pointer',
                padding: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div 
          className="brochure-modal-scroll"
          style={{
            overflowY: 'auto',
            padding: '28px 24px',
            background: '#f1f5f9',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          
          {/* Printable Official Brochure Container (A4 Optimized) */}
          <div className="brochure-printable-paper" style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: '800px',
            padding: '48px 44px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
            fontFamily: "var(--font-family, 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            position: 'relative'
          }}>

            {/* 1. Header Banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2.5px solid #0d9488',
              paddingBottom: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    background: '#0d9488',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em'
                  }}>
                    대한민국 1위 관세 AI 솔루션
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                    WCO 해설서 & 9,450건 판례 마스터 기반
                  </span>
                </div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  margin: 0,
                  color: '#0f172a',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2
                }}>
                  CUSWAY <span style={{ color: '#0d9488' }}>Customs Copilot</span>
                </h1>
                <p style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 700, margin: '5px 0 0 0' }}>
                  관세사의 업무 속도와 소명 정확도를 10배 높이는 전용 AI 어시스턴트
                </p>
              </div>

              {/* Logo / Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#0f766e',
                  fontWeight: 800,
                  fontSize: '0.78rem'
                }}>
                  <ShieldCheck size={16} />
                  <span>공식 솔루션 제안서</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                  문서번호: CUSWAY-GTM-2026
                </div>
              </div>
            </div>

            {/* 2. Headline & Key Value Proposition */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)',
              border: '1px solid #ccfbf1',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f766e', margin: 0, lineHeight: 1.35 }}>
                "해설서 검색에 쓰던 하루 3시간, 3초 만에 끝내고<br />
                진짜 고부가가치 관세 컨설팅에 집중하십시오."
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                CUSWAY는 관세 업무의 핵심인 <strong>WCO 해설서 본문, 관세율표 통칙 1~6, 부·류 주규정, 관세청 공식 결정례</strong>를 실시간으로 결합하여 <strong>관세사무소 맞춤 A4 공식 검토의견서</strong>를 원스톱 자동 생성합니다.
              </p>
            </div>

            {/* 3. The 4 Killer Core Capabilities (4대 핵심 무기) */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', borderLeft: '4px solid #0d9488', paddingLeft: '8px', marginBottom: '14px' }}>
                CUSWAY 4대 핵심 차별화 역량 (Core Strengths)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                {/* Feature 1 */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Award size={18} color="#0d9488" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      1. 관세사 맞춤 Co-Branding A4 출력
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                    • 관세사무소 로고, 상호, 공인직인 도장이 찍힌 정식 A4 PDF 즉시 인쇄<br />
                    • 최하단 CUSWAY 공인 인증 바 & QR코드로 화주 신뢰도 200% 배가
                  </p>
                </div>

                {/* Feature 2 */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Coins size={18} color="#b45309" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      2. 비공개 판례 5만P 캐시백 거래소
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                    • 서랍 속 미공개 결정서 1건 공유 시 최대 ₩50,000P 실시간 감정 지급<br />
                    • 적립 포인트로 Pro 플랜(월 4.4만 원) 100% 무료 전액 차감 이용
                  </p>
                </div>

                {/* Feature 3 */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Zap size={18} color="#0891b2" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      3. 4단계 원스톱 수입통관 파이프라인
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                    • [HS 품목분류 ➔ 세관장 확인 요건 ➔ FTA 실익 ➔ 행정서류] 일괄 완성<br />
                    • 통관 보류 및 사후 추징금 위험을 원천 차단하는 완벽한 안전장치
                  </p>
                </div>

                {/* Feature 4 */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Scale size={18} color="#0d9488" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      4. AI 관세평가 & 조세심판원 판례 허브
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                    • 특수관계 이전가격, 로열티 가산 처분, 생산지원비 실시간 법리 매칭<br />
                    • 조세심판원/대법원 승소(처분 취소) 판결문을 근거로 완벽 소명
                  </p>
                </div>

              </div>
            </div>

            {/* 4. Comparison Table (Before vs After) */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', borderLeft: '4px solid #0d9488', paddingLeft: '8px', marginBottom: '14px' }}>
                기존 업무 방식 vs CUSWAY 도입 후 비교
              </h3>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '9px 12px', textAlign: 'left', width: '22%', color: '#334155', fontWeight: 800 }}>구분</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', color: '#e11d48', width: '39%', fontWeight: 800 }}>기존 방식 (유니패스/씨엘HS)</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', color: '#0d9488', width: '39%', fontWeight: 800 }}>CUSWAY AI 코파일럿</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, background: '#fafafa' }}>소명서 작성 시간</td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>건당 30분 ~ 1시간 수작업</td>
                    <td style={{ padding: '9px 12px', fontWeight: 800, color: '#0d9488' }}>단 3초 만에 자동 완성 (90% 절감)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, background: '#fafafa' }}>팀 동시접속 환경</td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>1인 1계정 선착순 튕김 발생</td>
                    <td style={{ padding: '9px 12px', fontWeight: 800, color: '#0d9488' }}>모바일/PC 무제한 동시 팀 협업</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, background: '#fafafa' }}>화주 제출용 보고서</td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>워드/한글로 매번 처음부터 작성</td>
                    <td style={{ padding: '9px 12px', fontWeight: 800, color: '#0d9488' }}>관세사 직인 A4 PDF 원클릭 발급</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '9px 12px', fontWeight: 700, background: '#fafafa' }}>지식 자산화 (캐시백)</td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>서랍 속 방치 (0원의 가치)</td>
                    <td style={{ padding: '9px 12px', fontWeight: 800, color: '#0d9488' }}>건당 최대 5만P 캐시백 ➔ 구독료 0원</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Pricing & Scale Plans */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', borderLeft: '4px solid #0d9488', paddingLeft: '8px', marginBottom: '14px' }}>
                관세사무소 규모별 구독 요금제 (Tiering System)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                
                {/* Basic Plan */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Basic (개인형)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0d9488', margin: '4px 0' }}>₩0 원 (무료)</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.45 }}>
                    • 1인 전용 (월 50회 무료 RAG)<br />
                    • 기본 HSK 코드 및 관세율 조회<br />
                    • 모바일/PC 자유로운 교차 접속
                  </div>
                </div>

                {/* Pro Plan */}
                <div style={{ border: '2px solid #0d9488', borderRadius: '8px', padding: '14px', background: '#f0fdfa', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '-10px', right: '10px', background: '#0d9488', color: '#ffffff', fontSize: '0.62rem', padding: '2px 7px', borderRadius: '4px', fontWeight: 800 }}>
                    ★ 실무팀 추천
                  </span>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f766e' }}>Pro (실무팀형)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0d9488', margin: '4px 0' }}>월 44,000 원</div>
                  <div style={{ fontSize: '0.68rem', color: '#334155', lineHeight: 1.45 }}>
                    • <strong>최대 5인 기본 포함</strong> (지사 전용)<br />
                    • <strong>무제한</strong> 4단계 원스톱 통관 심사<br />
                    • 관세사 맞춤 A4 공식 의견서 PDF<br />
                    • 비공개 결정례 캐시백 전액 차감
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Enterprise (법인형)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>월 290,000 원</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.45 }}>
                    • <strong>50인 이상 본·지사 완전 무제한</strong><br />
                    • 관세법인 <strong>내부 ERP 시스템 API 연동</strong><br />
                    • 본사-지사 이력 클라우드 동기화<br />
                    • 대량 신고서 오류 자동 검증 엔진
                  </div>
                </div>

              </div>
            </div>

            {/* 6. Contact & QR Code Footer */}
            <div style={{
              marginTop: '8px',
              borderTop: '2px solid #0f172a',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.74rem',
              color: '#475569'
            }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a', marginBottom: '3px' }}>
                  CUSWAY 고객 성공 본부 & B2B 도입 센터
                </div>
                <div>📞 도입 문의: 02-540-1234 | ✉️ 파트너십: contact@cusway.kr</div>
                <div>🌐 웹사이트: https://cusway.kr | 💬 카카오톡 채널: @CUSWAY_AI</div>
              </div>

              <div style={{ textAlign: 'center', background: '#f8fafc', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <QrCode size={36} color="#0d9488" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                  [무료 체험 QR코드]
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
