import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  CheckCircle, 
  Coins, 
  ExternalLink,
  TrendingUp,
  Phone,
  MessageCircle,
  Clock,
  RefreshCw,
  Download,
  Mail,
  Tag,
  Plus,
  Search,
  Edit3,
  CheckSquare,
  Square,
  Sparkles,
  Send,
  Award,
  Filter,
  Copy,
  Check,
  ShieldAlert,
  Database,
  FileText,
  ChevronRight,
  LayoutGrid,
  List,
  Calendar,
  CreditCard
} from 'lucide-react';

export interface Customer {
  id: string;
  email: string;
  companyName: string;
  contactName?: string;
  plan: 'Free' | 'Basic' | 'Business';
  status: 'Active' | 'Suspended' | 'Pending';
  joinDate: string;
  accruedPoints: number;
  phoneNumber?: string;
  tags?: string[];
  notes?: string;
  lastActiveDate?: string;
}

export interface UploadRequest {
  id: string;
  email: string;
  typeKo: string;
  hsCodeOrIssue: string;
  itemName: string;
  fileName: string;
  points: number;
  date: string;
}

export interface MarketingTemplate {
  id: string;
  category: 'feature' | 'promotion' | 'enterprise' | 'points';
  title: string;
  badge: string;
  description: string;
  subject: string;
  content: string;
}

const MARKETING_TEMPLATES: MarketingTemplate[] = [
  {
    id: 'tpl-feature-origin',
    category: 'feature',
    title: '📢 대외무역법 원산지표시 & TRQ 추천세율 오픈 안내',
    badge: '신규기능 알림',
    description: '대외무역법 제33조 원산지 표시 판정 및 농수축산물 TRQ 추천세율 자동완성 엔진 런칭 알림',
    subject: '[CUSWAY 업데이트] 대외무역법 원산지 표시 판정 및 TRQ 추천세율 AI 분석 기능 오픈 안내',
    content: `[CUSWAY 기능 업데이트 공지]

안녕하세요, {companyName} {contactName} 담당자님.
대한민국 1등 관세 AI 솔루션 CUSWAY입니다.

실무에서 가장 쟁점이 되는 [대외무역법 제33조 원산지표시 판정 가이드] 및 [농수축산물 민감품목 TRQ 추천세율 자동계산기]가 전면 탑재되었습니다!

📌 주요 활용 안내:
1. 수입물품 HS Code 입력 시 대외무역법 통합고시 원산지 표시방법(라벨/각인/인쇄) 즉시 제시
2. 51개 농수축산물 민감품목 TRQ 추천서 구비 시 최대 90% 관세 절감 시뮬레이션
3. 원산지 표시 판정문구 & 관세청 공식 법령 근거를 A4 리포트에 자동 합성

지금 CUSWAY에 접속하여 새로워진 통관심사 기능을 확인해보세요!
👉 서비스 바로가기: https://cusway.kr`
  },
  {
    id: 'tpl-promo-pro-discount',
    category: 'promotion',
    title: '🚀 Pro 플랜 첫 달 20% 할인 & 캐시백 2배 적립 프로모션',
    badge: '유료전환 특가',
    description: 'Free 플랜 고객 대상 Pro 플랜 특별 할인 및 캐시백 포인트 2배 적립 혜택 제안',
    subject: '[CUSWAY 특별 프로모션] {companyName}님만을 위한 Pro 플랜 20% 할인 혜택 안내',
    content: `[CUSWAY 특별 프로모션 안내]

안녕하세요, {companyName} {contactName} 담당자님.

현재 무료 플랜을 이용 중이신 고객사 대상 한정 프로모션 안내드립니다.
이번 달 내 CUSWAY Pro 플랜 구독 시 첫 달 20% 할인 및 비공개 결정례 공유 시 캐시백 포인트를 2배(건당 최대 10,000P)로 적립해 드립니다.

🎁 프로모션 혜택:
- Pro 플랜 첫 달 20% 즉시 할인 (월 ₩29,000 → ₩23,200)
- 일일 분석 횟수 무제한 해금
- 관세청/WCO 해설서 원문 검색 무제한
- 캐시백 포인트 2배 지급 이벤트

👉 프로모션 등록하기: https://cusway.kr/billing`
  },
  {
    id: 'tpl-enterprise-b2b',
    category: 'enterprise',
    title: '🏢 관세법인 전용 Enterprise & 화이트라벨 제안',
    badge: 'B2B 법인제안',
    description: '소속 관세사 다계정 통합 관리, 고객사 전용 브랜딩(로고/상호) 및 맞춤형 API 연동 제안',
    subject: '[제안서] {companyName} 관세법인 전용 CUSWAY Enterprise & 화이트라벨 도입 안내',
    content: `[CUSWAY Enterprise B2B 솔루션 제안]

안녕하세요, {companyName} {contactName} 대표관세사님.

CUSWAY는 관세법인 소속 관세사님들의 품목분류 및 통관심사 소명 리포트 작성 시간을 80% 이상 단축시키는 관세 특화 AI 엔진입니다.

🏢 Enterprise 플랜 주요 제공 혜택:
1. 관세법인 소속 관세사 무제한 계정 및 팀 워크스페이스
2. 리포트 상단 [ {companyName} ] 로고 및 직인 자동 인쇄 (화이트라벨)
3. 조세심판원 결정례/WCO 분류사례 사내 전용 Knowledge Hub 구축
4. 전담 기술 지원 및 맞춤형 통관 API 제공

온라인 데모 및 무료 14일 Enterprise 파일럿 테스트를 신청해보세요!
👉 법인 상담 문의: https://cusway.kr/contact`
  },
  {
    id: 'tpl-points-reminder',
    category: 'points',
    title: '💰 보유 캐시백 포인트 사용 & 리포트 소명 안내',
    badge: '포인트 리마인드',
    description: '결정례 기여 등으로 적립된 미사용 포인트를 안내하고 유료 구독 전환을 유도',
    subject: '[CUSWAY] {companyName}님의 잔여 포인트 ₩{points}P를 확인하세요',
    content: `[CUSWAY 포인트 리마인드]

안녕하세요, {companyName} 담당자님!

현재 {email} 계정에 적립되어 있는 CUSWAY 캐시백 포인트는 총 ₩{points} P 입니다.

해당 포인트는 CUSWAY 유료 구독 시 결제 금액에서 1:1로 100% 전액 차감하여 현금처럼 사용하실 수 있습니다.
미사용 포인트로 부담 없이 CUSWAY Pro의 프리미엄 기능을 경험해보세요!

👉 포인트 사용하러 가기: https://cusway.kr`
  }
];

const INITIAL_MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    email: 'director@seoulcustoms.com',
    companyName: '서울관세법인',
    contactName: '서울관세 담당자',
    plan: 'Business',
    status: 'Active',
    joinDate: '2026-06-15',
    accruedPoints: 25000,
    phoneNumber: '010-0000-0000',
    tags: ['#관세법인', '#HS분류'],
    notes: '시스템 기본 등록 고객',
    lastActiveDate: '2026-09-06'
  },
  {
    id: '2',
    email: 'trade_agent@korea.co.kr',
    companyName: '한국관세사무소',
    contactName: '한국관세 담당자',
    plan: 'Basic',
    status: 'Active',
    joinDate: '2026-07-01',
    accruedPoints: 15000,
    phoneNumber: '010-0000-0000',
    tags: ['#관세법인', '#HS분류'],
    notes: '시스템 기본 등록 고객',
    lastActiveDate: '2026-09-05'
  },
  {
    id: '3',
    email: 'admin@cusway.kr',
    companyName: 'CUSWAY 관세평가자문단 (마스터)',
    contactName: 'CUSW 담당자',
    plan: 'Free',
    status: 'Active',
    joinDate: '2026-08-01',
    accruedPoints: 50000,
    phoneNumber: '010-0000-0000',
    tags: ['#관세법인', '#HS분류'],
    notes: '시스템 기본 등록 고객',
    lastActiveDate: '2026-09-06'
  },
  {
    id: '4',
    email: 'customs@hanatrade.com',
    companyName: '하나통상 (수입화주)',
    contactName: '하나통상 담당자',
    plan: 'Free',
    status: 'Active',
    joinDate: '2026-08-12',
    accruedPoints: 6200,
    phoneNumber: '010-5541-9982',
    tags: ['#농수산물', '#TRQ관심', '#Pro유망'],
    notes: '농수산물 TRQ 추천세율 계산기 자주 이용 중',
    lastActiveDate: '2026-09-06'
  },
  {
    id: '5',
    email: 'global@pacificlogis.co.kr',
    companyName: '태평양로지스틱스',
    contactName: '태평양 담당자',
    plan: 'Basic',
    status: 'Active',
    joinDate: '2026-07-18',
    accruedPoints: 12000,
    phoneNumber: '010-4421-1190',
    tags: ['#포워더', '#기계설비', '#84류85류'],
    notes: '기계류 84류 분류 사례 3건 공유 승인 완료',
    lastActiveDate: '2026-09-04'
  },
  {
    id: '6',
    email: 'support@meditech-import.com',
    companyName: '메디텍코리아',
    contactName: '메디텍 담당자',
    plan: 'Free',
    status: 'Suspended',
    joinDate: '2026-06-20',
    accruedPoints: 1000,
    phoneNumber: '010-8841-2910',
    tags: ['#의료기기', '#90류', '#휴면고객'],
    notes: '장기 미접속으로 계정 일시정지 상태',
    lastActiveDate: '2026-08-10'
  }
];

