import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Tag, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  HelpCircle,
  Package,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { getOriginMarkingGuide, OriginMarkingGuide } from '../utils/originMarkingHelper';

interface OriginMarkingGuideWidgetProps {
  hsCode: string;
  productName?: string;
  originCountryCode?: string;
  compact?: boolean;
}

export default function OriginMarkingGuideWidget({
  hsCode,
  productName,
  originCountryCode = 'CN',
  compact = false
}: OriginMarkingGuideWidgetProps) {
  const guide = getOriginMarkingGuide(hsCode, productName, originCountryCode);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'marking' | 'exemption' | 'customs'>('marking');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #cbd5e1',
      borderRadius: '12px',
      padding: compact ? '16px 18px' : '22px 24px',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      color: '#0f172a'
    }}>
      
      {/* Widget Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1.5px solid #e2e8f0',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Tag size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                🏛️ 대외무역법 제33조 원산지표시(Origin Marking) 규정 및 라벨링 실무 가이드
              </h4>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                borderRadius: '4px',
                fontWeight: 800
              }}>
                세관 의무 심사 대상
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              적용 품목군: <strong>{guide.categoryName}</strong> | 대상 국가: <strong>{guide.countryNameKo} ({guide.countryNameEn})</strong>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          {[
            { id: 'marking', label: '표시 방법 및 서식' },
            { id: 'exemption', label: '면제 요건' },
            { id: 'customs', label: '세관 보수작업' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#0d9488' : '#64748b',
                fontSize: '0.75rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Tab 1: Marking Guidelines & Sample Formats */}
      {activeTab === 'marking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Quick Copy Label Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)',
            border: '1px solid #ccfbf1',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#0f766e', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                💡 권장 원산지 표시 서식 (포장 및 본체 인쇄용)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', background: '#ffffff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #99f6e4' }}>
                  {guide.koreanMarkExample}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', background: '#ffffff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #99f6e4' }}>
                  {guide.englishMarkExample}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  또는 "{guide.alternativeMarkExample}"
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleCopy(`${guide.koreanMarkExample} / ${guide.englishMarkExample}`, 'all')}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  background: '#0d9488',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
                }}
              >
                {copiedType === 'all' ? <Check size={14} /> : <Copy size={14} />}
                {copiedType === 'all' ? '복사 완료!' : '문구 복사'}
              </button>
            </div>
          </div>

          {/* Detailed Legal & Practice Comparison Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', width: '22%', color: '#334155', fontWeight: 800 }}>구분 항목</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', width: '38%', color: '#0f172a', fontWeight: 800 }}>대외무역법 법적 요구사항</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', width: '40%', color: '#0d9488', fontWeight: 800 }}>본 품목 권장 실무 가이드</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', fontWeight: 700, background: '#fafafa' }}>① 표시 위치</td>
                <td style={{ padding: '8px 10px', color: '#475569' }}>최종 구매자가 쉽게 판독할 수 있는 본체 및 개별 외포장</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>{guide.markingLocation}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', fontWeight: 700, background: '#fafafa' }}>② 표시 방식 (내구성)</td>
                <td style={{ padding: '8px 10px', color: '#475569' }}>쉽게 지워지거나 떨어지지 않는 견고한 방식 (단순 스티커 제한)</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>{guide.markingMethod}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', fontWeight: 700, background: '#fafafa' }}>③ 이중 표시 의무</td>
                <td style={{ padding: '8px 10px', color: '#475569' }}>개별 포장되어 유통되는 물품은 본체와 포장 각각 표시</td>
                <td style={{ padding: '8px 10px', fontWeight: 800, color: guide.isPackagingDoubleMarkRequired ? '#b45309' : '#059669' }}>
                  {guide.isPackagingDoubleMarkRequired ? '⚠️ 필수 (물품 본체 + 개별 소매 외포장 모두 표시)' : '선택적 (용기 단위 식별 가능 시 갈음)'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 10px', fontWeight: 700, background: '#fafafa' }}>④ 활자 크기 & 언어</td>
                <td style={{ padding: '8px 10px', color: '#475569' }}>한글, 한자 또는 영문 8pt 이상 명확한 활자</td>
                <td style={{ padding: '8px 10px', color: '#0f172a' }}>{guide.fontSizeRule}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 10px', fontWeight: 700, background: '#fafafa' }}>⑤ 위반 시 처분</td>
                <td style={{ padding: '8px 10px', color: '#e11d48' }} colSpan={2}>
                  미표시, 허위표시, 손상·변경 시 <strong>시정명령 및 최대 3억 원 이하 과징금</strong>, 5년 이하 징역 또는 5천만 원 벌금 (대외무역법 제33조)
                </td>
              </tr>
            </tbody>
          </table>

          {/* Key Compliance Checklist */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>
              📋 관세사 실무 점검 체크포인트 (세관 사전검사 대비):
            </span>
            {guide.keyCheckpoints.map((point, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.75rem', color: '#475569' }}>
                <CheckCircle2 size={13} color="#0d9488" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{point}</span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. Tab 2: Exemption Rules */}
      {activeTab === 'exemption' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '14px 18px'
          }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              📜 대외무역법 시행령 제56조 (원산지표시의 면제) 대상
            </h5>
            <p style={{ margin: '0 0 10px 0', color: '#475569', lineHeight: 1.5 }}>
              다음 각 호의 어느 하나에 해당하는 물품은 수입 통관 시 세관장에게 <strong>[원산지표시 면제확인신청서]</strong>를 제출하여 승인을 받는 경우 본체 표시가 면제됩니다.
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#334155', lineHeight: 1.45 }}>
              <li><strong>1. 외화획득용 원부자재:</strong> 수입 후 수출물품 제조에 전량 사용되는 물품</li>
              <li><strong>2. 제조용 원재료:</strong> 수입 후 국내 제조·가공 공정에 투입되어 원래의 성상 및 형질이 완전히 소멸/변형되는 물품</li>
              <li><strong>3. 연구개발 및 견본품(Sample):</strong> 판매 목적이 아닌 연구, 시험, 분석용 물품</li>
              <li><strong>4. 개인 자가사용 수입물품:</strong> 판매용이 아닌 개인 소비용 물품</li>
              <li><strong>5. 파손/손상 우려 물품:</strong> 본체에 원산지를 표시할 경우 상품 가치가 현저히 손상되는 물품 (포장 표시로 갈음)</li>
            </ul>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#166534',
            fontSize: '0.76rem',
            lineHeight: 1.5
          }}>
            <strong>💡 본 품목 적용 가이드:</strong> {guide.exemptionRule}
          </div>
        </div>
      )}

      {/* 3. Tab 3: Customs Repair Procedure */}
      {activeTab === 'customs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '14px 18px',
            color: '#991b1b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={18} color="#dc2626" />
              <strong style={{ fontSize: '0.88rem' }}>세관 수입검사 원산지 미표시/오표시 적발 시 구제 절차</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.5, color: '#7f1d1d' }}>
              수입신고 후 세관 검사(C/S 검사)에서 원산지 표시가 미흡하거나 누락된 경우, 즉시 통관이 보류되며 관세청 <strong>[원산지표시 보수작업]</strong> 절차를 거쳐야 반출이 승인됩니다.
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '14px 18px'
          }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
              🛠️ 보세구역 내 원산지표시 보수작업 진행 4단계
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', borderLeft: '3px solid #0d9488' }}>
                <strong>1. 세관 보수작업 승인 신청:</strong> 관세사를 통해 유니패스(UNIPASS)로 [보수작업 승인신청서] 및 견본 사진 제출
              </div>
              <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', borderLeft: '3px solid #0d9488' }}>
                <strong>2. 보세창고 내 작업 실시:</strong> 세관 승인 후 보세구역 내에서 인쇄, 각인, 봉제라벨, 스티커 부착 작업 진행
              </div>
              <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', borderLeft: '3px solid #0d9488' }}>
                <strong>3. 보수작업 완료 보고 & 세관 실물 검사:</strong> 완료된 물품 사진 첨부 보고 및 세관원 현품 재검사
              </div>
              <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', borderLeft: '3px solid #0d9488' }}>
                <strong>4. 수입신고 수리 및 반출:</strong> 적법 표시 확인 후 최종 수입신고필증 교부 및 국내 반출 허용
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
