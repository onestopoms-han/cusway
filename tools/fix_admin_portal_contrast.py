import re

file_path = r'src/components/AdminPortal.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Header Banner
old_header = """      {/* 1. Header Banner & Sleek Navigation Tabs */}
      <div className="glass-panel" style={{
        padding: '22px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(20, 184, 166, 0.15)',
                padding: '7px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(20, 184, 166, 0.3)'
              }}>
                <ShieldAlert size={18} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                CUSWAY 총괄 관리자 포털
              </h2>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(20, 184, 166, 0.15)',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                border: '1px solid rgba(20, 184, 166, 0.3)'
              }}>
                Operation & CRM Hub
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
              관세법인·수출입기업 회원 CRM 관리, 결정례 캐시백 검수, B2B 맞춤형 마케팅 캠페인 및 법령 크롤러 통합 관제
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>관리자 계정:</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '6px' }}>
              {currentUser?.email || 'admin@cusway.kr'}
            </span>
          </div>
        </div>

        {/* Unified Sub-Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '4px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          width: 'fit-content'
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
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              background: activeTab === 'crm' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'crm' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Users size={14} />
            <span>고객 CRM & 회원 관리</span>
            <span style={{
              fontSize: '0.68rem',
              padding: '1px 6px',
              borderRadius: '10px',
              background: activeTab === 'crm' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'crm' ? '#000' : '#fff',
              fontWeight: 700
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
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              background: activeTab === 'cashback' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'cashback' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Coins size={14} />
            <span>판례·캐시백 검수 센터</span>
            {uploadRequests.length > 0 && (
              <span style={{
                fontSize: '0.68rem',
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
            onClick={() => setActiveTab('marketing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              background: activeTab === 'marketing' ? 'var(--accent-amber)' : 'transparent',
              color: activeTab === 'marketing' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Send size={14} />
            <span>비즈니스 마케팅 캠페인</span>
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
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              background: activeTab === 'crawler' ? '#6366f1' : 'transparent',
              color: activeTab === 'crawler' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Clock size={14} />
            <span>법령·뉴스 크롤러 관제</span>
          </button>
        </div>
      </div>"""

new_header = """      {/* 1. Header Banner & Sleek Navigation Tabs */}
      <div style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid #334155',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(20, 184, 166, 0.2)',
                padding: '7px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(20, 184, 166, 0.4)'
              }}>
                <ShieldAlert size={18} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                CUSWAY 총괄 관리자 포털
              </h2>
              <span style={{
                fontSize: '0.72rem',
                padding: '3px 9px',
                borderRadius: '12px',
                background: 'rgba(20, 184, 166, 0.2)',
                color: 'var(--accent-primary)',
                fontWeight: 800,
                border: '1px solid rgba(20, 184, 166, 0.4)'
              }}>
                Operation & CRM Hub
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
              관세법인·수출입기업 회원 CRM 관리, 결정례 캐시백 검수, B2B 맞춤형 마케팅 캠페인 및 법령 크롤러 통합 관제
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>관리자 계정:</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }}>
              {currentUser?.email || 'admin@cusway.kr'}
            </span>
          </div>
        </div>

        {/* Unified Sub-Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '5px',
          background: 'rgba(0, 0, 0, 0.45)',
          borderRadius: '10px',
          border: '1px solid #334155',
          width: 'fit-content',
          flexWrap: 'wrap'
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
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'crm' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'crm' ? '#000000' : '#cbd5e1'
            }}
          >
            <Users size={14} />
            <span>고객 CRM & 회원 관리</span>
            <span style={{
              fontSize: '0.68rem',
              padding: '1px 7px',
              borderRadius: '10px',
              background: activeTab === 'crm' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.15)',
              color: activeTab === 'crm' ? '#000000' : '#f8fafc',
              fontWeight: 800
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
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'cashback' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'cashback' ? '#000000' : '#cbd5e1'
            }}
          >
            <Coins size={14} />
            <span>판례·캐시백 검수 센터</span>
            {uploadRequests.length > 0 && (
              <span style={{
                fontSize: '0.68rem',
                padding: '1px 7px',
                borderRadius: '10px',
                background: '#ef4444',
                color: '#ffffff',
                fontWeight: 900
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
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'marketing' ? 'var(--accent-amber)' : 'transparent',
              color: activeTab === 'marketing' ? '#000000' : '#cbd5e1'
            }}
          >
            <Send size={14} />
            <span>비즈니스 마케팅 캠페인</span>
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
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeTab === 'crawler' ? '#6366f1' : 'transparent',
              color: activeTab === 'crawler' ? '#ffffff' : '#cbd5e1'
            }}
          >
            <Clock size={14} />
            <span>법령·뉴스 크롤러 관제</span>
          </button>
        </div>
      </div>"""

