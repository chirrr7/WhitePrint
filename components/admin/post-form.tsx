'use client'

import React, {
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import matter from 'gray-matter'
import { savePostAction, saveBriefDataAction } from '@/lib/admin/actions'
import type { PageMessage } from '@/lib/admin/messages'
import type { PostEditorData } from '@/lib/admin/data'
import { TheBrief } from '@/components/TheBrief'
import type { BriefData, BriefCount } from '@/components/TheBrief'
import { tokens } from '@/lib/tokens'
import { RichEditor } from '@/components/admin/rich-editor'

/* ─── Types ─────────────────────────────────────────────── */

interface PostFormProps {
  message: PageMessage | null
  mode: 'create' | 'edit'
  models: PostEditorData['models']
  post: PostEditorData['post']
  stances: PostEditorData['stances']
  topics: PostEditorData['topics']
}

/* ─── Helpers ────────────────────────────────────────────── */

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 16)
}

function wordCount(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ').trim()
  return text ? text.split(/\s+/).length : 0
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

const VERDICT_OPTIONS = ['SHORT', 'LONG', 'NEUTRAL', 'WATCH', 'SHORT VOL', 'LONG VOL']
const SIGNAL_OPTIONS = ['High Signal', 'Critical', 'Moderate', 'Watch']

function emptyCount(idx: number): BriefCount {
  return {
    num: ROMAN[idx] ?? String(idx + 1),
    title: '',
    signal: 'Moderate',
    claim: '',
    src: '',
    value: '',
    note: '',
  }
}

function emptyBrief(): BriefData {
  return { verdict: 'NEUTRAL', counts: [], conclusion: '' }
}

/* ─── Shared style tokens ─────────────────────────────────── */

const S = {
  bg: tokens.bg,
  surface: tokens.surface,
  surfaceB: '#161514',
  ink: tokens.ink,
  muted: tokens.muted,
  border: tokens.border,
  accent: tokens.accent,
  mono: tokens.fontMono,
  serif: tokens.fontDisplay,
} as const

const inputBase: React.CSSProperties = {
  background: S.surface,
  border: `1px solid ${S.border}`,
  color: S.ink,
  fontFamily: S.mono,
  fontSize: 12,
  padding: '7px 10px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const selectBase: React.CSSProperties = {
  ...inputBase,
  appearance: 'none',
  cursor: 'pointer',
}

const textareaBase: React.CSSProperties = {
  ...inputBase,
  resize: 'vertical',
  lineHeight: 1.6,
}

const labelBase: React.CSSProperties = {
  fontFamily: S.mono,
  fontSize: 9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: S.muted,
  display: 'block',
  marginBottom: 5,
}

const btnPrimary: React.CSSProperties = {
  background: S.accent,
  color: '#fff',
  border: 'none',
  fontFamily: S.mono,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '9px 18px',
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  background: 'transparent',
  color: S.ink,
  border: `1px solid ${S.border}`,
  fontFamily: S.mono,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  padding: '9px 18px',
  cursor: 'pointer',
}

/* ─── Article tab ─────────────────────────────────────────── */

interface ArticleTabProps {
  post: PostEditorData['post']
  topics: PostEditorData['topics']
  stances: PostEditorData['stances']
  models: PostEditorData['models']
  mode: 'create' | 'edit'
}

function ArticleTab({ post, topics, stances, models, mode }: ArticleTabProps) {
  const titleRef = useRef<HTMLDivElement | null>(null)

  const [wc, setWc] = useState(0)
  const [titleFocused, setTitleFocused] = useState(false)
  const [bodyMdx, setBodyMdx] = useState(() => {
    const raw = post?.body_mdx ?? post?.body ?? ''
    return matter(raw).content
  })
  const [title, setTitle] = useState(post?.title ?? '')

  const toolbarBtn: React.CSSProperties = {
    background: 'transparent',
    border: `1px solid ${S.border}`,
    color: S.ink,
    fontFamily: S.mono,
    fontSize: 10,
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: 2,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          background: S.surfaceB,
          borderBottom: `1px solid ${S.border}`,
          flexWrap: 'wrap',
        }}
      >
        {/* Topic */}
        <select
          name="topic_id"
          defaultValue={post?.topic_id ? String(post.topic_id) : ''}
          style={{ ...selectBase, width: 140 }}
        >
          <option value="">No topic</option>
          {topics.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Status */}
        <select name="status" defaultValue={post?.status ?? 'draft'} style={{ ...selectBase, width: 110 }}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        {/* Published at */}
        <input
          type="datetime-local"
          name="published_at"
          defaultValue={toDateTimeLocal(post?.published_at)}
          style={{ ...inputBase, width: 180 }}
        />

        {/* Slug */}
        <input
          type="text"
          name="slug"
          defaultValue={post?.slug ?? ''}
          placeholder="auto-slug"
          style={{ ...inputBase, width: 160 }}
        />

        {/* Word count */}
        <span
          style={{
            fontFamily: S.mono,
            fontSize: 9,
            color: S.muted,
            marginLeft: 'auto',
            letterSpacing: '0.1em',
          }}
        >
          {wc} words
        </span>

        {/* Save draft */}
        <button type="submit" name="_action" value="draft" style={btnGhost}>
          Save Draft
        </button>

        {/* Publish */}
        <button type="submit" name="_action" value="publish" style={btnPrimary}>
          Publish
        </button>
      </div>

      {/* Inline title */}
      <div style={{ padding: '24px 40px 0', background: S.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ ...labelBase, margin: 0 }}>Title</span>
          <button
            type="button"
            style={toolbarBtn}
            onClick={() => {
              const sel = window.getSelection()
              if (!sel || sel.isCollapsed || !titleRef.current?.contains(sel.anchorNode)) return
              const text = sel.toString()
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              document.execCommand('insertText', false, `*${text}*`)
            }}
          >
            Highlight
          </button>
        </div>
        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setTitleFocused(true)}
          onBlur={() => {
            setTitleFocused(false)
            setTitle(titleRef.current?.innerText ?? '')
          }}
          onInput={() => setTitle(titleRef.current?.innerText ?? '')}
          data-placeholder="Article title…"
          style={{
            fontFamily: S.serif,
            fontSize: 26,
            fontWeight: 700,
            color: S.ink,
            outline: 'none',
            borderBottom: `2px solid ${titleFocused ? S.accent : 'transparent'}`,
            paddingBottom: 4,
            minHeight: 38,
            transition: 'border-color 0.15s',
            emptyCells: 'show',
          }}
        >
          {post?.title ?? ''}
        </div>
        {/* Hidden title for form submission */}
        <input type="hidden" name="title" value={title} readOnly />
      </div>

      {/* Body editor */}
      <input type="hidden" name="body_mdx" value={bodyMdx} readOnly />
      <RichEditor
        initialContent={bodyMdx}
        onChange={(md) => {
          setBodyMdx(md)
          setWc(wordCount(md))
        }}
      />

      {/* Remaining metadata in a compact panel */}
      <div
        style={{
          padding: '20px 40px',
          background: S.surfaceB,
          borderTop: `1px solid ${S.border}`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
        }}
      >
        <label style={{ display: 'block' }}>
          <span style={labelBase}>Summary</span>
          <textarea
            name="summary"
            defaultValue={post?.summary ?? ''}
            rows={3}
            style={textareaBase}
            placeholder="Thesis in one paragraph…"
          />
        </label>

        <label style={{ display: 'block' }}>
          <span style={labelBase}>Linked Stance</span>
          <select name="stance_id" defaultValue={post?.stance_id ? String(post.stance_id) : ''} style={selectBase}>
            <option value="">None</option>
            {stances.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block' }}>
          <span style={labelBase}>Linked Model</span>
          <select name="linked_model_id" defaultValue={post?.linked_model_id ? String(post.linked_model_id) : ''} style={selectBase}>
            <option value="">None</option>
            {models.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, gridColumn: '1/-1' }}>
          <input type="checkbox" name="featured" value="true" defaultChecked={post?.featured ?? false} />
          <span style={{ ...labelBase, margin: 0 }}>Featured</span>
          <input type="checkbox" name="homepage" value="true" defaultChecked={post?.homepage ?? false} style={{ marginLeft: 16 }} />
          <span style={{ ...labelBase, margin: 0 }}>Homepage candidate</span>
        </label>
      </div>
    </div>
  )
}