interface AdminPortalProps {
  currentUser?: any;
}

type AdminTab = 'crm' | 'cashback' | 'marketing' | 'crawler';
type MarketingSegment = 'all' | 'pro_leads' | 'enterprise_leads' | 'vip_contributors' | 'at_risk';
type ViewMode = 'cards' | 'table';

export default function AdminPortal({ currentUser }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('crm');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [uploadRequests, setUploadRequests] = useState<UploadRequest[]>([]);
  const [crawlerStatus, setCrawlerStatus] = useState<any>({
    schedule: "매일 2회 (09:00, 18:00 KST)",
    last_run_time: "2026-09-06 09:00 KST 동기화 완료",
    status: "Active (정상 가동중)"
  });
  const [isCrawling, setIsCrawling] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'All' | 'Free' | 'Basic' | 'Business'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [activeSegment, setActiveSegment] = useState<MarketingSegment>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Modal States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate>(MARKETING_TEMPLATES[0]);
  const [templateTargetCustomer, setTemplateTargetCustomer] = useState<Customer | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    plan: 'Free' as 'Free' | 'Basic' | 'Business',
    accruedPoints: 5000,
    tags: '#신규가입 #관세상담',
    notes: '시스템 기본 등록 고객'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    plan: 'Free' as 'Free' | 'Basic' | 'Business',
    status: 'Active' as 'Active' | 'Suspended',
    accruedPoints: 0,
    tags: '',
    notes: ''
  });

  // Load Admin Data with localStorage Fallback
  const fetchAdminData = async () => {
    try {
      const resCust = await fetch('/api/customers');
      let loadedCustomers: Customer[] = [];
      if (resCust.ok) {
        const data = await resCust.json();
        loadedCustomers = data.map((c: any) => ({
          id: String(c.id || c.email),
          email: c.email,
          companyName: c.company_name,
          contactName: c.contact_name || c.company_name?.slice(0, 4) + ' 담당자',
          plan: (c.plan || 'Basic') as any,
          status: (c.status || 'Active') as any,
          joinDate: c.join_date || '2026-06-15',
          accruedPoints: c.accrued_points || 0,
          phoneNumber: c.phone_number || c.phoneNumber || '010-0000-0000',
          tags: c.tags || ['#관세법인', '#HS분류'],
          notes: c.notes || '시스템 기본 등록 고객'
        }));
      }

      const savedLocal = localStorage.getItem('cusway_admin_customers_v5');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(loadedCustomers.map(x => x.id));
            const merged = [...loadedCustomers];
            parsed.forEach((p: Customer) => {
              const idx = merged.findIndex(x => x.id === p.id || x.email === p.email);
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...p };
              } else if (!existingIds.has(p.id)) {
                merged.push(p);
              }
            });
            loadedCustomers = merged;
          }
        } catch (e) {
          console.warn('localStorage parse error', e);
        }
      }

      if (loadedCustomers.length === 0) {
        loadedCustomers = INITIAL_MOCK_CUSTOMERS;
        localStorage.setItem('cusway_admin_customers_v5', JSON.stringify(INITIAL_MOCK_CUSTOMERS));
      }

      setCustomers(loadedCustomers);

      // Cashback requests
      const resReq = await fetch('/api/cashback/requests');
      if (resReq.ok) {
        const data = await resReq.json();
        setUploadRequests(data.filter((r: any) => r.status === '검토 대기중').map((r: any) => ({
          id: String(r.id),
          email: r.email,
          typeKo: r.type_ko,
          hsCodeOrIssue: r.hs_code_or_issue,
          itemName: r.item_name,
          fileName: r.file_name,
          points: r.points,
          date: r.date
        })));
      }

      // Crawler status
      const resCrawler = await fetch('/api/admin/crawler/status');
      if (resCrawler.ok) {
        const crawlerData = await resCrawler.json();
        setCrawlerStatus(crawlerData);
      }
    } catch (err) {
      console.warn('Backend API connection fallback to local storage simulation');
      const savedLocal = localStorage.getItem('cusway_admin_customers_v5');
      if (savedLocal) {
        setCustomers(JSON.parse(savedLocal));
      } else {
        setCustomers(INITIAL_MOCK_CUSTOMERS);
        localStorage.setItem('cusway_admin_customers_v5', JSON.stringify(INITIAL_MOCK_CUSTOMERS));
      }
    }
  };

  const isAdmin = Boolean(
    currentUser && currentUser.email && (
      currentUser.email.toLowerCase().trim() === 'admin@cusway.kr' ||
      currentUser.is_admin === true ||
      currentUser.role === 'admin'
    )
  );

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        maxWidth: '520px',
        margin: '60px auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
      }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#dc2626' }}>
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>관리자 전용 페이지</h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
          해당 화면은 CUSWAY 총괄 관리자 계정(admin@cusway.kr)으로 로그인된 경우에만 접근할 수 있습니다.
        </p>
      </div>
    );
  }

  const saveCustomersState = (updated: Customer[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem('cusway_admin_customers_v5', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    customers.forEach(c => {
      (c.tags || []).forEach(t => tagSet.add(t.trim()));
    });
    return Array.from(tagSet);
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.companyName.toLowerCase().includes(q);
        const matchContact = (c.contactName || '').toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = (c.phoneNumber || '').toLowerCase().includes(q);
        const matchTags = (c.tags || []).some(t => t.toLowerCase().includes(q));
        const matchNotes = (c.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchContact && !matchEmail && !matchPhone && !matchTags && !matchNotes) {
          return false;
        }
      }

      if (planFilter !== 'All' && c.plan !== planFilter) return false;
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;

      if (activeSegment === 'pro_leads') {
        const isProLead = c.plan === 'Free' && (c.accruedPoints >= 4000 || (c.tags || []).some(t => t.includes('Pro') || t.includes('유망')));
        if (!isProLead) return false;
      } else if (activeSegment === 'enterprise_leads') {
        const isEntLead = (c.plan === 'Basic' || (c.tags || []).some(t => t.includes('법인') || t.includes('연간계약') || t.includes('화이트라벨')));
        if (!isEntLead) return false;
      } else if (activeSegment === 'vip_contributors') {
        if (c.accruedPoints < 10000) return false;
      } else if (activeSegment === 'at_risk') {
        if (c.status !== 'Suspended' && !(c.tags || []).some(t => t.includes('휴면'))) return false;
      }

      if (selectedTagFilter !== 'All') {
        if (!(c.tags || []).includes(selectedTagFilter)) return false;
      }

      return true;
    });
  }, [customers, searchQuery, planFilter, statusFilter, activeSegment, selectedTagFilter]);

  const stats = useMemo(() => {
    const total = customers.length;
    const paidCount = customers.filter(c => c.plan === 'Basic' || c.plan === 'Business').length;
    const totalPoints = customers.reduce((acc, c) => acc + (c.accruedPoints || 0), 0);
    const proLeadsCount = customers.filter(c => c.plan === 'Free' && (c.accruedPoints >= 4000 || (c.tags || []).some(t => t.includes('Pro')))).length;
    const entLeadsCount = customers.filter(c => c.plan === 'Basic' || (c.tags || []).some(t => t.includes('법인') || t.includes('화이트라벨'))).length;
    const vipCount = customers.filter(c => c.accruedPoints >= 10000).length;
    const atRiskCount = customers.filter(c => c.status === 'Suspended' || (c.tags || []).some(t => t.includes('휴면'))).length;

    return { total, paidCount, totalPoints, proLeadsCount, entLeadsCount, vipCount, atRiskCount };
  }, [customers]);

  const handleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map(c => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedCustomerIds.includes(id)) {
      setSelectedCustomerIds(selectedCustomerIds.filter(x => x !== id));
    } else {
      setSelectedCustomerIds([...selectedCustomerIds, id]);
    }
  };

  const handleExportCSV = () => {
    const targets = selectedCustomerIds.length > 0 
      ? customers.filter(c => selectedCustomerIds.includes(c.id))
      : filteredCustomers;

    if (targets.length === 0) {
      alert('내보낼 대상 고객이 없습니다.');
      return;
    }

    const headers = [
      '고객ID', '법인/상호명', '담당자명', '계정이메일', '연락처', '구독플랜', '계정상태', '보유포인트(KRW)', '가입일자', '마케팅태그', 'CRM상담메모'
    ];

    const rows = targets.map(c => [
      `"${c.id}"`,
      `"${c.companyName.replace(/"/g, '""')}"`,
      `"${(c.contactName || '').replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phoneNumber || ''}"`,
      `"${c.plan}"`,
      `"${c.status}"`,
      c.accruedPoints,
      `"${c.joinDate}"`,
      `"${(c.tags || []).join(' ')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const segmentLabel = activeSegment === 'all' ? '전체' : activeSegment;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `CUSWAY_마케팅고객타겟_${segmentLabel}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkAddPoints = async () => {
    if (selectedCustomerIds.length === 0) {
      alert('선택된 고객이 없습니다.');
      return;
    }
    const pointsToAdd = prompt(`선택된 고객 ${selectedCustomerIds.length}명에게 지급할 프로모션 보너스 포인트를 입력하세요 (P):`, '5000');
    if (!pointsToAdd || isNaN(Number(pointsToAdd))) return;

    const addVal = parseInt(pointsToAdd, 10);
    const updated = customers.map(c => {
      if (selectedCustomerIds.includes(c.id)) {
        return {
          ...c,
          accruedPoints: c.accruedPoints + addVal,
          notes: (c.notes || '') + `\n[${new Date().toISOString().slice(0,10)}] 프로모션 보너스 +${addVal.toLocaleString()}P 일괄 지급`
        };
      }
      return c;
    });

    saveCustomersState(updated);
    alert(`선택된 ${selectedCustomerIds.length}개 고객사에 각각 ₩${addVal.toLocaleString()}P가 지급되었습니다.`);
    setSelectedCustomerIds([]);
  };

  const handleBulkAddTag = () => {
    if (selectedCustomerIds.length === 0) {
      alert('선택된 고객이 없습니다.');
      return;
    }
    const newTag = prompt('선택된 고객들에게 일괄 추가할 마케팅 태그를 입력하세요 (예: #2026추석특가, #원산지문의):', '#2026추석프로모션');
    if (!newTag || !newTag.trim()) return;

    const formattedTag = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
    const updated = customers.map(c => {
      if (selectedCustomerIds.includes(c.id)) {
        const currentTags = c.tags || [];
        if (!currentTags.includes(formattedTag)) {
          return { ...c, tags: [...currentTags, formattedTag] };
        }
      }
      return c;
    });

    saveCustomersState(updated);
    alert(`선택된 ${selectedCustomerIds.length}개 고객사에 [${formattedTag}] 태그가 일괄 추가되었습니다.`);
  };

  const handleRemoveTag = (customerId: string, tagToRemove: string) => {
    const updated = customers.map(c => {
      if (c.id === customerId) {
        return { ...c, tags: (c.tags || []).filter(t => t !== tagToRemove) };
      }
      return c;
    });
    saveCustomersState(updated);
  };

  const handleAddInlineTag = (customerId: string) => {
    const tag = prompt('추가할 태그를 입력하세요 (예: #농수산물, #대형법인, #화학품):');
    if (!tag || !tag.trim()) return;
    const formatted = tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`;
    const updated = customers.map(c => {
      if (c.id === customerId) {
        const current = c.tags || [];
        if (!current.includes(formatted)) {
          return { ...c, tags: [...current, formatted] };
        }
      }
      return c;
    });
    saveCustomersState(updated);
  };

  const toggleCustomerStatus = async (id: string, currentStatus: string, companyName: string, email: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await fetch(`/api/customers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.warn('API fallback to local state', e);
    }

    const updated = customers.map(c => {
      if (c.id === id) {
        return { ...c, status: newStatus as any };
      }
      return c;
    });
    saveCustomersState(updated);
    alert(`[계정 상태 변경]\n${companyName} (${email}) 계정이 [${newStatus === 'Active' ? '이용 활성' : '이용 정지'}] 처리되었습니다.`);
  };

  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.companyName || !newCustomerForm.email) {
      alert('회사명과 이메일은 필수 입력 사항입니다.');
      return;
    }

    const tagsArray = newCustomerForm.tags
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const newCustomer: Customer = {
      id: String(Date.now()),
      email: newCustomerForm.email,
      companyName: newCustomerForm.companyName,
      contactName: newCustomerForm.contactName || newCustomerForm.companyName + ' 담당자',
      phoneNumber: newCustomerForm.phoneNumber || '010-0000-0000',
      plan: newCustomerForm.plan,
      status: 'Active',
      joinDate: new Date().toISOString().slice(0, 10),
      accruedPoints: Number(newCustomerForm.accruedPoints) || 5000,
      tags: tagsArray.length > 0 ? tagsArray : ['#관세법인', '#HS분류'],
      notes: newCustomerForm.notes || '시스템 기본 등록 고객',
      lastActiveDate: new Date().toISOString().slice(0, 10)
    };

    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newCustomer.email,
          company_name: newCustomer.companyName,
          plan: newCustomer.plan,
          status: newCustomer.status,
          accrued_points: newCustomer.accruedPoints,
          phone_number: newCustomer.phoneNumber
        })
      });
    } catch (err) {
      console.warn('Backend API unavailable, saved locally');
    }

    saveCustomersState([newCustomer, ...customers]);
    setIsAddCustomerModalOpen(false);
    setNewCustomerForm({
      companyName: '',
      contactName: '',
      email: '',
      phoneNumber: '',
      plan: 'Free',
      accruedPoints: 5000,
      tags: '#신규가입 #관세상담',
      notes: '시스템 기본 등록 고객'
    });
    alert(`신규 고객사 [${newCustomer.companyName}] 등록이 완료되었습니다.`);
  };

  const handleOpenEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setEditForm({
      companyName: c.companyName,
      contactName: c.contactName || '',
      email: c.email,
      phoneNumber: c.phoneNumber || '',
      plan: c.plan,
      status: c.status as any,
      accruedPoints: c.accruedPoints,
      tags: (c.tags || []).join(' '),
      notes: c.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const tagsArray = editForm.tags
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const updated = customers.map(c => {
      if (c.id === editingCustomer.id) {
        return {
          ...c,
          companyName: editForm.companyName,
          contactName: editForm.contactName,
          phoneNumber: editForm.phoneNumber,
          plan: editForm.plan,
          status: editForm.status,
          accruedPoints: Number(editForm.accruedPoints) || 0,
          tags: tagsArray,
          notes: editForm.notes
        };
      }
      return c;
    });

    try {
      await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: editForm.companyName,
          plan: editForm.plan,
          status: editForm.status,
          accrued_points: Number(editForm.accruedPoints),
          phone_number: editForm.phoneNumber
        })
      });
    } catch (err) {
      console.warn('API fallback to local state', err);
    }

    saveCustomersState(updated);
    setIsEditModalOpen(false);
    setEditingCustomer(null);
    alert(`고객사 [${editForm.companyName}] CRM 정보가 업데이트되었습니다.`);
  };

  const handleOpenMarketingLauncher = (target?: Customer) => {
    if (target) {
      setTemplateTargetCustomer(target);
    } else if (selectedCustomerIds.length === 1) {
      const single = customers.find(c => c.id === selectedCustomerIds[0]);
      setTemplateTargetCustomer(single || null);
    } else {
      setTemplateTargetCustomer(null);
    }
    setIsTemplateModalOpen(true);
  };

  const generatedTemplateContent = useMemo(() => {
    const target = templateTargetCustomer || (selectedCustomerIds.length > 0 ? customers.find(c => c.id === selectedCustomerIds[0]) : filteredCustomers[0]) || {
      companyName: '(주)고객사명',
      contactName: '관세/통관 담당자',
      email: 'customer@company.com',
      accruedPoints: 5000,
      plan: 'Free'
    };

    let text = selectedTemplate.content;
    text = text.replace(/{companyName}/g, target.companyName || '고객사');
    text = text.replace(/{contactName}/g, target.contactName || '담당자님');
    text = text.replace(/{email}/g, target.email || '');
    text = text.replace(/{points}/g, (target.accruedPoints || 0).toLocaleString());
    text = text.replace(/{plan}/g, target.plan || 'Free');
    return text;
  }, [selectedTemplate, templateTargetCustomer, selectedCustomerIds, filteredCustomers, customers]);

  const handleCopyTemplateText = () => {
    navigator.clipboard.writeText(generatedTemplateContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleTriggerCrawler = async () => {
    setIsCrawling(true);
    try {
      const res = await fetch('/api/admin/crawler/trigger', { method: 'POST' });
      if (res.ok) {
        alert('🚀 [정기 크롤러] 즉시 동기화 작업이 시작되었습니다.\n(관세청 실시간 고시, 조세심판원 최신 결정례, 중앙관세분석소 데이터베이스)');
        setTimeout(() => {
          fetchAdminData();
          setIsCrawling(false);
        }, 2000);
      } else {
        alert('크롤러 실행 요청에 실패했습니다.');
        setIsCrawling(false);
      }
    } catch (e) {
      alert('크롤러 동기화 완료 (로컬 모드)');
      setIsCrawling(false);
    }
  };

  const approveRequest = async (reqId: string, email: string, points: number) => {
    try {
      await fetch(`/api/cashback/requests/${reqId}/approve`, { method: 'POST' });
      alert(`[검수 완료 - 캐시백 승인]\n${email} 계정에 ₩${points.toLocaleString()}P 적립이 승인 완료되었습니다.`);
      fetchAdminData();
    } catch (err) {
      setUploadRequests(uploadRequests.filter(r => r.id !== reqId));
    }
  };

  const rejectRequest = async (reqId: string, email: string) => {
    const reason = prompt('반려 사유를 입력하세요:', '문서 내 수입자 상호 및 개인정보 비식별화(마스킹) 처리가 누락되었습니다.');
    if (!reason) return;

    try {
      await fetch(`/api/cashback/requests/${reqId}/reject`, { method: 'POST' });
      alert(`[검수 완료 - 캐시백 반려]\n수신인: ${email}\n반려사유: ${reason}`);
      fetchAdminData();
    } catch (err) {
      setUploadRequests(uploadRequests.filter(r => r.id !== reqId));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', width: '100%', color: '#000000', fontFamily: 'inherit' }}>
      
      {/* 1. Header Banner & High-Contrast Navigation Tabs (Text-First Overhaul) */}
      <div style={{
        padding: '30px 34px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: '#ffffff',
        border: '2.5px solid #475569',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{
                background: '#ccfbf1',
                padding: '12px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2.5px solid #0d9488'
              }}>
                <ShieldAlert size={30} color="#0f766e" />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 950, color: '#000000', margin: 0, letterSpacing: '-0.02em' }}>
                CUSWAY 총괄 관리자 포털 & 통합 고객 CRM 허브
              </h1>
              <span style={{
                fontSize: '0.95rem',
                padding: '6px 16px',
                borderRadius: '14px',
                background: '#ccfbf1',
                color: '#064e3b',
                fontWeight: 950,
                border: '2px solid #0d9488'
              }}>
                👑 Operation & CRM Hub
              </span>
            </div>
            <p style={{ fontSize: '1.08rem', color: '#000000', marginTop: '10px', margin: 0, fontWeight: 850, lineHeight: 1.6 }}>
              관세법인·수출입기업 회원 CRM 관리, 결정례 캐시백 검수, B2B 맞춤형 마케팅 캠페인 및 법령 크롤러 통합 관제
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 950 }}>관리자 계정:</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 950, color: '#064e3b', background: '#ccfbf1', padding: '10px 18px', borderRadius: '10px', border: '2.5px solid #0d9488' }}>
              {currentUser?.email || '인증된 관리자'}
            </span>
          </div>
        </div>

        {/* Large High-Visibility Sub-Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '8px',
          background: '#ffffff',
          borderRadius: '14px',
          border: '2.5px solid #475569',
          width: 'fit-content',
          flexWrap: 'wrap',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={() => setActiveTab('crm')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 26px',
              borderRadius: '10px',
              border: activeTab === 'crm' ? '3px solid #0d9488' : '2px solid #94a3b8',
              fontSize: '1.05rem',
              fontWeight: 950,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'crm' ? '#ccfbf1' : '#ffffff',
              color: activeTab === 'crm' ? '#064e3b' : '#000000'
            }}
          >
            <Users size={22} color={activeTab === 'crm' ? '#0d9488' : '#000000'} />
            <span>고객 CRM & 회원 관리</span>
            <span style={{
              fontSize: '0.88rem',
              padding: '4px 12px',
              borderRadius: '12px',
              background: activeTab === 'crm' ? '#0d9488' : '#e2e8f0',
              color: activeTab === 'crm' ? '#ffffff' : '#000000',
              fontWeight: 950
            }}>
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cashback')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 26px',
              borderRadius: '10px',
              border: activeTab === 'cashback' ? '3px solid #0891b2' : '2px solid #94a3b8',
              fontSize: '1.05rem',
              fontWeight: 950,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'cashback' ? '#cffafe' : '#ffffff',
              color: activeTab === 'cashback' ? '#164e63' : '#000000'
            }}
          >
            <Coins size={22} color={activeTab === 'cashback' ? '#0891b2' : '#000000'} />
            <span>판례·캐시백 검수 센터</span>
            {uploadRequests.length > 0 && (
              <span style={{
                fontSize: '0.88rem',
                padding: '4px 12px',
                borderRadius: '12px',
                background: '#fee2e2',
                color: '#881337',
                fontWeight: 950,
                border: '2px solid #dc2626'
              }}>
                {uploadRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 26px',
              borderRadius: '10px',
              border: activeTab === 'marketing' ? '3px solid #d97706' : '2px solid #94a3b8',
              fontSize: '1.05rem',
              fontWeight: 950,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'marketing' ? '#fef3c7' : '#ffffff',
              color: activeTab === 'marketing' ? '#78350f' : '#000000'
            }}
          >
            <Send size={22} color={activeTab === 'marketing' ? '#d97706' : '#000000'} />
            <span>비즈니스 마케팅 캠페인</span>
          </button>

          <button
            onClick={() => setActiveTab('crawler')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 26px',
              borderRadius: '10px',
              border: activeTab === 'crawler' ? '3px solid #6366f1' : '2px solid #94a3b8',
              fontSize: '1.05rem',
              fontWeight: 950,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'crawler' ? '#e0e7ff' : '#ffffff',
              color: activeTab === 'crawler' ? '#312e81' : '#000000'
            }}
          >
            <Clock size={22} color={activeTab === 'crawler' ? '#6366f1' : '#000000'} />
            <span>법령·뉴스 크롤러 관제</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: 고객 CRM 관리 */}
      {activeTab === 'crm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Executive KPI Stats (4 Large Cards, Big Bold High-Contrast Numbers) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ background: '#ffffff', border: '3px solid #0d9488', borderRadius: '16px', padding: '24px 26px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#ccfbf1', padding: '16px', borderRadius: '14px', border: '2.5px solid #0d9488' }}>
                <Users size={32} color="#0f766e" />
              </div>
              <div>
                <span style={{ fontSize: '1.0rem', color: '#064e3b', fontWeight: 950, display: 'block' }}>총 관리 고객사</span>
                <h2 style={{ fontSize: '2.0rem', fontWeight: 950, margin: '2px 0 0 0', color: '#000000' }}>
                  {stats.total}<span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#000000', marginLeft: '4px' }}>개사</span>
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: 950, display: 'block', marginTop: '4px' }}>활성 {customers.filter(c => c.status === 'Active').length} · 정지 {customers.filter(c => c.status === 'Suspended').length}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '3px solid #0891b2', borderRadius: '16px', padding: '24px 26px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#cffafe', padding: '16px', borderRadius: '14px', border: '2.5px solid #0891b2' }}>
                <TrendingUp size={32} color="#0891b2" />
              </div>
              <div>
                <span style={{ fontSize: '1.0rem', color: '#0e7490', fontWeight: 950, display: 'block' }}>유료 구독 (Pro/Ent)</span>
                <h2 style={{ fontSize: '2.0rem', fontWeight: 950, margin: '2px 0 0 0', color: '#0e7490' }}>
                  {stats.paidCount}<span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#000000', marginLeft: '4px' }}>개사</span>
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 950, display: 'block', marginTop: '4px' }}>전환율 {stats.total > 0 ? Math.round((stats.paidCount / stats.total) * 100) : 0}% (MRR ₩1.24M)</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '3px solid #d97706', borderRadius: '16px', padding: '24px 26px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '14px', border: '2.5px solid #d97706' }}>
                <Sparkles size={32} color="#d97706" />
              </div>
              <div>
                <span style={{ fontSize: '1.0rem', color: '#b45309', fontWeight: 950, display: 'block' }}>마케팅 잠재 리드</span>
                <h2 style={{ fontSize: '2.0rem', fontWeight: 950, margin: '2px 0 0 0', color: '#b45309' }}>
                  {stats.proLeadsCount + stats.entLeadsCount}<span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#000000', marginLeft: '4px' }}>개사</span>
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 950, display: 'block', marginTop: '4px' }}>Pro유망 {stats.proLeadsCount} · B2B잠재 {stats.entLeadsCount}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '3px solid #16a34a', borderRadius: '16px', padding: '24px 26px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '14px', border: '2.5px solid #16a34a' }}>
                <Award size={32} color="#16a34a" />
              </div>
              <div>
                <span style={{ fontSize: '1.0rem', color: '#15803d', fontWeight: 950, display: 'block' }}>누적 캐시백 풀</span>
                <h2 style={{ fontSize: '2.0rem', fontWeight: 950, margin: '2px 0 0 0', color: '#15803d' }}>
                  ₩{(stats.totalPoints / 1000).toFixed(0)}k <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#000000' }}>P</span>
                </h2>
                <span style={{ fontSize: '0.9rem', color: '#000000', fontWeight: 950, display: 'block', marginTop: '4px' }}>기여 VIP {stats.vipCount}개사</span>
              </div>
            </div>
          </div>

          {/* Unified Search, Segments, and Actions (Big Readable Inputs) */}
          <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {/* Segment Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.0rem', fontWeight: 950, color: '#000000', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
                  <Filter size={20} color="#000000" /> 세그먼트:
                </span>

                {[
                  { key: 'all', label: `전체 (${stats.total})`, color: '#000000', bg: '#e2e8f0', border: '#475569' },
                  { key: 'pro_leads', label: `Pro 전환 유망 (${stats.proLeadsCount})`, color: '#064e3b', bg: '#ccfbf1', border: '#0d9488' },
                  { key: 'enterprise_leads', label: `Enterprise 잠재 (${stats.entLeadsCount})`, color: '#78350f', bg: '#fef3c7', border: '#d97706' },
                  { key: 'vip_contributors', label: `VIP 기여자 (${stats.vipCount})`, color: '#065f46', bg: '#dcfce7', border: '#16a34a' },
                  { key: 'at_risk', label: `휴면 관리군 (${stats.atRiskCount})`, color: '#881337', bg: '#fee2e2', border: '#dc2626' }
                ].map(seg => (
                  <button
                    key={seg.key}
                    onClick={() => setActiveSegment(seg.key as MarketingSegment)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: activeSegment === seg.key ? `3px solid ${seg.border}` : '2px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontWeight: 950,
                      cursor: 'pointer',
                      background: activeSegment === seg.key ? seg.bg : '#ffffff',
                      color: activeSegment === seg.key ? seg.color : '#000000',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {seg.label}
                  </button>
                ))}
              </div>

              {/* View Mode & Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* View Mode Toggle */}
                <div style={{ display: 'flex', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '2px solid #475569' }}>
                  <button
                    onClick={() => setViewMode('cards')}
                    title="카드형 CRM 뷰"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: viewMode === 'cards' ? '2.5px solid #0d9488' : '2.5px solid transparent',
                      background: viewMode === 'cards' ? '#ccfbf1' : 'transparent',
                      color: viewMode === 'cards' ? '#064e3b' : '#000000',
                      fontWeight: 950,
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    <LayoutGrid size={18} color={viewMode === 'cards' ? '#064e3b' : '#000000'} />
                    <span>카드 뷰</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="테이블형 상세 뷰"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: viewMode === 'table' ? '2.5px solid #0d9488' : '2.5px solid transparent',
                      background: viewMode === 'table' ? '#ccfbf1' : 'transparent',
                      color: viewMode === 'table' ? '#064e3b' : '#000000',
                      fontWeight: 950,
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    <List size={18} color={viewMode === 'table' ? '#064e3b' : '#000000'} />
                    <span>테이블 뷰</span>
                  </button>
                </div>

                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '2.5px solid #475569',
                    color: '#000000',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={18} color="#000000" />
                  <span>CSV 추출</span>
                </button>

                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: '#ccfbf1',
                    border: '2.5px solid #0d9488',
                    color: '#064e3b',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(13, 148, 136, 0.25)'
                  }}
                >
                  <Plus size={20} color="#064e3b" />
                  <span>신규 고객 등록</span>
                </button>
              </div>
            </div>

            {/* Filter Bar with Large Readable Text */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
              gap: '16px',
              paddingTop: '18px',
              borderTop: '2px solid #cbd5e1'
            }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '14px', top: '15px', color: '#000000' }} />
                <input
                  type="text"
                  placeholder="법인명, 담당자, 이메일, 전화번호, 태그, CRM 메모 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '2.5px solid #64748b',
                    color: '#000000',
                    fontSize: '1.0rem',
                    outline: 'none',
                    fontWeight: 900
                  }}
                />
              </div>

              <div>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '2.5px solid #64748b',
                    color: '#000000',
                    fontSize: '1.0rem',
                    outline: 'none',
                    fontWeight: 950
                  }}
                >
                  <option value="All">전체 구독 플랜</option>
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro 플랜</option>
                  <option value="Business">Enterprise 플랜</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '2.5px solid #64748b',
                    color: '#000000',
                    fontSize: '1.0rem',
                    outline: 'none',
                    fontWeight: 950
                  }}
                >
                  <option value="All">전체 상태</option>
                  <option value="Active">이용 활성</option>
                  <option value="Suspended">이용 정지</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedTagFilter}
                  onChange={(e) => setSelectedTagFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '2.5px solid #64748b',
                    color: '#000000',
                    fontSize: '1.0rem',
                    outline: 'none',
                    fontWeight: 950
                  }}
                >
                  <option value="All">전체 태그 필터</option>
                  {allAvailableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Bulk Selection Action Strip */}
          {selectedCustomerIds.length > 0 && (
            <div style={{
              background: '#ccfbf1',
              border: '2.5px solid #0d9488',
              borderRadius: '14px',
              padding: '16px 26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(13, 148, 136, 0.2)'
            }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 950, color: '#064e3b' }}>
                선택된 고객: <span style={{ color: '#065f46', textDecoration: 'underline', fontSize: '1.15rem' }}>{selectedCustomerIds.length}</span>개사
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleBulkAddPoints}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#dcfce7',
                    border: '2px solid #16a34a',
                    color: '#065f46',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer'
                  }}
                >
                  🎁 일괄 포인트 지급
                </button>

                <button
                  onClick={handleBulkAddTag}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#fef3c7',
                    border: '2px solid #d97706',
                    color: '#78350f',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer'
                  }}
                >
                  🏷️ 일괄 태그
                </button>

                <button
                  onClick={() => handleOpenMarketingLauncher()}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: '#ccfbf1',
                    border: '2px solid #0d9488',
                    color: '#064e3b',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer'
                  }}
                >
                  📢 마케팅 메시지 발송
                </button>
              </div>
            </div>
          )}

          {/* Customer CRM Items List / Cards Presentation */}
          {filteredCustomers.length === 0 ? (
            <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', color: '#000000' }}>
              <Users size={48} color="#0f766e" style={{ opacity: 0.7, margin: '0 auto 12px' }} />
              <p style={{ fontSize: '1.2rem', fontWeight: 950, color: '#000000' }}>검색 및 필터 조건에 부합하는 고객이 없습니다.</p>
            </div>
          ) : viewMode === 'cards' ? (
            /* ===================================================
               A. High-Contrast Typography-Centered Card View (Text-Focused)
               =================================================== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredCustomers.map(c => {
                const isChecked = selectedCustomerIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    style={{
                      background: isChecked ? '#f0fdfa' : '#ffffff',
                      border: isChecked ? '3.5px solid #0d9488' : '2.5px solid #475569',
                      borderRadius: '16px',
                      padding: '26px 30px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Top Row: Checkbox, Company Name, Contact, Plan Badge, Status Badge, Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <div onClick={() => handleToggleSelect(c.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          {isChecked ? (
                            <CheckSquare size={26} color="#0f766e" />
                          ) : (
                            <Square size={26} color="#475569" />
                          )}
                        </div>

                        {/* Company Name & Contact in Large Bold Text */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.38rem', fontWeight: 950, color: '#000000', letterSpacing: '-0.01em' }}>
                            {c.companyName}
                          </span>
                          <span style={{ fontSize: '1.08rem', fontWeight: 900, color: '#1e293b' }}>
                            ({c.contactName || c.companyName?.slice(0, 4) + ' 담당자'})
                          </span>
                        </div>

                        {/* Plan Badge */}
                        <span style={{
                          fontSize: '0.95rem',
                          padding: '6px 16px',
                          borderRadius: '10px',
                          fontWeight: 950,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: c.plan === 'Business' ? '#fef3c7' : c.plan === 'Basic' ? '#ccfbf1' : '#f1f5f9',
                          color: c.plan === 'Business' ? '#78350f' : c.plan === 'Basic' ? '#064e3b' : '#000000',
                          border: c.plan === 'Business' ? '2.5px solid #d97706' : c.plan === 'Basic' ? '2.5px solid #0d9488' : '2px solid #475569'
                        }}>
                          {c.plan === 'Business' ? '👑 Enterprise' : c.plan === 'Basic' ? '⚡ Pro' : 'Free 플랜'}
                        </span>

                        {/* Status Badge */}
                        <span style={{
                          fontSize: '0.95rem',
                          fontWeight: 950,
                          padding: '6px 16px',
                          borderRadius: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: c.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: c.status === 'Active' ? '#065f46' : '#881337',
                          border: c.status === 'Active' ? '2.5px solid #16a34a' : '2.5px solid #dc2626'
                        }}>
                          {c.status === 'Active' ? '● 이용 활성' : '■ 이용 정지'}
                        </span>
                      </div>

                      {/* Action Buttons Strip */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => handleOpenMarketingLauncher(c)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            background: '#cffafe',
                            border: '2.5px solid #0891b2',
                            color: '#164e63',
                            fontSize: '0.95rem',
                            fontWeight: 950,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Send size={17} color="#164e63" />
                          <span>마케팅 발송</span>
                        </button>

                        <button
                          onClick={() => {
                            handleOpenMarketingLauncher(c);
                            window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                          }}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            background: '#FEE500',
                            border: '2.5px solid #ca8a04',
                            color: '#000000',
                            fontSize: '0.95rem',
                            fontWeight: 950,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <MessageCircle size={17} color="#000000" />
                          <span>카톡상담</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(c)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '2.5px solid #475569',
                            color: '#000000',
                            fontSize: '0.95rem',
                            fontWeight: 950,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Edit3 size={17} color="#000000" />
                          <span>CRM 상세</span>
                        </button>

                        <button
                          onClick={() => toggleCustomerStatus(c.id, c.status, c.companyName, c.email)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            background: c.status === 'Active' ? '#fee2e2' : '#dcfce7',
                            border: c.status === 'Active' ? '2.5px solid #dc2626' : '2.5px solid #16a34a',
                            color: c.status === 'Active' ? '#881337' : '#065f46',
                            fontSize: '0.95rem',
                            fontWeight: 950,
                            cursor: 'pointer'
                          }}
                        >
                          {c.status === 'Active' ? '이용 정지' : '이용 활성'}
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Large Meta Info (Email, Phone, JoinDate, Points) - High Contrast */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '28px',
                      fontSize: '1.05rem',
                      padding: '16px 22px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '2.5px solid #64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#000000', fontWeight: 950 }}>📧 이메일:</span>
                        <a href={`mailto:${c.email}`} style={{ color: '#0284c7', fontWeight: 950, textDecoration: 'none', fontSize: '1.05rem' }}>
                          {c.email}
                        </a>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#000000', fontWeight: 950 }}>📞 연락처:</span>
                        <span style={{ color: '#000000', fontWeight: 950, fontSize: '1.05rem' }}>
                          {c.phoneNumber || '010-0000-0000'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#000000', fontWeight: 950 }}>📅 가입일:</span>
                        <span style={{ color: '#000000', fontWeight: 950, fontSize: '1.05rem' }}>
                          {c.joinDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                        <span style={{ color: '#064e3b', fontWeight: 950, fontSize: '1.05rem' }}>💰 보유 포인트:</span>
                        <span style={{
                          color: '#064e3b',
                          fontWeight: 950,
                          fontSize: '1.18rem',
                          background: '#ccfbf1',
                          padding: '6px 16px',
                          borderRadius: '10px',
                          border: '2.5px solid #0d9488'
                        }}>
                          ₩{c.accruedPoints.toLocaleString()} P
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row 1: Marketing Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.0rem', fontWeight: 950, color: '#000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={18} color="#0f766e" /> 태그:
                      </span>
                      {(c.tags || []).map(t => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.95rem',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            color: '#000000',
                            border: '2px solid #475569',
                            fontWeight: 950,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>{t}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(c.id, t);
                            }}
                            title="태그 삭제"
                            style={{
                              cursor: 'pointer',
                              color: '#dc2626',
                              fontWeight: 950,
                              fontSize: '1.1rem',
                              marginLeft: '4px'
                            }}
                          >
                            ×
                          </span>
                        </span>
                      ))}

                      <button
                        onClick={() => handleAddInlineTag(c.id)}
                        style={{
                          background: '#ccfbf1',
                          border: '2px solid #0d9488',
                          color: '#064e3b',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          padding: '6px 14px',
                          borderRadius: '10px',
                          fontWeight: 950
                        }}
                      >
                        + 태그 추가
                      </button>
                    </div>

                    {/* Bottom Row 2: CRM Memo Box in Large High-Contrast Font */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#ffffff',
                      padding: '16px 22px',
                      borderRadius: '12px',
                      border: '2.5px solid #64748b'
                    }}>
                      <div style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#0f766e', fontWeight: 950 }}>📝 CRM 메모:</span>
                        <span style={{ color: '#000000', fontWeight: 900 }}>
                          {c.notes || '시스템 기본 등록 고객'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenEditModal(c)}
                        style={{
                          background: '#ffffff',
                          border: '2px solid #475569',
                          color: '#000000',
                          fontSize: '0.92rem',
                          fontWeight: 950,
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          marginLeft: '16px'
                        }}
                      >
                        메모 작성 / 수정
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* ===================================================
               B. High-Contrast Large Typography Table View (Text-Focused)
               =================================================== */
            <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '50px 1.5fr 1.8fr 130px 110px 130px 1.8fr 180px',
                padding: '18px 24px',
                background: '#cbd5e1',
                borderBottom: '2.5px solid #475569',
                fontSize: '1.0rem',
                fontWeight: 950,
                color: '#000000',
                alignItems: 'center'
              }}>
                <div onClick={handleSelectAll} style={{ cursor: 'pointer' }}>
                  {selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                    <CheckSquare size={24} color="#0f766e" />
                  ) : (
                    <Square size={24} color="#000000" />
                  )}
                </div>
                <div>법인 / 상호명</div>
                <div>계정 이메일 / 연락처</div>
                <div>구독 플랜</div>
                <div>상태</div>
                <div>보유 포인트</div>
                <div>CRM 메모 및 태그</div>
                <div style={{ textAlign: 'right' }}>관리 액션</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredCustomers.map(c => {
                  const isChecked = selectedCustomerIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1.5fr 1.8fr 130px 110px 130px 1.8fr 180px',
                        padding: '18px 24px',
                        borderBottom: '2px solid #e2e8f0',
                        background: isChecked ? '#f0fdfa' : '#ffffff',
                        fontSize: '1.0rem',
                        alignItems: 'center',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div onClick={() => handleToggleSelect(c.id)} style={{ cursor: 'pointer' }}>
                        {isChecked ? (
                          <CheckSquare size={24} color="#0f766e" />
                        ) : (
                          <Square size={24} color="#475569" />
                        )}
                      </div>

                      {/* Company Name & Contact */}
                      <div>
                        <div style={{ fontWeight: 950, color: '#000000', fontSize: '1.15rem' }}>{c.companyName}</div>
                        {c.contactName && (
                          <div style={{ fontSize: '0.95rem', color: '#1e293b', marginTop: '3px', fontWeight: 900 }}>
                            {c.contactName}
                          </div>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div>
                        <div style={{ color: '#0284c7', fontWeight: 950, fontSize: '1.05rem' }}>{c.email}</div>
                        {c.phoneNumber && (
                          <div style={{ fontSize: '0.95rem', color: '#000000', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900 }}>
                            <Phone size={15} color="#000000" /> {c.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Plan Badge */}
                      <div>
                        <span style={{
                          fontSize: '0.92rem',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontWeight: 950,
                          background: c.plan === 'Business' ? '#fef3c7' : c.plan === 'Basic' ? '#ccfbf1' : '#f1f5f9',
                          color: c.plan === 'Business' ? '#78350f' : c.plan === 'Basic' ? '#064e3b' : '#000000',
                          border: c.plan === 'Business' ? '2.5px solid #d97706' : c.plan === 'Basic' ? '2.5px solid #0d9488' : '2px solid #475569'
                        }}>
                          {c.plan === 'Business' ? 'Enterprise' : c.plan === 'Basic' ? 'Pro' : 'Free'}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          fontSize: '0.92rem',
                          fontWeight: 950,
                          padding: '5px 12px',
                          borderRadius: '16px',
                          background: c.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: c.status === 'Active' ? '#065f46' : '#881337',
                          border: c.status === 'Active' ? '2.5px solid #16a34a' : '2.5px solid #dc2626'
                        }}>
                          {c.status === 'Active' ? '● 활성' : '■ 정지'}
                        </span>
                      </div>

                      {/* Points */}
                      <div style={{ fontWeight: 950, color: '#064e3b', fontSize: '1.15rem' }}>
                        ₩{c.accruedPoints.toLocaleString()}P
                      </div>

                      {/* Tags & Note */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          {(c.tags || []).slice(0, 3).map(t => (
                            <span key={t} style={{
                              fontSize: '0.88rem',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: '#ffffff',
                              color: '#000000',
                              border: '2px solid #475569',
                              fontWeight: 950
                            }}>
                              {t}
                            </span>
                          ))}
                          <button
                            onClick={() => handleAddInlineTag(c.id)}
                            style={{ background: '#ccfbf1', border: '2px solid #0d9488', color: '#064e3b', fontSize: '0.88rem', cursor: 'pointer', padding: '3px 10px', borderRadius: '6px', fontWeight: 950 }}
                          >
                            +태그
                          </button>
                        </div>
                        {c.notes && (
                          <div style={{
                            fontSize: '0.95rem',
                            color: '#000000',
                            background: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '2px solid #64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '260px',
                            fontWeight: 900
                          }}>
                            📝 {c.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenMarketingLauncher(c)}
                          title="마케팅 템플릿 발송"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#cffafe',
                            border: '2px solid #0891b2',
                            color: '#164e63',
                            cursor: 'pointer'
                          }}
                        >
                          <Send size={16} color="#164e63" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(c)}
                          title="상세 수정 및 메모"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '2px solid #475569',
                            color: '#000000',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={16} color="#000000" />
                        </button>

                        <button
                          onClick={() => toggleCustomerStatus(c.id, c.status, c.companyName, c.email)}
                          title={c.status === 'Active' ? '이용 정지 처리' : '이용 활성화 처리'}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: c.status === 'Active' ? '#fee2e2' : '#dcfce7',
                            border: c.status === 'Active' ? '2px solid #dc2626' : '2px solid #16a34a',
                            color: c.status === 'Active' ? '#881337' : '#065f46',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 950
                          }}
                        >
                          {c.status === 'Active' ? '정지' : '활성'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      )}

      {/* 3. TAB 2: 판례·캐시백 검수 센터 (Text-First Overhaul) */}
      {activeTab === 'cashback' && (
        <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', padding: '30px 34px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #e2e8f0', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 950, color: '#000000', margin: 0 }}>
                📁 비공개 결정례·판례 공유 검수 대기실
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#000000', marginTop: '8px', margin: 0, fontWeight: 850 }}>
                고객 및 관세사가 업로드한 비공개 품목분류·조세심판원 결정문을 검수하고 승인 시 캐시백 포인트를 지급합니다.
              </p>
            </div>
            <span style={{ fontSize: '1.05rem', color: '#064e3b', fontWeight: 950, background: '#ccfbf1', padding: '8px 20px', borderRadius: '16px', border: '2.5px solid #0d9488' }}>
              대기 중: {uploadRequests.length}건
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {uploadRequests.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#000000', fontSize: '1.15rem', gridColumn: '1 / -1' }}>
                <CheckCircle size={48} color="#0f766e" style={{ margin: '0 auto 14px' }} />
                <p style={{ fontWeight: 950, color: '#000000' }}>검수 대기 중인 공유 자료가 없습니다. 모든 요청이 처리되었습니다.</p>
              </div>
            ) : (
              uploadRequests.map(req => (
                <div key={req.id} style={{
                  background: '#ffffff',
                  border: '2.5px solid #64748b',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.92rem', padding: '6px 14px', borderRadius: '8px', background: '#cffafe', color: '#164e63', fontWeight: 950, border: '2px solid #0891b2' }}>
                      {req.typeKo}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: '#000000', fontWeight: 900 }}>{req.date}</span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#000000', margin: 0 }}>{req.hsCodeOrIssue}</h3>
                    <p style={{ fontSize: '1.05rem', color: '#000000', marginTop: '6px', margin: 0, fontWeight: 900 }}>품목/사건명: {req.itemName}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '2px solid #94a3b8', padding: '14px 18px', borderRadius: '10px', fontSize: '1.0rem' }}>
                    <span style={{ color: '#000000', fontWeight: 950 }}>제출자: <b style={{ color: '#0284c7' }}>{req.email}</b></span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`[문서 열기]\n${req.fileName} 검증 미리보기`); }} style={{ color: '#0f766e', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 950, fontSize: '1.0rem' }}>
                      문서검증 <ExternalLink size={17} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
                    <button
                      onClick={() => rejectRequest(req.id, req.email)}
                      style={{
                        background: '#fee2e2',
                        border: '2.5px solid #dc2626',
                        borderRadius: '10px',
                        color: '#881337',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 950,
                        cursor: 'pointer'
                      }}
                    >
                      반려 (사유입력)
                    </button>
                    <button
                      onClick={() => approveRequest(req.id, req.email, req.points)}
                      style={{
                        background: '#ccfbf1',
                        border: '2.5px solid #0d9488',
                        borderRadius: '10px',
                        color: '#064e3b',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 950,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                      }}
                    >
                      승인 (+₩{req.points.toLocaleString()}P)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 3: 마케팅 캠페인 센터 (Text-First Overhaul) */}
      {activeTab === 'marketing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '22px' }}>
          
          {/* Left: Template Selector */}
          <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ borderBottom: '2.5px solid #e2e8f0', paddingBottom: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#000000', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={22} color="#d97706" /> B2B 캠페인 템플릿 목록
              </h3>
              <p style={{ fontSize: '1.0rem', color: '#000000', marginTop: '8px', margin: 0, fontWeight: 850 }}>
                발송 목적에 최적화된 마케팅 문구를 선택하세요.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? '#fef3c7' : '#ffffff',
                      border: isSelected ? '3.5px solid #d97706' : '2.5px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.88rem',
                        padding: '5px 12px',
                        borderRadius: '8px',
                        background: '#fef3c7',
                        color: '#78350f',
                        fontWeight: 950,
                        border: '2px solid #d97706'
                      }}>
                        {tpl.badge}
                      </span>
                      {isSelected && <Check size={20} color="#d97706" />}
                    </div>
                    <h4 style={{ fontSize: '1.08rem', fontWeight: 950, color: '#000000', margin: 0 }}>{tpl.title}</h4>
                    <p style={{ fontSize: '0.95rem', color: '#000000', margin: 0, lineHeight: '1.6', fontWeight: 850 }}>{tpl.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Preview & Dispatch */}
          <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ borderBottom: '2.5px solid #e2e8f0', paddingBottom: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 950, color: '#000000', margin: 0 }}>
                실시간 변수 치환 미리보기
              </h3>
              <p style={{ fontSize: '1.0rem', color: '#000000', marginTop: '8px', margin: 0, fontWeight: 850 }}>
                고객사명, 담당자, 보유 포인트 등이 실시간으로 적용됩니다.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '2.5px solid #64748b',
              fontSize: '1.05rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#000000', fontWeight: 950 }}>수신 타겟:</span>
              <span style={{ color: '#064e3b', fontWeight: 950, fontSize: '1.05rem' }}>
                {templateTargetCustomer ? `${templateTargetCustomer.companyName} (${templateTargetCustomer.email})` : `전체 고객사 (${customers.length}개사)`}
              </span>
            </div>

            <textarea
              readOnly
              value={generatedTemplateContent}
              rows={12}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '2.5px solid #64748b',
                color: '#000000',
                fontSize: '1.02rem',
                lineHeight: '1.75',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                fontWeight: 900
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {copiedNotification && (
                  <span style={{ fontSize: '1.0rem', color: '#15803d', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={20} /> 복사 완료!
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleCopyTemplateText}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '2.5px solid #475569',
                    color: '#000000',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={18} color="#000000" />
                  <span>문구 복사</span>
                </button>

                <a
                  href={`mailto:${templateTargetCustomer?.email || ''}?subject=${encodeURIComponent(selectedTemplate.subject)}&body=${encodeURIComponent(generatedTemplateContent)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: '#cffafe',
                    border: '2.5px solid #0891b2',
                    color: '#164e63',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={18} color="#164e63" />
                  <span>이메일 열기</span>
                </a>

                <button
                  onClick={() => {
                    handleCopyTemplateText();
                    window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: '#FEE500',
                    border: '2.5px solid #ca8a04',
                    color: '#000000',
                    fontSize: '0.95rem',
                    fontWeight: 950,
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(254, 229, 0, 0.35)'
                  }}
                >
                  <MessageCircle size={18} color="#000000" />
                  <span>카카오톡 발송</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. TAB 4: 법령·뉴스 크롤러 관제 (Text-First Overhaul) */}
      {activeTab === 'crawler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{
            padding: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            border: '2.5px solid #475569',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ background: '#e0e7ff', padding: '18px', borderRadius: '14px', border: '2.5px solid #6366f1' }}>
                <Clock size={36} color="#4338ca" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 950, color: '#000000', margin: 0 }}>
                    실시간 관세 법령 및 뉴스 자동 크롤러 데몬
                  </h3>
                  <span style={{
                    fontSize: '0.92rem',
                    padding: '5px 14px',
                    borderRadius: '14px',
                    background: '#dcfce7',
                    color: '#065f46',
                    fontWeight: 950,
                    border: '2.5px solid #16a34a'
                  }}>
                    ● {crawlerStatus.status || 'Active'}
                  </span>
                </div>
                <p style={{ fontSize: '1.05rem', color: '#000000', marginTop: '8px', margin: 0, fontWeight: 850 }}>
                  동기화 주기: <b style={{ color: '#000000' }}>{crawlerStatus.schedule || '매일 2회 (09:00, 18:00 KST)'}</b> · 최근 실행: <b style={{ color: '#000000' }}>{crawlerStatus.last_run_time || '최근 동기화 완료'}</b>
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerCrawler}
              disabled={isCrawling}
              style={{
                background: '#e0e7ff',
                border: '3px solid #6366f1',
                borderRadius: '12px',
                padding: '14px 28px',
                color: '#312e81',
                fontSize: '1.05rem',
                fontWeight: 950,
                cursor: isCrawling ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: isCrawling ? 0.7 : 1,
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.25)'
              }}
            >
              <RefreshCw size={20} className={isCrawling ? 'animate-spin' : ''} />
              <span>{isCrawling ? '동기화 중...' : '⚡ 즉시 동기화 실행'}</span>
            </button>
          </div>

          <div style={{ background: '#ffffff', border: '2.5px solid #475569', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 950, color: '#0e7490', margin: 0 }}>
              📡 연동 데이터 파이프라인 대상:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '26px', fontSize: '1.05rem', color: '#000000', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.7', fontWeight: 900 }}>
              <li>관세청 전자통관 UNI-PASS 실시간 고시 및 보도자료</li>
              <li>조세심판원(Tax Tribunal) 관세 세액·품목분류 심판 결정례</li>
              <li>중앙관세분석소 화학물질 및 복합재 성분분석 사례집</li>
              <li>관세평가분류원 품목분류 사전심사 데이터베이스</li>
            </ul>
          </div>
        </div>
      )}

      {/* MODAL 1: ➕ 신규 고객 등록 모달 (Large Text) */}
      {isAddCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleCreateCustomerSubmit} style={{
            width: '100%',
            maxWidth: '600px',
            background: '#ffffff',
            border: '3px solid #475569',
            borderRadius: '18px',
            padding: '34px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #e2e8f0', paddingBottom: '18px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#000000', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={26} color="#0f766e" /> 신규 고객사 직접 등록
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '1.8rem', cursor: 'pointer', fontWeight: 950 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>법인 / 상호명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대관세법인"
                  value={newCustomerForm.companyName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>담당자 성명</label>
                <input
                  type="text"
                  placeholder="예: 홍길동 대표관세사"
                  value={newCustomerForm.contactName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>계정 이메일 *</label>
                <input
                  type="email"
                  required
                  placeholder="customs@company.co.kr"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>연락처</label>
                <input
                  type="text"
                  placeholder="010-1234-5678"
                  value={newCustomerForm.phoneNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>초기 구독 플랜</label>
                <select
                  value={newCustomerForm.plan}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 950 }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>초기 적립 포인트 (P)</label>
                <input
                  type="number"
                  value={newCustomerForm.accruedPoints}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 950 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>마케팅 태그</label>
              <input
                type="text"
                placeholder="#농수산물 #대형법인 #Pro유망"
                value={newCustomerForm.tags}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tags: e.target.value })}
                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>CRM 상담 메모</label>
              <textarea
                rows={3}
                placeholder="상담 이력 및 특이사항을 기록하세요..."
                value={newCustomerForm.notes}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', resize: 'vertical', outline: 'none', fontWeight: 900 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ padding: '12px 24px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #475569', color: '#000000', fontSize: '1.0rem', fontWeight: 950, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '12px 28px', borderRadius: '10px', background: '#ccfbf1', border: '2.5px solid #0d9488', color: '#064e3b', fontSize: '1.0rem', fontWeight: 950, cursor: 'pointer', boxShadow: '0 2px 10px rgba(13, 148, 136, 0.25)' }}
              >
                등록 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: 📝 고객 CRM 상세 & 상담 메모 모달 (Large Text) */}
      {isEditModalOpen && editingCustomer && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleSaveEditCustomer} style={{
            width: '100%',
            maxWidth: '640px',
            background: '#ffffff',
            border: '3px solid #475569',
            borderRadius: '18px',
            padding: '34px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #e2e8f0', paddingBottom: '18px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#000000', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={26} color="#0f766e" /> 고객 CRM 상세 관리 & 상담 히스토리
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '1.8rem', cursor: 'pointer', fontWeight: 950 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>법인 / 상호명</label>
                <input
                  type="text"
                  required
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>담당자 성명</label>
                <input
                  type="text"
                  value={editForm.contactName}
                  onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>계정 이메일</label>
                <input
                  type="email"
                  disabled
                  value={editForm.email}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#f1f5f9', border: '2.5px solid #cbd5e1', color: '#000000', fontSize: '1.0rem', fontWeight: 950 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>연락처</label>
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>구독 플랜</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 950 }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>계정 상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 950 }}
                >
                  <option value="Active">이용 활성</option>
                  <option value="Suspended">이용 정지</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>보유 포인트 (P)</label>
                <input
                  type="number"
                  value={editForm.accruedPoints}
                  onChange={(e) => setEditForm({ ...editForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 950 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>마케팅 태그</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="#농수산물 #화학품 #대형법인"
                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', outline: 'none', fontWeight: 900 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '1.0rem', color: '#000000', fontWeight: 950, display: 'block', marginBottom: '8px' }}>
                영업 / 상담 히스토리 CRM 메모
              </label>
              <textarea
                rows={4}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="예: 2026-09-06: 전화상담 완료. 농수산물 TRQ 기능 안내 후 Pro 결제 혜택 제안함."
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #64748b', color: '#000000', fontSize: '1.0rem', lineHeight: '1.7', resize: 'vertical', outline: 'none', fontWeight: 900 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ padding: '12px 24px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #475569', color: '#000000', fontSize: '1.0rem', fontWeight: 950, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '12px 28px', borderRadius: '10px', background: '#ccfbf1', border: '2.5px solid #0d9488', color: '#064e3b', fontSize: '1.0rem', fontWeight: 950, cursor: 'pointer', boxShadow: '0 2px 10px rgba(13, 148, 136, 0.25)' }}
              >
                저장 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: 📢 마케팅 메시지 팝업 모달 (Large Text) */}
      {isTemplateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '760px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#ffffff',
            border: '3px solid #475569',
            borderRadius: '18px',
            padding: '34px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #e2e8f0', paddingBottom: '18px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#000000', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={26} color="#0891b2" /> 마케팅 메시지 발송 런처
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '1.8rem', cursor: 'pointer', fontWeight: 950 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? '#cffafe' : '#ffffff',
                      border: isSelected ? '3.5px solid #0891b2' : '2.5px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', color: '#164e63', fontWeight: 950 }}>{tpl.badge}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 950, color: '#000000', margin: 0 }}>{tpl.title}</h4>
                  </div>
                );
              })}
            </div>

            <textarea
              readOnly
              value={generatedTemplateContent}
              rows={8}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '2.5px solid #64748b',
                color: '#000000',
                fontSize: '1.02rem',
                lineHeight: '1.7',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                fontWeight: 900
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={handleCopyTemplateText}
                style={{ padding: '12px 22px', borderRadius: '10px', background: '#ffffff', border: '2.5px solid #475569', color: '#000000', fontSize: '1.0rem', fontWeight: 950, cursor: 'pointer' }}
              >
                문구 복사
              </button>
              <button
                onClick={() => {
                  handleCopyTemplateText();
                  window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                }}
                style={{ padding: '12px 26px', borderRadius: '10px', background: '#FEE500', border: '2.5px solid #ca8a04', color: '#000000', fontSize: '1.0rem', fontWeight: 950, cursor: 'pointer', boxShadow: '0 2px 10px rgba(254, 229, 0, 0.35)' }}
              >
                카카오톡 발송
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

