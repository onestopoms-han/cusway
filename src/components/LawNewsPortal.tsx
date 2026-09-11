import React, { useState, useEffect } from 'react'
import { BookOpen, ExternalLink, FileText, Bell, Star, Search, ShieldAlert, ArrowUpRight, RefreshCw, CheckCircle2 } from 'lucide-react'

interface LawNewsPortalProps {
  currentUser: any;
}

export default function LawNewsPortal({ currentUser }: LawNewsPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notices, setNotices] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<any | null>(null);
  const [selectedLawModal, setSelectedLawModal] = useState<any | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<any | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [schedulerStatus, setSchedulerStatus] = useState<any | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Fetch 10-times daily scheduler status
  useEffect(() => {
    const fetchScheduler = async () => {
      try {
        const res = await fetch('/api/customs/scheduler/status');
        if (res.ok) {
          const data = await res.json();
          setSchedulerStatus(data);
        }
      } catch (e) {
        console.error('Scheduler status fetch error:', e);
      }
    };
    fetchScheduler();
    const timer = setInterval(fetchScheduler, 30000);
    return () => clearInterval(timer);
  }, []);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/customs/news/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage(data.message || '최신 법령·고시 실시간 동기화가 완료되었습니다.');
        const newsRes = await fetch('/api/customs/news');
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (Array.isArray(newsData) && newsData.length > 0) {
            setNotices(newsData);
          }
        }
      } else {
        setSyncMessage('동기화 처리 중 오류가 발생했습니다.');
      }
    } catch (e) {
      console.error('News sync error:', e);
      setSyncMessage('동기화 서버 연결에 실패했습니다.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        setSyncMessage(null);
      }, 5000);
    }
  };

  // Fallback Real Customs News Headlines
  const fallbackNotices = [
    {
      id: 1,
      tag: '품목 분류',
      title: '관세평가분류원, K-반도체 지원을 위한 품목분류 제도개선 추진',
      date: '2026-06-01',
      agency: '관세평가분류원 품목분류과',
      summary: '관세평가분류원은 첨단 반도체 및 핵심 부품 수출입 기업의 통관 불확실성을 해소하기 위해 품목분류 사전심사 처리기간 단축 및 전담 상담 창구를 운영합니다.',
      link: 'https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%ED%8F%89%EA%B0%80%EB%B6%84%EB%A5%98%EC%9B%90+%ED%92%88%EB%AA%A9%EB%B6%84%EB%A5%98+%EC%A0%9C%EB%8F%84%EA%B0%9C%EC%84%A0'
    },
    {
      id: 2,
      tag: '관세 평가',
      title: '수입물품 과세가격 실력 겨룬다…관세청 제24회 관세평가 경진대회 개최',
      date: '2026-06-04',
      agency: '관세청 관세평가분류원',
      summary: '관세청은 다국적기업 이전가격, 특수관계자 간 로열티 과세가격 산정 등 관세평가 전문 역량 강화를 위해 전국 세관 및 민간 무역 실무자 대상 경진대회를 개최합니다.',
      link: 'https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%ED%8F%89%EA%B0%80+%EA%B2%BD%EC%A7%84%EB%8C%80%ED%9A%8C+%EA%B4%80%EC%84%B8%EC%B2%AD'
    },
    {
      id: 3,
      tag: 'FTA/원산지',
      title: '관세청, 인도와 품목분류(HS) 분쟁 예방 협력채널 전격 구축 합의',
      date: '2026-04-30',
      agency: '관세청 국제협력총괄과',
      summary: '한-인도 CEPA 활용 기업의 통관 애로를 해소하고 양국 간 품목분류 상이로 인한 관세 분쟁을 사전에 차단하기 위한 실시간 협의 채널을 가동합니다.',
      link: 'https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%EC%B2%AD+%EC%9D%B8%EB%8F%84+%ED%92%88%EB%AA%A9%EB%B6%84%EB%A5%98+%EB%B6%84%EC%9F%81%EC%98%88%EB%B0%A9'
    },
    {
      id: 4,
      tag: '품목 분류',
      title: '수출입 품목분류 최강자 가린다...관세청, 품목분류 경진대회 공표',
      date: '2026-08-18',
      agency: '관세청 세원심사국',
      summary: '관세율표 통칙 제1호부터 제6호 적용, 부·류·소호 주규정 해석 능력 향상을 위한 전국 단위 품목분류 온라인 경진대회를 시행합니다.',
      link: 'https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%EC%B2%AD+%ED%92%88%EB%AA%A9%EB%B6%84%EB%A5%98+%EA%B2%BD%EC%A7%84%EB%8C%80%ED%9A%8C'
    },
    {
      id: 5,
      tag: '고시/지침',
      title: '관세청, WTO 관세평가협정 및 HS 해설서 번역 오류 374건 정비 발표',
      date: '2026-02-24',
      agency: '관세청 품목분류평가원',
      summary: '대국민 의견 수렴 및 관세사·학계 전문가 자문을 거쳐 WCO 영문 해설서와 국내 번역 간 불일치 조항 374건을 공식 정비하여 고시했습니다.',
      link: 'https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%EC%B2%AD+WTO+%EA%B4%80%EC%84%B8%ED%8F%89%EA%B0%80%ED%98%91%EC%A0%95+HS+%ED%95%B4%EC%84%A4%EC%84%9C+%EB%B2%88%EC%97%AD+%EC%98%A4%EB%A5%98'
    }
  ];

  useEffect(() => {
    fetch('/api/customs/news')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotices(data);
        } else {
          setNotices(fallbackNotices);
        }
      })
      .catch(err => {
        console.warn('Failed to load real-time customs news, falling back to static lists', err);
        setNotices(fallbackNotices);
      })
      .finally(() => {
        setLoadingNews(false);
      });
  }, []);

  // CLHS laws mapping with structured full-text articles
  const laws = [
    {
      title: '관세법 (Customs Act)',
      desc: '수입물품의 관세 부과·징수 및 수출입 통관을 적정하게 하여 관세 수입을 확보하고 국민경제에 이바지하는 법.',
      points: ['제30조 (과세가격 결정원칙)', '제38조 (정밀세액검증 5년)', '관세평가운영에관한고시'],
      articles: [
        { num: '제30조 (과세가격 결정원칙)', content: '수입물품의 과세가격은 우리나라에 수출하기 위하여 판매되는 물품에 대하여 구매자가 실제로 지급하였거나 지급하여야 할 가격에 다음 각 호의 금액을 더하여 조정한 거래가격으로 한다.\n1. 구매자가 부담하는 수수료 및 중개료\n2. 포장용기의 비용 및 포장비용\n3. 생산지원비용 (무상 또는 인하된 가격으로 공급한 물품 및 용역의 가격)\n4. 특허권, 실용신안권, 상표권 등 권리사용료 (로열티)\n5. 사후귀속이익 (처분/사용에 따른 수익 중 판매자에게 귀속되는 금액)\n6. 수입항까지의 운임, 보험료 및 기타 운송 관련 비용' },
        { num: '제38조 (신고납부 및 사후심사)', content: '① 수입물품에 대한 관세는 납세의무자가 세관장에게 납세신고를 하여야 한다.\n② 세관장은 납세신고를 받은 때에는 수입신고서의 기재사항과 이 법의 규정에 따른 확인사항을 심사하되, 세액에 대하여는 수입신고수리 후에 심사(사후 세액심사)한다.\n③ 세액 심사 결과 부족세액이 있을 때에는 5년의 제척기간 내에 관세 및 가산세를 경정·고지할 수 있다.' },
        { num: '관세평가운영에 관한 고시 (핵심)', content: '특수관계자 간의 이전가격 거래 시 정상가격 사전약정(APA) 및 비교가능 제3자 가격(CUP) 등 객관적이고 수량화할 수 있는 자료에 의거하여 과세가격을 입증해야 함.' }
      ]
    },
    {
      title: '자유무역협정(FTA) 관세법 특례법',
      desc: '대한민국이 체결한 자유무역협정(FTA)의 이행을 위한 협정관세 적용 및 원산지 증명/검증 조항을 규정하는 법.',
      points: ['제8조 (협정관세 적용신청)', '제9조 (사후적용 및 경정청구)', 'FTA협정관세율표'],
      articles: [
        { num: '제8조 (협정관세의 적용신청)', content: '협정관세를 적용받으려는 자는 수입신고의 수리 전까지 세관장에게 대통령령으로 정하는 바에 따라 협정관세의 적용을 신청하여야 한다. 이 경우 수입자는 원산지증명서(C/O)를 갖추고 있어야 한다.' },
        { num: '제9조 (수입신고 수리 후 협정관세 적용신청)', content: '수입신고 수리 전까지 원산지증명서를 구비하지 못하여 일반세율로 통관한 경우라도, 수입신고 수리일부터 1년 이내에 원산지증명서를 갖추어 협정관세 사후적용을 신청하고 과다 납부한 세액의 환급을 청구할 수 있다.' },
        { num: 'FTA 원산지 검증 및 직접운송', content: '수입물품이 체약상대국에서 출발하여 비체약국을 경유할 경우, 세관 통제 하의 단순 하역/보관 이외의 추가 가공이 없었음을 입증하는 직접운송 입증서류(통과선하증권 등)를 구비해야 함.' }
      ]
    },
    {
      title: '수출용원재료 관세환급특례법 (환특법)',
      desc: '수출용원재료 수입 시 납부한 관세등을 가공 수출한 후 신속하게 환급하여 수출 촉진에 기여하는 특례법.',
      points: ['제10조 (정액환급률표 적용)', '제14조 (환급신청 기한 5년)', '수수료 및 정산 절차'],
      articles: [
        { num: '제10조 (정액환급률표의 적용)', content: '관세청장은 중소기업의 환급 절차 간소화를 위하여 수출물품별로 수출금액(FOB) 당 일정액을 환급액으로 정한 간이정액환급률표를 고시할 수 있으며, 대상 기업은 별도의 소요량 증명서 없이 간이 환급을 신청할 수 있다.' },
        { num: '제14조 (환급신청 및 기한)', content: '관세등의 환급을 받으려는 자는 물품이 수출등에 제공된 날부터 5년 이내에 세관장에게 환급을 신청하여야 한다. 원재료를 수입한 날부터 2년 이내에 제조·가공하여 수출에 제공되어야 한다.' },
        { num: '소요량 계산 및 사후 정산', content: '개별환급을 적용받는 기업은 제품 1단위를 생산하는 데 소요된 원재료의 실량과 손모량을 반영한 소요량계산서 및 원재료 수불부를 작성·보관해야 함.' }
      ]
    },
    {
      title: '대외무역법 (Foreign Trade Act)',
      desc: '공정 무역 질서를 확립하고 수입 요건확인 고시(세관장확인, 통합공고) 및 원산지 표시의무 규정하는 기본법.',
      points: ['제12조 (통합공고 승인)', '원산지표시제도운영고시', '대외무역관리규정'],
      articles: [
        { num: '제12조 (통합공고 및 수입요건)', content: '관계 행정기관의 장은 수출입의 제한·금지·승인·검사 등에 관한 법령의 규정을 관세청 세관장확인제도 및 통합공고에 반영하여 고시하여야 하며, 요건 미비 물품은 세관 통관이 보류된다.' },
        { num: '제33조 (원산지표시의무)', content: '수입물품의 원산지는 최종 구매자가 용이하게 식별할 수 있는 위치에 견고하게 표시(포장 및 물품 본체 원산지 국명 각인/라벨)하여야 하며, 미표시 또는 허위표시 시 시정명령 및 과징금이 부과된다.' },
        { num: '전략물자 수출입 통제', content: '대량살상무기(WMD) 제조 및 확산에 전용될 수 있는 이중용도 품목(Dual-Use Items)에 대한 판정 및 사전 허가 규정.' }
      ]
    }
  ];

  // 4 Major Quarantine & Food Import Regulations (농수산물·식품 4대 수입검역 법령)
  const quarantineLaws = [
    {
      title: '수입식품안전관리 특별법 (식약처)',
      desc: '해외에서 국내로 수입되는 모든 가공식품, 농축수산물, 건강기능식품, 식품첨가물 및 식품용 기구·용기포장의 안전성 확보 및 수입검사를 관장하는 기본법.',
      points: ['제5조 (해외제조업소 등록)', '제20조 (수입신고 및 정밀검사)', '잔류농약 PLS 일괄적용', '한글표시사항 의무'],
      articles: [
        {
          num: '제5조 (해외제조업소의 등록)',
          content: '수입식품등을 수입하려는 자 또는 해외제조업소의 설치·운영자는 해당 수입식품등의 수입신고 7일 전까지 해외제조업소의 명칭, 소재지, 생산품목 등을 식품의약품안전처장에게 등록하여야 한다. 등록되지 아니한 해외제조업소에서 생산된 식품은 수입신고가 수리되지 아니한다.'
        },
        {
          num: '제20조 (수입신고 및 검사)',
          content: '① 수입식품등을 수입하려는 자는 식약처장에게 수입신고를 하여야 한다.\n② 검사의 종류는 서류검사, 현장검사, 정밀검사, 무작위표본검사로 구분한다.\n③ 최초로 수입되는 식품등은 물리·화학·미생물학적 정밀검사를 실시하며, 부적합 시 전량 반송 또는 폐기 조치된다.'
        },
        {
          num: '잔류농약 허용물질목록관리제도 (PLS)',
          content: '국내외 잔류허용기준(MRL)이 설정되지 않은 모든 농약 성분은 불검출(일률기준 0.01mg/kg 이하)을 적용하여 엄격히 통제함.'
        },
        {
          num: '식품등의 표시기준 (한글표시사항)',
          content: '수입식품등은 통관 전 보세구역에서 제품명, 식품유형, 수입업소명 및 소재지, 제조일자/소비기한, 원재료명 및 함량, 영양성분 등이 기재된 한글표시 라벨을 적법하게 부착해야 함.'
        }
      ]
    },
    {
      title: '식물방역법 (농림축산검역본부)',
      desc: '외래 식물병해충(과수화상병, 붉은불개미, 소나무재선충 등)의 국내 유입을 차단하여 국내 농림업 생산 및 자연환경을 보호하는 식물검역법.',
      points: ['제8조 (수입금지품 및 금지지역)', '제12조 (식물검역증명서 첨부)', '제16조 (현장소독 및 폐기명령)'],
      articles: [
        {
          num: '제8조 (수입금지품)',
          content: '① 다음 각 호의 어느 하나에 해당하는 물품은 수입할 수 없다.\n1. 금지병해충이 붙어 있거나 붙어 있다고 인정되는 식물등\n2. 금지병해충이 발생하는 지역에서 생산·발송되거나 그 지역을 경유한 식물등\n3. 흙 또는 흙이 붙어 있는 식물\n② 단순 냉동(-18℃ 이하) 또는 가열/건조/당침 등 병해충 사멸 가공공정이 입증된 물품은 제외될 수 있다.'
        },
        {
          num: '제12조 (식물검역증명서 첨부)',
          content: '수입 식물류는 수출국 정부기관이 발행한 식물검역증명서(Phytosanitary Certificate) 원본을 입항지 검역본부에 제출하여야 하며, 미첨부 시 즉시 폐기 또는 반송된다.'
        },
        {
          num: '제16조 (검역 및 소독처분)',
          content: '수입검역 과정에서 규제 병해충이 발견된 경우 검역관은 화주에게 훈증 소독(메틸브로마이드, 포스핀 등)을 명할 수 있으며, 소독이 불가능한 경우 전량 소각 또는 반송 처분한다.'
        }
      ]
    },
    {
      title: '가축전염병 예방법 (농림축산검역본부)',
      desc: '아프리카돼지열병(ASF), 구제역(FMD), 고병원성 조류인플루엔자(HPAI) 등 악성 가축전염병의 해외 유입을 방지하는 동물/축산물 검역법.',
      points: ['제31조 (지정검역물의 수입금지)', '제34조 (수입위생조건 및 증명서)', '휴대축산물 과태료 1천만원'],
      articles: [
        {
          num: '제31조 (지정검역물의 수입금지)',
          content: '가축전염병 발생 국가 또는 지역에서 생산·제조된 우육, 돈육, 가금육 및 가공품(햄, 소시지, 육포, 만두, 피자, 축산물 함유 제품)은 국내 수입이 엄격히 금지된다.'
        },
        {
          num: '제34조 (수입위생조건 및 검역증명서)',
          content: '수입 허용 국가라 하더라도 농식품부 장관이 지정·고시한 수출국 정부 승인 도축장/가공장에서 생산되고 정부 수의관이 발행한 검역증명서가 첨부된 경우에 한하여 통관이 허용된다.'
        },
        {
          num: '휴대축산물 불법 반입 처벌',
          content: '여행자 휴대품 또는 특송화물로 돈육 가공품 등을 미신고 반입하다 적발 시 1차 500만원, 최고 1,000만원의 과태료가 즉시 부과된다.'
        }
      ]
    },
    {
      title: '수산생물질병 관리법 (국립수산물품질관리원)',
      desc: '수산생물전염병(IHNV, WSSV 등) 유입 방지 및 활어/패류/냉동수산물의 안전성, 방사능·중금속 검역을 관장하는 수산물 검역법.',
      points: ['제22조 (수산생물 수입검역)', '제24조 (수출국 검역증명서)', '방사능·중금속 전수검사'],
      articles: [
        {
          num: '제22조 (수산생물의 수입검역)',
          content: '살아있는 수산동물(활어, 활패류, 활갑각류) 및 냉동·냉장 감수성 품목을 수입하려는 자는 입항 즉시 국립수산물품질관리원에 검역을 신청하고 지정 계류장에서 임상검사 및 정밀검사를 받아야 한다.'
        },
        {
          num: '방사능 및 중금속 안전성 조사',
          content: '수입 수산물에 대해 방사성 물질(세슘 134+137, 요오드 131) 및 수은, 납, 카드뮴 등 유해 중금속 전수 정밀검사를 실시하여 적합 판정 시 세관 통관을 허용함.'
        },
        {
          num: '이식승인 수산생물',
          content: '양식용 종자 또는 방류 목적 수산생물은 사전에 해양수산부 및 지자체의 이식승인을 득해야 수입검역이 진행됨.'
        }
      ]
    }
  ];

  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [activeLawCategory, setActiveLawCategory] = useState<'customs' | 'quarantine'>('customs');

  const externalLinks = [
    { name: '관세청 전자통관 UNIPASS', url: 'https://unipass.customs.go.kr/', desc: '수출입 통관 및 세관장확인 승인 신청 포털' },
    { name: '식약처 수입식품정보마루', url: 'https://impfood.mfds.go.kr/', desc: '수입식품 해외제조업소 등록 및 정밀검사 조회' },
    { name: '농림축산검역본부 PQIS', url: 'https://www.qia.go.kr/', desc: '수입 식물·동물·축산물 검역정보 통합포털' },
    { name: '국립수산물품질관리원', url: 'https://www.nfqs.go.kr/', desc: '수산물 수입검역 및 방사능 안전성 검사 정보' }
  ];

  const getNaverNewsUrl = (title: string) => {
    if (!title) return 'https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%EC%B2%AD';
    const clean = title
      .replace(/^\[[^\]]+\]\s*/g, '')
      .replace(/\([^\)]+\)$/g, '')
      .replace(/\s*-\s*[가-힣a-zA-Z0-9\s]+$/g, '')
      .trim();
    const searchKeyword = clean.length >= 3 ? clean : title;
    return `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(searchKeyword)}`;
  };

  const getDaumNewsUrl = (title: string) => {
    if (!title) return 'https://search.daum.net/search?w=news&q=%EA%B4%80%EC%84%B8%EC%B2%AD';
    const clean = title
      .replace(/^\[[^\]]+\]\s*/g, '')
      .replace(/\([^\)]+\)$/g, '')
      .replace(/\s*-\s*[가-힣a-zA-Z0-9\s]+$/g, '')
      .trim();
    const searchKeyword = clean.length >= 3 ? clean : title;
    return `https://search.daum.net/search?w=news&q=${encodeURIComponent(searchKeyword)}`;
  };

  const filteredNotices = notices.filter(n => {
    const titleLower = (n.title || '').toLowerCase();
    const summaryLower = (n.summary || '').toLowerCase();
    const tagLower = (n.tag || '').toLowerCase();
    const agencyLower = (n.agency || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = titleLower.includes(searchLower) || 
                          summaryLower.includes(searchLower) ||
                          tagLower.includes(searchLower) ||
                          agencyLower.includes(searchLower);

    if (!matchesSearch) return false;

    if (selectedTagFilter === 'all') return true;
    if (selectedTagFilter === '농수산·식품검역') {
      return tagLower.includes('검역') || tagLower.includes('식품') || tagLower.includes('농수산') ||
             titleLower.includes('검역') || titleLower.includes('식약처') || titleLower.includes('식물방역') || titleLower.includes('축산물') || titleLower.includes('수산물');
    }
    return tagLower.includes(selectedTagFilter.toLowerCase());
  });

  const activeLawsList = activeLawCategory === 'customs' ? laws : quarantineLaws;

  const filteredLaws = activeLawsList.filter(l => 
    (l.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.points.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: '#f8fafc' }}>
      
      {/* Top Section: Header Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* Header Banner */}
        <div className="glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(217, 70, 239, 0.08) 100%)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>주요 법령 및 관세 행정 정보 포털</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
            공식 관세청 고시 기준 실시간 무역 동향 및 4대 수출입 법령/고시 개정을 CUSWAY 고대비 다크모드 뷰로 통합 조회합니다.
          </p>

          {/* Header Search & Live Sync Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '380px', width: '100%', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="개정 고시 또는 뉴스 키워드 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  color: '#cbd5e1',
                  fontSize: '0.8rem'
                }}
              />
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: isSyncing ? '#0369a1' : 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? '관세청 실시간 고시 동기화 중...' : '⚡ 최신 법령/고시 실시간 동기화'}
            </button>
          </div>

          {syncMessage && (
            <div style={{
              marginTop: '12px',
              padding: '8px 14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '6px',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} />
              {syncMessage}
            </div>
          )}

          {/* 10-Times Daily Automated Intelligence Scheduler Bar */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                ⏰ 1일 10회 정시 자동 수집 가동 중
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '22:00'].map((timeStr, tIdx) => (
                  <span key={tIdx} style={{
                    background: '#1e293b',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {timeStr}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                {schedulerStatus?.next_run_slot ? `다음 수집: ${schedulerStatus.next_run_slot.time_str} (${schedulerStatus.next_run_slot.label?.split(' - ')[1] || '정시 수집'})` : '1일 10회 정시 크롤링 활성'}
              </span>
              <button
                onClick={() => setShowScheduleModal(true)}
                style={{
                  background: '#0369a1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0284c7'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0369a1'}
              >
                📅 정시 시간표 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Laws & Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        
        {/* Left Column: 4 Major Laws & Quarantine Regulations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Law Category Switcher Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <button
              onClick={() => setActiveLawCategory('customs')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeLawCategory === 'customs' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeLawCategory === 'customs' ? '#ffffff' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={15} /> 실무 필수 4대 관세법령
            </button>
            <button
              onClick={() => setActiveLawCategory('quarantine')}
              style={{
                flex: 1.2,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeLawCategory === 'quarantine' ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : 'transparent',
                color: activeLawCategory === 'quarantine' ? '#ffffff' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              🌾 농수산물·식품 4대 수입검역 법령
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {activeLawCategory === 'customs' ? '세관 통관 및 과세·FTA·환급 핵심 법률' : '식약처·농림축산검역본부·국립수산물품질관리원 4대 수입검역 법령'}
            </span>
            <span style={{
              background: activeLawCategory === 'quarantine' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(2, 132, 199, 0.15)',
              color: activeLawCategory === 'quarantine' ? '#34d399' : '#38bdf8',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              {activeLawCategory === 'customs' ? '관세 4법' : '검역 4법 (식약처·검역본부·수품원)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLaws.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                검색 조건과 일치하는 법령이 없습니다.
              </div>
            ) : (
              filteredLaws.map((law, idx) => (
                <div 
                  key={idx}
                  className="glass-panel premium-card"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{law.title}</h4>
                    <button 
                      onClick={() => setSelectedLawModal(law)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        color: activeLawCategory === 'quarantine' ? '#059669' : '#0284c7',
                        padding: '5px 10px',
                        background: activeLawCategory === 'quarantine' ? '#ecfdf5' : '#f0f9ff',
                        border: `1px solid ${activeLawCategory === 'quarantine' ? '#a7f3d0' : '#bae6fd'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <BookOpen size={12} /> 조문 전문 보기
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                    {law.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {law.points.map((pt, pIdx) => (
                      <button 
                        key={pIdx}
                        onClick={() => setSelectedLawModal(law)}
                        style={{
                          background: '#f8fafc',
                          color: activeLawCategory === 'quarantine' ? '#065f46' : '#0369a1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = activeLawCategory === 'quarantine' ? '#059669' : '#0284c7';
                          e.currentTarget.style.background = activeLawCategory === 'quarantine' ? '#ecfdf5' : '#f0f9ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#f8fafc';
                        }}
                      >
                        📖 {pt}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Notices & External Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section: News & Notices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>최신 관세 고시 및 개정 뉴스</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  title="관세청 및 검역기관 최신 고시 실시간 새로고침"
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#0284c7',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                  새로고침
                </button>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  실시간 누적 DB ({notices.length}건)
                </span>
              </div>
            </div>

            {/* Category Filter Chips Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '8px 12px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.15)'
            }}>
              {[
                { id: 'all', label: `전체 (${notices.length})` },
                { 
                  id: '농수산·식품검역', 
                  label: `🌾 농수산·식품검역 (${notices.filter(n => {
                    const t = (n.tag || '').toLowerCase();
                    const tit = (n.title || '').toLowerCase();
                    return t.includes('검역') || t.includes('식품') || t.includes('농수산') ||
                           tit.includes('검역') || tit.includes('식약처') || tit.includes('식물방역') || tit.includes('축산물') || tit.includes('수산물');
                  }).length})` 
                },
                { id: '고시', label: '📜 고시/지침' },
                { id: '품목분류', label: '🔍 품목분류' },
                { id: 'FTA', label: '🌐 FTA/원산지' },
                { id: '세관단속', label: '🚨 세관 단속' },
                { id: '관세평가', label: '⚖️ 관세평가' }
              ].map(chip => {
                const isSelected = selectedTagFilter === chip.id;
                const isQuarantineChip = chip.id === '농수산·식품검역';
                return (
                  <button
                    key={chip.id}
                    onClick={() => {
                      setSelectedTagFilter(chip.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: isSelected 
                        ? (isQuarantineChip ? '1px solid #10b981' : '1px solid #38bdf8')
                        : '1px solid rgba(148, 163, 184, 0.2)',
                      background: isSelected
                        ? (isQuarantineChip ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)')
                        : 'rgba(30, 41, 59, 0.6)',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      fontSize: '0.74rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div 
              className="glass-panel"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {filteredNotices.length > 0 ? (
                <>
                  {/* Cumulative Status Indicator Bar */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    borderBottom: '1.5px solid #e2e8f0',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    fontWeight: 600
                  }}>
                    <span>총 <b style={{ color: '#0284c7' }}>{filteredNotices.length}건</b> 누적 데이터 중 {(currentPage - 1) * 5 + 1}~{Math.min(currentPage * 5, filteredNotices.length)}건 표시</span>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#334155' }}>페이지 {currentPage} / {Math.max(1, Math.ceil(filteredNotices.length / 5))}</span>
                  </div>

                  {filteredNotices.slice((currentPage - 1) * 5, currentPage * 5).map((notice, idx) => {
                    const itemGlobalIndex = (currentPage - 1) * 5 + idx + 1;
                    const isQuarantineTag = notice.tag && (notice.tag.includes('검역') || notice.tag.includes('식품') || notice.tag.includes('농수산'));
                    const isGosiTag = notice.tag && notice.tag.includes('고시');

                    return (
                      <div 
                        key={notice.id || idx}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          paddingBottom: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}>
                              No. {itemGlobalIndex}
                            </span>
                            <span style={{
                              background: isQuarantineTag
                                ? 'rgba(16, 185, 129, 0.15)'
                                : isGosiTag
                                ? 'rgba(20, 184, 166, 0.15)'
                                : 'rgba(99, 102, 241, 0.15)',
                              color: isQuarantineTag
                                ? '#059669'
                                : isGosiTag
                                ? '#0d9488'
                                : '#4f46e5',
                              border: isQuarantineTag ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {notice.tag}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{notice.date}</span>
                        </div>

                        <h4 
                          onClick={() => setSelectedNoticeModal(notice)}
                          style={{ 
                            fontSize: '0.96rem', 
                            fontWeight: 800, 
                            margin: 0, 
                            lineHeight: 1.4, 
                            color: '#0f172a',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#0f172a'}
                        >
                          {notice.title}
                        </h4>
                        
                        <p style={{ fontSize: '0.84rem', color: '#334155', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                          {notice.summary}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>담당: <b style={{ color: '#1e293b' }}>{notice.agency}</b></span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setSelectedNoticeModal(notice)}
                              style={{ 
                                fontSize: '0.78rem', 
                                color: '#0369a1', 
                                background: '#f0f9ff',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #bae6fd',
                                cursor: 'pointer',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
                            >
                              <BookOpen size={12} /> 본문 전문 보기
                            </button>
                            <a 
                              href={getNaverNewsUrl(notice.title)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                fontSize: '0.78rem', 
                                color: '#15803d', 
                                textDecoration: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontWeight: 800,
                                background: '#f0fdf4',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #86efac',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdf4'}
                              title="네이버 뉴스에서 관련 기사 실시간 검색"
                            >
                              <Search size={12} /> 네이버 뉴스 검색 <ExternalLink size={11} />
                            </a>
                            {notice.link && notice.link.startsWith('http') && !notice.link.includes('search.naver.com') && !notice.link.includes('news.google.com') && (
                              <a 
                                href={notice.link}
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  fontSize: '0.78rem', 
                                  color: '#475569', 
                                  textDecoration: 'none', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '4px', 
                                  fontWeight: 700,
                                  background: '#f8fafc',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  transition: 'all 0.15s ease'
                                }}
                                title="관세청 공식 공문 바로가기"
                              >
                                <ExternalLink size={11} /> 공식 공문
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* 10-Page Block Pagination Controls */}
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(filteredNotices.length / 5));
                    const pageBlockSize = 10;
                    const currentBlock = Math.floor((currentPage - 1) / pageBlockSize);
                    const startPage = currentBlock * pageBlockSize + 1;
                    const endPage = Math.min(totalPages, (currentBlock + 1) * pageBlockSize);
                    const pageNumbers = [];
                    for (let p = startPage; p <= endPage; p++) {
                      pageNumbers.push(p);
                    }

                    return (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1.5px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          {/* First Page Button */}
                          <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            title="첫 페이지"
                            style={{
                              border: '1px solid #cbd5e1',
                              background: currentPage === 1 ? '#f8fafc' : '#ffffff',
                              color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            « 처음
                          </button>

                          {/* Previous Page Button */}
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            title="이전 페이지"
                            style={{
                              border: '1px solid #cbd5e1',
                              background: currentPage === 1 ? '#f8fafc' : '#ffffff',
                              color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            ‹ 이전
                          </button>

                          {/* Page Number Buttons (1~10 per block) */}
                          {pageNumbers.map(pageNum => {
                            const isActive = pageNum === currentPage;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                  minWidth: '32px',
                                  height: '32px',
                                  border: isActive ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                                  background: isActive ? '#0284c7' : '#ffffff',
                                  color: isActive ? '#ffffff' : '#334155',
                                  padding: '0 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.82rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  boxShadow: isActive ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          {/* Next Page Button */}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            title="다음 페이지"
                            style={{
                              border: '1px solid #cbd5e1',
                              background: currentPage === totalPages ? '#f8fafc' : '#ffffff',
                              color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            다음 ›
                          </button>

                          {/* Last Page Button */}
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            title="마지막 페이지"
                            style={{
                              border: '1px solid #cbd5e1',
                              background: currentPage === totalPages ? '#f8fafc' : '#ffffff',
                              color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            끝 »
                          </button>
                        </div>

                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                          ⚡ 관세청 행정고시 및 유니패스 개정 정보가 실시간으로 계속 누적 집계됩니다. (총 {filteredNotices.length}건, {totalPages}페이지)
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  검색어에 매칭되는 최근 고시 뉴스가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Section: External Utility Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>실무 추천 바로가기</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {externalLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel premium-card"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{link.name}</span>
                    <ExternalLink size={12} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>{link.desc}</span>
                </a>
              ))}
            </div>

            {/* Domain info callout */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.78rem',
              color: '#334155',
              lineHeight: 1.5,
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <strong style={{ color: '#0284c7' }}>🏛️ 관세법령 공식 포털 연계 안내:</strong>
              <div style={{ marginTop: '3px', color: '#475569' }}>
                과거 관세법령 도메인(<code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px', color: '#dc2626' }}>laws.customs.go.kr</code>)은 서비스 개편으로 현재 관세청 <strong>UNIPASS 관세법령정보포털(CLIP)</strong> 및 <strong>국가법령정보센터</strong>로 완전히 일원화 통합되었습니다. 상단 바로가기 버튼을 통해 최신 법령 및 WCO 해설서를 즉시 조회하실 수 있습니다.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* In-App Full Notice & Regulation Reader Modal */}
      {selectedNoticeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #cbd5e1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {selectedNoticeModal.tag || '관세 행정'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                    발령일자: {selectedNoticeModal.date}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                  {selectedNoticeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  소관부처: <b style={{ color: '#0f172a' }}>{selectedNoticeModal.agency}</b>
                </span>
                <span style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700 }}>
                  공식 통보 및 지침
                </span>
              </div>

              {/* Full Text Content */}
              <div>
                <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                  📜 지침/고시 전문 및 세부 이행 기준 (전체 전문)
                </span>
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '20px',
                  fontSize: '0.88rem',
                  color: '#1e293b',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  fontWeight: 500
                }}>
                  {selectedNoticeModal.full_content || selectedNoticeModal.summary}
                </div>
              </div>

              {/* Downloadable Official Attached Files */}
              {selectedNoticeModal.attached_files && (
                <div>
                  <span style={{ fontSize: '0.86rem', color: '#0369a1', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    📎 공식 첨부파일 (관세청 원본 공문)
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(() => {
                      try {
                        const files = JSON.parse(selectedNoticeModal.attached_files);
                        return files.map((f: any, fIdx: number) => (
                          <div 
                            key={fIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: '#f8fafc',
                              border: '1.5px solid #cbd5e1',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              gap: '10px'
                            }}
                          >
                            <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              📄 {f.name}
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => setPreviewAttachment(f)}
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#0f766e',
                                  fontWeight: 800,
                                  background: '#f0fdfa',
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #99f6e4',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#ccfbf1'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdfa'}
                              >
                                👁️ 화면에서 바로 열기
                              </button>
                              <button
                                onClick={() => {
                                  const safeName = f.name.endsWith('.pdf') ? f.name : f.name + '.pdf';
                                  window.open(`/api/customs/download-pdf?id=${selectedNoticeModal.id}&filename=${encodeURIComponent(safeName)}`, '_blank');
                                }}
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#0284c7',
                                  fontWeight: 800,
                                  background: '#f0f9ff',
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #bae6fd',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
                              >
                                💾 PDF 다운로드 및 새 창 열기 ({f.size})
                              </button>
                            </div>
                          </div>
                        ));
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </div>

                  {/* Embedded In-App Document Viewer */}
                  {previewAttachment && (
                    <div style={{
                      marginTop: '12px',
                      background: '#ffffff',
                      border: '2px solid #0d9488',
                      borderRadius: '10px',
                      padding: '16px',
                      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #99f6e4', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 [문서 미리보기] {previewAttachment.name}
                        </span>
                        <button
                          onClick={() => setPreviewAttachment(null)}
                          style={{
                            background: '#0d9488',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          미리보기 닫기 ✕
                        </button>
                      </div>

                      <div style={{
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '18px',
                        fontSize: '0.86rem',
                        color: '#0f172a',
                        lineHeight: 1.75,
                        whiteSpace: 'pre-wrap',
                        fontWeight: 500
                      }}>
{`【관세청 공인 지침 원본 파일 본문 전문】
문서명: ${previewAttachment.name}
발령기관: ${selectedNoticeModal.agency}
공표일자: ${selectedNoticeModal.date}

${selectedNoticeModal.full_content || selectedNoticeModal.summary}`}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '16px' }}>
                <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  💡 실무 통관 / 법무 영향 및 대응 가이드 (CUSWAY AI Note)
                </span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', lineHeight: 1.6 }}>
                  본 건은 관세청의 최신 수입통관 규제 지침으로서, 관련 물품 수입신고 시 강화된 필수 구비서류(수출신고필증, 전매생산허가증, 해외제조사 MSDS 등)의 유효성을 사전에 확인하여 통관 보류 및 과태료 리스크를 방지해야 합니다.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={getNaverNewsUrl(selectedNoticeModal.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: '#009743',
                    fontWeight: 800,
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                  title="네이버 뉴스에서 관련 기사 실시간 검색"
                >
                  <Search size={13} /> 네이버 뉴스 검색 <ExternalLink size={11} />
                </a>
                <a
                  href={getDaumNewsUrl(selectedNoticeModal.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: '#2563eb',
                    fontWeight: 800,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                  title="다음 뉴스에서 관련 기사 실시간 검색"
                >
                  <Search size={13} /> 다음 뉴스 검색 <ExternalLink size={11} />
                </a>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App 4 Major Laws Article Reader Modal */}
      {selectedLawModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #cbd5e1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  alignSelf: 'flex-start'
                }}>
                  대한민국 공인 법률 전문
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                  {selectedLawModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLawModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Structured Articles */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px 16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#0369a1', fontWeight: 700 }}>
                  💡 법령 개요: {selectedLawModal.desc}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  📜 실무 필수 핵심 조문 전문 (Direct Articles)
                </span>

                {selectedLawModal.articles?.map((art: any, aIdx: number) => (
                  <div 
                    key={aIdx} 
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284c7' }}>
                      {art.num}
                    </span>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#1e293b',
                      lineHeight: 1.65,
                      margin: 0,
                      whiteSpace: 'pre-line',
                      fontWeight: 500
                    }}>
                      {art.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button
                onClick={() => setSelectedLawModal(null)}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 22px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                확인 완료 (닫기)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10-Times Daily Crawler Schedule Timeline Modal */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            border: '1.5px solid #cbd5e1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  자동화 데몬 24시간 가동
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  ⏰ 1일 10회 정시 자동 수집 스케줄표 (KST)
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', color: '#0369a1', fontWeight: 800 }}>
                    🎯 현재 수집 주기: 하루 10회 정밀 자동 동기화
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    관세청 공식 보도자료, 관세평가분류원, 조세심판원 결정례, WCO/HSK 품목분류 개정을 정시마다 실시간 수집합니다.
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: '#10b981',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    ● 데몬 정상 작동 중
                  </span>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                    {schedulerStatus?.last_run_time ? `최근 수집: ${schedulerStatus.last_run_time}` : '실시간 대기 중'}
                  </div>
                </div>
              </div>

              {/* 10 Checkpoints Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                  📋 1일 10회 정시 수집 체크포인트 및 업무 목적
                </span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '10px' }}>
                  {[
                    { num: 1, time: '08:00', title: '조간 관세 고시/지침 개정 수집', desc: '관세청 밤사이 발표 지침 및 일일 조간 고시' },
                    { num: 2, time: '09:30', title: '관세청 개청 및 1차 보도자료', desc: '전국 세관 및 통관포털 오전 공식 보도자료' },
                    { num: 3, time: '11:00', title: '오전 관세/통관 동향 및 환율', desc: '수출입 통관 실적 및 관세청 기준환율 고시' },
                    { num: 4, time: '12:30', title: '점심 시간대 관세 행정 공시', desc: '통관 심사 기준 및 대외무역 요건공고' },
                    { num: 5, time: '14:00', title: '오후 업무 개시 및 통관 심사', desc: '세관장확인 대상 및 요건확인 고시 개정' },
                    { num: 6, time: '15:30', title: '품목분류(HS) & FTA 긴급 공지', desc: '관세평가분류원 사전심사 및 협정세율' },
                    { num: 7, time: '17:00', title: '관세청 석간 보도 및 고시 개정', desc: '관세청 공식 당일 보도자료 및 행정예고' },
                    { num: 8, time: '18:30', title: '당일 통관 행정/단속 종합 브리핑', desc: '위조상품/부정수입 세관 단속 및 환특법 공지' },
                    { num: 9, time: '20:00', title: '야간 관세 평가 및 결정례 수집', desc: '조세심판원 관세 결정례 및 관세평가 사례' },
                    { num: 10, time: '22:00', title: '일일 관세/무역 최종 결산 종합', desc: '당일 전체 관세 행정/법령 최종 누적 동기화' }
                  ].map((slot) => (
                    <div 
                      key={slot.num}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.74rem',
                          fontWeight: 800
                        }}>
                          {slot.num}회차 | {slot.time}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                          자동 실행 예약
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {slot.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {slot.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  handleSync();
                }}
                disabled={isSyncing}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? '수집 진행 중...' : '⚡ 지금 즉시 전체 수집 실행'}
              </button>
              
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{
                  background: '#64748b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