/* ─── Brief tab ───────────────────────────────────────────── */

interface BriefTabProps {
  post: PostEditorData['post']
}

function BriefTab({ post }: BriefTabProps) {
  // Try to parse existing brief_data from post if available
  // The column may not exist yet; we handle that gracefully
  const initialBrief: BriefData = emptyBrief()

  const [brief, setBrief] = useState<BriefData>(initialBrief)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [openCounts, setOpenCounts] = useState<Set<number>>(new Set([0]))

  function setVerdict(verdict: string) {
    setBrief((b) => ({ ...b, verdict }))
  }

  function setConclusion(conclusion: string) {
    setBrief((b) => ({ ...b, conclusion }))
  }

  function addCount() {
    if (brief.counts.length >= 5) return
    setBrief((b) => {
      const newCounts = [...b.counts, emptyCount(b.counts.length)]
      return { ...b, counts: newCounts }
    })
    setOpenCounts((prev) => new Set([...prev, brief.counts.length]))
  }

  function removeCount(idx: number) {
    setBrief((b) => {
      const newCounts = b.counts.filter((_, i) => i !== idx).map((c, i) => ({
        ...c,
        num: ROMAN[i] ?? String(i + 1),
      }))
      return { ...b, counts: newCounts }
    })
  }

  function updateCount(idx: number, field: keyof BriefCount, value: string) {
    setBrief((b) => {
      const newCounts = b.counts.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
      return { ...b, counts: newCounts }
    })
  }

  function toggleCount(idx: number) {
    setOpenCounts((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  async function saveBrief() {
    if (!post?.id) {
      setSaveMsg('Save the article first to get a post ID.')
      return
    }
    setSaving(true)
    setSaveMsg(null)
    const fd = new FormData()
    fd.append('id', String(post.id))
    fd.append('brief_data', JSON.stringify(brief))
    const result = await saveBriefDataAction(fd)
    setSaving(false)
    setSaveMsg(result.ok ? 'Brief saved.' : (result.error ?? 'Error'))
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 0,
        minHeight: 600,
        alignItems: 'start',
      }}
    >
      {/* Left: builder */}
      <div style={{ padding: '28px 32px', borderRight: `1px solid ${S.border}`, overflowY: 'auto' }}>
        {/* Verdict */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelBase}>Verdict</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {VERDICT_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVerdict(v)}
                style={{
                  fontFamily: S.mono,
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '5px 10px',
                  border: `1px solid ${brief.verdict === v ? S.accent : S.border}`,
                  background: brief.verdict === v ? S.accent : 'transparent',
                  color: brief.verdict === v ? '#fff' : S.muted,
                  cursor: 'pointer',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Counts */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelBase}>Counts ({brief.counts.length}/5)</label>
          {brief.counts.map((count, idx) => {
            const isOpen = openCounts.has(idx)
            return (
              <div
                key={idx}
                style={{
                  border: `1px solid ${S.border}`,
                  marginBottom: 8,
                  background: S.surface,
                }}
              >
                {/* Accordion header */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => toggleCount(idx)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: S.ink,
                    }}
                  >
                    <span style={{ fontFamily: S.mono, fontSize: 10, color: S.accent, minWidth: 20 }}>
                      {ROMAN[idx] ?? String(idx + 1)}.
                    </span>
                    <span style={{ fontFamily: S.serif, fontSize: 13, flex: 1 }}>
                      {count.title || 'Untitled count'}
                    </span>
                    <span style={{ fontFamily: S.mono, fontSize: 9, color: S.muted }}>
                      {isOpen ? '▴' : '▾'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCount(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: S.muted,
                      fontFamily: S.mono,
                      fontSize: 10,
                      padding: '10px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>

                {isOpen && (
                  <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${S.border}` }}>
                    {/* Title */}
                    <div style={{ marginBottom: 10, marginTop: 12 }}>
                      <label style={labelBase}>Title</label>
                      <input
                        type="text"
                        value={count.title}
                        onChange={(e) => updateCount(idx, 'title', e.target.value)}
                        placeholder="Count title…"
                        style={inputBase}
                      />
                    </div>

                    {/* Signal */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelBase}>Signal Level</label>
                      <select
                        value={count.signal}
                        onChange={(e) => updateCount(idx, 'signal', e.target.value)}
                        style={selectBase}
                      >
                        {SIGNAL_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Claim */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={labelBase}>Claim</label>
                      <textarea
                        value={count.claim}
                        onChange={(e) => updateCount(idx, 'claim', e.target.value)}
                        rows={3}
                        placeholder="The core claim…"
                        style={textareaBase}
                      />
                    </div>

                    {/* Proof block */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={labelBase}>Source</label>
                        <input
                          type="text"
                          value={count.src}
                          onChange={(e) => updateCount(idx, 'src', e.target.value)}
                          placeholder="e.g. 10-K FY24"
                          style={inputBase}
                        />
                      </div>
                      <div>
                        <label style={labelBase}>Key Figure</label>
                        <input
                          type="text"
                          value={count.value}
                          onChange={(e) => updateCount(idx, 'value', e.target.value)}
                          placeholder="e.g. $4.2B"
                          style={inputBase}
                        />
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div>
                      <label style={labelBase}>Interpretation</label>
                      <textarea
                        value={count.note}
                        onChange={(e) => updateCount(idx, 'note', e.target.value)}
                        rows={2}
                        placeholder="So what does this mean…"
                        style={textareaBase}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {brief.counts.length < 5 && (
            <button type="button" onClick={addCount} style={{ ...btnGhost, width: '100%', marginTop: 4 }}>
              + Add Count
            </button>
          )}
        </div>

        {/* Conclusion */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelBase}>Conclusion</label>
          <textarea
            value={brief.conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            rows={4}
            placeholder="Final synthesis…"
            style={textareaBase}
          />
        </div>

        {/* Save brief */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={saveBrief} disabled={saving} style={btnPrimary}>
            {saving ? 'Saving…' : 'Save Brief'}
          </button>
          {saveMsg && (
            <span style={{ fontFamily: S.mono, fontSize: 10, color: saveMsg.includes('saved') ? '#2d7a4f' : S.accent }}>
              {saveMsg}
            </span>
          )}
        </div>
      </div>

      {/* Right: live preview */}
      <div
        style={{
          background: S.bg,
          borderLeft: `1px solid ${S.border}`,
          padding: 16,
          position: 'sticky',
          top: 0,
          maxHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ fontFamily: S.mono, fontSize: 8, color: S.muted, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Live Preview
        </div>
        <TheBrief
          brief={brief}
          postTitle={post?.title ?? 'Untitled'}
          postSlug={post?.slug}
          variant="preview"
        />
      </div>
    </div>
  )
}

/* ─── Main PostForm component ─────────────────────────────── */

export function PostForm({
  message,
  mode,
  models,
  post,
  stances,
  topics,
}: PostFormProps) {
  const [activeTab, setActiveTab] = useState<'article' | 'brief'>('article')

  const tabStyle = (tab: 'article' | 'brief'): React.CSSProperties => ({
    fontFamily: S.mono,
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? S.accent : 'transparent'}`,
    color: activeTab === tab ? S.ink : S.muted,
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'color 0.1s, border-color 0.1s',
  })

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.ink }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 40px',
          borderBottom: `1px solid ${S.border}`,
          background: S.surface,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <button type="button" onClick={() => setActiveTab('article')} style={tabStyle('article')}>
            Article
          </button>
          <button type="button" onClick={() => setActiveTab('brief')} style={tabStyle('brief')}>
            Brief
          </button>
        </div>
        <Link
          href="/admin/posts"
          style={{
            fontFamily: S.mono,
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: S.muted,
            textDecoration: 'none',
          }}
        >
          ← Back
        </Link>
      </div>

      {/* Message banner */}
      {message ? (
        <div
          style={{
            padding: '10px 40px',
            background: message.tone === 'error' ? '#3a1414' : '#143a1d',
            color: S.ink,
            fontFamily: S.mono,
            fontSize: 11,
            borderBottom: `1px solid ${S.border}`,
          }}
        >
          {message.text}
        </div>
      ) : null}

      {/* The form wraps the Article tab so we can submit via server action */}
      {activeTab === 'article' ? (
        <form action={savePostAction}>
          {post ? <input type="hidden" name="id" value={String(post.id)} /> : null}
          <ArticleTab post={post} topics={topics} stances={stances} models={models} mode={mode} />
        </form>
      ) : (
        <BriefTab post={post} />
      )}
    </div>
  )
}
