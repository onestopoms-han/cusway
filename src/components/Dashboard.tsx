import { HistoryItem } from '../App'
import { TrendingUp, FileText, PiggyBank, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react'

interface DashboardProps {
  history: HistoryItem[];
  onNavigateToAnalyze: () => void;
}

export default function Dashboard({ history, onNavigateToAnalyze }: DashboardProps) {
  // 통계 계산
  const totalAudited = history.length;
  const overPaidCount = history.filter(item => item.refundAmount > 0).length;
  const totalRefundPossible = history.reduce((sum, item) => sum + item.refundAmount, 0);
  
  // 탐지율 (환급 발견율)
  const detectionRate = totalAudited > 0 ? Math.round((overPaidCount / totalAudited) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>대시보드</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>이미 납부된 수입 통관 세액의 사후 검증 현황과 관세 환급 분석 현황을 실시간 모니터링합니다.</p>
        </div>
        <button className="btn-primary" onClick={onNavigateToAnalyze}>
          <span>사후 세액 검증 시작</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">누적 사후 검증 건수</span>
            <div style={{ padding: '6px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px', color: 'var(--accent-primary)' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className="metric-value text-gradient">{totalAudited}건</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            관세청 수입 신고 데이터 대조 완료
          </div>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">누적 예상 환급액</span>
            <div style={{ padding: '6px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '6px', color: 'var(--accent-cyan)' }}>
              <PiggyBank size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-cyan)', textShadow: '0 0 12px rgba(6, 182, 212, 0.3)' }}>
            ₩{totalRefundPossible.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={12} />
            <span>환급 가능 대상: {overPaidCount}건</span>
          </div>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">AI 과다납부 탐지율</span>
            <div style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: 'var(--accent-green)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="metric-value text-gradient">{detectionRate}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            HS코드/규격/단가 알고리즘 검증
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>사후 세액 정밀 검증 및 환급 내역</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={14} />
            <span>최적 관세율 미적용에 따른 환급액 산출 목록</span>
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px 16px' }}>검증 일자</th>
                <th style={{ padding: '12px 16px' }}>수입업체명</th>
                <th style={{ padding: '12px 16px' }}>수입 품목 및 규격</th>
                <th style={{ padding: '12px 16px' }}>기존 납부세액</th>
                <th style={{ padding: '12px 16px' }}>최적화 세액</th>
                <th style={{ padding: '12px 16px' }}>환급 예상액</th>
                <th style={{ padding: '12px 16px' }}>검증 결과</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>전송처 (상태)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '16px' }}>{item.date}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{item.importer}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.items}</td>
                  <td style={{ padding: '16px' }}>{item.originalTax}</td>
                  <td style={{ padding: '16px', color: 'var(--accent-cyan)' }}>{item.optimizedTax}</td>
                  <td style={{ padding: '16px', fontWeight: 700, color: item.refundAmount > 0 ? 'var(--accent-amber)' : 'inherit' }}>
                    {item.refundAmount > 0 ? `₩${item.refundAmount.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: item.verificationStatus === '적정 납부' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: item.verificationStatus === '적정 납부' ? 'var(--accent-green)' : 'var(--accent-amber)'
                    }}>
                      {item.verificationStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {item.phone ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.phone} ({item.status})
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>미전송</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