assert old_header in content, "old_header not found"
content = content.replace(old_header, new_header, 1)

# 2. Update KPI Stats (4 Cards)
old_kpi = """          {/* Executive KPI Stats (4 Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(20, 184, 166, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Users size={22} color="var(--accent-primary)" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>총 관리 고객사</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: '#fff' }}>
                  {stats.total}<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.68rem', color: '#10b981' }}>활성 {customers.filter(c => c.status === 'Active').length} · 정지 {customers.filter(c => c.status === 'Suspended').length}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <TrendingUp size={22} color="var(--accent-cyan)" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>유료 구독 (Pro/Ent)</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--accent-cyan)' }}>
                  {stats.paidCount}<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>전환율 {stats.total > 0 ? Math.round((stats.paidCount / stats.total) * 100) : 0}% (MRR ₩1.24M)</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Sparkles size={22} color="var(--accent-amber)" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>마케팅 잠재 리드</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--accent-amber)' }}>
                  {stats.proLeadsCount + stats.entLeadsCount}<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '2px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pro유망 {stats.proLeadsCount} · B2B잠재 {stats.entLeadsCount}</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Award size={22} color="#10b981" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>누적 캐시백 풀</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: '#10b981' }}>
                  ₩{(stats.totalPoints / 1000).toFixed(0)}k <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>P</span>
                </h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>기여 VIP {stats.vipCount}개사</span>
              </div>
            </div>
          </div>"""

new_kpi = """          {/* Executive KPI Stats (4 Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ background: 'rgba(13, 148, 136, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Users size={22} color="#0d9488" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>총 관리 고객사</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', color: '#0f172a' }}>
                  {stats.total}<span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginLeft: '2px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>활성 {customers.filter(c => c.status === 'Active').length} · 정지 {customers.filter(c => c.status === 'Suspended').length}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <TrendingUp size={22} color="#0891b2" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>유료 구독 (Pro/Ent)</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', color: '#0891b2' }}>
                  {stats.paidCount}<span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginLeft: '2px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>전환율 {stats.total > 0 ? Math.round((stats.paidCount / stats.total) * 100) : 0}% (MRR ₩1.24M)</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Sparkles size={22} color="#b45309" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>마케팅 잠재 리드</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', color: '#b45309' }}>
                  {stats.proLeadsCount + stats.entLeadsCount}<span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginLeft: '2px' }}>개사</span>
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Pro유망 {stats.proLeadsCount} · B2B잠재 {stats.entLeadsCount}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Award size={22} color="#059669" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>누적 캐시백 풀</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', color: '#059669' }}>
                  ₩{(stats.totalPoints / 1000).toFixed(0)}k <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>P</span>
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>기여 VIP {stats.vipCount}개사</span>
              </div>
            </div>
          </div>"""

assert old_kpi in content, "old_kpi not found"
content = content.replace(old_kpi, new_kpi, 1)

# 3. Update Search & Filter Bar
old_filter = """          {/* Unified Search, Segments, and Actions */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              {/* Segment Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                  <Filter size={13} /> 세그먼트:
                </span>

                {[
                  { key: 'all', label: `전체 (${stats.total})` },
                  { key: 'pro_leads', label: `Pro 전환 유망 (${stats.proLeadsCount})`, color: 'var(--accent-primary)' },
                  { key: 'enterprise_leads', label: `Enterprise 잠재 (${stats.entLeadsCount})`, color: 'var(--accent-amber)' },
                  { key: 'vip_contributors', label: `VIP 기여자 (${stats.vipCount})`, color: '#10b981' },
                  { key: 'at_risk', label: `휴면 관리군 (${stats.atRiskCount})`, color: '#ef4444' }
                ].map(seg => (
                  <button
                    key={seg.key}
                    onClick={() => setActiveSegment(seg.key as MarketingSegment)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: activeSegment === seg.key 
                        ? (seg.color ? `1px solid ${seg.color}` : '1px solid rgba(255,255,255,0.4)')
                        : '1px solid var(--border-color)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: activeSegment === seg.key 
                        ? (seg.color ? `${seg.color}22` : 'rgba(255,255,255,0.12)')
                        : 'rgba(0,0,0,0.2)',
                      color: activeSegment === seg.key ? (seg.color || '#fff') : 'var(--text-muted)',
                      transition: 'var(--transition-smooth)'
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
                    padding: '7px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} />
                  <span>CSV 추출</span>
                </button>

                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: '#000',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                  <span>신규 고객 등록</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="법인명, 담당자, 이메일, 전화번호, 태그, CRM 메모 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 32px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    outline: 'none'
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
                    padding: '7px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    outline: 'none'
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
                    padding: '7px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                >
                  <option value="All">전체 태그 필터</option>
                  {allAvailableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>"""

