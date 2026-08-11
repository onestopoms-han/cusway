import { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  RefreshCw
} from 'lucide-react';
import { DeclarationData } from '../App';

interface ImportAnalyzerProps {
  onAnalysisComplete: (data: DeclarationData) => void;
}

export default function ImportAnalyzer({ onAnalysisComplete }: ImportAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [importer, setImporter] = useState('한마음 유통물류(주)');
  const [declarationNo, setDeclarationNo] = useState('14302-26-1020261');

  // Trigger analysis simulation
  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      
      const mockResult: DeclarationData = {
        declarationNo: declarationNo,
        importer: importer,
        customsValue: 45000000,
        items: ['유기농 저온 압착 들기름 원료 (1212.99-9000)'],
        declarationDate: new Date().toISOString().split('T')[0],
        specification: '유기농 저온 압착용 100%',
        unitPrice: 5200,
        avgUnitPrice: 3800,
        unitPriceStatus: '고가 신고 (환급 대상)',
        currency: 'USD',
        exchangeRate: 1350,
        currencyStatus: '적정',
        originalHsCode: '1212.99-9000',
        originalRate: '30% (기본관세)',
        recommendedHsCode: '2106.90-9099',
        recommendedRate: '8% (기본세율/협정세율 최적 적용)',
        originalDuty: 7181600,
        originalVat: 718160,
        optimizedDuty: 4202000,
        optimizedVat: 420200,
        refundAmount: 2979600,
        verificationStatus: '과다 납부 발견 (환급 가능)'
      };

      onAnalysisComplete(mockResult);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>
          사후 세액 검증 엔진 (Import Analyzer)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          기 납부한 수입신고서의 규격, HS코드오류, 단가 적정성 대조를 통하여 과다 납부 세액을 찾아 환급 신청 데이터를 자동화합니다.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '30px'
      }}>
        
        {/* Upload and Target Configuration */}
        <section className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--accent-primary)" />
            수입신고서 문서 분석 및 입력
          </h3>

          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.01)',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}>
            {/* PDF Upload zone */}
            <div style={{ flex: 1, padding: '10px', borderRight: '1px solid var(--border-color)' }} onClick={(e) => {
              e.stopPropagation();
              setDocUploaded(true);
              setFileName('Declaration_Import_2026_0805.pdf');
            }}>
              {!docUploaded || !fileName.endsWith('.pdf') ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <FileText size={32} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      PDF 업로드
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      수입신고서 PDF 추가
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={32} color="var(--accent-primary)" />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                      PDF 완료
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#fff' }}>
                      📄 {fileName}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Excel Upload zone */}
            <div style={{ flex: 1, padding: '10px' }} onClick={(e) => {
              e.stopPropagation();
              setDocUploaded(true);
              setFileName('Declaration_Import_Batch_2026.xlsx');
            }}>
              {!docUploaded || !fileName.endsWith('.xlsx') ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <FileText size={32} color="var(--accent-cyan)" style={{ opacity: 0.8 }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      엑셀(Excel) 업로드
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      대량 신고데이터 XLSX 추가
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={32} color="var(--accent-cyan)" />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      엑셀 완료
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#fff' }}>
                      📊 {fileName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>수입자 상호</label>
              <input 
                type="text" 
                value={importer} 
                onChange={e => setImporter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>수입신고번호</label>
              <input 
                type="text" 
                value={declarationNo} 
                onChange={e => setDeclarationNo(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={analyzing || !docUploaded}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
              color: '#000',
              fontWeight: 700,
              cursor: (analyzing || !docUploaded) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: (analyzing || !docUploaded) ? 0.6 : 1
            }}>
            {analyzing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                정밀 사후 세액 검증 알고리즘 가동 중...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                사후 세액 검증 및 환급분석 실행
              </>
            )}
          </button>
        </section>

        {/* Right side static guide info */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={16} />
              AI 검증 파이프라인
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px' }}>
              <li>기존 신고된 10자리 HSK 코드의 유효성 검증</li>
              <li>유사 거래 단가 및 규격 텍스트 RAG 데이터베이스 매칭 검증</li>
              <li>협정세율(FTA) 우선 적용 순위 배정 및 오류 탐지</li>
            </ul>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} />
              검증 대상 리스크
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px' }}>
              <li>관세율 오적용에 의한 과다 납부</li>
              <li>수입 물품 품명 설명 기재 오류 및 누락</li>
              <li>고가 통관 신고에 따른 세액 과다 유출</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
