// admin-ui.jsx — Shell, Sidebar, shared primitives
// Exports to window: AT, AMONO, ASERIF, AdminShell, AdminMono, AdminBadge, AdminBtn, AdminInput, AdminDivider

const AT = {
  bg:       '#0a0a0a',
  surface:  '#111110',
  surfaceB: '#161514',
  surfaceC: '#1c1a18',
  ink:      '#f5f2eb',
  muted:    'rgba(245,242,235,0.45)',
  subtle:   'rgba(245,242,235,0.2)',
  faint:    'rgba(245,242,235,0.06)',
  border:   'rgba(245,242,235,0.08)',
  borderB:  'rgba(245,242,235,0.14)',
  accent:   '#b83025',
};
const AMONO  = { fontFamily: "'JetBrains Mono', monospace" };
const ASERIF = { fontFamily: "'Playfair Display', Georgia, serif" };
const ASYS   = { fontFamily: "-apple-system, system-ui, sans-serif" };

// ─── PRIMITIVES ───────────────────────────────────────────────
function AdminMono({ children, size = 8, color = AT.muted, style = {}, ...p }) {
  return (
    <span style={{ ...AMONO, fontSize: size, letterSpacing: '0.13em', textTransform: 'uppercase', color, ...style }} {...p}>
      {children}
    </span>
  );
}

function AdminDivider({ style = {} }) {
  return <div style={{ height: 1, background: AT.border, ...style }} />;
}

function AdminBadge({ children, color = AT.muted, bg = AT.faint }) {
  return (
    <span style={{
      ...AMONO, fontSize: 6.5, letterSpacing: '0.12em', textTransform: 'uppercase',
      color, background: bg, padding: '3px 8px',
      border: `1px solid ${color}40`,
    }}>{children}</span>
  );
}

function AdminBtn({ children, onClick, variant = 'ghost', style = {}, ...p }) {
  const [hov, setHov] = React.useState(false);
  const variants = {
    primary: { background: hov ? '#c93d30' : AT.accent, color: '#fff', border: 'none' },
    ghost:   { background: hov ? AT.faint  : 'transparent', color: AT.muted, border: `1px solid ${AT.border}` },
    danger:  { background: hov ? '#7a1a12' : 'transparent', color: '#e05a4e', border: `1px solid #e05a4e40` },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 14px', cursor: 'pointer', transition: 'all 0.15s',
        ...AMONO, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase',
        ...variants[variant], ...style,
      }}
      {...p}
    >{children}</button>
  );
}

function AdminInput({ label, value, onChange, placeholder, type = 'text', note, style = {} }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ ...AMONO, fontSize: 7, letterSpacing: '0.13em', textTransform: 'uppercase', color: AT.muted, display: 'block', marginBottom: 6 }}>{label}</label>}
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: AT.faint, border: `1px solid ${AT.border}`,
          color: AT.ink, padding: '9px 12px', outline: 'none',
          ...ASYS, fontSize: 13, transition: 'border-color 0.15s', ...style,
        }}
        onFocus={e => e.target.style.borderColor = AT.accent}
        onBlur={e => e.target.style.borderColor = AT.border}
      />
      {note && <div style={{ ...AMONO, fontSize: 6, letterSpacing: '0.06em', color: AT.subtle, marginTop: 5, lineHeight: 1.6 }}>{note}</div>}
    </div>
  );
}