new_filter = """          {/* Unified Search, Segments, and Actions */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              {/* Segment Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                  <Filter size={13} /> 세그먼트:
                </span>

                {[
                  { key: 'all', label: `전체 (${stats.total})` },
                  { key: 'pro_leads', label: `Pro 전환 유망 (${stats.proLeadsCount})`, color: '#0d9488' },
                  { key: 'enterprise_leads', label: `Enterprise 잠재 (${stats.entLeadsCount})`, color: '#b45309' },
                  { key: 'vip_contributors', label: `VIP 기여자 (${stats.vipCount})`, color: '#059669' },
                  { key: 'at_risk', label: `휴면 관리군 (${stats.atRiskCount})`, color: '#dc2626' }
                ].map(seg => (
                  <button
                    key={seg.key}
                    onClick={() => setActiveSegment(seg.key as MarketingSegment)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: activeSegment === seg.key 
                        ? (seg.color ? `1.5px solid ${seg.color}` : '1.5px solid #0f172a')
                        : '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      fontWeight: 750,
                      cursor: 'pointer',
                      background: activeSegment === seg.key 
                        ? (seg.color ? `${seg.color}15` : '#e2e8f0')
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
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: '0.76rem',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} />
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
                    background: '#0d9488',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                  }}
                >
                  <Plus size={14} />
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
              borderTop: '1px solid #f1f5f9'
            }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="법인명, 담당자, 이메일, 전화번호, 태그, CRM 메모 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontWeight: 500
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
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontWeight: 600
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
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontWeight: 600
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
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                >
                  <option value="All">전체 태그 필터</option>
                  {allAvailableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>"""

assert old_filter in content, "old_filter not found"
content = content.replace(old_filter, new_filter, 1)

# 4. Update Bulk Selection Strip & Customer CRM Table
old_table = """          {/* Bulk Selection Action Strip */}
          {selectedCustomerIds.length > 0 && (
            <div style={{
              background: 'rgba(20, 184, 166, 0.12)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                선택된 고객: <span style={{ color: 'var(--accent-primary)' }}>{selectedCustomerIds.length}</span>개사
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleBulkAddPoints}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#10b981',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🎁 일괄 포인트 지급
                </button>

                <button
                  onClick={handleBulkAddTag}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: 'var(--accent-amber)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🏷️ 일괄 태그
                </button>

                <button
                  onClick={() => handleOpenMarketingLauncher()}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '5px',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: '#000',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📢 마케팅 메시지 발송
                </button>
              </div>
            </div>
          )}

          {/* Customer CRM Table */}
          <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1.5fr 1.8fr 90px 80px 100px 1.8fr 140px',
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.3)',
              borderBottom: '1px solid var(--border-color)',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              alignItems: 'center'
            }}>
              <div onClick={handleSelectAll} style={{ cursor: 'pointer' }}>
                {selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                  <CheckSquare size={16} color="var(--accent-primary)" />
                ) : (
                  <Square size={16} />
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
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>검색 및 필터 조건에 부합하는 고객이 없습니다.</p>
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
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isChecked ? 'rgba(20, 184, 166, 0.05)' : 'transparent',
                        fontSize: '0.78rem',
                        alignItems: 'center',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div onClick={() => handleToggleSelect(c.id)} style={{ cursor: 'pointer' }}>
                        {isChecked ? (
                          <CheckSquare size={16} color="var(--accent-primary)" />
                        ) : (
                          <Square size={16} color="var(--text-muted)" />
                        )}
                      </div>

                      {/* Company Name & Contact */}
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{c.companyName}</div>
                        {c.contactName && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {c.contactName}
                          </div>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>{c.email}</div>
                        {c.phoneNumber && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={10} /> {c.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Plan Badge */}
                      <div>
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          background: c.plan === 'Business' ? 'rgba(245, 158, 11, 0.15)' : c.plan === 'Basic' ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: c.plan === 'Business' ? 'var(--accent-amber)' : c.plan === 'Basic' ? 'var(--accent-primary)' : 'var(--text-muted)',
                          border: c.plan === 'Business' ? '1px solid rgba(245, 158, 11, 0.3)' : c.plan === 'Basic' ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid var(--border-color)'
                        }}>
                          {c.plan === 'Business' ? 'Enterprise' : c.plan === 'Basic' ? 'Pro' : 'Free'}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: c.status === 'Active' ? '#10b981' : '#fca5a5'
                        }}>
                          {c.status === 'Active' ? '● 활성' : '■ 정지'}
                        </span>
                      </div>

                      {/* Points */}
                      <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                        ₩{c.accruedPoints.toLocaleString()}P
                      </div>

                      {/* Tags & Note */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                          {(c.tags || []).slice(0, 3).map(t => (
                            <span key={t} style={{
                              fontSize: '0.65rem',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              background: 'rgba(255,255,255,0.06)',
                              color: 'var(--text-muted)'
                            }}>
                              {t}
                            </span>
                          ))}
                          <button
                            onClick={() => handleAddInlineTag(c.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                          >
                            +태그
                          </button>
                        </div>
                        {c.notes && (
                          <div style={{
                            fontSize: '0.68rem',
                            color: '#94a3b8',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '220px'
                          }}>
                            📝 {c.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        <button
                          onClick={() => handleOpenMarketingLauncher(c)}
                          title="마케팅 템플릿 발송"
                          style={{
                            padding: '4px 6px',
                            borderRadius: '4px',
                            background: 'rgba(6, 182, 212, 0.12)',
                            border: '1px solid rgba(6, 182, 212, 0.25)',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer'
                          }}
                        >
                          <Send size={11} />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(c)}
                          title="상세 수정 및 메모"
                          style={{
                            padding: '4px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid var(--border-color)',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={11} />
                        </button>

                        <button
                          onClick={() => toggleCustomerStatus(c.id, c.status, c.companyName, c.email)}
                          title={c.status === 'Active' ? '이용 정지 처리' : '이용 활성화 처리'}
                          style={{
                            padding: '4px 6px',
                            borderRadius: '4px',
                            background: c.status === 'Active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: 'none',
                            color: c.status === 'Active' ? '#fca5a5' : '#10b981',
                            cursor: 'pointer',
                            fontSize: '0.68rem',
                            fontWeight: 700
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

          </div>"""

