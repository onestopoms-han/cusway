import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';

export default function PdfToExcel() {
  const [docUploaded, setDocUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = () => {
    setConverting(true);
    setTimeout(() => {
      setConverting(false);
      setConverted(true);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>
          PDF ➔ 엑셀 자동 변환기 (PdfToExcel)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          관세청 수입신고서 PDF의 행·열 원시 테이블 데이터를 파싱하여 즉각 업로드 및 사후 분석 가능한 Excel 포맷으로 추출합니다.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '30px'
      }}>
        
        {/* Conversion setup card */}
        <section className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={18} color="var(--accent-primary)" />
            변환 대상 문서 선택
          </h3>

          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '12px',
            padding: '45px 20px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.01)',
            cursor: 'pointer'
          }}
          onClick={() => {
            setDocUploaded(true);
            setFileName('Import_Declaration_Batch.pdf');
          }}>
            {!docUploaded ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Upload size={48} color="var(--text-muted)" style={{ opacity: 0.7 }} />
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    변환할 PDF 업로드
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    클릭하여 엑셀 원시 데이터로 변환할 PDF 수입신고 문서를 추가해 주세요.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={48} color="var(--accent-primary)" />
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '4px' }}>
                    문서 확인 완료
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#fff' }}>
                    📄 {fileName}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleConvert}
            disabled={converting || !docUploaded || converted}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
              color: '#000',
              fontWeight: 700,
              cursor: (converting || !docUploaded || converted) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            {converting ? (
              <>엑셀 추출 가동 중...</>
            ) : converted ? (
              <>
                <CheckCircle2 size={16} />
                엑셀 변환 완료 (다운로드 완료)
              </>
            ) : (
              <>
                <FileSpreadsheet size={16} />
                엑셀 정형 데이터 추출 시작
              </>
            )}
          </button>
        </section>

        {/* Dynamic info cards */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} />
              엑셀 변환 장점
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px' }}>
              <li>수입 신고 단가 오류 및 통계적 이상 수치 즉시 엑셀 필터링 가능</li>
              <li>다량의 신고 란(품목) 일괄 대조 분석 최적화</li>
              <li>회계 및 ERP 시스템 연동 적합 포맷 지원</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
