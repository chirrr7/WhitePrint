// admin-pages.jsx — All admin page components
// Exports to window: LoginPage, DashboardPage, PostsPage, StancesPage, PipelinePage, ModelsPage, SettingsPage

const { useState, useRef } = React;

// ─── SAMPLE DATA ──────────────────────────────────────────────
const SAMPLE_POSTS = [
  { id:1, title:'Oracle: The Infrastructure Bet Nobody\'s Pricing', type:'equity', verdict:'SHORT', status:'published', date:'2024-04-18', words:4200 },
  { id:2, title:'Dollar Weakness: Structural, Not Cyclical', type:'macro', verdict:'SHORT', status:'published', date:'2024-02-12', words:3100 },
  { id:3, title:'Off-Plan Default Swaps', type:'quant', verdict:'', status:'published', date:'2024-03-05', words:2800 },
  { id:4, title:'High Yield Credit: The Refinancing Wall', type:'equity', verdict:'SHORT', status:'published', date:'2024-01-29', words:3600 },
  { id:5, title:'Fed March 2026: Three Things to Watch', type:'market-notes', verdict:'', status:'draft', date:'2026-03-18', words:890 },
  { id:6, title:'Gold and the De-dollarization Bid', type:'macro', verdict:'LONG', status:'published', date:'2024-03-05', words:2400 },
];

const SAMPLE_STANCES = [
  { id:1, ticker:'ORCL', name:'Oracle Corp.', type:'Equity', dir:'Short', cv:88, filed:'Apr 2024', status:'active' },
  { id:2, ticker:'NVDA', name:'Nvidia Corp.', type:'Equity', dir:'Long',  cv:72, filed:'Mar 2024', status:'active' },
  { id:3, ticker:'DXY',  name:'US Dollar',   type:'Macro',  dir:'Short', cv:80, filed:'Feb 2024', status:'active' },
  { id:4, ticker:'HYG',  name:'High Yield',  type:'Credit', dir:'Short', cv:65, filed:'Jan 2024', status:'active' },
  { id:5, ticker:'GLD',  name:'Gold',        type:'Macro',  dir:'Long',  cv:78, filed:'Mar 2024', status:'active' },
  { id:6, ticker:'WTI',  name:'Crude Oil',   type:'Macro',  dir:'Neutral',cv:41,filed:'Apr 2024', status:'closed' },
];

const TYPE_COLOR = { equity:'#b83025', macro:'#7a6040', quant:'#3d5f8a', 'market-notes':'#3d6b5f' };
const DIR_COLOR  = { Short:'#b83025', Long:'#2d7a4f', Neutral:'#6a6a6a', 'SHORT VOL':'#b83025', 'LONG VOL':'#2d7a4f' };