new_table = """          {/* Bulk Selection Action Strip */}
          {selectedCustomerIds.length > 0 && (
            <div style={{
              background: '#f0fdfa',
              border: '1.5px solid #99f6e4',
              borderRadius: '8px',
              padding: '10px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                선택된 고객: <span style={{ color: '#0d9488' }}>{selectedCustomerIds.length}</span>개사
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleBulkAddPoints}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '5px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#059669',
                    fontSize: '0.74rem',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  🎁 일괄 포인트 지급
                </button>

                <button
                  onClick={handleBulkAddTag}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '5px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#b45309',
                    fontSize: '0.74rem',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  🏷️ 일괄 태그
                </button>

                <button
                  onClick={() => handleOpenMarketingLauncher()}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '5px',
                    background: '#0d9488',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📢 마케팅 메시지 발송
                </button>
              </div>
            </div>
          )}

          {/* Customer CRM Table */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1.5fr 1.8fr 90px 80px 100px 1.8fr 140px',
              padding: '12px 18px',
              background: '#f8fafc',
              borderBottom: '1.5px solid #e2e8f0',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#475569',
              alignItems: 'center'
            }}>
              <div onClick={handleSelectAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                  <CheckSquare size={16} color="#0d9488" />
                ) : (
                  <Square size={16} color="#94a3b8" />
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
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                <Users size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>검색 및 필터 조건에 부합하는 고객이 없습니다.</p>
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
                        padding: '13px 18px',
                        borderBottom: '1px solid #f1f5f9',
                        background: isChecked ? '#f0fdfa' : 'transparent',
                        fontSize: '0.8rem',
                        alignItems: 'center',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div onClick={() => handleToggleSelect(c.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {isChecked ? (
                          <CheckSquare size={16} color="#0d9488" />
                        ) : (
                          <Square size={16} color="#94a3b8" />
                        )}
                      </div>

                      {/* Company Name & Contact */}
                      <div>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{c.companyName}</div>
                        {c.contactName && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                            {c.contactName}
                          </div>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div>
                        <div style={{ color: '#334155', fontWeight: 500 }}>{c.email}</div>
                        {c.phoneNumber && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={10} /> {c.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Plan Badge */}
                      <div>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          background: c.plan === 'Business' ? 'rgba(245, 158, 11, 0.12)' : c.plan === 'Basic' ? 'rgba(13, 148, 136, 0.12)' : '#f1f5f9',
                          color: c.plan === 'Business' ? '#b45309' : c.plan === 'Basic' ? '#0d9488' : '#475569',
                          border: c.plan === 'Business' ? '1px solid rgba(245, 158, 11, 0.3)' : c.plan === 'Basic' ? '1px solid rgba(13, 148, 136, 0.3)' : '1px solid #cbd5e1'
                        }}>
                          {c.plan === 'Business' ? 'Enterprise' : c.plan === 'Basic' ? 'Pro' : 'Free'}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: c.status === 'Active' ? '#059669' : '#dc2626'
                        }}>
                          {c.status === 'Active' ? '● 활성' : '■ 정지'}
                        </span>
                      </div>

                      {/* Points */}
                      <div style={{ fontWeight: 800, color: '#0d9488' }}>
                        ₩{c.accruedPoints.toLocaleString()}P
                      </div>

                      {/* Tags & Note */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          {(c.tags || []).slice(0, 3).map(t => (
                            <span key={t} style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              background: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              color: '#334155',
                              fontWeight: 600
                            }}>
                              {t}
                            </span>
                          ))}
                          <button
                            onClick={() => handleAddInlineTag(c.id)}
                            style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.68rem', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                          >
                            +태그
                          </button>
                        </div>
                        {c.notes && (
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '220px'
                          }}>
                            📝 {c.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenMarketingLauncher(c)}
                          title="마케팅 템플릿 발송"
                          style={{
                            padding: '5px 8px',
                            borderRadius: '5px',
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            color: '#0891b2',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit3 size={12} />
                        </button>

                        <button
                          onClick={() => toggleCustomerStatus(c.id, c.status, c.companyName, c.email)}
                          title={c.status === 'Active' ? '이용 정지 처리' : '이용 활성화 처리'}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '5px',
                            background: c.status === 'Active' ? '#fef2f2' : '#f0fdf4',
                            border: c.status === 'Active' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                            color: c.status === 'Active' ? '#dc2626' : '#059669',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 800
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

          </div>"""

