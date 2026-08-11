import { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Coins, 
  Building2, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  companyName: string;
  plan: 'Free' | 'Basic' | 'Business';
  status: 'Active' | 'Suspended' | 'Pending';
  joinDate: string;
  accruedPoints: number;
}

interface UploadRequest {
  id: string;
  email: string;
  typeKo: string;
  hsCodeOrIssue: string;
  itemName: string;
  fileName: string;
  points: number;
  date: string;
}

export default function AdminPortal() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', email: 'director@seoulcustoms.com', companyName: '서울관세법인', plan: 'Business', status: 'Active', joinDate: '2026-06-15', accruedPoints: 25000 },
    { id: '2', email: 'trade_agent@korea.co.kr', companyName: '한국관세사무소', plan: 'Basic', status: 'Active', joinDate: '2026-07-01', accruedPoints: 5000 },
    { id: '3', email: 'customs_tax@corp.com', companyName: '태평양세무관세', plan: 'Business', status: 'Suspended', joinDate: '2026-05-10', accruedPoints: 0 },
    { id: '4', email: 'user77@pjhcustoms.com', companyName: 'PJH 관세팀 내부망', plan: 'Business', status: 'Active', joinDate: '2026-08-01', accruedPoints: 15000 }
  ]);

  const [uploadRequests, setUploadRequests] = useState<UploadRequest[]>([
    {
      id: 'REQ-101',
      email: 'director@seoulcustoms.com',
      typeKo: '관세평가 판례',
      hsCodeOrIssue: '상표권 권리사용료의 수입관련성',
      itemName: '의류 완제품 수입 라이선스 계약서',
      fileName: '의류완제품_로열티계약서_비식별.pdf',
      points: 8000,
      date: '2026-08-11'
    },
    {
      id: 'REQ-102',
      email: 'trade_agent@korea.co.kr',
      typeKo: 'HS 품목분류',
      hsCodeOrIssue: '2101.12-1000',
      itemName: '설탕 대체 감미료 혼합 커피조제품',
      fileName: '품목분류회신_2101_커피.pdf',
      points: 5000,
      date: '2026-08-11'
    }
  ]);

  // 회원 활성/정지 토글 기능
  const toggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'Active' ? 'Suspended' : 'Active';
        alert(`[계정 통제 정책 알림]\n${c.companyName} (${c.email}) 계정 상태가 ${newStatus === 'Active' ? '활성화' : '이용 정지'} 처리되었습니다.`);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  // 캐시백 문서 승인 처리
  const approveRequest = (reqId: string, email: string, points: number) => {
    // 1. 요청 목록에서 제거
    setUploadRequests(uploadRequests.filter(r => r.id !== reqId));
    
    // 2. 고객 포인트 추가
    setCustomers(customers.map(c => {
      if (c.email === email) {
        return { ...c, accruedPoints: c.accruedPoints + points };
      }
      return c;
    }));

    alert(`[검수 완료 - 캐시백 승인]\n${email} 계정에 ${points.toLocaleString()}포인트(₩) 적립이 승인 완료되었습니다.`);
  };

  // 캐시백 문서 반려 처리
  const rejectRequest = (reqId: string, email: string) => {
    const reason = prompt('반려 사유를 입력하세요:', '문서 내 수입자 상호 및 개인정보 비식별화(마스킹) 처리가 누락되었습니다.');
    if (reason) {
      setUploadRequests(uploadRequests.filter(r => r.id !== reqId));
      alert(`[검수 완료 - 캐시백 반려]\n수신인: ${email}\n반려사유: ${reason}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 어드민 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <Users size={32} color="var(--accent-cyan)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>총 관리 관세사/법인 수</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{customers.length}개 법인</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--accent-primary)' }}>
          <Coins size={32} color="var(--accent-primary)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>검수 대기중인 공유사례</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{uploadRequests.length}건</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--accent-amber)' }}>
          <TrendingUp size={32} color="var(--accent-amber)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>월 매출액 (MRR)</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>₩1,240,000</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.7fr', gap: '24px' }}>
        
        {/* 왼쪽: 캐시백 검수 대기실 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>📁 결정례/판례 공유 사례 검수 대기실</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              고객관세사가 업로드한 품목분류/관세평가 비식별 문서를 검수하여 캐시백 승인 여부를 결정합니다.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', maxHeight: '450px' }}>
            {uploadRequests.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                검수 대기 중인 공유 자료가 없습니다.
              </div>
            ) : (
              uploadRequests.map(req => (
                <div key={req.id} style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {req.typeKo}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{req.date}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{req.hsCodeOrIssue}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>품목/사건명: {req.itemName}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>제출자: <b>{req.email}</b></span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`[문서 열기]\n${req.fileName} PDF 미리보기 창이 활성화됩니다.`); }} style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      문서검증 <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => rejectRequest(req.id, req.email)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--accent-red)',
                        padding: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ❌ 반려 (사유전송)
                    </button>
                    <button
                      onClick={() => approveRequest(req.id, req.email, req.points)}
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#000',
                        padding: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      👍 승인 (+₩{req.points.toLocaleString()} P)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 오른쪽: 가입관세법인 고객 디렉토리 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>👥 가입관세사 및 법인 고객 디렉토리</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              가입된 관세법인의 요금제 구독 현황을 모니터링하고, 결제 연체 시 계정 사용 권한을 수동으로 일시 정지 처리할 수 있습니다.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {customers.map(c => (
              <div key={c.id} style={{
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
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{c.companyName}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)', fontWeight: 600 }}>
                      {c.plan} Plan
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    계정: {c.email} | 가입일: {c.joinDate}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                    보유 적립 포인트: <b>₩{c.accruedPoints.toLocaleString()} P</b>
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    background: c.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: c.status === 'Active' ? '#10b981' : '#fca5a5'
                  }}>
                    {c.status === 'Active' ? '이용 활성' : '이용 정지'}
                  </span>
                  
                  <button
                    onClick={() => toggleCustomerStatus(c.id)}
                    style={{
                      background: c.status === 'Active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: c.status === 'Active' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      color: c.status === 'Active' ? 'var(--accent-red)' : 'var(--accent-primary)',
                      padding: '4px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {c.status === 'Active' ? 'Suspended' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