// ─── SHARED PAGE WRAPPER ──────────────────────────────────────
function Page({ title, subtitle, actions, children }) {
  const T = window.AT;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      {/* Page header */}
      <div style={{ padding:'24px 32px 20px', borderBottom:`1px solid ${T.border}`, flexShrink:0, background:T.surface }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div>
            <window.AdminMono size={7} color={T.accent} style={{ display:'block', marginBottom:6, opacity:1 }}>
              Whiteprint Admin
            </window.AdminMono>
            <h1 style={{ ...window.ASERIF, fontSize:22, fontWeight:700, color:T.ink, letterSpacing:'-0.02em' }}>
              {title}
            </h1>
            {subtitle && <p style={{ ...window.ASERIF, fontSize:12, color:T.muted, marginTop:4, fontStyle:'italic' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display:'flex', gap:8 }}>{actions}</div>}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'28px 32px' }}>
        {children}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const T = window.AT;
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [err,   setErr]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !pass) { setErr('Enter email and password.'); return; }
    onLogin();
  };

  return (
    <div style={{
      minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center',
      position:'relative', overflow:'hidden',
    }}>
      {/* Grain */}
      <div style={{
        position:'absolute', inset:'-40%', width:'180%', height:'180%',
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity:0.025, pointerEvents:'none',
      }} />

      {/* Card */}
      <div style={{ width:400, position:'relative', zIndex:1 }}>
        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ ...window.ASERIF, fontSize:22, fontWeight:700, color:T.ink }}>
            Whiteprint <em style={{ color:T.accent }}>Research</em>
          </div>
          <window.AdminMono size={7} color={T.subtle} style={{ display:'block', marginTop:8, opacity:1 }}>
            Admin Panel · Private Access
          </window.AdminMono>
        </div>

        {/* Form */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, padding:'32px' }}>
          <div style={{ borderLeft:`2px solid ${T.accent}`, paddingLeft:14, marginBottom:24 }}>
            <window.AdminMono size={7} color={T.accent} style={{ display:'block', marginBottom:4, opacity:1 }}>
              Sign In
            </window.AdminMono>
            <div style={{ ...window.ASERIF, fontSize:13, color:T.muted, fontStyle:'italic', lineHeight:1.6 }}>
              Supabase Auth handles the session. Admin allowlist in Postgres decides access.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <window.AdminInput label="Email" value={email} onChange={setEmail} placeholder="admin@whiteprintresearch.com" type="email" />
            <window.AdminInput label="Password" value={pass} onChange={setPass} placeholder="Your password" type="password" />

            {err && (
              <div style={{ padding:'8px 12px', background:'#b8302514', border:`1px solid #b8302540`, marginBottom:16 }}>
                <window.AdminMono size={7} color={T.accent} style={{ opacity:1 }}>{err}</window.AdminMono>
              </div>
            )}

            <window.AdminBtn variant='primary' style={{ width:'100%', padding:'11px', marginTop:4 }}>
              Sign In →
            </window.AdminBtn>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1 }}>
            Vol. I · No. 3 · Internal Access Only
          </window.AdminMono>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function DashboardPage({ setPage, setEditPost }) {
  const T = window.AT;
  const stats = [
    { label:'Published', value:'6', sub:'all time' },
    { label:'Active Stances', value:'5', sub:'live positions' },
    { label:'In Progress', value:'2', sub:'drafts' },
    { label:'Avg. Words', value:'3.2k', sub:'per piece' },
  ];

  return (
    <Page
      title="Dashboard"
      subtitle="Overview of all published research and site activity"
      actions={<window.AdminBtn variant='primary' onClick={() => setPage('new-post')}>+ New Post</window.AdminBtn>}
    >
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding:'18px 20px', background:T.surface, border:`1px solid ${T.border}` }}>
            <div style={{ ...window.ASERIF, fontSize:28, fontWeight:700, color:T.ink, letterSpacing:'-0.04em', lineHeight:1 }}>
              {s.value}
            </div>
            <window.AdminMono size={7} color={T.muted} style={{ display:'block', marginTop:8, opacity:1 }}>{s.label}</window.AdminMono>
            <window.AdminMono size={6.5} color={T.subtle} style={{ display:'block', marginTop:2, opacity:1 }}>{s.sub}</window.AdminMono>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16 }}>
        {/* Recent posts */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}` }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <window.AdminMono size={7.5} color={T.ink} style={{ opacity:1 }}>Recent Posts</window.AdminMono>
            <button onClick={() => setPage('posts')} style={{ background:'none', border:'none', cursor:'pointer' }}>
              <window.AdminMono size={7} color={T.accent} style={{ opacity:1 }}>All posts →</window.AdminMono>
            </button>
          </div>
          {SAMPLE_POSTS.slice(0,4).map((p, i) => (
            <div key={p.id} style={{
              display:'flex', alignItems:'center', gap:16,
              padding:'12px 20px', borderBottom: i < 3 ? `1px solid ${T.border}` : 'none',
              cursor:'pointer',
            }}
              onClick={() => { setEditPost(p); setPage('edit-post'); }}
            >
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ ...window.ASERIF, fontSize:13, fontWeight:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {p.title}
                </div>
                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <window.AdminMono size={6.5} color={TYPE_COLOR[p.type] || T.muted} style={{ opacity:1 }}>{p.type}</window.AdminMono>
                  <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1 }}>{p.date}</window.AdminMono>
                </div>
              </div>
              <window.AdminBadge color={p.status === 'published' ? '#2d7a4f' : T.muted}>
                {p.status}
              </window.AdminBadge>
            </div>
          ))}
        </div>

        {/* Active stances */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}` }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <window.AdminMono size={7.5} color={T.ink} style={{ opacity:1 }}>Stances</window.AdminMono>
            <button onClick={() => setPage('stances')} style={{ background:'none', border:'none', cursor:'pointer' }}>
              <window.AdminMono size={7} color={T.accent} style={{ opacity:1 }}>All →</window.AdminMono>
            </button>
          </div>
          {SAMPLE_STANCES.filter(s => s.status === 'active').slice(0,5).map((s, i, arr) => (
            <div key={s.id} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'10px 20px', borderBottom: i < arr.length-1 ? `1px solid ${T.border}` : 'none',
            }}>
              <div>
                <div style={{ ...window.AMONO, fontSize:11, letterSpacing:'0.06em', color:T.ink }}>{s.ticker}</div>
                <window.AdminMono size={6.5} color={T.muted} style={{ opacity:1 }}>{s.type}</window.AdminMono>
              </div>
              <div style={{ textAlign:'right' }}>
                <window.AdminMono size={7} color={DIR_COLOR[s.dir] || T.muted} style={{ display:'block', opacity:1 }}>{s.dir}</window.AdminMono>
                <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1 }}>{s.cv}% cv</window.AdminMono>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