assert old_table in content, "old_table not found"
content = content.replace(old_table, new_table, 1)

# 5. Update Tab 2: Cashback Review Center
old_cashback = """      {/* 3. TAB 2: 판례·캐시백 검수 센터 */}
      {activeTab === 'cashback' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                📁 비공개 결정례·판례 공유 검수 대기실
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                고객 및 관세사가 업로드한 비공개 품목분류·조세심판원 결정문을 검수하고 승인 시 캐시백 포인트를 지급합니다.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
              대기 중: {uploadRequests.length}건
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {uploadRequests.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', gridColumn: '1 / -1' }}>
                <CheckCircle size={32} color="var(--accent-primary)" style={{ opacity: 0.5, margin: '0 auto 8px' }} />
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
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {req.typeKo}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{req.date}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', margin: 0 }}>{req.hsCodeOrIssue}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>품목/사건명: {req.itemName}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>제출자: <b style={{ color: '#fff' }}>{req.email}</b></span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`[문서 열기]\n${req.fileName} 검증 미리보기`); }} style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 700 }}>
                      문서검증 <ExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => rejectRequest(req.id, req.email)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '6px',
                        color: '#fca5a5',
                        padding: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      반려 (사유입력)
                    </button>
                    <button
                      onClick={() => approveRequest(req.id, req.email, req.points)}
                      style={{
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#000',
                        padding: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer'
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
      )}"""

new_cashback = """      {/* 3. TAB 2: 판례·캐시백 검수 센터 */}
      {activeTab === 'cashback' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                📁 비공개 결정례·판례 공유 검수 대기실
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
                고객 및 관세사가 업로드한 비공개 품목분류·조세심판원 결정문을 검수하고 승인 시 캐시백 포인트를 지급합니다.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 800 }}>
              대기 중: {uploadRequests.length}건
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {uploadRequests.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem', gridColumn: '1 / -1' }}>
                <CheckCircle size={36} color="#0d9488" style={{ opacity: 0.6, margin: '0 auto 10px' }} />
                <p style={{ fontWeight: 600 }}>검수 대기 중인 공유 자료가 없습니다. 모든 요청이 처리되었습니다.</p>
              </div>
            ) : (
              uploadRequests.map(req => (
                <div key={req.id} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891b2', fontWeight: 800 }}>
                      {req.typeKo}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{req.date}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{req.hsCodeOrIssue}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', margin: 0 }}>품목/사건명: {req.itemName}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: '#475569' }}>제출자: <b style={{ color: '#0f172a' }}>{req.email}</b></span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`[문서 열기]\n${req.fileName} 검증 미리보기`); }} style={{ color: '#0d9488', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 800 }}>
                      문서검증 <ExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => rejectRequest(req.id, req.email)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        color: '#dc2626',
                        padding: '7px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      반려 (사유입력)
                    </button>
                    <button
                      onClick={() => approveRequest(req.id, req.email, req.points)}
                      style={{
                        background: '#0d9488',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        padding: '7px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer'
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
      )}"""

assert old_cashback in content, "old_cashback not found"
content = content.replace(old_cashback, new_cashback, 1)

