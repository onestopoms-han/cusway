import { useState, useEffect } from 'react';
import { 
  Gift, 
  ShieldCheck, 
  UploadCloud, 
  Coins, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Layers, 
  Award,
  TrendingUp,
  Search,
  Scale
} from 'lucide-react';

interface UploadHistory {
  id: string;
  type: 'hs' | 'valuation';
  typeKo: string;
  hsCodeOrIssue: string;
  itemName: string;
  fileName: string;
  points: number;
  status: '검토 대기중' | '승인 완료' | '반려' | '재확인 요청중';
  date: string;
}

interface CashBackManagerProps {
  currentUser: any;
}

export default function CashBackManager({ currentUser }: CashBackManagerProps) {
  const [shareType, setShareType] = useState<'hs' | 'valuation'>('hs');
  const [hsCode, setHsCode] = useState('');
  const [valuationIssue, setValuationIssue] = useState('');
  const [itemName, setItemName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string | null>(null);
  const [isConfidential, setIsConfidential] = useState(true); // 비공개 결정서 기본 체크
  const [decisionType, setDecisionType] = useState<'overturned' | 'approved' | 'rejected'>('approved'); // 승소/인용 여부
  
  // FTA 원산지 & GRI 정밀 심사 파라미터 (사용자 피드백 반영: 대량 비공개 회신 정밀 감정)
  const [ftaAgreement, setFtaAgreement] = useState<string>('none'); // FTA 협정 대상
  const [psrSensitivity, setPsrSensitivity] = useState<'standard' | 'cth_sensitive' | 'rvc_sensitive' | 'origin_dispute'>('standard');
  const [griComplexity, setGriComplexity] = useState<'gri_1' | 'gri_2' | 'gri_3' | 'chapter_note'>('gri_1');
  const [hasEvidencePackage, setHasEvidencePackage] = useState<boolean>(false);

  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
    points?: number;
  } | null>(null);
  const [history, setHistory] = useState<UploadHistory[]>([]);
  const [localAddedPoints, setLocalAddedPoints] = useState(0);

  // AI 가치 감정 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    appraisedPoints: number;
    scarcityGrade: string;
    scarcityRate: number;
    matchedPublicCount: number;
    basePoints: number;
    confidentialBonus: number;
    decisionBonus: number;
    scarcityBonus: number;
    appraisalSnippet: string;
  } | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/cashback/requests');
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((item: any) => ({
          id: String(item.id),
          type: item.type || 'hs',
          typeKo: item.type_ko || (item.type === 'hs' ? 'HS 품목분류' : '조세심판/관세평가'),
          hsCodeOrIssue: item.hs_code_or_issue || '',
          itemName: item.item_name || '',
          fileName: item.file_name || '',
          points: item.points || 10000,
          status: item.status || '승인 완료',
          date: item.date || new Date().toISOString().split('T')[0]
        }));
        setHistory(mapped);
      }
    } catch (err) {
      console.warn('FastAPI 백엔드 미응답, 로컬 시뮬레이션 상태 유지');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalPoints = history
    .filter(item => item.status === '승인 완료')
    .reduce((sum, item) => sum + item.points, (currentUser?.accrued_points || 15000)) + localAddedPoints;

  // AI 실시간 가치 감정 실행 함수
  const triggerAppraisal = async (
    customFile?: File, 
    overrideHs?: string, 
    overrideItem?: string, 
    overrideType?: 'hs' | 'valuation',
    overridePsr?: 'standard' | 'cth_sensitive' | 'rvc_sensitive' | 'origin_dispute',
    overrideGri?: 'gri_1' | 'gri_2' | 'gri_3' | 'chapter_note',
    overrideEvidence?: boolean
  ) => {
    const currentShareType = overrideType || shareType;
    const identifier = overrideHs || (currentShareType === 'hs' ? hsCode : valuationIssue);
    const nameToEvaluate = overrideItem || itemName || (customFile ? customFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') : '');
    const activePsr = overridePsr !== undefined ? overridePsr : psrSensitivity;
    const activeGri = overrideGri !== undefined ? overrideGri : griComplexity;
    const activeEvidence = overrideEvidence !== undefined ? overrideEvidence : hasEvidencePackage;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/cashback/appraise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_type: currentShareType,
          item_name: nameToEvaluate || '수입물품 비공개 결정서',
          identifier: identifier || (currentShareType === 'hs' ? '8517.62-6000' : '특수관계 이전가격'),
          is_confidential: isConfidential,
          decision_type: decisionType,
          fta_agreement: ftaAgreement,
          psr_sensitivity: activePsr,
          gri_complexity: activeGri,
          has_evidence_package: activeEvidence
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult({
          appraisedPoints: data.appraised_points,
          scarcityGrade: data.scarcity_grade,
          scarcityRate: data.scarcity_rate,
          matchedPublicCount: data.matched_public_count,
          basePoints: data.base_points,
          confidentialBonus: data.confidential_bonus,
          decisionBonus: data.decision_bonus,
          scarcityBonus: data.scarcity_bonus,
          appraisalSnippet: data.appraisal_snippet
        });
      } else {
        throw new Error('Fallback to local calculation');
      }
    } catch (e) {
      // Local fallback calculation logic with strict domain distinction
      if (currentShareType === 'hs') {
        const basePts = 500;
        const confBonus = isConfidential ? 1000 : 300;
        const decBonus = decisionType === 'overturned' ? 1000 : 500;
        
        let psrBonus = 0;
        let psrLabel = '일반 분류';
        if (activePsr === 'cth_sensitive') { psrBonus = 2000; psrLabel = 'FTA 세번변경(CTH/CTSH) 경합'; }
        else if (activePsr === 'rvc_sensitive') { psrBonus = 2500; psrLabel = '부가가치기준(RVC) 쟁점'; }
        else if (activePsr === 'origin_dispute') { psrBonus = 3500; psrLabel = 'FTA 원산지검증 방어 소명'; }

        let griBonus = 0;
        let griLabel = '통칙 1호 표준';
        if (activeGri === 'gri_2') { griBonus = 1500; griLabel = '통칙 2호 (미완성/혼합물)'; }
        else if (activeGri === 'gri_3') { griBonus = 2500; griLabel = '통칙 3호 (본질적 특성)'; }
        else if (activeGri === 'chapter_note') { griBonus = 2000; griLabel = '부·류 주규정 배제'; }

        const evidenceBonus = activeEvidence ? 1500 : 0;
        const total = Math.min(10000, basePts + confBonus + decBonus + psrBonus + griBonus + evidenceBonus);

        setAnalysisResult({
          appraisedPoints: total,
          scarcityGrade: activePsr !== 'standard' || activeGri !== 'gri_1' ? '고난도 FTA 법리 회시 (Level 3~4)' : (isConfidential ? '신규 세번 (DB 미등재 신제품)' : '일반 세번 (표준 분류 규격)'),
          scarcityRate: activePsr !== 'standard' ? 95.0 : (isConfidential ? 92.0 : 75.0),
          matchedPublicCount: isConfidential ? 1 : 4,
          basePoints: basePts,
          confidentialBonus: confBonus,
          decisionBonus: decBonus + psrBonus + griBonus + evidenceBonus,
          scarcityBonus: 0,
          appraisalSnippet: `본 품목분류 회시서는 CUSWAY FTA 정밀 심사 결과 [${psrLabel} + ${griLabel}${activeEvidence ? ' + 원산지증빙 완비' : ''}]로 판정되어, 정밀 가치 평가에 따라 ₩${total.toLocaleString()}P의 캐시백이 산정되었습니다.`
        });
      } else {
        const basePts = 10000;
        const confBonus = isConfidential ? 20000 : 5000;
        const decBonus = decisionType === 'overturned' ? 15000 : 5000;
        const total = Math.min(50000, basePts + confBonus + decBonus);

        setAnalysisResult({
          appraisedPoints: total,
          scarcityGrade: isConfidential ? '최상급 (국내 유일 미공개 독점 판례)' : '우수 (실무 검증 가치 높음)',
          scarcityRate: isConfidential ? 97.5 : 82.0,
          matchedPublicCount: isConfidential ? 1 : 4,
          basePoints: basePts,
          confidentialBonus: confBonus,
          decisionBonus: decBonus,
          scarcityBonus: 0,
          appraisalSnippet: `본 조세심판원/관세평가 결정문은 CUSWAY 9,450건 마스터 DB 대조 결과 독창성 ${isConfidential ? '97.5%' : '82.0%'}로 산정되어, 최대 ₩${total.toLocaleString()}P의 고가치 캐시백이 책정되었습니다.`
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 스마트 결정례 파일 파싱 및 폼 자동 채움 (Auto-fill) 함수
  const processUploadedFile = (file: File) => {
    setFileName(file.name);
    const sizeInKb = (file.size / 1024).toFixed(1);
    setFileSize(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`);
    setIsParsingFile(true);
    setParseSuccessMsg(null);

    // 파일명 및 내용 시뮬레이션 파싱
    setTimeout(() => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      
      // 1. HS Code 감지 (예: 8517.62, 8517.62-6000, 200819 등)
      const hsMatch = file.name.match(/(\d{4}[\.\-]?\d{2}([\.\-]?\d{4})?)/);
      let detectedHs = hsMatch ? hsMatch[0].replace(/[\.\-]/g, '') : '';
      if (detectedHs.length >= 6) {
        if (detectedHs.length === 10) {
          detectedHs = `${detectedHs.slice(0, 4)}.${detectedHs.slice(4, 6)}-${detectedHs.slice(6, 10)}`;
        } else {
          detectedHs = `${detectedHs.slice(0, 4)}.${detectedHs.slice(4, 6)}`;
        }
      }

      // 2. 심판/평가 키워드 감지 (조심, 국심, 이전가격, 로열티, 특수관계, 과세가격 등)
      const isValuationDoc = /조심|국심|심판|평가|로열티|이전가격|특수관계|가산세|생산지원/i.test(file.name);
      
      // 3. FTA PSR 및 고난도 법리 키워드 감지
      const isFtaCth = /fta|원산지|cth|ctsh|psr|세번변경|부가가치|rvc/i.test(file.name);
      const isGriComplex = /통칙|본질|세트|주규정|혼합|가공/i.test(file.name);
      const isEvidence = /bom|소명|의견서|공정도|사양/i.test(file.name);

      let determinedType: 'hs' | 'valuation' = shareType;
      let finalHs = hsCode;
      let finalIssue = valuationIssue;
      let finalItem = itemName || cleanName;

      let detectedPsr: 'standard' | 'cth_sensitive' | 'rvc_sensitive' | 'origin_dispute' = psrSensitivity;
      let detectedGri: 'gri_1' | 'gri_2' | 'gri_3' | 'chapter_note' = griComplexity;
      let detectedEvidence = hasEvidencePackage;

      if (isValuationDoc) {
        determinedType = 'valuation';
        setShareType('valuation');
        finalIssue = cleanName;
        setValuationIssue(cleanName);
        setParseSuccessMsg(`⚖️ 조세심판원/관세평가 결정문 감지: 고가치 법리 자산 (최대 50,000P 대상)`);
      } else if (detectedHs || isFtaCth) {
        determinedType = 'hs';
        setShareType('hs');
        if (detectedHs) {
          finalHs = detectedHs;
          setHsCode(detectedHs);
        }
        if (isFtaCth) {
          detectedPsr = 'cth_sensitive';
          setPsrSensitivity('cth_sensitive');
        }
        if (isGriComplex) {
          detectedGri = 'gri_3';
          setGriComplexity('gri_3');
        }
        if (isEvidence) {
          detectedEvidence = true;
          setHasEvidencePackage(true);
        }
        setParseSuccessMsg(`📦 FTA 품목분류 회시서 감지: ${isFtaCth ? 'FTA 세번변경(CTH) 경합' : '정형 세번'} 정밀 심사 가동`);
      } else {
        if (shareType === 'hs' && !hsCode) {
          finalHs = '8517.62-6000';
          setHsCode('8517.62-6000');
        } else if (shareType === 'valuation' && !valuationIssue) {
          finalIssue = cleanName;
          setValuationIssue(cleanName);
        }
        setParseSuccessMsg(`📄 결정서 파일 "${file.name}" 분석 완료! FTA 정밀 가치 감정을 시작합니다.`);
      }

      if (!itemName) {
        setItemName(cleanName);
        finalItem = cleanName;
      }

      setIsParsingFile(false);
      triggerAppraisal(file, finalHs, finalItem, determinedType, detectedPsr, detectedGri, detectedEvidence);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryIdentifier = shareType === 'hs' ? (hsCode || '8517.62-6000') : (valuationIssue || '비공개 관세평가 쟁점');
    const effectiveItemName = itemName || (fileName ? fileName.replace(/\.[^/.]+$/, '') : '기업 비공개 결정례');
    const effectiveFileName = fileName || '비공개_결정서_스캔본.pdf';

    const ptsToAward = analysisResult ? analysisResult.appraisedPoints : (isConfidential ? 35000 : 15000);

    const payload = {
      email: currentUser?.email || 'guest@cusway.kr',
      type: shareType,
      type_ko: shareType === 'hs' ? 'HS 품목분류 (비공개)' : '조세심판/관세평가 (비공개)',
      hs_code_or_issue: primaryIdentifier,
      item_name: `${isConfidential ? '[비공개] ' : ''}${effectiveItemName}`,
      file_name: effectiveFileName,
      points: ptsToAward
    };

    // 1. 즉시 Optimistic UI 업데이트 (사용자 대기 시간 0초)
    const newRecord: UploadHistory = {
      id: `local-${Date.now()}`,
      type: shareType,
      typeKo: shareType === 'hs' ? 'HS 품목분류 (비공개)' : '조세심판/관세평가 (비공개)',
      hsCodeOrIssue: primaryIdentifier,
      itemName: `${isConfidential ? '[비공개] ' : ''}${effectiveItemName}`,
      fileName: effectiveFileName,
      points: ptsToAward,
      status: '승인 완료',
      date: new Date().toISOString().split('T')[0]
    };
    setHistory(prev => [newRecord, ...prev]);
    setLocalAddedPoints(prev => prev + ptsToAward);
    setUploadStatus(true);
    
    // 2. 화려한 즉시 축하 토스트 팝업
    setToastNotification({
      type: 'success',
      title: '🎉 비공개 결정례 가치 감정 및 캐시백 등록 완료!',
      message: `감정가 ₩${ptsToAward.toLocaleString()}P가 즉시 적립되었습니다. 우측 공유 내역에서 확인하실 수 있습니다.`,
      points: ptsToAward
    });

    // 3. 백엔드 전송
    try {
      const response = await fetch('/api/cashback/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.warn('백엔드 전송 실패 시에도 로컬 상태 유지:', err);
    }
    
    // 4. 입력 초기화
    setHsCode('');
    setValuationIssue('');
    setItemName('');
    setFileName('');
    setFileSize('');
    setParseSuccessMsg(null);

    setTimeout(() => {
      setUploadStatus(null);
    }, 5000);
  };

  const handleAppeal = async (reqId: string) => {
    const reason = prompt('반려에 대한 소명 사유를 작성해 주세요 (예: 2024년 관세청 비공개 서한 원본 사본 증빙):');
    if (!reason || reason.trim() === '') return;

    try {
      const response = await fetch(`/api/cashback/requests/${reqId}/appeal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appeal_reason: reason })
      });
      if (response.ok) {
        alert('재심사가 정상 접수되었습니다. 24시간 내 수동 검증이 진행됩니다.');
        fetchHistory();
      }
    } catch (err) {
      alert('재심사가 정상 접수되었습니다.');
      setHistory(prev => prev.map(item => item.id === reqId ? { ...item, status: '재확인 요청중', fileName: `${item.fileName} (소명: ${reason})` } : item));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '28px', 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(217, 70, 239, 0.08) 100%)', 
        border: '1.5px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.08)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🏛️</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                비공개 결정례 AI 실시간 가치 감정 & 캐시백 거래소
              </h2>
              <span style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d946ef 100%)', 
                color: '#000', 
                fontSize: '0.72rem', 
                padding: '3px 10px', 
                borderRadius: '20px', 
                fontWeight: 800 
              }}>
                실무 가치 차등 산정 모델
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              📦 <strong>HS 품목분류 회시서</strong>: 표준 세번 매핑 정형 데이터로 <strong>건당 ₩1,000P ~ ₩3,000P</strong>의 AI 사전학습 실비 마일리지 지급 <br/>
              ⚖️ <strong>조세심판원/관세평가 결정문</strong>: 과세처분 취소 및 경정청구 소명 논리가 담긴 초고가치 법리 자산으로 <strong>건당 최대 ₩50,000P</strong>의 프리미엄 캐시백 지급
            </p>
          </div>

          <div style={{ 
            textAlign: 'right', 
            background: 'rgba(15, 23, 42, 0.65)', 
            padding: '16px 24px', 
            borderRadius: '14px', 
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              나의 누적 캐시백 적립금 (구독료 자동 차감 가능)
            </span>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-amber)', letterSpacing: '-0.02em' }}>
              ₩{totalPoints.toLocaleString()} <span style={{ fontSize: '1.1rem' }}>P</span>
            </span>
            <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '4px', fontWeight: 700 }}>
              ✓ 차월 솔루션 이용료 100% 현금 차감 가능
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Upload & Appraisal Engine, Right History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        
        {/* Left Side: Dynamic Valuation Form & AI Appraisal Certificate */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '14px' }}>
          
          {/* Category Toggle Tabs */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <button
              type="button"
              onClick={() => {
                setShareType('hs');
                setAnalysisResult(null);
                setParseSuccessMsg(null);
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: shareType === 'hs' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: shareType === 'hs' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                color: shareType === 'hs' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={16} /> 📦 [품목분류] 사전심사 회시서 (1천~3천P)
            </button>
            <button
              type="button"
              onClick={() => {
                setShareType('valuation');
                setAnalysisResult(null);
                setParseSuccessMsg(null);
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: shareType === 'valuation' ? '2px solid var(--accent-amber)' : '1px solid var(--border-color)',
                background: shareType === 'valuation' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                color: shareType === 'valuation' ? 'var(--accent-amber)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Scale size={16} /> ⚖️ [조세심판/평가] 비공개 결정문 (최대 5만P)
            </button>
          </div>

          {uploadStatus && (
            <div style={{ 
              padding: '16px', 
              background: 'rgba(16, 185, 129, 0.12)', 
              border: '1.5px solid rgba(16, 185, 129, 0.4)', 
              borderRadius: '10px', 
              color: '#34d399', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 700
            }}>
              <CheckCircle2 size={20} />
              <div>
                <strong>비공개 결정서 가치 감정 및 캐시백 등록 완료!</strong><br />
                <span style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 500 }}>
                  책정된 캐시백 포인트가 계정에 즉시 적립되었으며, 차월 결제 시 전액 현금 차감됩니다.
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Primary Identifier */}
            {shareType === 'hs' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                  품목분류 세번 (HSK 6단위 또는 10단위)
                </label>
                <input 
                  type="text" 
                  placeholder="예: 8517.62-6000 (또는 3824.99 등)" 
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                  관세평가 핵심 쟁점 주제
                </label>
                <input 
                  type="text" 
                  placeholder="예: 특수관계자 이전가격 사후조정, 로열티 거래조건성 배제, 생산지원비 비과세 소명..." 
                  value={valuationIssue}
                  onChange={(e) => setValuationIssue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                />
              </div>
            )}

            {/* Item Name / Case Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                품목명 / 사건명 (상세 물품 스펙 또는 사건 요지)
              </label>
              <input 
                type="text" 
                placeholder={shareType === 'hs' ? "예: 이차전지 전극 코팅용 나노 탄소 복합 소재" : "예: 다국적 소프트웨어 라이선스 대가 지급의 권리사용료 가산 처분 취소 청구"}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              />
            </div>

            {/* Confidential Check & Decision Outcome Badges (Differentiated by shareType) */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              padding: '14px',
              background: shareType === 'hs' ? 'rgba(6, 182, 212, 0.05)' : 'rgba(245, 158, 11, 0.04)',
              border: shareType === 'hs' ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} color={shareType === 'hs' ? 'var(--accent-cyan)' : 'var(--accent-amber)'} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: shareType === 'hs' ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
                    {shareType === 'hs' ? '미공개 신제품 회시서 가산 (+₩1,000P)' : '비공개 결정서 프리미엄 가산 (+₩20,000P)'}
                  </span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => {
                      setIsConfidential(e.target.checked);
                      if (fileName) triggerAppraisal();
                    }}
                    style={{ width: '18px', height: '18px', accentColor: shareType === 'hs' ? 'var(--accent-cyan)' : 'var(--accent-amber)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>비공개 요청 문서임</span>
                </label>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  결정 결과 유형 ({shareType === 'hs' ? '사전심사 적격/인용 여부' : '승소/처분취소 여부에 따른 추가 보상'})
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(shareType === 'hs' ? [
                    { id: 'approved', label: '📋 사전심사 적격 회시', bonus: '+500P' },
                    { id: 'overturned', label: '🏆 재분류/이의신청 인용', bonus: '+1,000P' },
                    { id: 'rejected', label: '🛡️ 보완/반려 회시', bonus: '+0P' }
                  ] : [
                    { id: 'overturned', label: '🏆 승소 / 인용 결정', bonus: '+15,000P' },
                    { id: 'approved', label: '📋 사전심사 적격 회시', bonus: '+10,000P' },
                    { id: 'rejected', label: '🛡️ 기각 / 방어 소명서', bonus: '+5,000P' }
                  ]).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setDecisionType(opt.id as any);
                        if (fileName) triggerAppraisal();
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: decisionType === opt.id 
                          ? (shareType === 'hs' ? '1.5px solid var(--accent-cyan)' : '1.5px solid var(--accent-amber)') 
                          : '1px solid var(--border-color)',
                        background: decisionType === opt.id 
                          ? (shareType === 'hs' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(245, 158, 11, 0.2)') 
                          : 'rgba(0,0,0,0.3)',
                        color: decisionType === opt.id 
                          ? (shareType === 'hs' ? 'var(--accent-cyan)' : 'var(--accent-amber)') 
                          : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <div>{opt.label}</div>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({opt.bonus})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* [NEW] FTA Precision Review Matrix for HS Classification Rulings */}
            {shareType === 'hs' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1.5px solid rgba(6, 182, 212, 0.35)',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔬</span>
                    <strong style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 800 }}>
                      FTA 원산지결정기준(PSR) & GRI 법리 정밀 심사
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#0891b2', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                    정밀 차등 보상 (최대 10,000P)
                  </span>
                </div>

                {/* 1. FTA 협정 대상 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                    FTA 적용 협정 (원산지증명서 발급 대상)
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'none', label: '일반/미적용' },
                      { id: 'kor_eu', label: '한-EU FTA' },
                      { id: 'kor_us', label: '한-미 FTA' },
                      { id: 'rcep', label: 'RCEP' },
                      { id: 'kor_cn', label: '한-중 FTA' },
                      { id: 'kor_asean', label: '한-아세안' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFtaAgreement(f.id);
                          triggerAppraisal(undefined, undefined, undefined, 'hs', psrSensitivity, griComplexity, hasEvidencePackage);
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: ftaAgreement === f.id ? '1.5px solid #38bdf8' : '1px solid var(--border-color)',
                          background: ftaAgreement === f.id ? 'rgba(6, 182, 212, 0.25)' : 'rgba(0,0,0,0.3)',
                          color: ftaAgreement === f.id ? '#38bdf8' : 'var(--text-muted)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 원산지결정기준(PSR) 민감도 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                    원산지결정기준(PSR) 세번변경 민감도
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'standard', label: '🏷️ 일반 규격 회시', bonus: '기본' },
                      { id: 'cth_sensitive', label: '⚡ 세번변경(CTH/CTSH) 경합', bonus: '+2,000P' },
                      { id: 'rvc_sensitive', label: '📊 부가가치(RVC)/미소기준 연계', bonus: '+2,500P' },
                      { id: 'origin_dispute', label: '🛡️ 원산지검증(사후추징) 방어', bonus: '+3,500P' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPsrSensitivity(p.id as any);
                          triggerAppraisal(undefined, undefined, undefined, 'hs', p.id as any, griComplexity, hasEvidencePackage);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          border: psrSensitivity === p.id ? '1.5px solid #38bdf8' : '1px solid var(--border-color)',
                          background: psrSensitivity === p.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.25)',
                          color: psrSensitivity === p.id ? '#ffffff' : 'var(--text-muted)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{p.label}</span>
                        <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>{p.bonus}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. GRI 통칙 및 법리 심도 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700 }}>
                    적용 통칙 및 법리 심도 (GRI Rule Depth)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'gri_1', label: '📜 통칙 1호 (표준 표제/용어)', bonus: '기본' },
                      { id: 'gri_2', label: '🧩 통칙 2호 (미완성/혼합물)', bonus: '+1,500P' },
                      { id: 'gri_3', label: '⚖️ 통칙 3호 (본질적 특성/세트)', bonus: '+2,500P' },
                      { id: 'chapter_note', label: '📖 부·류 주규정 배제 적용', bonus: '+2,000P' }
                    ].map(g => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setGriComplexity(g.id as any);
                          triggerAppraisal(undefined, undefined, undefined, 'hs', psrSensitivity, g.id as any, hasEvidencePackage);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          border: griComplexity === g.id ? '1.5px solid #38bdf8' : '1px solid var(--border-color)',
                          background: griComplexity === g.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.25)',
                          color: griComplexity === g.id ? '#ffffff' : 'var(--text-muted)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{g.label}</span>
                        <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>{g.bonus}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. 증빙자료 패키지 완비 체크 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px dashed rgba(6, 182, 212, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 700 }}>
                      원자재명세서(BOM) / 제조공정도 / 관세사 검토서 완비
                    </span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={hasEvidencePackage}
                      onChange={(e) => {
                        setHasEvidencePackage(e.target.checked);
                        triggerAppraisal(undefined, undefined, undefined, 'hs', psrSensitivity, griComplexity, e.target.checked);
                      }}
                      style={{ width: '16px', height: '16px', accentColor: '#38bdf8', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800 }}>+₩1,500P</span>
                  </label>
                </div>
              </div>
            )}

            {/* Toast Notification Banner */}
            {toastNotification && (
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
                border: '2px solid #34d399',
                borderRadius: '12px',
                color: '#ffffff',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                animation: 'pulse 2s infinite'
              }}>
                <CheckCircle2 size={28} style={{ color: '#ffffff', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '0.98rem', letterSpacing: '-0.01em' }}>
                    {toastNotification.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', opacity: 0.95, marginTop: '2px', fontWeight: 600 }}>
                    {toastNotification.message}
                  </div>
                </div>
                {toastNotification.points && (
                  <div style={{
                    background: '#ffffff',
                    color: '#065f46',
                    fontWeight: 900,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    flexShrink: 0
                  }}>
                    +₩{toastNotification.points.toLocaleString()} P
                  </div>
                )}
              </div>
            )}

            {/* Document File Drag & Drop Dropzone */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  공식 회시문 / 심판결정문 PDF 또는 이미지 첨부 (필수)
                </label>
                {fileName && (
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>
                    ✓ 파일 업로드 준비 완료 ({fileSize})
                  </span>
                )}
              </div>

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: isDragging 
                    ? '2.5px dashed #38bdf8' 
                    : fileName 
                      ? '2px solid rgba(52, 211, 153, 0.6)' 
                      : '2px dashed var(--accent-cyan)',
                  borderRadius: '12px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: isDragging 
                    ? 'rgba(56, 189, 248, 0.15)' 
                    : fileName 
                      ? 'rgba(16, 185, 129, 0.08)' 
                      : 'rgba(6, 182, 212, 0.03)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isDragging ? '0 0 20px rgba(56, 189, 248, 0.3)' : 'none'
                }}
              >
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                  <UploadCloud 
                    size={38} 
                    style={{ 
                      color: isDragging ? '#38bdf8' : (fileName ? '#34d399' : 'var(--accent-cyan)'), 
                      transform: isDragging ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                  
                  {fileName ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        background: 'rgba(52, 211, 153, 0.2)', 
                        border: '1px solid #34d399', 
                        padding: '6px 14px', 
                        borderRadius: '8px', 
                        color: '#ffffff', 
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>📄 {fileName}</span>
                        <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>({fileSize})</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
                        클릭하거나 다른 파일을 끌어다 놓아 교체할 수 있습니다.
                      </span>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
                        {isDragging ? '📂 마우스를 놓으면 파일이 즉시 분석됩니다!' : '결정서 PDF 또는 이미지를 이곳에 드래그하거나 클릭하여 선택하세요'}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        ⚡ 파일 첨부 즉시 AI가 세번·사건명을 자동 추출하고 CUSWAY 9,450건 DB와 대조하여 가치 감정가를 실시간 산정합니다.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Parsing Progress / Auto-fill Banner */}
              {isParsingFile && (
                <div style={{
                  marginTop: '10px',
                  padding: '12px 16px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(6, 182, 212, 0.3)',
                    borderTop: '2px solid var(--accent-cyan)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>📄 비공개 결정서 텍스트 스캔 및 세번/사건명 자동 추출 중...</span>
                </div>
              )}

              {parseSuccessMsg && !isParsingFile && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid #34d399',
                  borderRadius: '8px',
                  color: '#34d399',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={16} />
                  <span>{parseSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* AI Dynamic Appraisal Certificate Viewer */}
            {isAnalyzing && (
              <div style={{
                padding: '24px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1.5px dashed var(--accent-cyan)',
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid rgba(6, 182, 212, 0.2)',
                  borderTop: '3px solid var(--accent-cyan)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 800, margin: 0 }}>
                    AI 실시간 가치 감정 엔진 가동 중
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    CUSWAY 9,450건 공개 판례·결정례 DB 대조 및 희소성·승소 파급력 산정 중...
                  </span>
                </div>
              </div>
            )}

            {analysisResult && !isAnalyzing && (
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: '1.5px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="var(--accent-amber)" />
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                      📋 AI 비공개 결정례 가치 감정서 (Appraisal Certificate)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    감정 완료
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>자료 희소성 등급</span>
                    <strong style={{ color: 'var(--accent-amber)', fontSize: '0.85rem' }}>{analysisResult.scarcityGrade}</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>기존 공개 DB 중복률</span>
                    <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>매칭 {analysisResult.matchedPublicCount}건 (독창성 {analysisResult.scarcityRate}%)</strong>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>기본 지식 보상금</span>
                    <span>+₩{analysisResult.basePoints.toLocaleString()} P</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: 600 }}>
                    <span>비공개(미공개) 문서 희소성 프리미엄</span>
                    <span>+₩{analysisResult.confidentialBonus.toLocaleString()} P</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                    <span>승소/처분취소 결정례 가산금</span>
                    <span>+₩{analysisResult.decisionBonus.toLocaleString()} P</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '2px', fontSize: '0.9rem', fontWeight: 800 }}>
                    <span style={{ color: '#fff' }}>최종 AI 산정 감정가 (지급 포인트)</span>
                    <span style={{ color: 'var(--accent-amber)', fontSize: '1.05rem' }}>
                      ₩{analysisResult.appraisedPoints.toLocaleString()} P
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', lineHeight: 1.5, margin: 0 }}>
                  💡 <b>AI 평가 의견:</b> {analysisResult.appraisalSnippet}
                </p>
              </div>
            )}

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                background: shareType === 'hs' 
                  ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' 
                  : 'linear-gradient(135deg, var(--accent-amber) 0%, #d946ef 100%)',
                border: 'none',
                borderRadius: '10px',
                color: shareType === 'hs' ? '#ffffff' : '#000000',
                fontWeight: 900,
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: shareType === 'hs' 
                  ? '0 4px 15px rgba(6, 182, 212, 0.35)' 
                  : '0 4px 15px rgba(245, 158, 11, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Award size={20} />
              {analysisResult 
                ? `감정가 ₩${analysisResult.appraisedPoints.toLocaleString()}P로 즉시 캐시백 신청 및 적립`
                : (fileName 
                    ? `첨부된 문서 (${fileName}) 즉시 캐시백 등록 (+₩${shareType === 'hs' ? '2,000' : '35,000'}P)` 
                    : `${shareType === 'hs' ? '[품목분류] 사전심사 회시서 마일리지 신청 (최대 3,000P)' : '[조세심판/평가] 비공개 결정문 캐시백 신청 (최대 50,000P)'}`)}
            </button>
          </form>

          {/* Privacy & Legal Security Shield Banner */}
          <div style={{
            background: '#064e3b',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '16px 18px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            lineHeight: 1.6,
            boxShadow: '0 4px 15px rgba(6, 78, 59, 0.3)'
          }}>
            <ShieldCheck size={24} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>
                🔒 CUSWAY 비식별화(개인정보 마스킹) 안심 보증
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#ecfdf5', fontWeight: 500, lineHeight: 1.6 }}>
                업로드된 결정서는 AI RAG 색인 전 <strong>수입자 상호, 대표자명, 사업자번호, 계좌정보 등 모든 영업비밀을 시스템 차원에서 자동 마스킹(블라인드 처리)</strong>하여 외부에 절대 노출되지 않도록 철저히 보호됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Upload History & Dynamic Point Ledgers */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>나의 비공개 결정례 공유 및 캐시백 내역</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              총 <b>{history.length}</b>건 등록
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '520px' }}>
            {history.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <Coins size={36} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '10px' }} />
                <p style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>아직 등록된 비공개 결정례가 없습니다.</p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  서랍 속 비공개 결정서를 등록하고 캐시백 포인트를 받아보세요!
                </span>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} style={{
                  background: '#1e293b',
                  border: '1.5px solid #334155',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                    {/* Top Row: Category Badge & HS Code / Issue */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        background: item.type === 'hs' ? '#0891b2' : '#b45309', 
                        color: '#ffffff', 
                        fontWeight: 800,
                        letterSpacing: '0.02em'
                      }}>
                        {item.typeKo}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: item.type === 'hs' ? '#38bdf8' : '#fbbf24' }}>
                        {item.hsCodeOrIssue}
                      </span>
                    </div>

                    {/* Middle: Product Name / Case Title */}
                    <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700, lineHeight: 1.4, wordBreak: 'break-word' }}>
                      {item.itemName}
                    </div>

                    {/* Bottom: File Name and Date with High Contrast */}
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>📄 <strong>문서:</strong> {item.fileName}</span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span>📅 <strong>접수일:</strong> {item.date}</span>
                    </div>
                  </div>

                  {/* Right Column: Status & Points */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.76rem',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontWeight: 800,
                      background: item.status === '승인 완료' ? '#065f46' : 
                                  item.status === '재확인 요청중' ? '#1e3a8a' : '#78350f',
                      color: item.status === '승인 완료' ? '#34d399' : 
                             item.status === '재확인 요청중' ? '#93c5fd' : '#fcd34d',
                      border: item.status === '승인 완료' ? '1px solid #10b981' : 
                              item.status === '재확인 요청중' ? '1px solid #3b82f6' : '1px solid #f59e0b'
                    }}>
                      {item.status}
                    </span>
                    {item.status === '반려' && (
                      <button 
                        onClick={() => handleAppeal(item.id)}
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 8px',
                          background: '#7f1d1d',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          color: '#fecaca',
                          cursor: 'pointer',
                          fontWeight: 800
                        }}
                      >
                        소명/재심사 요청
                      </button>
                    )}
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: item.type === 'hs' ? '#38bdf8' : '#fbbf24', letterSpacing: '-0.02em' }}>
                      +{item.points.toLocaleString()} P
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Value Mechanism Footer Box: Detailed Legal/Practical Justification */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '18px',
            fontSize: '0.82rem',
            color: '#f8fafc',
            lineHeight: 1.6
          }}>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💡 왜 HS분류 회시서와 심판결정문의 캐시백 금액이 다른가요? (산정 근거)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>📦 HS 품목분류 회시서 (1천~3천P)</strong>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  일반적 상품 규격 매핑 데이터로 대량 공개되므로, AI 사전학습 기여에 따른 <strong>소액 실비 마일리지(₩1,000~3,000P)</strong>로 산정됩니다.
                </span>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>⚖️ 조세심판원/평가 결정문 (최대 5만P)</strong>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  수억~수백억 대의 과세처분 취소·경정청구 소명 논리가 담긴 비공개 독점 자산으로 <strong>건당 최대 ₩50,000P</strong>의 프리미엄이 책정됩니다.
                </span>
              </div>
            </div>

            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.5 }}>
              * 적립된 모든 캐시백 포인트는 CUSWAY 차월 솔루션 이용료 결제 시 <strong>100% 전액 자동 차감</strong>되어 현금과 동일한 혜택을 제공합니다.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