// ─── POSTS LIST ───────────────────────────────────────────────
function PostsPage({ setPage, setEditPost }) {
  const T = window.AT;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const types = ['all','equity','macro','quant','market-notes'];
  const filtered = SAMPLE_POSTS.filter(p => {
    const matchType = filter === 'all' || p.type === filter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <Page
      title="Posts"
      subtitle="All research articles and market notes"
      actions={<window.AdminBtn variant='primary' onClick={() => { setEditPost(null); setPage('new-post'); }}>+ New Post</window.AdminBtn>}
    >
      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:20, alignItems:'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts…"
          style={{
            flex:1, maxWidth:320, background:T.faint, border:`1px solid ${T.border}`,
            color:T.ink, padding:'8px 12px', outline:'none',
            fontFamily:"-apple-system,system-ui,sans-serif", fontSize:12,
          }}
        />
        <div style={{ display:'flex', gap:1 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding:'7px 12px', border:`1px solid ${filter===t ? T.accent : T.border}`,
              background: filter===t ? T.accent : 'transparent',
              color: filter===t ? '#fff' : T.muted,
              ...window.AMONO, fontSize:7.5, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer',
              transition:'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:T.surface, border:`1px solid ${T.border}` }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 90px 80px 100px', gap:0, padding:'10px 20px', borderBottom:`1px solid ${T.border}`, background:T.surfaceB }}>
          {['Title','Type','Verdict','Status','Words','Date'].map(h => (
            <window.AdminMono key={h} size={6.5} color={T.subtle} style={{ opacity:1 }}>{h}</window.AdminMono>
          ))}
        </div>

        {filtered.map((p, i) => (
          <div
            key={p.id}
            style={{
              display:'grid', gridTemplateColumns:'1fr 100px 80px 90px 80px 100px', gap:0,
              padding:'13px 20px',
              borderBottom: i < filtered.length-1 ? `1px solid ${T.border}` : 'none',
              cursor:'pointer', transition:'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.faint}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => { setEditPost(p); setPage('edit-post'); }}
          >
            <div style={{ ...window.ASERIF, fontSize:13, fontWeight:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:16 }}>{p.title}</div>
            <window.AdminMono size={7} color={TYPE_COLOR[p.type] || T.muted} style={{ opacity:1 }}>{p.type}</window.AdminMono>
            <window.AdminMono size={7} color={DIR_COLOR[p.verdict] || T.subtle} style={{ opacity:1 }}>{p.verdict || '—'}</window.AdminMono>
            <window.AdminBadge color={p.status==='published' ? '#2d7a4f' : T.muted}>{p.status}</window.AdminBadge>
            <window.AdminMono size={7} color={T.muted} style={{ opacity:1 }}>{(p.words/1000).toFixed(1)}k</window.AdminMono>
            <window.AdminMono size={7} color={T.subtle} style={{ opacity:1 }}>{p.date}</window.AdminMono>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding:'32px', textAlign:'center' }}>
            <window.AdminMono size={7.5} color={T.subtle} style={{ opacity:1 }}>No posts match</window.AdminMono>
          </div>
        )}
      </div>
    </Page>
  );
}

// ─── STANCES ──────────────────────────────────────────────────
function StancesPage({ setPage }) {
  const T = window.AT;
  const [filter, setFilter] = useState('active');

  const shown = SAMPLE_STANCES.filter(s => filter === 'all' || s.status === filter);

  return (
    <Page
      title="Stances"
      subtitle="Live research positions and conviction levels"
      actions={<window.AdminBtn variant='primary'>+ New Stance</window.AdminBtn>}
    >
      <div style={{ display:'flex', gap:1, marginBottom:20 }}>
        {['active','closed','all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'7px 14px', border:`1px solid ${filter===f ? T.accent : T.border}`,
            background: filter===f ? T.accent : 'transparent',
            color: filter===f ? '#fff' : T.muted,
            ...window.AMONO, fontSize:7.5, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {shown.map(s => (
          <div key={s.id} style={{ background:T.surface, border:`1px solid ${T.border}`, padding:'18px 20px', cursor:'pointer', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.borderB}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ ...window.AMONO, fontSize:16, letterSpacing:'0.04em', color:T.ink }}>{s.ticker}</div>
                <window.AdminMono size={7} color={T.muted} style={{ opacity:1 }}>{s.name}</window.AdminMono>
              </div>
              <window.AdminBadge
                color={s.dir==='Long' ? '#2d7a4f' : s.dir==='Short' ? T.accent : T.muted}
              >{s.dir}</window.AdminBadge>
            </div>

            {/* Conviction bar */}
            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1 }}>Conviction</window.AdminMono>
                <window.AdminMono size={6.5} color={T.ink} style={{ opacity:1 }}>{s.cv}%</window.AdminMono>
              </div>
              <div style={{ height:2, background:T.faint }}>
                <div style={{ height:'100%', width:`${s.cv}%`, background:T.accent }} />
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <window.AdminMono size={6.5} color={TYPE_COLOR[s.type.toLowerCase()] || T.muted} style={{ opacity:1 }}>{s.type}</window.AdminMono>
              <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1 }}>Filed {s.filed}</window.AdminMono>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

// ─── MODELS ───────────────────────────────────────────────────
function ModelsPage() {
  const T = window.AT;
  const models = [
    { name:'ORCL Capex Model', type:'Equity', updated:'Apr 2024', desc:'Oracle infrastructure build and depreciation drag through FY2027.' },
    { name:'DXY Structural Model', type:'Macro', updated:'Feb 2024', desc:'Real yield differential model vs G7 peers.' },
    { name:'HYG Refinancing Wall', type:'Credit', updated:'Jan 2024', desc:'High yield maturity schedule and default rate projection.' },
  ];
  return (
    <Page title="Models" subtitle="Downloadable financial models attached to research pieces">
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {models.map(m => (
          <div key={m.name} style={{ background:T.surface, border:`1px solid ${T.border}`, padding:'18px 20px', display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ flex:1 }}>
              <div style={{ ...window.ASERIF, fontSize:14, fontWeight:600, color:T.ink, marginBottom:4 }}>{m.name}</div>
              <window.AdminMono size={7} color={TYPE_COLOR[m.type.toLowerCase()] || T.muted} style={{ display:'block', marginBottom:4, opacity:1 }}>{m.type} · Updated {m.updated}</window.AdminMono>
              <div style={{ ...window.ASERIF, fontSize:12, color:T.muted, fontStyle:'italic' }}>{m.desc}</div>
            </div>
            <window.AdminBtn variant='ghost' style={{ flexShrink:0 }}>Download .xlsx</window.AdminBtn>
          </div>
        ))}
      </div>
    </Page>
  );
}

// ─── PIPELINE ─────────────────────────────────────────────────
function PipelinePage() {
  const T = window.AT;
  const [items, setItems] = useState([
    { id:1, title:'NVDA: Blackwell Gross Margin Sustainability', stage:'Research', pct:60, type:'equity', redacted:false, pubDate:'' },
    { id:2, title:'SPX: Earnings Resilience vs. Multiple Compression', stage:'Drafting', pct:30, type:'macro', redacted:false, pubDate:'' },
    { id:3, title:'EUR/USD: Rate Differentials Post-ECB', stage:'Idea', pct:10, type:'macro', redacted:true, pubDate:'' },
  ]);

  const update = (id, key, val) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it));

  const STAGES = ['Idea','Research','Drafting','Review','Ready'];

  return (
    <Page
      title="In Progress"
      subtitle="Research pipeline — controls what appears on the public homepage"
      actions={<window.AdminBtn variant='primary'>+ Add Item</window.AdminBtn>}
    >
      {/* Info banner */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 14px', border:`1px solid ${T.border}`, background:T.faint, marginBottom:20 }}>
        <div style={{ width:1.5, background:T.accent, alignSelf:'stretch', flexShrink:0 }} />
        <div>
          <window.AdminMono size={7} color={T.muted} style={{ display:'block', marginBottom:4, opacity:1 }}>
            Public Homepage Pipeline Docket
          </window.AdminMono>
          <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1, lineHeight:1.8 }}>
            All items below are visible on the homepage pipeline section. Toggle <span style={{ color:T.ink }}>Redact Title</span> to show a blurred placeholder instead of the real title to public visitors.
          </window.AdminMono>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {items.map(item => (
          <div key={item.id} style={{ background:T.surface, border:`1px solid ${T.border}` }}>
            {/* Header row */}
            <div style={{ padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:16 }}>
              <div style={{ flex:1 }}>
                {/* Editable title */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => update(item.id, 'title', e.target.innerText)}
                  style={{
                    ...window.ASERIF, fontSize:14, fontWeight:600, color:T.ink,
                    outline:'none', borderBottom:`1px solid transparent`, marginBottom:10,
                    transition:'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = T.accent}
                  onBlur={e => { e.target.style.borderBottomColor = 'transparent'; update(item.id, 'title', e.target.innerText); }}
                >
                  {item.title}
                </div>

                {/* Stage + progress */}
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10 }}>
                  <select value={item.stage} onChange={e => update(item.id, 'stage', e.target.value)}
                    style={{ background:T.faint, border:`1px solid ${T.border}`, color:T.ink, padding:'5px 8px', fontFamily:"'JetBrains Mono',monospace", fontSize:7.5, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer' }}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select value={item.type} onChange={e => update(item.id, 'type', e.target.value)}
                    style={{ background:T.faint, border:`1px solid ${T.border}`, color:T.ink, padding:'5px 8px', fontFamily:"'JetBrains Mono',monospace", fontSize:7.5, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer' }}>
                    {['equity','macro','quant','market-notes'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Progress bar */}
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <input type="range" min={0} max={100} step={5} value={item.pct}
                    onChange={e => update(item.id, 'pct', +e.target.value)}
                    style={{ flex:1, accentColor:T.accent }} />
                  <window.AdminMono size={7} color={T.muted} style={{ opacity:1, width:32, textAlign:'right' }}>{item.pct}%</window.AdminMono>
                </div>
              </div>

              {/* Redaction toggle — RIGHT side */}
              <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, minWidth:120 }}>
                <button
                  onClick={() => update(item.id, 'redacted', !item.redacted)}
                  style={{
                    padding:'7px 12px', border:`1px solid ${item.redacted ? T.accent : T.border}`,
                    background: item.redacted ? T.accent+'18' : 'transparent',
                    color: item.redacted ? T.accent : T.subtle,
                    cursor:'pointer', display:'flex', alignItems:'center', gap:7, transition:'all 0.15s',
                    fontFamily:"'JetBrains Mono',monospace", fontSize:7.5, letterSpacing:'0.1em', textTransform:'uppercase',
                  }}
                >
                  <div style={{
                    width:8, height:8,
                    background: item.redacted ? T.accent : T.border,
                    borderRadius:'50%', transition:'background 0.15s',
                  }} />
                  {item.redacted ? 'Redacted' : 'Redact Title'}
                </button>

                {/* Preview of how it looks to the public */}
                <div style={{ padding:'6px 10px', background:T.faint, border:`1px solid ${T.border}`, maxWidth:160 }}>
                  <window.AdminMono size={5.5} color={T.subtle} style={{ display:'block', marginBottom:4, opacity:1 }}>Public preview</window.AdminMono>
                  {item.redacted ? (
                    <div style={{ display:'flex', gap:3, alignItems:'center' }}>
                      {[40,64,48,56,32].map((w,i) => (
                        <div key={i} style={{ height:8, width:w, background:'rgba(245,242,235,0.14)', borderRadius:2 }} />
                      ))}
                    </div>
                  ) : (
                    <window.AdminMono size={7} color={T.muted} style={{ opacity:1, lineHeight:1.5 }}>
                      {item.title.slice(0, 28)}{item.title.length > 28 ? '…' : ''}
                    </window.AdminMono>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────
function SettingsPage() {
  const T = window.AT;
  const [vals, setVals] = useState({
    siteName: 'Whiteprint Research',
    tagline: 'Independent Macro & Equity Research',
    accentColor: '#b83025',
    email: 'chirayuparikh7@gmail.com',
    twitterHandle: '@whiteprintresearch',
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setVals(prev => ({ ...prev, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Section = ({ title, children }) => (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, marginBottom:16 }}>
      <div style={{ padding:'12px 20px', borderBottom:`1px solid ${T.border}`, background:T.surfaceB }}>
        <window.AdminMono size={7.5} color={T.ink} style={{ opacity:1 }}>{title}</window.AdminMono>
      </div>
      <div style={{ padding:'20px' }}>{children}</div>
    </div>
  );

  return (
    <Page
      title="Settings"
      subtitle="Site configuration and admin preferences"
      actions={
        <window.AdminBtn variant='primary' onClick={save}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </window.AdminBtn>
      }
    >
      <div style={{ maxWidth:640 }}>
        <Section title="Site Identity">
          <window.AdminInput label="Site Name" value={vals.siteName} onChange={v => set('siteName',v)} />
          <window.AdminInput label="Tagline" value={vals.tagline} onChange={v => set('tagline',v)} />
          <div style={{ marginBottom:16 }}>
            <label style={{ ...window.AMONO, fontSize:7, letterSpacing:'0.13em', textTransform:'uppercase', color:T.muted, display:'block', marginBottom:6 }}>Accent Color</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <input type="color" value={vals.accentColor} onChange={e => set('accentColor',e.target.value)}
                style={{ width:40, height:32, border:`1px solid ${T.border}`, background:'transparent', cursor:'pointer', padding:2 }} />
              <window.AdminMono size={8} color={T.ink} style={{ opacity:1 }}>{vals.accentColor}</window.AdminMono>
            </div>
          </div>
        </Section>

        <Section title="Contact & Social">
          <window.AdminInput label="Contact Email" value={vals.email} onChange={v => set('email',v)} type="email" />
          <window.AdminInput label="Twitter / X Handle" value={vals.twitterHandle} onChange={v => set('twitterHandle',v)} />
        </Section>

        <Section title="Admin Access">
          <div style={{ padding:'12px 14px', background:T.faint, border:`1px solid ${T.border}`, marginBottom:16 }}>
            <window.AdminMono size={7} color={T.muted} style={{ display:'block', marginBottom:6, opacity:1 }}>
              Current admin: {vals.email}
            </window.AdminMono>
            <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1, lineHeight:1.7 }}>
              Admin access is controlled by the Supabase allowlist in Postgres. Add emails directly in the database.
            </window.AdminMono>
          </div>
          <window.AdminBtn variant='danger'>Sign out of all sessions</window.AdminBtn>
        </Section>
      </div>
    </Page>
  );
}

Object.assign(window, { LoginPage, DashboardPage, PostsPage, StancesPage, ModelsPage, PipelinePage, SettingsPage });