# 6. Update Tab 3: Marketing Campaign Center
old_marketing = """      {/* 4. TAB 3: 마케팅 캠페인 센터 */}
      {activeTab === 'marketing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '16px' }}>
          
          {/* Left: Template Selector */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} color="var(--accent-amber)" /> B2B 캠페인 템플릿 목록
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
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
                      background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0,0,0,0.25)',
                      border: isSelected ? '1px solid var(--accent-amber)' : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--accent-amber)',
                        fontWeight: 700
                      }}>
                        {tpl.badge}
                      </span>
                      {isSelected && <Check size={14} color="var(--accent-amber)" />}
                    </div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', margin: 0 }}>{tpl.title}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{tpl.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Preview & Dispatch */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                실시간 변수 치환 미리보기
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                고객사명, 담당자, 보유 포인트 등이 실시간으로 적용됩니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '0.76rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>수신 타겟:</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>
                {templateTargetCustomer ? `${templateTargetCustomer.companyName} (${templateTargetCustomer.email})` : `전체 고객사 (${customers.length}개사)`}
              </span>
            </div>

            <textarea
              readOnly
              value={generatedTemplateContent}
              rows={12}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                color: '#e2e8f0',
                fontSize: '0.78rem',
                lineHeight: '1.6',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {copiedNotification && (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={13} /> 복사 완료!
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
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={13} />
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
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.76rem',
                    fontWeight: 750,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={13} />
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
                    border: 'none',
                    color: '#111827',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={13} />
                  <span>카카오톡 채널</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}"""

new_marketing = """      {/* 4. TAB 3: 마케팅 캠페인 센터 */}
      {activeTab === 'marketing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '16px' }}>
          
          {/* Left: Template Selector */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} color="#b45309" /> B2B 캠페인 템플릿 목록
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px', margin: 0 }}>
                발송 목적에 최적화된 마케팅 문구를 선택하세요.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? '#fffbeb' : '#f8fafc',
                      border: isSelected ? '1.5px solid #d97706' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '13px 14px',
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
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: isSelected ? 'rgba(217, 119, 6, 0.2)' : '#e2e8f0',
                        color: '#b45309',
                        fontWeight: 800
                      }}>
                        {tpl.badge}
                      </span>
                      {isSelected && <Check size={15} color="#d97706" />}
                    </div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{tpl.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>{tpl.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dynamic Preview & Dispatch */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                실시간 변수 치환 미리보기
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px', margin: 0 }}>
                고객사명, 담당자, 보유 포인트 등이 실시간으로 적용됩니다.
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              padding: '11px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>수신 타겟:</span>
              <span style={{ color: '#0d9488', fontWeight: 900 }}>
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
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {copiedNotification && (
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> 문구가 클립보드에 복사되었습니다!
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
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={13} />
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
                    background: '#e0f2fe',
                    border: '1px solid #0284c7',
                    color: '#0284c7',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={13} />
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
                    border: 'none',
                    color: '#111827',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(254, 229, 0, 0.3)'
                  }}
                >
                  <MessageCircle size={13} />
                  <span>카카오톡 채널</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}"""

assert old_marketing in content, "old_marketing not found"
content = content.replace(old_marketing, new_marketing, 1)

# 7. Update Tab 4: Crawler Daemon
old_crawler = """      {/* 5. TAB 4: 법령·뉴스 크롤러 관제 */}
      {activeTab === 'crawler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{
            padding: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '10px', borderRadius: '10px' }}>
                <Clock size={24} color="#818cf8" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    실시간 관세 법령 및 뉴스 자동 크롤러 데몬
                  </h3>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontWeight: 700
                  }}>
                    ● {crawlerStatus.status || 'Active'}
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px', margin: 0 }}>
                  동기화 주기: <b>{crawlerStatus.schedule || '매일 2회 (09:00, 18:00 KST)'}</b> · 최근 실행: <b>{crawlerStatus.last_run_time || '최근 동기화 완료'}</b>
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerCrawler}
              disabled={isCrawling}
              style={{
                background: 'var(--accent-primary)',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 18px',
                color: '#000',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: isCrawling ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isCrawling ? 0.7 : 1
              }}
            >
              <RefreshCw size={14} className={isCrawling ? 'animate-spin' : ''} />
              <span>{isCrawling ? '동기화 중...' : '⚡ 즉시 동기화 실행'}</span>
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: 0 }}>
              📡 연동 데이터 파이프라인 대상:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <li>관세청 전자통관 UNI-PASS 실시간 고시 및 보도자료</li>
              <li>조세심판원(Tax Tribunal) 관세 세액·품목분류 심판 결정례</li>
              <li>중앙관세분석소 화학물질 및 복합재 성분분석 사례집</li>
              <li>관세평가분류원 품목분류 사전심사 데이터베이스</li>
            </ul>
          </div>
        </div>
      )}"""

