file_path = r'src/components/BrandShowcase.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update activeTab type
old_tab_type = "const [activeTab, setActiveTab] = useState<'branding' | 'cashback' | 'pipeline' | 'valuation'>('branding');"
new_tab_type = "const [activeTab, setActiveTab] = useState<'invoice-calc' | 'branding' | 'cashback' | 'pipeline' | 'valuation'>('invoice-calc');"

assert old_tab_type in content, "old_tab_type not found"
content = content.replace(old_tab_type, new_tab_type, 1)

# 2. Update Tab Navigation List
old_nav = """          {[
            { id: 'branding', label: '🖨️ 관세사 맞춤 A4 의견서 & Co-Branding', badge: '화주 바이럴 1위' },
            { id: 'cashback', label: '💰 비공개 결정례 AI 가치 감정 & 캐시백', badge: '구독료 0원화' },
            { id: 'pipeline', label: '⚡ 4단계 원스톱 수입통관 파이프라인', badge: '요건/FTA 일괄' },
            { id: 'valuation', label: '⚖️ AI 관세평가 & 조세심판원 판례 허브', badge: '과세처분 방어' }
          ].map((t) => ("""

new_nav = """          {[
            { id: 'invoice-calc', label: '📄 영문 인보이스/PDF 스마트 추출 & 1초 관세 계산기', badge: '신규 탑재 🚀' },
            { id: 'branding', label: '🖨️ 관세사 맞춤 A4 의견서 & Co-Branding', badge: '화주 바이럴 1위' },
            { id: 'cashback', label: '💰 비공개 결정례 AI 가치 감정 & 캐시백', badge: '구독료 0원화' },
            { id: 'pipeline', label: '⚡ 4단계 원스톱 수입통관 파이프라인', badge: '요건/FTA 일괄' },
            { id: 'valuation', label: '⚖️ AI 관세평가 & 조세심판원 판례 허브', badge: '과세처분 방어' }
          ].map((t) => ("""

assert old_nav in content, "old_nav not found"
content = content.replace(old_nav, new_nav, 1)

# 3. Add Tab Content for 'invoice-calc' before TAB 1
old_tab_start = "          {/* TAB 1: Co-Branding A4 Official Report Preview */}"

invoice_tab_content = """          {/* TAB 0: Commercial Invoice / PDF Smart Extractor & Duty Savings Calculator */}
          {activeTab === 'invoice-calc' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    COMMERCIAL INVOICE PARSER & TARIFF SAVINGS CALCULATOR
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  영문 송장 사진과 PDF 사양서를 올리면<br />
                  <span style={{ color: 'var(--accent-cyan)' }}>10단위 HSK 매핑과 관세 절감액</span>이 즉시 나옵니다.
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  실무에서 수취하는 <strong>상업송장(Commercial Invoice) 사진(JPG/PNG), PDF 기술사양서, 또는 영문 텍스트</strong>를 입력하면, AI가 WCO 영문 해설서와 한국 관세청 10단위 HSK 마스터를 1:1 이중 앵커링하여 정확한 세번과 실시간 절감 세액을 1초 만에 도출합니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span><strong>영문 인보이스 1초 스마트 파싱:</strong> 거래품명(Description), 원재료, 규격, CIF 금액 자동 추출</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span><strong>실시간 관세 절감액(Duty Savings) 계산:</strong> 기본세율 vs 최적 FTA/TRQ 세액 및 절감액 1초 비교</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span><strong>1-Click HSK 복사 & UNI-PASS 연동:</strong> 유니패스/CLIP 직통 포털 링크 및 단골 품목(⭐) 보관함</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span><strong>전문가 소명 팔레트:</strong> 통칙 1호, 본질적 특성, C/O 구비 요건 문구 1클릭 삽입</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('hs-classifier')}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.35)'
                    }}
                  >
                    <Sparkles size={15} /> 인보이스 추출기 & HS 분류기 체험하기
                  </button>
                </div>
              </div>

              {/* Interactive Invoice & Tariff Savings Mockup */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.02) 0%, rgba(6, 182, 212, 0.06) 100%)',
                border: '1.5px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    📄 인보이스 영문 파싱 ➔ HSK 10단위 & 관세 절감 실시간 연동
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.12)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                    AI Live Demo
                  </span>
                </div>

                {/* Simulated Invoice Card */}
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>
                  <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>INVOICE COMMODITY (영문 송장 원문)</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    PMSM Brushless Synchronous Servo Motor 3.0kW (400V, 3000 RPM)
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '2px' }}>
                    Origin: Germany (DE) | Amount: USD 9,200.00 CIF
                  </div>
                </div>

                {/* Resulting HSK & Tariff Breakdown */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>매핑 확정 세번:</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0284c7' }}>HSK 8501.52-9000</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#f8fafc', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>기본세율 (8%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#dc2626' }}>₩993,600</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>한-EU FTA (0%)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>₩0</div>
                    </div>
                    <div style={{ background: 'rgba(5, 150, 105, 0.1)', borderRadius: '4px', padding: '2px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700 }}>순 절감 관세</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#059669' }}>₩993,600</div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, textAlign: 'right' }}>
                  * 원산지증명서(C/O) 구비 시 100% 관세 전액 면제 혜택
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Co-Branding A4 Official Report Preview */}"""

assert old_tab_start in content, "old_tab_start not found"
content = content.replace(old_tab_start, invoice_tab_content, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated src/components/BrandShowcase.tsx with Invoice & Tariff Calculator Showcase!")