// ─── SVG ICONS ────────────────────────────────────────────────
const icons = {
  dashboard: (c='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0" y="0" width="6" height="6" stroke={c} strokeWidth="1.2"/>
      <rect x="8" y="0" width="6" height="6" stroke={c} strokeWidth="1.2"/>
      <rect x="0" y="8" width="6" height="6" stroke={c} strokeWidth="1.2"/>
      <rect x="8" y="8" width="6" height="6" stroke={c} strokeWidth="1.2"/>
    </svg>
  ),
  posts: (c='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="12" stroke={c} strokeWidth="1.2"/>
      <line x1="4" y1="4.5" x2="10" y2="4.5" stroke={c} strokeWidth="1.2"/>
      <line x1="4" y1="7" x2="10" y2="7" stroke={c} strokeWidth="1.2"/>
      <line x1="4" y1="9.5" x2="7" y2="9.5" stroke={c} strokeWidth="1.2"/>
    </svg>
  ),
  stances: (c='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0" y="8" width="3" height="6" stroke={c} strokeWidth="1.2"/>
      <rect x="4.5" y="4" width="3" height="10" stroke={c} strokeWidth="1.2"/>
      <rect x="9" y="1" width="3" height="13" stroke={c} strokeWidth="1.2"/>
    </svg>
  ),
  models: (c='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0" y="0" width="14" height="14" stroke={c} strokeWidth="1.2"/>
      <line x1="0" y1="4.5" x2="14" y2="4.5" stroke={c} strokeWidth="1"/>
      <line x1="0" y1="9" x2="14" y2="9" stroke={c} strokeWidth="1"/>
      <line x1="5" y1="0" x2="5" y2="14" stroke={c} strokeWidth="1"/>
    </svg>
  ),
  settings: (c='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" stroke={c} strokeWidth="1.2"/>
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.5 2.5l1 1M10.5 10.5l1 1M11.5 2.5l-1 1M3.5 10.5l-1 1" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  pipeline: (c='currentColor') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke={c} strokeWidth="1.2"/>
      <path d="M7 4v3.5l2 2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  logout: (c='currentColor') => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 1H11V11H8" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M1 6H8M5 3.5L8 6L5 8.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// ─── NAV CONFIG ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',   icon: icons.dashboard },
  { id: 'posts',     label: 'Posts',       icon: icons.posts },
  { id: 'stances',   label: 'Stances',     icon: icons.stances },
  { id: 'models',    label: 'Models',      icon: icons.models },
  { id: 'pipeline',  label: 'In Progress', icon: icons.pipeline },
  { id: 'settings',  label: 'Settings',    icon: icons.settings },
];

// ─── SIDEBAR ─────────────────────────────────────────────────
function AdminSidebar({ page, setPage, onLogout }) {
  return (
    <div style={{
      width: 220, flexShrink: 0, height: '100vh',
      position: 'sticky', top: 0, display: 'flex', flexDirection: 'column',
      background: AT.surface, borderRight: `1px solid ${AT.border}`,
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${AT.border}` }}>
        <div style={{ ...ASERIF, fontSize: 15, fontWeight: 700, color: AT.ink }}>
          Whiteprint <em style={{ color: AT.accent }}>Admin</em>
        </div>
        <AdminMono size={6.5} color={AT.subtle} style={{ display: 'block', marginTop: 5 }}>
          Editorial Panel
        </AdminMono>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.id || (page === 'new-post' && item.id === 'posts') || (page === 'edit-post' && item.id === 'posts');
          const [hov, setHov] = React.useState(false);
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px', border: 'none', textAlign: 'left', cursor: 'pointer',
                background: active ? AT.accent + '14' : hov ? AT.faint : 'transparent',
                borderLeft: `2px solid ${active ? AT.accent : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ color: active ? AT.accent : AT.muted, flexShrink: 0 }}>
                {item.icon(active ? AT.accent : AT.muted)}
              </span>
              <AdminMono
                size={7.5}
                color={active ? AT.ink : AT.muted}
                style={{ opacity: 1 }}
              >
                {item.label}
              </AdminMono>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: `1px solid ${AT.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, background: AT.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AdminMono size={9} color='#fff' style={{ opacity: 1 }}>C</AdminMono>
          </div>
          <div>
            <AdminMono size={7} color={AT.ink} style={{ display: 'block', opacity: 1 }}>Chirayu</AdminMono>
            <AdminMono size={6} color={AT.subtle} style={{ opacity: 1 }}>Admin</AdminMono>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {icons.logout(AT.subtle)}
          <AdminMono size={7} color={AT.subtle} style={{ opacity: 1 }}>Sign out</AdminMono>
        </button>
      </div>
    </div>
  );
}

// ─── SHELL ────────────────────────────────────────────────────
function AdminShell({ page, setPage, onLogout, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: AT.bg }}>
      <AdminSidebar page={page} setPage={setPage} onLogout={onLogout} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { AT, AMONO, ASERIF, ASYS, AdminMono, AdminDivider, AdminBadge, AdminBtn, AdminInput, AdminShell, icons });