new_crawler = """      {/* 5. TAB 4: 법령·뉴스 크롤러 관제 */}
      {activeTab === 'crawler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '12px', borderRadius: '10px' }}>
                <Clock size={24} color="#6366f1" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    실시간 관세 법령 및 뉴스 자동 크롤러 데몬
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#059669',
                    fontWeight: 800
                  }}>
                    ● {crawlerStatus.status || 'Active'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', margin: 0 }}>
                  동기화 주기: <b style={{ color: '#0f172a' }}>{crawlerStatus.schedule || '매일 2회 (09:00, 18:00 KST)'}</b> · 최근 실행: <b style={{ color: '#0f172a' }}>{crawlerStatus.last_run_time || '최근 동기화 완료'}</b>
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerCrawler}
              disabled={isCrawling}
              style={{
                background: '#0d9488',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: isCrawling ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isCrawling ? 0.7 : 1,
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
              }}
            >
              <RefreshCw size={14} className={isCrawling ? 'animate-spin' : ''} />
              <span>{isCrawling ? '동기화 중...' : '⚡ 즉시 동기화 실행'}</span>
            </button>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0891b2', margin: 0 }}>
              📡 연동 데이터 파이프라인 대상:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: 1.5 }}>
              <li>관세청 전자통관 UNI-PASS 실시간 고시 및 보도자료</li>
              <li>조세심판원(Tax Tribunal) 관세 세액·품목분류 심판 결정례</li>
              <li>중앙관세분석소 화학물질 및 복합재 성분분석 사례집</li>
              <li>관세평가분류원 품목분류 사전심사 데이터베이스</li>
            </ul>
          </div>
        </div>
      )}"""

assert old_crawler in content, "old_crawler not found"
content = content.replace(old_crawler, new_crawler, 1)

# 8. Update Modals (Add Customer, Edit Customer, Template launcher)
old_modals = """      {/* MODAL 1: ➕ 신규 고객 등록 모달 */}
      {isAddCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
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
            maxWidth: '520px',
            background: '#0f172a',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} color="var(--accent-primary)" /> 신규 고객사 직접 등록
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>법인 / 상호명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대관세법인"
                  value={newCustomerForm.companyName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>담당자 성명</label>
                <input
                  type="text"
                  placeholder="예: 홍길동 대표관세사"
                  value={newCustomerForm.contactName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>계정 이메일 *</label>
                <input
                  type="email"
                  required
                  placeholder="customs@company.co.kr"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>연락처</label>
                <input
                  type="text"
                  placeholder="010-1234-5678"
                  value={newCustomerForm.phoneNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>초기 구독 플랜</label>
                <select
                  value={newCustomerForm.plan}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>초기 적립 포인트 (P)</label>
                <input
                  type="number"
                  value={newCustomerForm.accruedPoints}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>마케팅 태그</label>
              <input
                type="text"
                placeholder="#농수산물 #대형법인 #Pro유망"
                value={newCustomerForm.tags}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tags: e.target.value })}
                style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>CRM 상담 메모</label>
              <textarea
                rows={2}
                placeholder="상담 이력 및 특이사항을 기록하세요..."
                value={newCustomerForm.notes}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ padding: '7px 14px', borderRadius: '5px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '7px 16px', borderRadius: '5px', background: 'var(--accent-primary)', border: 'none', color: '#000', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
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
            maxWidth: '560px',
            background: '#0f172a',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} color="var(--accent-primary)" /> 고객 CRM 상세 관리 & 상담 히스토리
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>법인 / 상호명</label>
                <input
                  type="text"
                  required
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>담당자 성명</label>
                <input
                  type="text"
                  value={editForm.contactName}
                  onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>계정 이메일</label>
                <input
                  type="email"
                  disabled
                  value={editForm.email}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>연락처</label>
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>구독 플랜</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>계정 상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                >
                  <option value="Active">이용 활성</option>
                  <option value="Suspended">이용 정지</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>보유 포인트 (P)</label>
                <input
                  type="number"
                  value={editForm.accruedPoints}
                  onChange={(e) => setEditForm({ ...editForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>마케팅 태그</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="#농수산물 #화학품 #대형법인"
                style={{ width: '100%', padding: '7px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                영업 / 상담 히스토리 CRM 메모
              </label>
              <textarea
                rows={4}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="예: 2026-09-06: 전화상담 완료. 농수산물 TRQ 기능 안내 후 Pro 결제 혜택 제안함."
                style={{ width: '100%', padding: '8px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.78rem', lineHeight: '1.4', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ padding: '7px 14px', borderRadius: '5px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '7px 16px', borderRadius: '5px', background: 'var(--accent-primary)', border: 'none', color: '#000', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
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
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0f172a',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 850, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} color="var(--accent-cyan)" /> 마케팅 메시지 발송 런처
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {MARKETING_TEMPLATES.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    style={{
                      background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(0,0,0,0.25)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}
                  >
                    <span style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{tpl.badge}</span>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', margin: 0 }}>{tpl.title}</h4>
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
                padding: '10px',
                borderRadius: '6px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                lineHeight: '1.5',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={handleCopyTemplateText}
                style={{ padding: '7px 14px', borderRadius: '5px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
              >
                문구 복사
              </button>
              <button
                onClick={() => {
                  handleCopyTemplateText();
                  window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                }}
                style={{ padding: '7px 16px', borderRadius: '5px', background: '#FEE500', border: 'none', color: '#111827', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
              >
                카카오톡 발송
              </button>
            </div>
          </div>
        </div>
      )}"""

