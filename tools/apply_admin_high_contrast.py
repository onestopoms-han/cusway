import os

new_admin_portal_content = '''import { useState, useEffect, useMemo } from 'react';
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
  ChevronRight
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

type AdminTab = 'crm' | 'cashback' | 'marketing' | 'crawler';
type MarketingSegment = 'all' | 'pro_leads' | 'enterprise_leads' | 'vip_contributors' | 'at_risk';

export default function AdminPortal({ currentUser }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('crm');
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

      const savedLocal = localStorage.getItem('cusway_admin_customers_v2');
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

  const saveCustomersState = (updated: Customer[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem('cusway_admin_customers_v2', JSON.stringify(updated));
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

    const csvContent = '\\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
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
          notes: (c.notes || '') + `\\n[${new Date().toISOString().slice(0,10)}] 프로모션 보너스 +${addVal.toLocaleString()}P 일괄 지급`
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
    alert(`[계정 상태 변경]\\n${companyName} (${email}) 계정이 [${newStatus === 'Active' ? '활성화' : '이용 정지'}] 처리되었습니다.`);
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
        alert('🚀 [정기 크롤러] 즉시 동기화 작업이 시작되었습니다.\\n(관세청 실시간 고시, 조세심판원 최신 결정례, 중앙관세분석소 데이터베이스)');
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
      alert(`[검수 완료 - 캐시백 승인]\\n${email} 계정에 ₩${points.toLocaleString()}P 적립이 승인 완료되었습니다.`);
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
      alert(`[검수 완료 - 캐시백 반려]\\n수신인: ${email}\\n반려사유: ${reason}`);
      fetchAdminData();
    } catch (err) {
      setUploadRequests(uploadRequests.filter(r => r.id !== reqId));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', color: '#0f172a' }}>
      
      {/* 1. Header Banner & Sleek Navigation Tabs (Bright High-Contrast Slate/Teal Card) */}
      <div style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#ccfbf1',
                padding: '8px 11px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #0d9488'
              }}>
                <ShieldAlert size={20} color="#0f766e" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                CUSWAY 총괄 관리자 포털
              </h2>
              <span style={{
                fontSize: '0.74rem',
                padding: '3px 10px',
                borderRadius: '12px',
                background: '#ccfbf1',
                color: '#0f766e',
                fontWeight: 850,
                border: '1.5px solid #0d9488'
              }}>
                Operation & CRM Hub
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: '6px', margin: 0, fontWeight: 600 }}>
              관세법인·수출입기업 회원 CRM 관리, 결정례 캐시백 검수, B2B 맞춤형 마케팅 캠페인 및 법령 크롤러 통합 관제
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>관리자 계정:</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 850, color: '#0f172a', background: '#e2e8f0', padding: '5px 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}>
              {currentUser?.email || 'admin@cusway.kr'}
            </span>
          </div>
        </div>

        {/* Unified Sub-Tabs (High-Contrast Buttons with Clear Non-White Saturated Text) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          background: '#f1f5f9',
          borderRadius: '12px',
          border: '1.5px solid #cbd5e1',
          width: 'fit-content',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('crm')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: activeTab === 'crm' ? '1.5px solid #0d9488' : '1.5px solid transparent',
              fontSize: '0.84rem',
              fontWeight: 850,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'crm' ? '#ccfbf1' : 'transparent',
              color: activeTab === 'crm' ? '#115e59' : '#475569'
            }}
          >
            <Users size={16} />
            <span>고객 CRM & 회원 관리</span>
            <span style={{
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: '10px',
              background: activeTab === 'crm' ? '#0d9488' : '#e2e8f0',
              color: activeTab === 'crm' ? '#ccfbf1' : '#334155',
              fontWeight: 900
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
              padding: '9px 18px',
              borderRadius: '8px',
              border: activeTab === 'cashback' ? '1.5px solid #0891b2' : '1.5px solid transparent',
              fontSize: '0.84rem',
              fontWeight: 850,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'cashback' ? '#cffafe' : 'transparent',
              color: activeTab === 'cashback' ? '#155e75' : '#475569'
            }}
          >
            <Coins size={16} />
            <span>판례·캐시백 검수 센터</span>
            {uploadRequests.length > 0 && (
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '10px',
                background: '#fee2e2',
                color: '#991b1b',
                fontWeight: 900,
                border: '1px solid #fca5a5'
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
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: activeTab === 'marketing' ? '1.5px solid #d97706' : '1.5px solid transparent',
              fontSize: '0.84rem',
              fontWeight: 850,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'marketing' ? '#fef3c7' : 'transparent',
              color: activeTab === 'marketing' ? '#92400e' : '#475569'
            }}
          >
            <Send size={16} />
            <span>비즈니스 마케팅 캠페인</span>
          </button>

          <button
            onClick={() => setActiveTab('crawler')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: activeTab === 'crawler' ? '1.5px solid #6366f1' : '1.5px solid transparent',
              fontSize: '0.84rem',
              fontWeight: 850,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'crawler' ? '#e0e7ff' : 'transparent',
              color: activeTab === 'crawler' ? '#3730a3' : '#475569'
            }}
          >
            <Clock size={16} />
            <span>법령·뉴스 크롤러 관제</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: 고객 CRM 관리 */}
      {activeTab === 'crm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Executive KPI Stats (4 Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#ccfbf1', padding: '10px', borderRadius: '10px', border: '1px solid #99f6e4' }}>
                <Users size={22} color="#0f766e" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 800 }}>총 관리 고객사</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '2px 0 0 0', color: '#0f172a' }}>
                  {stats.total}<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginLeft: '3px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 750 }}>활성 {customers.filter(c => c.status === 'Active').length} · 정지 {customers.filter(c => c.status === 'Suspended').length}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#cffafe', padding: '10px', borderRadius: '10px', border: '1px solid #a5f3fc' }}>
                <TrendingUp size={22} color="#0e7490" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 800 }}>유료 구독 (Pro/Ent)</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '2px 0 0 0', color: '#0e7490' }}>
                  {stats.paidCount}<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginLeft: '3px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700 }}>전환율 {stats.total > 0 ? Math.round((stats.paidCount / stats.total) * 100) : 0}% (MRR ₩1.24M)</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                <Sparkles size={22} color="#b45309" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 800 }}>마케팅 잠재 리드</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '2px 0 0 0', color: '#b45309' }}>
                  {stats.proLeadsCount + stats.entLeadsCount}<span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginLeft: '3px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700 }}>Pro유망 {stats.proLeadsCount} · B2B잠재 {stats.entLeadsCount}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <Award size={22} color="#15803d" />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 800 }}>누적 캐시백 풀</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '2px 0 0 0', color: '#15803d' }}>
                  ₩{(stats.totalPoints / 1000).toFixed(0)}k <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>P</span>
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700 }}>기여 VIP {stats.vipCount}개사</span>
              </div>
            </div>
          </div>

          {/* Unified Search, Segments, and Actions */}
          <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              {/* Segment Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 850, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                  <Filter size={14} /> 세그먼트:
                </span>

                {[
                  { key: 'all', label: `전체 (${stats.total})` },
                  { key: 'pro_leads', label: `Pro 전환 유망 (${stats.proLeadsCount})`, color: '#0f766e', bg: '#ccfbf1' },
                  { key: 'enterprise_leads', label: `Enterprise 잠재 (${stats.entLeadsCount})`, color: '#92400e', bg: '#fef3c7' },
                  { key: 'vip_contributors', label: `VIP 기여자 (${stats.vipCount})`, color: '#15803d', bg: '#dcfce7' },
                  { key: 'at_risk', label: `휴면 관리군 (${stats.atRiskCount})`, color: '#991b1b', bg: '#fee2e2' }
                ].map(seg => (
                  <button
                    key={seg.key}
                    onClick={() => setActiveSegment(seg.key as MarketingSegment)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: activeSegment === seg.key 
                        ? (seg.color ? `1.5px solid ${seg.color}` : '1.5px solid #0f172a')
                        : '1.5px solid #cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: activeSegment === seg.key 
                        ? (seg.bg || '#e2e8f0')
                        : '#f8fafc',
                      color: activeSegment === seg.key ? (seg.color || '#0f172a') : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {seg.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} />
                  <span>CSV 추출</span>
                </button>

                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: '#ccfbf1',
                    border: '1.5px solid #0d9488',
                    color: '#0f766e',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.15)'
                  }}
                >
                  <Plus size={15} />
                  <span>신규 고객 등록</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
              gap: '10px',
              paddingTop: '12px',
              borderTop: '1.5px solid #f1f5f9'
            }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="법인명, 담당자, 이메일, 전화번호, 태그, CRM 메모 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 34px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontWeight: 650
                  }}
                />
              </div>

              <div>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontWeight: 700
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
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontWeight: 700
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
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontWeight: 700
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
              border: '1.5px solid #0d9488',
              borderRadius: '8px',
              padding: '10px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(13, 148, 136, 0.1)'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#0f766e' }}>
                선택된 고객: <span style={{ color: '#115e59', textDecoration: 'underline' }}>{selectedCustomerIds.length}</span>개사
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleBulkAddPoints}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#dcfce7',
                    border: '1.5px solid #15803d',
                    color: '#15803d',
                    fontSize: '0.76rem',
                    fontWeight: 850,
                    cursor: 'pointer'
                  }}
                >
                  🎁 일괄 포인트 지급
                </button>

                <button
                  onClick={handleBulkAddTag}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#fef3c7',
                    border: '1.5px solid #b45309',
                    color: '#92400e',
                    fontSize: '0.76rem',
                    fontWeight: 850,
                    cursor: 'pointer'
                  }}
                >
                  🏷️ 일괄 태그
                </button>

                <button
                  onClick={() => handleOpenMarketingLauncher()}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: '#ccfbf1',
                    border: '1.5px solid #0d9488',
                    color: '#0f766e',
                    fontSize: '0.76rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  📢 마케팅 메시지 발송
                </button>
              </div>
            </div>
          )}

          {/* Customer CRM Table */}
          <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1.5fr 1.8fr 90px 80px 100px 1.8fr 140px',
              padding: '14px 18px',
              background: '#f1f5f9',
              borderBottom: '1.5px solid #cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 900,
              color: '#0f172a',
              alignItems: 'center'
            }}>
              <div onClick={handleSelectAll} style={{ cursor: 'pointer' }}>
                {selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                  <CheckSquare size={17} color="#0f766e" />
                ) : (
                  <Square size={17} color="#64748b" />
                )}
              </div>
              <div>법인 / 상호명</div>
              <div>계정 이메일 / 연락처</div>
              <div>구독 플랜</div>
              <div>상태</div>
              <div>보유 포인트</div>
              <div>CRM 메모 및 관심 태그</div>
              <div style={{ textAlign: 'right' }}>관리 액션</div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
                <Users size={36} style={{ opacity: 0.4, margin: '0 auto 10px' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>검색 및 필터 조건에 부합하는 고객이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredCustomers.map(c => {
                  const isChecked = selectedCustomerIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1.5fr 1.8fr 90px 80px 100px 1.8fr 140px',
                        padding: '14px 18px',
                        borderBottom: '1px solid #e2e8f0',
                        background: isChecked ? '#f0fdfa' : '#ffffff',
                        fontSize: '0.8rem',
                        alignItems: 'center',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div onClick={() => handleToggleSelect(c.id)} style={{ cursor: 'pointer' }}>
                        {isChecked ? (
                          <CheckSquare size={17} color="#0f766e" />
                        ) : (
                          <Square size={17} color="#94a3b8" />
                        )}
                      </div>

                      {/* Company Name & Contact */}
                      <div>
                        <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.86rem' }}>{c.companyName}</div>
                        {c.contactName && (
                          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px', fontWeight: 700 }}>
                            {c.contactName}
                          </div>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div>
                        <div style={{ color: '#0f172a', fontWeight: 650 }}>{c.email}</div>
                        {c.phoneNumber && (
                          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <Phone size={11} /> {c.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Plan Badge */}
                      <div>
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 850,
                          background: c.plan === 'Business' ? '#fef3c7' : c.plan === 'Basic' ? '#ccfbf1' : '#f1f5f9',
                          color: c.plan === 'Business' ? '#92400e' : c.plan === 'Basic' ? '#0f766e' : '#334155',
                          border: c.plan === 'Business' ? '1.5px solid #d97706' : c.plan === 'Basic' ? '1.5px solid #0d9488' : '1.5px solid #cbd5e1'
                        }}>
                          {c.plan === 'Business' ? 'Enterprise' : c.plan === 'Basic' ? 'Pro' : 'Free'}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 850,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: c.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: c.status === 'Active' ? '#15803d' : '#991b1b',
                          border: c.status === 'Active' ? '1.5px solid #16a34a' : '1.5px solid #dc2626'
                        }}>
                          {c.status === 'Active' ? '● 활성' : '■ 정지'}
                        </span>
                      </div>

                      {/* Points */}
                      <div style={{ fontWeight: 950, color: '#0f766e', fontSize: '0.86rem' }}>
                        ₩{c.accruedPoints.toLocaleString()}P
                      </div>

                      {/* Tags & Note */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          {(c.tags || []).slice(0, 3).map(t => (
                            <span key={t} style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: '#f1f5f9',
                              color: '#0f172a',
                              border: '1px solid #cbd5e1',
                              fontWeight: 750
                            }}>
                              {t}
                            </span>
                          ))}
                          <button
                            onClick={() => handleAddInlineTag(c.id)}
                            style={{ background: '#ccfbf1', border: '1px solid #0d9488', color: '#0f766e', fontSize: '0.68rem', cursor: 'pointer', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}
                          >
                            +태그
                          </button>
                        </div>
                        {c.notes && (
                          <div style={{
                            fontSize: '0.72rem',
                            color: '#334155',
                            background: '#f8fafc',
                            padding: '3px 7px',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '220px',
                            fontWeight: 600
                          }}>
                            📝 {c.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                        <button
                          onClick={() => handleOpenMarketingLauncher(c)}
                          title="마케팅 템플릿 발송"
                          style={{
                            padding: '5px 8px',
                            borderRadius: '5px',
                            background: '#cffafe',
                            border: '1.5px solid #0891b2',
                            color: '#155e75',
                            cursor: 'pointer'
                          }}
                        >
                          <Send size={12} />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(c)}
                          title="상세 수정 및 메모"
                          style={{
                            padding: '5px 8px',
                            borderRadius: '5px',
                            background: '#f1f5f9',
                            border: '1.5px solid #cbd5e1',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={12} />
                        </button>

                        <button
                          onClick={() => toggleCustomerStatus(c.id, c.status, c.companyName, c.email)}
                          title={c.status === 'Active' ? '이용 정지 처리' : '이용 활성화 처리'}
                          style={{
                            padding: '5px 9px',
                            borderRadius: '5px',
                            background: c.status === 'Active' ? '#fee2e2' : '#dcfce7',
                            border: c.status === 'Active' ? '1.5px solid #dc2626' : '1.5px solid #16a34a',
                            color: c.status === 'Active' ? '#991b1b' : '#15803d',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 850
                          }}
                        >
                          {c.status === 'Active' ? '정지' : '활성'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* 3. TAB 2: 판례·캐시백 검수 센터 */}
      {activeTab === 'cashback' && (
        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                📁 비공개 결정례·판례 공유 검수 대기실
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', margin: 0, fontWeight: 600 }}>
                고객 및 관세사가 업로드한 비공개 품목분류·조세심판원 결정문을 검수하고 승인 시 캐시백 포인트를 지급합니다.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 850, background: '#ccfbf1', padding: '4px 12px', borderRadius: '12px', border: '1.5px solid #0d9488' }}>
              대기 중: {uploadRequests.length}건
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {uploadRequests.length === 0 ? (
              <div style={{ padding: '50px', textAlign: 'center', color: '#475569', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
                <CheckCircle size={38} color="#0f766e" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontWeight: 800, color: '#0f172a' }}>검수 대기 중인 공유 자료가 없습니다. 모든 요청이 처리되었습니다.</p>
              </div>
            ) : (
              uploadRequests.map(req => (
                <div key={req.id} style={{
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', padding: '3px 9px', borderRadius: '4px', background: '#cffafe', color: '#155e75', fontWeight: 850, border: '1.5px solid #0891b2' }}>
                      {req.typeKo}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700 }}>{req.date}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>{req.hsCodeOrIssue}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#334155', marginTop: '3px', margin: 0, fontWeight: 650 }}>품목/사건명: {req.itemName}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1.5px solid #e2e8f0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.76rem' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>제출자: <b style={{ color: '#0f172a' }}>{req.email}</b></span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`[문서 열기]\\n${req.fileName} 검증 미리보기`); }} style={{ color: '#0f766e', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 850 }}>
                      문서검증 <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => rejectRequest(req.id, req.email)}
                      style={{
                        background: '#fee2e2',
                        border: '1.5px solid #dc2626',
                        borderRadius: '6px',
                        color: '#991b1b',
                        padding: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 850,
                        cursor: 'pointer'
                      }}
                    >
                      반려 (사유입력)
                    </button>
                    <button
                      onClick={() => approveRequest(req.id, req.email, req.points)}
                      style={{
                        background: '#ccfbf1',
                        border: '1.5px solid #0d9488',
                        borderRadius: '6px',
                        color: '#0f766e',
                        padding: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(13, 148, 136, 0.15)'
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

      {/* 4. TAB 3: 마케팅 캠페인 센터 */}
      {activeTab === 'marketing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '16px' }}>
          
          {/* Left: Template Selector */}
          <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 950, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={18} color="#b45309" /> B2B 캠페인 템플릿 목록
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px', margin: 0, fontWeight: 600 }}>
                발송 목적에 최적화된 마케팅 문구를 선택하세요.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? '#fef3c7' : '#f8fafc',
                      border: isSelected ? '1.5px solid #b45309' : '1.5px solid #cbd5e1',
                      borderRadius: '8px',
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
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 850,
                        border: '1px solid #fde68a'
                      }}>
                        {tpl.badge}
                      </span>
                      {isSelected && <Check size={16} color="#b45309" />}
                    </div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{tpl.title}</h4>
                    <p style={{ fontSize: '0.74rem', color: '#334155', margin: 0, lineHeight: '1.4', fontWeight: 600 }}>{tpl.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Preview & Dispatch */}
          <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                실시간 변수 치환 미리보기
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px', margin: 0, fontWeight: 600 }}>
                고객사명, 담당자, 보유 포인트 등이 실시간으로 적용됩니다.
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#475569', fontWeight: 700 }}>수신 타겟:</span>
              <span style={{ color: '#0f766e', fontWeight: 900 }}>
                {templateTargetCustomer ? `${templateTargetCustomer.companyName} (${templateTargetCustomer.email})` : `전체 고객사 (${customers.length}개사)`}
              </span>
            </div>

            <textarea
              readOnly
              value={generatedTemplateContent}
              rows={12}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.82rem',
                lineHeight: '1.6',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                fontWeight: 650
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {copiedNotification && (
                  <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={15} /> 복사 완료!
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleCopyTemplateText}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={14} />
                  <span>문구 복사</span>
                </button>

                <a
                  href={`mailto:${templateTargetCustomer?.email || ''}?subject=${encodeURIComponent(selectedTemplate.subject)}&body=${encodeURIComponent(generatedTemplateContent)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: '#cffafe',
                    border: '1.5px solid #0891b2',
                    color: '#155e75',
                    fontSize: '0.78rem',
                    fontWeight: 850,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={14} />
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
                    gap: '5px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: '#FEE500',
                    border: '1.5px solid #eab308',
                    color: '#111827',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(254, 229, 0, 0.3)'
                  }}
                >
                  <MessageCircle size={14} />
                  <span>카카오톡 채널</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. TAB 4: 법령·뉴스 크롤러 관제 */}
      {activeTab === 'crawler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '10px', border: '1px solid #c7d2fe' }}>
                <Clock size={26} color="#4338ca" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                    실시간 관세 법령 및 뉴스 자동 크롤러 데몬
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 9px',
                    borderRadius: '8px',
                    background: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 850,
                    border: '1.5px solid #16a34a'
                  }}>
                    ● {crawlerStatus.status || 'Active'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', margin: 0, fontWeight: 600 }}>
                  동기화 주기: <b style={{ color: '#0f172a' }}>{crawlerStatus.schedule || '매일 2회 (09:00, 18:00 KST)'}</b> · 최근 실행: <b style={{ color: '#0f172a' }}>{crawlerStatus.last_run_time || '최근 동기화 완료'}</b>
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerCrawler}
              disabled={isCrawling}
              style={{
                background: '#e0e7ff',
                border: '1.5px solid #6366f1',
                borderRadius: '6px',
                padding: '10px 18px',
                color: '#3730a3',
                fontSize: '0.82rem',
                fontWeight: 900,
                cursor: isCrawling ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isCrawling ? 0.7 : 1,
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)'
              }}
            >
              <RefreshCw size={15} className={isCrawling ? 'animate-spin' : ''} />
              <span>{isCrawling ? '동기화 중...' : '⚡ 즉시 동기화 실행'}</span>
            </button>
          </div>

          <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0e7490', margin: 0 }}>
              📡 연동 데이터 파이프라인 대상:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: '1.5', fontWeight: 600 }}>
              <li>관세청 전자통관 UNI-PASS 실시간 고시 및 보도자료</li>
              <li>조세심판원(Tax Tribunal) 관세 세액·품목분류 심판 결정례</li>
              <li>중앙관세분석소 화학물질 및 복합재 성분분석 사례집</li>
              <li>관세평가분류원 품목분류 사전심사 데이터베이스</li>
            </ul>
          </div>
        </div>
      )}

      {/* MODAL 1: ➕ 신규 고객 등록 모달 */}
      {isAddCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleCreateCustomerSubmit} style={{
            width: '100%',
            maxWidth: '520px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={18} color="#0f766e" /> 신규 고객사 직접 등록
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>법인 / 상호명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대관세법인"
                  value={newCustomerForm.companyName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>담당자 성명</label>
                <input
                  type="text"
                  placeholder="예: 홍길동 대표관세사"
                  value={newCustomerForm.contactName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>계정 이메일 *</label>
                <input
                  type="email"
                  required
                  placeholder="customs@company.co.kr"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>연락처</label>
                <input
                  type="text"
                  placeholder="010-1234-5678"
                  value={newCustomerForm.phoneNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>초기 구독 플랜</label>
                <select
                  value={newCustomerForm.plan}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 700 }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>초기 적립 포인트 (P)</label>
                <input
                  type="number"
                  value={newCustomerForm.accruedPoints}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 700 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>마케팅 태그</label>
              <input
                type="text"
                placeholder="#농수산물 #대형법인 #Pro유망"
                value={newCustomerForm.tags}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tags: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>CRM 상담 메모</label>
              <textarea
                rows={2}
                placeholder="상담 이력 및 특이사항을 기록하세요..."
                value={newCustomerForm.notes}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', resize: 'vertical', outline: 'none', fontWeight: 650 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#ccfbf1', border: '1.5px solid #0d9488', color: '#0f766e', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.15)' }}
              >
                등록 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: 📝 고객 CRM 상세 & 상담 메모 모달 */}
      {isEditModalOpen && editingCustomer && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleSaveEditCustomer} style={{
            width: '100%',
            maxWidth: '560px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={18} color="#0f766e" /> 고객 CRM 상세 관리 & 상담 히스토리
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>법인 / 상호명</label>
                <input
                  type="text"
                  required
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>담당자 성명</label>
                <input
                  type="text"
                  value={editForm.contactName}
                  onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>계정 이메일</label>
                <input
                  type="email"
                  disabled
                  value={editForm.email}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#475569', fontSize: '0.82rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>연락처</label>
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>구독 플랜</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 700 }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>계정 상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 700 }}
                >
                  <option value="Active">이용 활성</option>
                  <option value="Suspended">이용 정지</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>보유 포인트 (P)</label>
                <input
                  type="number"
                  value={editForm.accruedPoints}
                  onChange={(e) => setEditForm({ ...editForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 800 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>마케팅 태그</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="#농수산물 #화학품 #대형법인"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', outline: 'none', fontWeight: 650 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                영업 / 상담 히스토리 CRM 메모
              </label>
              <textarea
                rows={4}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="예: 2026-09-06: 전화상담 완료. 농수산물 TRQ 기능 안내 후 Pro 결제 혜택 제안함."
                style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', lineHeight: '1.5', resize: 'vertical', outline: 'none', fontWeight: 650 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#ccfbf1', border: '1.5px solid #0d9488', color: '#0f766e', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.15)' }}
              >
                저장 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: 📢 마케팅 메시지 팝업 모달 */}
      {isTemplateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={18} color="#0891b2" /> 마케팅 메시지 발송 런처
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? '#cffafe' : '#f8fafc',
                      border: isSelected ? '1.5px solid #0891b2' : '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: '#155e75', fontWeight: 850 }}>{tpl.badge}</span>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{tpl.title}</h4>
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
                padding: '12px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                fontWeight: 650
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={handleCopyTemplateText}
                style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
              >
                문구 복사
              </button>
              <button
                onClick={() => {
                  handleCopyTemplateText();
                  window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                }}
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#FEE500', border: '1.5px solid #eab308', color: '#111827', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 6px rgba(254, 229, 0, 0.3)' }}
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
'''

with open('src/components/AdminPortal.tsx', 'w', encoding='utf-8') as f:
    f.write(new_admin_portal_content)

print("Updated AdminPortal.tsx successfully with zero white text and vibrant contrasting colors!")
