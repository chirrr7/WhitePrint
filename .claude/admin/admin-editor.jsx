// admin-editor.jsx — WYSIWYG Post Editor
// Exports to window: PostEditor

const { useState, useEffect, useRef, useCallback } = React;

// ─── FLOATING TOOLBAR ─────────────────────────────────────────
function FloatingToolbar({ editorRef }) {
  const [pos, setPos] = useState(null);
  const toolbarRef = useRef(null);
  const savedRange = useRef(null);

  // Save selection whenever editor loses focus (before toolbar click steals it)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const save = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
    };
    el.addEventListener('blur', save);
    el.addEventListener('mouseup', save);
    el.addEventListener('keyup', save);
    return () => { el.removeEventListener('blur', save); el.removeEventListener('mouseup', save); el.removeEventListener('keyup', save); };
  }, [editorRef]);

  const exec = (cmd, val = null) => {
    // Restore selection so execCommand acts on the right range
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    // Re-save after command
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  useEffect(() => {
    const onSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim() || !editorRef.current) {
        setPos(null); return;
      }
      // Check selection is inside editor
      const node = sel.anchorNode;
      if (!editorRef.current.contains(node)) { setPos(null); return; }
      const range = sel.getRangeAt(0);
      const rect  = range.getBoundingClientRect();
      const eRect = editorRef.current.getBoundingClientRect();
      setPos({
        top:  rect.top - eRect.top - 46,
        left: rect.left - eRect.left + rect.width / 2,
      });
    };
    document.addEventListener('selectionchange', onSelection);
    return () => document.removeEventListener('selectionchange', onSelection);
  }, [editorRef]);

  if (!pos) return null;

  const T = window.AT;
  const btnStyle = (active = false) => ({
    background: active ? T.accent : 'transparent',
    border: 'none', cursor: 'pointer', color: active ? '#fff' : T.ink,
    padding: '5px 8px', transition: 'background 0.1s',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.04em',
  });

  return (
    <div
      ref={toolbarRef}
      style={{
        position: 'absolute',
        top: pos.top, left: pos.left,
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 1,
        background: '#1a1816', border: `1px solid ${T.borderB}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        padding: '3px',
        whiteSpace: 'nowrap',
      }}
      onMouseDown={e => e.preventDefault()}
    >
      {[
        { label: <strong>B</strong>, cmd: 'bold' },
        { label: <em>I</em>,         cmd: 'italic' },
        { label: <u>U</u>,           cmd: 'underline' },
      ].map(({label, cmd}) => (
        <button key={cmd} style={btnStyle()} onMouseDown={e => e.preventDefault()} onClick={() => exec(cmd)} title={cmd}>{label}</button>
      ))}
      <div style={{ width:1, height:18, background: T.border, margin:'0 2px' }} />
      {[
        { label:'H1', val:'h1' }, { label:'H2', val:'h2' }, { label:'H3', val:'h3' },
      ].map(({label, val}) => (
        <button key={val} style={btnStyle()} onMouseDown={e => e.preventDefault()} onClick={() => exec('formatBlock', val)}>{label}</button>
      ))}
      <div style={{ width:1, height:18, background: T.border, margin:'0 2px' }} />
      <button style={btnStyle()} onMouseDown={e => e.preventDefault()} onClick={() => exec('formatBlock','blockquote')} title="Quote">"</button>
      <button style={btnStyle()} onMouseDown={e => e.preventDefault()} onClick={() => exec('formatBlock','pre')} title="Code">{'{}'}</button>
      <div style={{ width:1, height:18, background: T.border, margin:'0 2px' }} />
      <button style={btnStyle()} onMouseDown={e => e.preventDefault()} onClick={() => {
        const url = prompt('Link URL:');
        if (url) exec('createLink', url);
      }} title="Link">↗</button>
      <label style={{ ...btnStyle(), display:'flex', alignItems:'center', gap:4, cursor:'pointer' }} title="Text color"
        onMouseDown={e => e.preventDefault()}>
        A
        <input type="color" style={{ width:14, height:14, border:'none', padding:0, cursor:'pointer', background:'transparent' }}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => exec('foreColor', e.target.value)} />
      </label>
    </div>
  );
}

// ─── BLOCK TYPE GUTTER ────────────────────────────────────────
function BlockGutter({ editorRef }) {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const T = window.AT;

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    setVisible(false);
  };

  const insertTable = () => {
    const rows = 3, cols = 3;
    let html = '<table style="width:100%;border-collapse:collapse;margin:16px 0">';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        const tag = r === 0 ? 'th' : 'td';
        html += `<${tag} style="border:1px solid rgba(245,242,235,0.12);padding:8px 12px;text-align:left">${r===0?'Header':'Cell'}</${tag}>`;
      }
      html += '</tr>';
    }
    html += '</table><p><br></p>';
    exec('insertHTML', html);
  };

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const onMouseMove = (e) => {
      const eRect = el.getBoundingClientRect();
      setTop(e.clientY - eRect.top);
    };
    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [editorRef]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute', left: -88, top: top - 14,
      display: 'flex', gap: 2,
      opacity: 0.5,
    }}
      onMouseEnter={() => setVisible(true)}
    >
      {[
        { label:'p',  title:'Paragraph',   fn: () => exec('formatBlock','p') },
        { label:'H2', title:'Heading',      fn: () => exec('formatBlock','h2') },
        { label:'—',  title:'Divider',      fn: () => exec('insertHTML','<hr><p><br></p>') },
        { label:'⊞',  title:'Insert Table', fn: insertTable },
      ].map(item => (
        <button key={item.label}
          onClick={item.fn}
          title={item.title}
          onMouseDown={e => e.preventDefault()}
          style={{
            background: T.surfaceB, border: `1px solid ${T.border}`,
            color: T.muted, cursor:'pointer', padding:'3px 6px',
            fontFamily:"'JetBrains Mono',monospace", fontSize:8,
            letterSpacing:'0.06em',
          }}
        >{item.label}</button>
      ))}
    </div>
  );
}

// ─── ARTICLE STYLE (matches published post) ───────────────────
const ARTICLE_CSS = `
  .wp-editor { outline: none; caret-color: #b83025; }
  .wp-editor h1 { font-family:'Playfair Display',Georgia,serif; font-size:28px; font-weight:700; line-height:1.2; letter-spacing:-0.025em; margin:28px 0 14px; color:#f5f2eb; }
  .wp-editor h2 { font-family:'Playfair Display',Georgia,serif; font-size:22px; font-weight:600; line-height:1.25; letter-spacing:-0.015em; margin:24px 0 10px; color:#f5f2eb; }
  .wp-editor h3 { font-family:'Playfair Display',Georgia,serif; font-size:17px; font-weight:600; margin:20px 0 8px; color:#f5f2eb; }
  .wp-editor p  { font-family:'Playfair Display',Georgia,serif; font-size:15px; line-height:1.95; color:rgba(245,242,235,0.75); margin:0 0 16px; }
  .wp-editor blockquote { border-left:2px solid #b83025; margin:20px 0; padding:4px 0 4px 20px; }
  .wp-editor blockquote p { color:rgba(245,242,235,0.55); font-style:italic; margin:0; }
  .wp-editor pre { background:rgba(245,242,235,0.05); border:1px solid rgba(245,242,235,0.08); padding:14px 18px; margin:16px 0; font-family:'JetBrains Mono',monospace; font-size:12px; color:rgba(245,242,235,0.65); overflow-x:auto; white-space:pre-wrap; }
  .wp-editor hr { border:none; border-top:1px solid rgba(245,242,235,0.1); margin:28px 0; }
  .wp-editor strong { font-weight:700; color:#f5f2eb; }
  .wp-editor em { font-style:italic; }
  .wp-editor a { color:#b83025; text-decoration:underline; }
  .wp-editor table { width:100%; border-collapse:collapse; margin:16px 0; font-family:-apple-system,system-ui,sans-serif; font-size:13px; }
  .wp-editor th { background:rgba(245,242,235,0.06); color:rgba(245,242,235,0.65); font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.1em; text-transform:uppercase; padding:10px 12px; border:1px solid rgba(245,242,235,0.1); text-align:left; }
  .wp-editor td { padding:10px 12px; border:1px solid rgba(245,242,235,0.08); color:rgba(245,242,235,0.7); vertical-align:top; }
  .wp-editor td:focus, .wp-editor th:focus { outline:1px solid #b83025; }
  .wp-editor [data-placeholder]:empty:before { content:attr(data-placeholder); color:rgba(245,242,235,0.18); pointer-events:none; }
`;

// ─── BRIEF EDITOR TAB ─────────────────────────────────────────
const ROMAN = ['I','II','III','IV','V'];

function makeBriefCount() {
  return { title:'', signal:'High Signal', claim:'', src:'', value:'', note:'' };
}

function BriefEditor({ brief, onChange }) {
  const T = window.AT;
  const [counts, setCounts] = useState(brief?.counts || [makeBriefCount()]);
  const [verdict, setVerdict] = useState(brief?.verdict || '');
  const [conclusion, setConclusion] = useState(brief?.conclusion || '');
  const [openIdx, setOpenIdx] = useState(0);

  const update = useCallback((field, val) => {
    const data = { verdict, conclusion, counts };
    if (field === 'verdict') { setVerdict(val); onChange({ ...data, verdict: val }); }
    if (field === 'conclusion') { setConclusion(val); onChange({ ...data, conclusion: val }); }
  }, [verdict, conclusion, counts, onChange]);

  const updateCount = (i, key, val) => {
    const next = counts.map((c, idx) => idx === i ? { ...c, [key]: val } : c);
    setCounts(next);
    onChange({ verdict, conclusion, counts: next });
  };

  const fieldStyle = {
    width:'100%', background:T.faint, border:`1px solid ${T.border}`,
    color:T.ink, padding:'8px 10px', outline:'none',
    fontFamily:"-apple-system,system-ui,sans-serif", fontSize:12,
    marginBottom:10, resize:'vertical',
  };
  const labelStyle = { ...window.AMONO, fontSize:7, letterSpacing:'0.12em', textTransform:'uppercase', color:T.muted, display:'block', marginBottom:5 };

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'28px 40px 60px' }}>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1 }}>
          <label style={labelStyle}>Verdict</label>
          <select value={verdict} onChange={e => update('verdict', e.target.value)}
            style={{ ...fieldStyle, marginBottom:0, fontFamily:"'JetBrains Mono',monospace", fontSize:8.5, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer' }}>
            <option value=''>No verdict</option>
            {['SHORT','LONG','NEUTRAL','WATCH','SHORT VOL','LONG VOL'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ flex:1 }}>
          <label style={labelStyle}>Counts</label>
          <div style={{ display:'flex', gap:4 }}>
            <span style={{ ...window.AMONO, fontSize:9, color:T.muted, padding:'8px 0' }}>{counts.length} / 5 counts</span>
            {counts.length < 5 && (
              <button onClick={() => setCounts([...counts, makeBriefCount()])}
                style={{ padding:'6px 12px', border:`1px solid ${T.border}`, background:'transparent', color:T.muted, cursor:'pointer', ...window.AMONO, fontSize:7, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                + Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Counts */}
      {counts.map((count, i) => (
        <div key={i} style={{ border:`1px solid ${openIdx===i?T.accent+'50':T.border}`, marginBottom:4, transition:'border-color 0.2s' }}>
          <button onClick={() => setOpenIdx(openIdx===i ? -1 : i)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:openIdx===i?T.faint:'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
            <div style={{ width:28, height:28, border:`1px solid ${openIdx===i?T.accent:T.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              ...window.ASERIF, fontSize:11, fontStyle:'italic', fontWeight:700, color:openIdx===i?T.accent:T.ink }}>
              {ROMAN[i]}
            </div>
            <div style={{ flex:1, ...window.ASERIF, fontSize:13, color:count.title?T.ink:T.subtle, fontStyle:count.title?'normal':'italic' }}>
              {count.title || 'Untitled count'}
            </div>
            <span style={{ ...window.AMONO, fontSize:11, color:T.subtle }}>{openIdx===i?'−':'+'}</span>
          </button>
          {openIdx === i && (
            <div style={{ padding:'0 16px 16px' }}>
              <label style={labelStyle}>Title</label>
              <input value={count.title} onChange={e => updateCount(i,'title',e.target.value)} placeholder="e.g. Capex 10× in Three Years" style={{ ...fieldStyle, ...window.ASERIF, fontSize:13 }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 140px', gap:10 }}>
                <div>
                  <label style={labelStyle}>Your Claim (one sentence)</label>
                  <textarea value={count.claim} onChange={e => updateCount(i,'claim',e.target.value)} rows={2} placeholder="What you believe and why…" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Signal</label>
                  <select value={count.signal} onChange={e => updateCount(i,'signal',e.target.value)}
                    style={{ ...fieldStyle, fontFamily:"'JetBrains Mono',monospace", fontSize:8, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer' }}>
                    {['High Signal','Critical','Moderate','Watch'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ padding:'10px', background:T.surfaceC, border:`1px solid ${T.border}`, marginBottom:10 }}>
                <window.AdminMono size={6.5} color={T.accent} style={{ display:'block', marginBottom:8, opacity:1 }}>Proof</window.AdminMono>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <div>
                    <label style={labelStyle}>Source</label>
                    <input value={count.src} onChange={e => updateCount(i,'src',e.target.value)} placeholder="e.g. 10-K FY2024, Note 6" style={{ ...fieldStyle, marginBottom:0, ...window.AMONO, fontSize:8 }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Key Figure / Value</label>
                    <input value={count.value} onChange={e => updateCount(i,'value',e.target.value)} placeholder="e.g. $6,866M vs $1,347M" style={{ ...fieldStyle, marginBottom:0, ...window.AMONO, fontSize:8 }} />
                  </div>
                </div>
              </div>
              <label style={labelStyle}>Interpretation (1–2 sentences)</label>
              <textarea value={count.note} onChange={e => updateCount(i,'note',e.target.value)} rows={2} placeholder="What it means…" style={fieldStyle} />
            </div>
          )}
        </div>
      ))}

      {/* Conclusion */}
      <div style={{ marginTop:16 }}>
        <label style={labelStyle}>Conclusion</label>
        <textarea value={conclusion} onChange={e => update('conclusion', e.target.value)} rows={3}
          placeholder="The short verdict paragraph — appears at the bottom of every Brief."
          style={{ ...fieldStyle, ...window.ASERIF, fontSize:13, lineHeight:1.7 }}
        />
      </div>
    </div>
  );
}

// ─── MAIN EDITOR COMPONENT ────────────────────────────────────
function PostEditor({ post, onSave, onCancel }) {
  const T = window.AT;
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState('article'); // 'article' | 'brief'
  const [briefData, setBriefData] = useState(post?.brief_data || null);

  const [meta, setMeta] = useState({
    title:   post?.title   || '',
    type:    post?.type    || 'equity',
    verdict: post?.verdict || '',
    date:    post?.date    || new Date().toISOString().slice(0,10),
    slug:    post?.slug    || '',
  });
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Set initial content once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = post?.body || '<p>Start writing here. Select any text to format it.</p>';
    }
  }, []);

  const handleSave = () => {
    const body = editorRef.current?.innerHTML || '';
    onSave({ ...meta, body, brief_data: briefData });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInput = () => {
    const text = editorRef.current?.innerText || '';
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  };

  const selectStyle = {
    background: T.faint, border: `1px solid ${T.border}`,
    color: T.ink, padding: '9px 12px', outline: 'none',
    fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    cursor: 'pointer',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <style>{ARTICLE_CSS}</style>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', borderBottom: `1px solid ${T.border}`,
        background: T.surface, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:T.muted }}>
            <window.AdminMono size={7} color={T.muted} style={{ opacity:1 }}>← Posts</window.AdminMono>
          </button>
          <div style={{ width:1, height:14, background:T.border }} />
          <window.AdminMono size={7} color={T.accent} style={{ opacity:1 }}>
            {post ? 'Editing Post' : 'New Post'}
          </window.AdminMono>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* Article / Brief tab switcher */}
          <div style={{ display:'flex', gap:1, marginRight:8 }}>
            {[['article','Article'],['brief','Brief']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                padding:'6px 14px', border:`1px solid ${activeTab===id ? T.accent : T.border}`,
                background: activeTab===id ? T.accent+'18' : 'transparent',
                color: activeTab===id ? T.accent : T.muted,
                cursor:'pointer', ...AMONO, fontSize:7.5, letterSpacing:'0.1em', textTransform:'uppercase', transition:'all 0.15s',
              }}>{label}</button>
            ))}
          </div>
          <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1 }}>{wordCount} words</window.AdminMono>
          <window.AdminBtn onClick={handleSave} variant='ghost' style={{ padding:'6px 14px' }}>
            {saved ? '✓ Saved' : 'Save Draft'}
          </window.AdminBtn>
          <window.AdminBtn onClick={handleSave} variant='primary' style={{ padding:'6px 14px' }}>
            Publish
          </window.AdminBtn>
        </div>
      </div>

      {/* Meta fields */}
      <div style={{
        padding: '20px 32px',
        borderBottom: `1px solid ${T.border}`,
        background: T.surfaceB, flexShrink: 0,
      }}>
        {/* Title (big, editable inline) */}
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={e => setMeta(m => ({ ...m, title: e.target.innerText }))}
          data-placeholder="Post title — write your headline here"
          style={{
            ...window.ASERIF, fontSize: 26, fontWeight: 700, color: T.ink,
            letterSpacing: '-0.02em', lineHeight: 1.2,
            outline: 'none', marginBottom: 16,
            borderBottom: `1px solid transparent`,
          }}
          onFocus={e => e.target.style.borderBottomColor = T.accent}
          onBlur={e => e.target.style.borderBottomColor = 'transparent'}
        >
          {meta.title}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={meta.type} onChange={e => setMeta(m => ({...m, type:e.target.value}))} style={{ ...selectStyle }}>
            {['equity','macro','quant','market-notes'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={meta.verdict} onChange={e => setMeta(m => ({...m, verdict:e.target.value}))} style={{ ...selectStyle }}>
            <option value=''>No verdict</option>
            {['SHORT','LONG','NEUTRAL','WATCH','SHORT VOL','LONG VOL'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <input
            type="date"
            value={meta.date}
            onChange={e => setMeta(m => ({...m, date:e.target.value}))}
            style={{ ...selectStyle, fontFamily:"'JetBrains Mono',monospace", fontSize:9 }}
          />
          <input
            value={meta.slug}
            onChange={e => setMeta(m => ({...m, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))}
            placeholder="url-slug"
            style={{ ...selectStyle, width:200 }}
          />
        </div>
      </div>

      {/* Editor area — Article OR Brief */}
      {activeTab === 'article' ? (
      <div style={{ flex:1, overflowY:'auto', padding:'0 0 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px', position:'relative' }}>
          {/* Block gutter (left side helpers) */}
          <BlockGutter editorRef={editorRef} />

          {/* Floating format toolbar */}
          <FloatingToolbar editorRef={editorRef} />

          {/* THE EDITOR — looks like the published article */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="wp-editor"
            onInput={handleInput}
            spellCheck={true}
            style={{
              outline: 'none',
              minHeight: 400,
            }}
          />

          {/* Hint */}
          <div style={{ marginTop:32, paddingTop:20, borderTop:`1px solid ${T.border}` }}>
            <window.AdminMono size={6.5} color={T.subtle} style={{ opacity:1, lineHeight:1.8 }}>
              Select any text → formatting toolbar appears · Left side buttons → block types · Tables auto-editable inline
            </window.AdminMono>
          </div>
        </div>
      </div>
      ) : (
        /* Brief editor tab */
        <div style={{ flex:1, overflowY:'auto', background:T.bg }}>
          <BriefEditor brief={briefData} onChange={setBriefData} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PostEditor });