new_modals = """      {/* MODAL 1: ➕ 신규 고객 등록 모달 */}
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
            maxWidth: '540px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} color="#0d9488" /> 신규 고객사 직접 등록
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>법인 / 상호명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대관세법인"
                  value={newCustomerForm.companyName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>담당자 성명</label>
                <input
                  type="text"
                  placeholder="예: 홍길동 대표관세사"
                  value={newCustomerForm.contactName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>계정 이메일 *</label>
                <input
                  type="email"
                  required
                  placeholder="customs@company.co.kr"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>연락처</label>
                <input
                  type="text"
                  placeholder="010-1234-5678"
                  value={newCustomerForm.phoneNumber}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>초기 구독 플랜</label>
                <select
                  value={newCustomerForm.plan}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>초기 적립 포인트 (P)</label>
                <input
                  type="number"
                  value={newCustomerForm.accruedPoints}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0d9488', fontSize: '0.8rem', fontWeight: 800 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>마케팅 태그</label>
              <input
                type="text"
                placeholder="#농수산물 #대형법인 #Pro유망"
                value={newCustomerForm.tags}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tags: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CRM 상담 메모</label>
              <textarea
                rows={3}
                placeholder="상담 이력 및 특이사항을 기록하세요..."
                value={newCustomerForm.notes}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', lineHeight: '1.5', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#0d9488', border: 'none', color: '#ffffff', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)' }}
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
            maxWidth: '580px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} color="#0d9488" /> 고객 CRM 상세 관리 & 상담 히스토리
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>법인 / 상호명</label>
                <input
                  type="text"
                  required
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>담당자 성명</label>
                <input
                  type="text"
                  value={editForm.contactName}
                  onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>계정 이메일</label>
                <input
                  type="email"
                  disabled
                  value={editForm.email}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>연락처</label>
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>구독 플랜</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <option value="Free">Free 플랜</option>
                  <option value="Basic">Pro (Basic)</option>
                  <option value="Business">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>계정 상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <option value="Active">이용 활성</option>
                  <option value="Suspended">이용 정지</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>보유 포인트 (P)</label>
                <input
                  type="number"
                  value={editForm.accruedPoints}
                  onChange={(e) => setEditForm({ ...editForm, accruedPoints: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0d9488', fontSize: '0.8rem', fontWeight: 800 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>마케팅 태그</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="#농수산물 #화학품 #대형법인"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                영업 / 상담 히스토리 CRM 메모
              </label>
              <textarea
                rows={4}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="예: 2026-09-06: 전화상담 완료. 농수산물 TRQ 기능 안내 후 Pro 결제 혜택 제안함."
                style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontSize: '0.8rem', lineHeight: '1.5', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#0d9488', border: 'none', color: '#ffffff', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)' }}
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
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} color="#0891b2" /> 마케팅 메시지 발송 런처
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}
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
                      background: isSelected ? '#e0f2fe' : '#f8fafc',
                      border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 800 }}>{tpl.badge}</span>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{tpl.title}</h4>
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
                lineHeight: '1.6',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={handleCopyTemplateText}
                style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.78rem', fontWeight: 750, cursor: 'pointer' }}
              >
                문구 복사
              </button>
              <button
                onClick={() => {
                  handleCopyTemplateText();
                  window.open('https://pf.kakao.com/_onestopcustoms/chat', '_blank');
                }}
                style={{ padding: '8px 18px', borderRadius: '6px', background: '#FEE500', border: 'none', color: '#111827', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px rgba(254, 229, 0, 0.3)' }}
              >
                카카오톡 발송
              </button>
            </div>
          </div>
        </div>
      )}"""

assert old_modals in content, "old_modals not found"
content = content.replace(old_modals, new_modals, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated AdminPortal.tsx with high-contrast, crystal-clear light theme text!")
