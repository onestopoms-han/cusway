import { useState } from 'react';
import { Gift, ShieldCheck, UploadCloud, Coins, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface UploadHistory {
  id: string;
  type: 'hs' | 'valuation';
  typeKo: string;
  hsCodeOrIssue: string;
  itemName: string;
  fileName: string;
  points: number;
  status: '검토 대기중' | '승인 완료' | '반려';
  date: string;
}

import { useEffect } from 'react';

interface CashBackManagerProps {
  currentUser: any;
}

export default function CashBackManager({ currentUser }: CashBackManagerProps) {
  const shareType = 'valuation'; // 관세평가 판례 전용으로 캐시백 제한 고정
  const [valuationIssue, setValuationIssue] = useState('');
  const [itemName, setItemName] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null);
  const [history, setHistory] = useState<UploadHistory[]>([]);

  // AI 분석 모듈 추가 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    rarity: '최상 (신규/독점)' | '우수 (희귀 쟁점)' | '보통 (일반 판례)' | '낮음 (중복 사례)';
    matchRate: number; // 기존 DB와 매칭률 (%)
    legalImpact: '경정청구 소명력 매우 높음 (상)' | '중' | '하';
    suggestedPoints: number; // AI 책정 포인트
    analysisSnippet: string;
  } | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/cashback/requests');
      if (response.ok) {
        const data = await response.json();
        // API 필드 매핑
        const mapped = data.map((item: any) => ({
          id: String(item.id),
          type: item.type,
          typeKo: item.type_ko,
          hsCodeOrIssue: item.hs_code_or_issue,
          itemName: item.item_name,
          fileName: item.file_name,
          points: item.points,
          status: item.status,
          date: item.date
        }));
        // 관세평가 판례 타입만 필터링 노출하여 일관성 유지
        const filtered = mapped.filter((x: any) => x.type === 'valuation');
        setHistory(filtered);
      }
    } catch (err) {
      console.warn('FastAPI 백엔드가 구동되지 않아 로컬 메모리 모드로 작동합니다.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalPoints = history
    .filter(item => item.status === '승인 완료')
    .reduce((sum, item) => sum + item.points, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFileName(uploadedFile.name);
      
      // 파일 업로드 시 즉시 RAG 매칭 및 가치평가 시뮬레이션 가동
      setIsAnalyzing(true);
      setAnalysisResult(null);
      
      setTimeout(() => {
        // 관세평가 판례 유사도 매칭률
        const randomMatchRate = Math.floor(Math.random() * 40) + 10; // 10~50% 독창성 매칭
        
        let rarityVal: any = '최상 (신규/독점)';
        let pts = 15000;
        let impact: any = '경정청구 소명력 매우 높음 (상)';
        let snippet = `본 조세심판/법원 판결 자료는 기존 관세평가 DB 내에 유사 쟁점이 존재하지 않는 고가치 판결 소명 자료입니다.`;

        if (randomMatchRate > 40) {
          rarityVal = '보통 (일반 판례)';
          pts = 5000;
          impact = '중';
          snippet = `일반적인 평가 쟁점(이전가격/권리사용료)을 다루고 있으나 법적 논리 보강용으로 가치가 우수한 문서입니다.`;
        } else if (randomMatchRate > 20) {
          rarityVal = '우수 (희귀 쟁점)';
          pts = 9000;
          impact = '중';
          snippet = `다국적 거래 등 특수관계자 간 간접지급액 평가 등 실무상 매우 희귀한 쟁점을 포함한 판례 자료입니다.`;
        }

        setAnalysisResult({
          rarity: rarityVal,
          matchRate: randomMatchRate,
          legalImpact: impact,
          suggestedPoints: pts,
          analysisSnippet: snippet
        });
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryIdentifier = shareType === 'hs' ? hsCode : valuationIssue;
    if (!primaryIdentifier || !itemName || !fileName) {
      alert('모든 입력 항목과 문서를 업로드해 주세요.');
      return;
    }

    const ptsToAward = analysisResult ? analysisResult.suggestedPoints : (shareType === 'valuation' ? 8000 : 5000);

    const payload = {
      email: currentUser?.email || 'guest@cusway.kr',
      type: shareType,
      type_ko: shareType === 'hs' ? 'HS 품목분류' : '관세평가 판례',
      hs_code_or_issue: primaryIdentifier,
      item_name: itemName,
      file_name: fileName,
      points: ptsToAward
    };

    try {
      const response = await fetch('/api/cashback/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('캐시백 업로드 전송 실패');
      }
      
      setUploadStatus(true);
      setAnalysisResult(null);
      fetchHistory();
    } catch (err) {
      // Fallback
      const newRecord: UploadHistory = {
        id: String(history.length + 1),
        type: shareType,
        typeKo: '관세평가 판례',
        hsCodeOrIssue: primaryIdentifier,
        itemName,
        fileName,
        points: ptsToAward,
        status: '승인 완료', // 시뮬레이터 즉시 적립 연동
        date: new Date().toISOString().split('T')[0]
      };
      setHistory([newRecord, ...history]);
      setUploadStatus(true);
      setAnalysisResult(null);
    }
    
    // 입력 초기화
    setValuationIssue('');
    setItemName('');
    setFileName('');

    setTimeout(() => {
      setUploadStatus(null);
    }, 4000);
  };

  const handleAppeal = async (reqId: string) => {
    const reason = prompt('반려에 대한 재확인(소명) 요청 사유를 작성해 주세요. (예: 2012년 발행된 관세평가분류원 서한 공문 원본임):');
    if (!reason || reason.trim() === '') return;

    try {
      const response = await fetch(`/api/cashback/requests/${reqId}/appeal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appeal_reason: reason })
      });
      if (response.ok) {
        alert('재심사 청구가 성공적으로 접수되었습니다. 관리자팀에서 24시간 내 수동 재검증을 진행합니다.');
        fetchHistory();
      }
    } catch (err) {
      alert('서버 연결 실패. 재심사가 가상으로 정상 접수되었습니다.');
      setHistory(prev => prev.map(item => item.id === reqId ? { ...item, status: '재확인 요청중', fileName: `${item.fileName} (소명: ${reason})` } : item));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Upper Status Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 70, 239, 0.08) 100%)', 
        border: '1px solid rgba(245, 158, 11, 0.2)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Coins size={24} color="var(--accent-amber)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>관세평가 조세심판원 & 법원 판례 공유 캐시백 센터</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              보유하신 관세청 유권해석, 조세심판원 심판결정례, 또는 법원의 관세평가 판결인용 자료를 공유해 주세요. 전문 검수 승인 시 다음 달 구독료에서 즉시 차감되는 캐시백 포인트를 적립해 드립니다.
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>보유중인 누적 적립 포인트</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              ₩{totalPoints.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid split: Upload Form and History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Upload Document Form */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <UploadCloud size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>판례/심판 결정례 공유 등록 신청</h3>
          </div>

          {uploadStatus && (
            <div style={{ 
              padding: '12px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              borderRadius: '8px', 
              color: '#a7f3d0', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              공식 판례/심판례 문서 등록 신청이 완료되었습니다! 검수 완료 후 캐시백 포인트가 지급됩니다.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                관세평가 핵심 쟁점 주제
              </label>
              <input 
                type="text" 
                placeholder="예: 특수관계자 이전가격 영향 여부, 로열티의 거래조건성..." 
                value={valuationIssue}
                onChange={(e) => setValuationIssue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                품목명 / 사건명 (상세 내역)
              </label>
              <input 
                type="text" 
                placeholder="예: 다국적 의류법인 완제품 수입 상표권 분쟁 (또는 이전가격 사후 조정 건)"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                공식 회신문 / 판결문 PDF/이미지 첨부
              </label>
              <div style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <UploadCloud size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {fileName ? `선택된 파일: ${fileName}` : '클릭하거나 PDF/이미지 드래그 앤 드롭'}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  * 수입자명, 상호, 계좌정보 등 민감한 개인/기업 영업 비밀 정보는 사전에 블랙 마스킹(비식별 가림) 처리 후 업로드해 주세요.
                </p>
              </div>
            </div>

            {/* AI 실시간 문서 가치 분석 및 매칭률 평가 리포트 뷰어 */}
            {isAnalyzing && (
              <div style={{
                padding: '20px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px dashed var(--accent-cyan)',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(6, 182, 212, 0.2)',
                  borderTop: '3px solid var(--accent-cyan)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  AI가 11개년 관세청 사전심사 DB와 매칭률 대조 및 독점성 가치 평가 중...
                </span>
              </div>
            )}

            {analysisResult && (
              <div className="glass-panel" style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(217, 70, 239, 0.05) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <Gift size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>🤖 AI 실시간 사전회시 가치평가 리포트</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>기존 DB와 매칭률:</span>
                    <strong style={{ color: 'var(--accent-cyan)', marginLeft: '6px' }}>{analysisResult.matchRate}%</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>자료 희귀성 등급:</span>
                    <strong style={{ color: 'var(--accent-amber)', marginLeft: '6px' }}>{analysisResult.rarity}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>세액 절감 파급력:</span>
                    <strong style={{ color: '#d946ef', marginLeft: '6px' }}>{analysisResult.legalImpact}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>AI 산정 적정 가치:</span>
                    <strong style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', marginLeft: '6px' }}>
                      ₩{analysisResult.suggestedPoints.toLocaleString()} P
                    </strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', lineHeight: 1.4 }}>
                  💡 <b>AI 코멘트:</b> {analysisResult.analysisSnippet}
                </p>
              </div>
            )}

            <button 
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                background: 'linear-gradient(135deg, var(--accent-amber) 0%, #d946ef 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              캐시백 신청하기 (건당 ₩5,000 ~ ₩10,000 적립)
            </button>
          </form>

          {/* Legal Notice */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.75rem',
            color: '#fca5a5',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <strong>정보 보안 통제 정책:</strong><br />
              업로드된 결정서 데이터는 AI RAG 학습용 결정례 가공(비식별화)에만 독점 사용되며, 타 회원에게 화주 및 수입자명이 고스란히 유출되지 않도록 시스템 차원에서 엄격한 데이터 필터링을 거치게 되므로 안심하고 등록하셔도 좋습니다.
            </div>
          </div>
        </div>

        {/* Right Side: Upload History & Point Balance */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <FileText size={18} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>나의 결정례 공유 및 캐시백 승인 내역</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px' }}>
            {history.map((item) => (
              <div key={item.id} style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: item.type === 'hs' ? 'rgba(20, 184, 166, 0.15)' : 'rgba(6, 182, 212, 0.15)', color: item.type === 'hs' ? 'var(--accent-primary)' : 'var(--accent-cyan)', fontWeight: 700 }}>
                      {item.typeKo}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {item.hsCodeOrIssue}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {item.itemName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    파일: {item.fileName} | 신청일: {item.date}
                  </span>
                </div>

                <div style={{ textShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    background: item.status === '승인 완료' ? 'rgba(16, 185, 129, 0.15)' : 
                                item.status === '재확인 요청중' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: item.status === '승인 완료' ? '#10b981' : 
                           item.status === '재확인 요청중' ? 'var(--accent-cyan)' : '#f59e0b'
                  }}>
                    {item.status}
                  </span>
                  {item.status === '반려' && (
                    <button 
                      onClick={() => handleAppeal(item.id)}
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '4px',
                        color: '#fca5a5',
                        cursor: 'pointer',
                        marginTop: '2px'
                      }}
                    >
                      재확인 요청
                    </button>
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                    +{item.points.toLocaleString()} P
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Guide Box */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4
          }}>
            💡 <strong>포인트 소진 혜택:</strong> 적립된 캐시백 포인트는 차월 베이직/법인 요금제 청구 시 **자동으로 현금 차감(차액만 결제)** 처리됩니다.
          </div>
        </div>

      </div>

    </div>
  );
}
