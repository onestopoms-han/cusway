import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
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
  Layers,
  Copy,
  Check
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
CUSWAY를 활발히 이용해 주셔서 진심으로 감사드립니다.

{companyName}의 관세 업무 효율을 극대화하실 수 있도록, 이번 달 한정 [Pro 플랜 20% 특별 할인 프로모션]을 제공해 드립니다.

🎁 {companyName} 전용 혜택:
• Pro 플랜 첫 달 20% 구독료 할인 (월 59,000원 → 47,200원)
• 보유 중이신 리워드 포인트(₩{points} P)로 추가 차감 가능!
• 결정례/판례 공유 시 캐시백 포인트 2배 적립 (건당 최대 10,000P)
• 관세율표 3단 비교 및 WCO 해설서 무제한 AI 분석

아래 링크를 통해 할인 혜택을 즉시 적용받으실 수 있습니다.
👉 프로모션 구독하기: https://cusway.kr`
  },
  {
    id: 'tpl-b2b-whitelabel',
    category: 'enterprise',
    title: '👑 관세법인 전용 화이트라벨 단독 도메인 및 커스텀 AI 제안',
    badge: 'B2B Enterprise',
    description: '대형 관세법인 및 화주사 대상 브랜드 화이트라벨 & ERP/통관 API 연동 제안서',
    subject: '[B2B 제안] {companyName} 전용 브랜드 화이트라벨 AI 포털 및 전사 도입 안내',
    content: `[CUSWAY Enterprise B2B 제안]

안녕하십니까, {companyName} 대표 관세사님 및 IT/영업 총괄 담당자님.

귀사의 브랜드 신뢰도를 유지하면서 고객사(화주)에게 최첨단 AI 품목분류 서비스를 제공할 수 있는 [CUSWAY 화이트라벨(White-Label) 엔터프라이즈 솔루션]을 제안드립니다.

🏆 CUSWAY Enterprise 핵심 가치:
1. 단독 도메인 및 귀사 상호/CI 로고 전면 적용
2. 귀사 내부 통관 DB 및 고유 품목분류 판례 맞춤형 RAG 학습
3. 소속 관세사 무제한 계정 생성 및 전용 고객사 관리 대시보드
4. 전담 엔지니어의 1:1 온보딩 및 전산 시스템 연동 지원

상세 도입 견적 및 1:1 데모 시연이 필요하시면 편하신 시간에 회신 부탁드립니다.
📞 문의: 02-3456-7890 | 💬 카카오채널: @onestopcustoms`
  },
  {
    id: 'tpl-points-redemption',
    category: 'points',
    title: '💎 미사용 리워드 캐시백 포인트(₩{points}P) 사용 혜택 안내',
    badge: '포인트 소진',
    description: '지식 공유로 적립된 미사용 포인트를 Pro 구독 시 현금처럼 공제 사용하도록 유도',
    subject: '[리워드 안내] {companyName}님의 미사용 적립금 ₩{points} P 사용 혜택 안내',
    content: `[CUSWAY 리워드 포인트 안내]

안녕하세요, {companyName} {contactName} 담당자님.

회원님께서 관세 결정례 및 품목분류 지식 공유를 통해 적립하신 소중한 리워드 포인트가 대기 중입니다.

💰 현재 보유 포인트: ₩{points} P

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
    contactName: '김진우 대표관세사',
    plan: 'Business',
    status: 'Active',
    joinDate: '2026-06-15',
    accruedPoints: 25000,
    phoneNumber: '010-3849-2819',
    tags: ['#대형법인', '#화이트라벨도입', '#VIP', '#전자부품'],
    notes: '2026-09-04: 엔터프라이즈 화이트라벨 도메인 연동 완료. 소속 관세사 12명 계정 활성화 중. 10월 중 추가 API 연동 미팅 예정.',
    lastActiveDate: '2026-09-06'
  },
  {
    id: '2',
    email: 'trade_agent@korea.co.kr',
    companyName: '한국관세사무소',
    contactName: '이동훈 관세사',
    plan: 'Basic',
    status: 'Active',
    joinDate: '2026-07-01',
    accruedPoints: 8500,
    phoneNumber: '010-9921-4821',
    tags: ['#Pro유망', '#화학품', '#28류29류', '#연간계약상담'],
    notes: '2026-09-05: 화학물질 29류 성분분석 AI 매칭 기능 호평. Enterprise 업그레이드 견적서 요청받아 발송함.',
    lastActiveDate: '2026-09-05'
  },
  {
    id: '3',
    email: 'customs@hanatrade.com',
    companyName: '하나통상 (수입화주)',
    contactName: '박서연 차장',
    plan: 'Free',
    status: 'Active',
    joinDate: '2026-08-12',
    accruedPoints: 6200,
    phoneNumber: '010-5541-9982',
    tags: ['#농수산물', '#TRQ관심', '#Pro업그레이드유망'],
    notes: '2026-09-02: 농수산물 TRQ 추천세율 계산기 자주 이용 중. Free 한도(일 5회) 도달 빈도 높음 → Pro 20% 프로모션 추천 대상.',
    lastActiveDate: '2026-09-06'
  },
  {
    id: '4',
    email: 'global@pacificlogis.co.kr',
    companyName: '태평양로지스틱스',
    contactName: '최민호 본부장',
    plan: 'Basic',
    status: 'Active',
    joinDate: '2026-07-18',
    accruedPoints: 12000,
    phoneNumber: '010-4421-1190',
    tags: ['#포워더', '#기계설비', '#84류85류', '#판례기여우수'],
    notes: '2026-08-28: 기계류 84류 분류 사례 3건 공유 승인 완료. 캐시백 포인트 누적 12,000P.',
    lastActiveDate: '2026-09-04'
  },
  {
    id: '5',
    email: 'ceo@samwoo-customs.kr',
    companyName: '삼우관세사무소',
    contactName: '정성훈 관세사',
    plan: 'Free',
    status: 'Active',
    joinDate: '2026-08-25',
    accruedPoints: 4500,
    phoneNumber: '010-7712-3004',
    tags: ['#섬유패션', '#원산지표시', '#Pro유망'],
    notes: '2026-09-01: 원산지 표시규정 대외무역법 검토 기능 질의. Pro 업그레이드 검토 중.',
    lastActiveDate: '2026-09-03'
  },
  {
    id: '6',
    email: 'support@meditech-import.com',
    companyName: '메디텍코리아',
    contactName: '윤지혜 과장',
    plan: 'Free',
    status: 'Suspended',
    joinDate: '2026-06-20',
    accruedPoints: 1000,
    phoneNumber: '010-8841-2910',
    tags: ['#의료기기', '#90류', '#휴면고객'],
    notes: '2026-08-10: 장기 미접속으로 계정 일시정지 상태. 신규 기능 런칭 알림톡으로 재활성화 유도 필요.',
    lastActiveDate: '2026-08-10'
  }
];

interface AdminPortalProps {
  currentUser?: any;
}

type AdminTab = 'crm' | 'cashback' | 'crawler';
type MarketingSegment = 'all' | 'pro_leads' | 'enterprise_leads' | 'vip_contributors' | 'at_risk';

export default function AdminPortal({ currentUser }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('crm');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [uploadRequests, setUploadRequests] = useState<UploadRequest[]>([]);
  const [crawlerStatus, setCrawlerStatus] = useState<any>({
    schedule: "매일 2회 (09:00, 18:00 KST)",
    last_run_time: "최근 동기화 완료",
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
    notes: '2026-09-06: 관리자 직접 등록 온보딩 고객'
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
          joinDate: c.join_date || '2026-09-02',
          accruedPoints: c.accrued_points || 0,
          phoneNumber: c.phone_number || c.phoneNumber || '010-0000-0000',
          tags: c.tags || ['#관세법인', '#HS분류'],
          notes: c.notes || '시스템 기본 등록 고객'
        }));
      }

      // Check localStorage for offline / mock additions or notes
      const savedLocal = localStorage.getItem('cusway_admin_customers_v2');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge loaded and local
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
        localStorage.setItem('cusway_admin_customers_v2', JSON.stringify(INITIAL_MOCK_CUSTOMERS));
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
      const savedLocal = localStorage.getItem('cusway_admin_customers_v2');
      if (savedLocal) {
        setCustomers(JSON.parse(savedLocal));
      } else {
        setCustomers(INITIAL_MOCK_CUSTOMERS);
        localStorage.setItem('cusway_admin_customers_v2', JSON.stringify(INITIAL_MOCK_CUSTOMERS));
      }
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Save changes to localStorage helper
  const saveCustomersState = (updated: Customer[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem('cusway_admin_customers_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Collect all unique tags for filter dropdown
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    customers.forEach(c => {
      (c.tags || []).forEach(t => tagSet.add(t.trim()));
    });
    return Array.from(tagSet);
  }, [customers]);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // 1. Search Query
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

      // 2. Plan filter
      if (planFilter !== 'All' && c.plan !== planFilter) {
        return false;
      }

      // 3. Status filter
      if (statusFilter !== 'All' && c.status !== statusFilter) {
        return false;
      }

      // 4. Marketing Segment filter
      if (activeSegment === 'pro_leads') {
        // Free tier with high engagement / points >= 4,000 or specific tags
        const isProLead = c.plan === 'Free' && (c.accruedPoints >= 4000 || (c.tags || []).some(t => t.includes('Pro') || t.includes('유망')));
        if (!isProLead) return false;
      } else if (activeSegment === 'enterprise_leads') {
        // Pro users or corporate tags eligible for white-label / enterprise
        const isEntLead = (c.plan === 'Basic' || (c.tags || []).some(t => t.includes('법인') || t.includes('연간계약') || t.includes('화이트라벨')));
        if (!isEntLead) return false;
      } else if (activeSegment === 'vip_contributors') {
        // Top knowledge contributors with >= 10,000 points
        if (c.accruedPoints < 10000) return false;
      } else if (activeSegment === 'at_risk') {
        // Suspended or inactive
        if (c.status !== 'Suspended' && !(c.tags || []).some(t => t.includes('휴면'))) return false;
      }

      // 5. Tag filter dropdown
      if (selectedTagFilter !== 'All') {
        if (!(c.tags || []).includes(selectedTagFilter)) return false;
      }

      return true;
    });
  }, [customers, searchQuery, planFilter, statusFilter, activeSegment, selectedTagFilter]);

  // Marketing KPI stats
  const stats = useMemo(() => {
    const total = customers.length;
    const paidCount = customers.filter(c => c.plan === 'Basic' || c.plan === 'Business').length;
    const totalPoints = customers.reduce((acc, c) => acc + (c.accruedPoints || 0), 0);
    const proLeadsCount = customers.filter(c => c.plan === 'Free' && (c.accruedPoints >= 4000 || (c.tags || []).some(t => t.includes('Pro')))).length;
    const entLeadsCount = customers.filter(c => c.plan === 'Basic' || (c.tags || []).some(t => t.includes('법인') || t.includes('화이트라벨'))).length;
    const vipCount = customers.filter(c => c.accruedPoints >= 10000).length;
    const atRiskCount = customers.filter(c => c.status === 'Suspended' || (c.tags || []).some(t => t.includes('휴면'))).length;

    return {
      total,
      paidCount,
      totalPoints,
      proLeadsCount,
      entLeadsCount,
      vipCount,
      atRiskCount
    };
  }, [customers]);

  // Bulk selection handlers
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

  // CSV Export Function (Supports UTF-8 BOM for Excel compatibility)
  const handleExportCSV = () => {
    const targets = selectedCustomerIds.length > 0 
      ? customers.filter(c => selectedCustomerIds.includes(c.id))
      : filteredCustomers;

    if (targets.length === 0) {
      alert('내보낼 대상 고객이 없습니다.');
      return;
    }

    const headers = [
      '고객ID',
      '법인/상호명',
      '담당자명',
      '계정이메일',
      '연락처',
      '구독플랜',
      '계정상태',
      '보유포인트(KRW)',
      '가입일자',
      '마케팅태그',
      'CRM상담메모'
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

  // Bulk Bonus Points
  const handleBulkAddPoints = async () => {
    if (selectedCustomerIds.length === 0) {
      alert('선택된 고객이 없습니다.');
      return;
    }
    const pointsToAdd = prompt('선택된 고객 ' + selectedCustomerIds.length + '명에게 지급할 프로모션 보너스 포인트를 입력하세요 (P):', '5000');
    if (!pointsToAdd || isNaN(Number(pointsToAdd))) return;

    const addVal = parseInt(pointsToAdd, 10);
    const updated = customers.map(c => {
      if (selectedCustomerIds.includes(c.id)) {
        return {
          ...c,
          accruedPoints: c.accruedPoints + addVal,
          notes: (c.notes || '') + `\n[${new Date().toISOString().slice(0,10)}] 마케팅 프로모션 보너스 +${addVal.toLocaleString()}P 일괄 지급`
        };
      }
      return c;
    });

    saveCustomersState(updated);
    alert(`선택된 ${selectedCustomerIds.length}개 고객사에 각각 ₩${addVal.toLocaleString()}P가 성공적으로 지급되었습니다.`);
    setSelectedCustomerIds([]);
  };

  // Bulk Tag Assignment
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

  // Quick Inline Tag Remove
  const handleRemoveTag = (customerId: string, tagToRemove: string) => {
    const updated = customers.map(c => {
      if (c.id === customerId) {
        return { ...c, tags: (c.tags || []).filter(t => t !== tagToRemove) };
      }
      return c;
    });
    saveCustomersState(updated);
  };

  // Quick Inline Tag Add
  const handleAddInlineTag = (customerId: string) => {
    const tag = prompt('추가할 태그를 입력하세요 (예: #농수산물, #대형법인):');
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

  // Toggle Single Customer Status
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
    alert(`[계정 상태 변경]\n${companyName} (${email}) 계정이 [${newStatus === 'Active' ? '활성화' : '이용 정지'}] 처리되었습니다.`);
  };

  // Add Customer Submit
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
      tags: tagsArray.length > 0 ? tagsArray : ['#신규가입'],
      notes: newCustomerForm.notes || `[${new Date().toISOString().slice(0, 10)}] 관리자 수동 등록`,
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
      notes: '2026-09-06: 관리자 직접 등록 온보딩 고객'
    });
    alert(`신규 고객사 [${newCustomer.companyName}] 등록이 완료되었습니다.`);
  };

  // Edit Customer Open & Submit
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

  // Open Marketing Launcher for a specific customer or segment
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

  // Dynamic Template Text generator
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

  // Crawler Action
  const handleTriggerCrawler = async () => {
    setIsCrawling(true);
    try {
      const res = await fetch('/api/admin/crawler/trigger', { method: 'POST' });
      if (res.ok) {
        alert('🚀 [매일 2회 정기 크롤러] 즉시 동기화 작업이 백그라운드에서 시작되었습니다!\n(관세청 실시간 고시, 조세심판원 최신 결정례, 화학분석 사례가 갱신됩니다)');
        setTimeout(() => {
          fetchAdminData();
          setIsCrawling(false);
        }, 3000);
      } else {
        alert('크롤러 실행 요청에 실패했습니다.');
        setIsCrawling(false);
      }
    } catch (e) {
      alert('크롤러 즉시 실행 요청 완료 (시뮬레이션 모드)');
      setIsCrawling(false);
    }
  };

  // Cashback Approve & Reject
  const approveRequest = async (reqId: string, email: string, points: number) => {
    try {
      await fetch(`/api/cashback/requests/${reqId}/approve`, { method: 'POST' });
      alert(`[검수 완료 - 캐시백 승인]\n${email} 계정에 ${points.toLocaleString()}포인트(₩) 적립이 승인 완료되었습니다.`);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* 어드민 상단 통합 헤더 & 탭 네비게이션 */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(13, 148, 136, 0.08) 100%)',
        border: '1px solid rgba(20, 184, 166, 0.25)',
        borderRadius: '14px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#fff', margin: 0 }}>
              🛠️ CUSWAY 관리자 포털 & 통합 고객 CRM 허브
            </h2>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(20, 184, 166, 0.15)',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              border: '1px solid rgba(20, 184, 166, 0.3)'
            }}>
              B2B Marketing & Operation
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px', margin: 0 }}>
            관세법인/수출입기업 고객 관리, 영업 CRM 메모, 마케팅 타겟 세그먼트 추출 및 캠페인 발송 지원
          </p>
        </div>

        {/* 메인 탭 전환 버튼 */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.4)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('crm')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'crm' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'crm' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Users size={15} />
            <span>고객 CRM & 마케팅 허브</span>
            <span style={{
              fontSize: '0.7rem',
              padding: '1px 6px',
              borderRadius: '10px',
              background: activeTab === 'crm' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'crm' ? '#000' : '#fff'
            }}>
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cashback')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'cashback' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'cashback' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Coins size={15} />
            <span>판례 검수 대기실</span>
            {uploadRequests.length > 0 && (
              <span style={{
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '10px',
                background: '#ef4444',
                color: '#fff',
                fontWeight: 800
              }}>
                {uploadRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('crawler')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'crawler' ? 'var(--accent-amber)' : 'transparent',
              color: activeTab === 'crawler' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Clock size={15} />
            <span>자동 크롤러 & 시스템</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 고객 CRM & 마케팅 허브 */}
      {activeTab === 'crm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* KPI 통계 요약 카드 4종 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ background: 'rgba(8, 145, 178, 0.15)', padding: '10px', borderRadius: '10px' }}>
                <Users size={26} color="var(--accent-cyan)" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>총 관리 고객 / 법인</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 0 0' }}>{stats.total}개사</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>활성 {customers.filter(c => c.status === 'Active').length} / 정지 {customers.filter(c => c.status === 'Suspended').length}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ background: 'rgba(13, 148, 136, 0.15)', padding: '10px', borderRadius: '10px' }}>
                <TrendingUp size={26} color="var(--accent-primary)" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>유료 구독 (Pro/Enterprise)</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '2px 0 0 0' }}>
                  {stats.paidCount}개사
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>유료 전환율 {stats.total > 0 ? Math.round((stats.paidCount / stats.total) * 100) : 0}% (MRR ₩1,240,000)</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ background: 'rgba(217, 119, 6, 0.15)', padding: '10px', borderRadius: '10px' }}>
                <Sparkles size={26} color="var(--accent-amber)" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>마케팅 타겟 유망 리드</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '2px 0 0 0' }}>
                  {stats.proLeadsCount + stats.entLeadsCount}개사
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pro유망 {stats.proLeadsCount} + B2B잠재 {stats.entLeadsCount}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10b981' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px' }}>
                <Award size={26} color="#10b981" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>누적 리워드 포인트</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', margin: '2px 0 0 0' }}>
                  ₩{stats.totalPoints.toLocaleString()} P
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VIP 기여자 {stats.vipCount}명 보유 중</span>
              </div>
            </div>
          </div>

          {/* 마케팅 세그먼트 탭 & 액션 바 */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              
              {/* 세그먼트 필터 버튼 그룹 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                  <Filter size={14} /> 마케팅 세그먼트:
                </span>

                <button
                  onClick={() => setActiveSegment('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeSegment === 'all' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
                    color: activeSegment === 'all' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  🌐 전체 ({stats.total})
                </button>

                <button
                  onClick={() => setActiveSegment('pro_leads')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: activeSegment === 'pro_leads' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeSegment === 'pro_leads' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(0,0,0,0.2)',
                    color: activeSegment === 'pro_leads' ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                >
                  🚀 Pro 유료전환 유망군 ({stats.proLeadsCount})
                </button>

                <button
                  onClick={() => setActiveSegment('enterprise_leads')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: activeSegment === 'enterprise_leads' ? '1px solid var(--accent-amber)' : '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeSegment === 'enterprise_leads' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.2)',
                    color: activeSegment === 'enterprise_leads' ? 'var(--accent-amber)' : 'var(--text-muted)'
                  }}
                >
                  👑 Enterprise 잠재고객 ({stats.entLeadsCount})
                </button>

                <button
                  onClick={() => setActiveSegment('vip_contributors')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: activeSegment === 'vip_contributors' ? '1px solid #10b981' : '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeSegment === 'vip_contributors' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.2)',
                    color: activeSegment === 'vip_contributors' ? '#10b981' : 'var(--text-muted)'
                  }}
                >
                  💎 판례 기여 VIP ({stats.vipCount})
                </button>

                <button
                  onClick={() => setActiveSegment('at_risk')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: activeSegment === 'at_risk' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeSegment === 'at_risk' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.2)',
                    color: activeSegment === 'at_risk' ? '#fca5a5' : 'var(--text-muted)'
                  }}
                >
                  ⚠️ 휴면/정지 관리군 ({stats.atRiskCount})
                </button>
              </div>

              {/* 우측 주요 마케팅 액션 버튼 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10b981',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} />
                  <span>타겟 CSV 엑셀 추출</span>
                </button>

                <button
                  onClick={() => handleOpenMarketingLauncher()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  <Send size={14} />
                  <span>📢 마케팅 메시지 템플릿 발송</span>
                </button>

                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                    border: 'none',
                    color: '#000',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
                  }}
                >
                  <Plus size={15} />
                  <span>+ 신규 고객 직접 등록</span>
                </button>
              </div>

            </div>

            {/* 검색창 및 상세 필터 행 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
              gap: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)'
            }}>
              {/* 통합 검색창 */}
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="법인명, 담당자, 이메일, 전화번호, 태그(#농수산물), CRM 메모 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* 플랜 필터 */}
              <div>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="All">전체 구독 플랜</option>
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic) 플랜</option>
                  <option value="Business">Enterprise 플랜</option>
                </select>
              </div>

              {/* 상태 필터 */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="All">전체 계정 상태</option>
                  <option value="Active">이용 활성 (Active)</option>
                  <option value="Suspended">이용 정지 (Suspended)</option>
                </select>
              </div>

              {/* 태그 필터 드롭다운 */}
              <div>
                <select
                  value={selectedTagFilter}
                  onChange={(e) => setSelectedTagFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="All">전체 관심분야/태그</option>
                  {allAvailableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* 일괄 선택 액션 바 (1개 이상 체크 시 표시) */}
          {selectedCustomerIds.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '10px',
              padding: '10px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'fadeIn 0.2s ease-in'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                  선택된 고객: <span style={{ color: 'var(--accent-primary)' }}>{selectedCustomerIds.length}</span>개사
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  (전체 {filteredCustomers.length}개 중)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleBulkAddPoints}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🎁 일괄 보너스 포인트 지급
                </button>

                <button
                  onClick={handleBulkAddTag}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid var(--accent-amber)',
                    color: 'var(--accent-amber)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🏷️ 일괄 태그 부여
                </button>

                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📥 선택 대상 CSV 추출
                </button>

                <button
                  onClick={() => handleOpenMarketingLauncher()}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: '#000',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📢 선택 고객 맞춤 메시지 템플릿
                </button>
              </div>
            </div>
          )}

          {/* 고객 리스트 테이블 */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* 테이블 상단 컨트롤 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleSelectAll}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                    <CheckSquare size={16} color="var(--accent-primary)" />
                  ) : (
                    <Square size={16} />
                  )}
                  <span>전체 선택 ({filteredCustomers.length}개사 검색됨)</span>
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                💡 법인명 및 CRM 메모를 클릭하여 실시간 영업 노트를 관리할 수 있습니다.
              </div>
            </div>

            {/* 고객 목록 리스트 */}
            {filteredCustomers.length === 0 ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={40} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>검색 및 필터 조건에 부합하는 고객이 없습니다.</p>
                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>검색어를 초기화하거나 다른 세그먼트 탭을 선택해 보세요.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredCustomers.map(c => {
                  const isChecked = selectedCustomerIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: isChecked ? 'rgba(20, 184, 166, 0.08)' : 'rgba(0,0,0,0.25)',
                        border: isChecked ? '1px solid rgba(20, 184, 166, 0.4)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* 메인 정보 상단 행 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        
                        {/* 좌측: 체크박스 + 회사명 + 담당자 + 플랜 */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div
                            onClick={() => handleToggleSelect(c.id)}
                            style={{ cursor: 'pointer', marginTop: '2px' }}
                          >
                            {isChecked ? (
                              <CheckSquare size={18} color="var(--accent-primary)" />
                            ) : (
                              <Square size={18} color="var(--text-muted)" />
                            )}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                                {c.companyName}
                              </span>
                              
                              {c.contactName && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                  ({c.contactName})
                                </span>
                              )}

                              {/* 플랜 뱃지 */}
                              <span style={{
                                fontSize: '0.68rem',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontWeight: 700,
                                background: c.plan === 'Business' ? 'rgba(245, 158, 11, 0.2)' : c.plan === 'Basic' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: c.plan === 'Business' ? 'var(--accent-amber)' : c.plan === 'Basic' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                border: c.plan === 'Business' ? '1px solid rgba(245, 158, 11, 0.4)' : c.plan === 'Basic' ? '1px solid rgba(20, 184, 166, 0.4)' : '1px solid var(--border-color)'
                              }}>
                                {c.plan === 'Business' ? '👑 Enterprise' : c.plan === 'Basic' ? '⚡ Pro' : 'Free 플랜'}
                              </span>

                              {/* 상태 뱃지 */}
                              <span style={{
                                fontSize: '0.68rem',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontWeight: 700,
                                background: c.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: c.status === 'Active' ? '#10b981' : '#fca5a5'
                              }}>
                                {c.status === 'Active' ? '● 이용 활성' : '■ 이용 정지'}
                              </span>
                            </div>

                            {/* 이메일, 전화번호, 포인트, 가입일 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                              <span>이메일: <a href={`mailto:${c.email}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>{c.email}</a></span>
                              {c.phoneNumber && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <Phone size={11} />
                                  <a href={`tel:${c.phoneNumber}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{c.phoneNumber}</a>
                                </span>
                              )}
                              <span>가입일: <b>{c.joinDate}</b></span>
                              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                                보유 포인트: <b>₩{c.accruedPoints.toLocaleString()} P</b>
                              </span>
                            </div>

                          </div>
                        </div>

                        {/* 우측 빠른 액션 버튼군 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenMarketingLauncher(c)}
                            title="이 고객 대상 마케팅 템플릿 메시지 작성"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'rgba(6, 182, 212, 0.15)',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              color: 'var(--accent-cyan)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Send size={12} /> 마케팅 발송
                          </button>

                          <button
                            onClick={() => {
                              window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                            }}
                            title="카카오톡 1:1 상담 연결"
                            style={{
                              background: '#FEE500',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#111827',
                              padding: '5px 10px',
                              fontSize: '0.72rem',
                              fontWeight: 750,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <MessageCircle size={12} /> 카톡상담
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(c)}
                            title="고객 상세 정보 및 CRM 메모 수정"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid var(--border-color)',
                              color: '#fff',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={12} /> CRM 상세
                          </button>

                          <button
                            onClick={() => toggleCustomerStatus(c.id, c.status, c.companyName, c.email)}
                            style={{
                              background: c.status === 'Active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              border: c.status === 'Active' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '6px',
                              color: c.status === 'Active' ? '#fca5a5' : '#10b981',
                              padding: '5px 8px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {c.status === 'Active' ? '이용 정지' : '이용 활성화'}
                          </button>
                        </div>

                      </div>

                      {/* 태그 영역 & CRM 최신 메모 행 */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 2fr',
                        gap: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        alignItems: 'center'
                      }}>
                        {/* 태그 목록 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginRight: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Tag size={11} /> 태그:
                          </span>
                          {(c.tags || []).map(t => (
                            <span
                              key={t}
                              style={{
                                fontSize: '0.66rem',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'rgba(20, 184, 166, 0.12)',
                                color: 'var(--accent-primary)',
                                border: '1px solid rgba(20, 184, 166, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              {t}
                              <button
                                onClick={() => handleRemoveTag(c.id, t)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-muted)',
                                  cursor: 'pointer',
                                  padding: 0,
                                  fontSize: '0.65rem'
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => handleAddInlineTag(c.id)}
                            style={{
                              fontSize: '0.65rem',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              background: 'transparent',
                              border: '1px dashed var(--border-color)',
                              color: 'var(--text-muted)',
                              cursor: 'pointer'
                            }}
                          >
                            + 태그
                          </button>
                        </div>

                        {/* CRM 최신 상담 메모 */}
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#cbd5e1',
                          background: 'rgba(0,0,0,0.2)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            📝 <b>CRM 메모:</b> {c.notes || '등록된 상담 메모가 없습니다.'}
                          </span>
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--accent-primary)',
                              cursor: 'pointer',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              marginLeft: '6px',
                              flexShrink: 0
                            }}
                          >
                            메모 작성
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: 결정례/판례 공유 사례 검수 대기실 */}
      {activeTab === 'cashback' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>📁 결정례/판례 공유 사례 검수 대기실</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              고객관세사가 업로드한 품목분류/관세평가 비식별 문서를 검수하여 캐시백 승인 여부를 결정합니다. 승인 시 고객 계정에 리워드 포인트가 즉시 지급됩니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '14px' }}>
            {uploadRequests.length === 0 ? (
              <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', gridColumn: '1 / -1' }}>
                <CheckCircle size={36} color="var(--accent-primary)" style={{ opacity: 0.5, margin: '0 auto 10px' }} />
                <p>검수 대기 중인 공유 자료가 없습니다. 모든 요청이 처리되었습니다.</p>
              </div>
            ) : (
              uploadRequests.map(req => (
                <div key={req.id} style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {req.typeKo}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{req.date}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>{req.hsCodeOrIssue}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px', margin: 0 }}>품목/사건명: {req.itemName}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>제출자: <b>{req.email}</b></span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`[문서 열기]\n${req.fileName} PDF 미리보기 창이 활성화됩니다.`); }} style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                      문서검증 <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                    <button
                      onClick={() => rejectRequest(req.id, req.email)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        color: '#fca5a5',
                        padding: '7px',
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
                        padding: '7px',
                        fontSize: '0.78rem',
                        fontWeight: 750,
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
      )}

      {/* TAB 3: 자동 크롤러 & 시스템 제어 */}
      {activeTab === 'crawler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(20, 184, 166, 0.25)',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  background: 'rgba(20, 184, 166, 0.15)',
                  padding: '12px',
                  borderRadius: '10px'
                }}>
                  <Clock size={28} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      🤖 실시간 관세정보 & 결정례 매일 2회 자동 크롤러 데몬
                    </h3>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      ● {crawlerStatus.status || 'Active (정상 가동중)'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                    스케줄 주기: <b>{crawlerStatus.schedule || '매일 2회 (09:00, 18:00 KST)'}</b> | 최근 동기화: <b>{crawlerStatus.last_run_time || '동기화 완료'}</b>
                  </p>
                </div>
              </div>

              <button
                onClick={handleTriggerCrawler}
                disabled={isCrawling}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  color: '#000',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isCrawling ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 10px rgba(20, 184, 166, 0.3)',
                  opacity: isCrawling ? 0.7 : 1
                }}
              >
                <RefreshCw size={16} className={isCrawling ? 'animate-spin' : ''} />
                <span>{isCrawling ? '크롤링 수집 진행 중...' : '⚡ 지금 즉시 크롤링 동기화'}</span>
              </button>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: 0 }}>
                📡 자동 수집 데이터 파이프라인 대상 소스:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>관세청 실시간 고시/통관/법령 뉴스 피드 (Google RSS & AI CLIP)</li>
                <li>조세심판원(Tax Tribunal) 관세 최신 결정례 지식베이스</li>
                <li>중앙관세분석소 화학분석 및 복합 성분 분석 사례</li>
                <li>관세평가 및 품목분류 유권해석 지식그래프 자동 인덱싱</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: 📢 마케팅 메시지 / 이메일 발송 템플릿 모달 */}
      {isTemplateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0f172a',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            
            {/* 모달 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={18} color="var(--accent-cyan)" /> 📢 마케팅 메시지 & 캠페인 템플릿 런처
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                  고객사 맞춤형 변수({'{companyName}'}, {'{points}'} 등)가 실시간 치환되어 알림톡/문자/이메일로 즉시 복사 및 발송됩니다.
                </p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* 템플릿 선택 라디오 카드 목록 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.3)',
                      border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.66rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(20, 184, 166, 0.2)',
                        color: 'var(--accent-primary)',
                        fontWeight: 700
                      }}>
                        {tpl.badge}
                      </span>
                      {isSelected && <Check size={14} color="var(--accent-cyan)" />}
                    </div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', margin: 0 }}>{tpl.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{tpl.description}</p>
                  </div>
                );
              })}
            </div>

            {/* 수신 대상 타겟 선택 바 */}
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>수신 대상 고객:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>
                  {templateTargetCustomer 
                    ? `${templateTargetCustomer.companyName} (${templateTargetCustomer.email})`
                    : selectedCustomerIds.length > 0 
                      ? `선택된 ${selectedCustomerIds.length}개 고객사`
                      : `현재 세그먼트 ${filteredCustomers.length}개 전체 고객사`}
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                변수 자동 치환 활성화됨
              </span>
            </div>

            {/* 실시간 템플릿 미리보기 박스 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fff' }}>
                메시지 본문 (알림톡 / LMS / 이메일 프리뷰):
              </span>
              <textarea
                readOnly
                value={generatedTemplateContent}
                rows={10}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-color)',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  lineHeight: '1.6',
                  fontFamily: 'monospace',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* 하단 액션 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              <div>
                {copiedNotification && (
                  <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> 클립보드에 메시지 전문이 복사되었습니다!
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleCopyTemplateText}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={14} />
                  <span>문구 전체 복사</span>
                </button>

                <a
                  href={`mailto:${templateTargetCustomer?.email || ''}?subject=${encodeURIComponent(selectedTemplate.subject)}&body=${encodeURIComponent(generatedTemplateContent)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={14} />
                  <span>이메일 앱 열기</span>
                </a>

                <button
                  onClick={() => {
                    handleCopyTemplateText();
                    window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    background: '#FEE500',
                    border: 'none',
                    color: '#111827',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={14} />
                  <span>카카오톡 채널 발송창 이동</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ➕ 신규 고객 등록 모달 */}
      {isAddCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleCreateCustomerSubmit} className="glass-panel" style={{
            width: '100%',
            maxWidth: '560px',
            background: '#0f172a',
            border: '1px solid var(--accent-primary)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--accent-primary)" /> + 신규 고객사 직접 등록 (Onboarding)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>법인 / 상호명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대관세법인"
                  value={newCustomerForm.companyName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>담당자 성명 / 직함</label>
                <input
                  type="text"
                  placeholder="예: 홍길동 대표관세사"
                  value={newCustomerForm.contactName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>계정 이메일 *</label>
                <input
                  type="email"
                  required
                  placeholder="customs@company.co.kr"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>연락처 (전화/휴대폰)</label>
                <input
                  type="text"
                  placeholder="010-1234-5678"
                  value={newCustomerForm.phoneNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>초기 구독 플랜</label>
                <select
                  value={newCustomerForm.plan}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic) 플랜</option>
                  <option value="Business">Enterprise 플랜</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>초기 지급 포인트 (P)</label>
                <input
                  type="number"
                  value={newCustomerForm.accruedPoints}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>마케팅 태그 (띄어쓰기 구분)</label>
              <input
                type="text"
                placeholder="#농수산물 #대형법인 #연간계약상담"
                value={newCustomerForm.tags}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tags: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>초기 영업/상담 CRM 메모</label>
              <textarea
                rows={3}
                placeholder="상담 이력 및 고객 특이사항을 기록하세요..."
                value={newCustomerForm.notes}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '8px 20px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)', border: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                고객사 등록 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: 📝 고객 CRM 상세 & 상담 메모 모달 */}
      {isEditModalOpen && editingCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleSaveEditCustomer} className="glass-panel" style={{
            width: '100%',
            maxWidth: '620px',
            background: '#0f172a',
            border: '1px solid var(--accent-primary)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="var(--accent-primary)" /> 고객 CRM 상세 관리 & 상담 히스토리
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>법인 / 상호명</label>
                <input
                  type="text"
                  required
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>담당자 성명</label>
                <input
                  type="text"
                  value={editForm.contactName}
                  onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>계정 이메일</label>
                <input
                  type="email"
                  disabled
                  value={editForm.email}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>연락처 (전화/휴대폰)</label>
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>구독 플랜</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>계정 상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                >
                  <option value="Active">이용 활성 (Active)</option>
                  <option value="Suspended">이용 정지 (Suspended)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>보유 포인트 (P)</label>
                <input
                  type="number"
                  value={editForm.accruedPoints}
                  onChange={(e) => setEditForm({ ...editForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>마케팅 관심 태그 (띄어쓰기 구분)</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="#농수산물 #화학품 #대형법인 #Pro유망"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                영업 / 상담 히스토리 CRM 메모 (일자별 상담 이력)
              </label>
              <textarea
                rows={5}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="예: 2026-09-06: 전화상담 완료. 농수산물 TRQ 기능 안내 후 Pro 결제 혜택 제안함."
                style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.82rem', lineHeight: '1.5', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '8px 20px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)', border: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                CRM 정보 저장
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
