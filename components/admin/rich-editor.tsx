'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useEffect } from 'react'
import { tokens } from '@/lib/tokens'

interface RichEditorProps {
  initialContent: string
  onChange: (markdown: string) => void
}

/* ─── Design tokens (editor = dark admin theme) ─────────────── */
const E = {
  bg: tokens.bg,
  surface: tokens.surface,
  surfaceB: '#161514',
  ink: tokens.ink,
  muted: tokens.muted,
  border: tokens.border,
  accent: tokens.accent,
  mono: tokens.fontMono,
  serif: tokens.fontDisplay,
}

/* ─── Toolbar button base ────────────────────────────────────── */
const btn: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${E.border}`,
  color: E.ink,
  fontFamily: E.mono,
  fontSize: 10,
  padding: '4px 8px',
  cursor: 'pointer',
  borderRadius: 2,
  letterSpacing: '0.06em',
}

const btnActive: React.CSSProperties = {
  ...btn,
  background: E.accent,
  borderColor: E.accent,
  color: '#fff',
}

const divider: React.CSSProperties = {
  width: 1,
  height: 16,
  background: E.border,
  margin: 'auto 4px',
  flexShrink: 0,
}

/* ─── Table styles injected into the editor DOM ──────────────── */
const TABLE_CSS = `
  .ProseMirror table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0 28px;
    border: 1px solid rgba(245,242,235,0.10);
    font-size: 13px;
    table-layout: auto;
  }
  .ProseMirror table thead tr {
    background: #1a1816;
  }
  .ProseMirror table thead th {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(245,242,235,0.55);
    text-align: left;
    padding: 10px 14px;
    white-space: nowrap;
    border: 1px solid rgba(245,242,235,0.08);
    position: relative;
  }
  .ProseMirror table tbody td {
    padding: 10px 14px;
    line-height: 1.6;
    color: rgba(245,242,235,0.88);
    border: 1px solid rgba(245,242,235,0.07);
    vertical-align: top;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }
  .ProseMirror table tbody tr:nth-child(even) td {
    background: rgba(245,242,235,0.025);
  }
  .ProseMirror table tbody tr:hover td {
    background: rgba(245,242,235,0.05);
  }
  .ProseMirror table .selectedCell::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(184,48,37,0.18);
    pointer-events: none;
    z-index: 2;
  }
  .ProseMirror table td,
  .ProseMirror table th {
    position: relative;
  }
  .ProseMirror table .column-resize-handle {
    background: ${E.accent};
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 3px;
    pointer-events: none;
    z-index: 10;
  }
  .ProseMirror.resize-cursor {
    cursor: col-resize;
  }
`

export function RichEditor({ initialContent, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
      Markdown,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange((editor.storage as any).markdown.getMarkdown())
    },
  })

  useEffect(() => {
    if (!editor) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = (editor.storage as any).markdown.getMarkdown()
    if (initialContent !== current) {
      editor.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  if (!editor) return null

  /* ── helpers ── */
  function Btn({
    label,
    action,
    active,
    extra,
    title,
  }: {
    label: string
    action: () => void
    active?: boolean
    extra?: React.CSSProperties
    title?: string
  }) {
    return (
      <button
        type="button"
        title={title}
        onMouseDown={(e) => e.preventDefault()}
        onClick={action}
        style={{ ...(active ? btnActive : btn), ...extra }}
      >
        {label}
      </button>
    )
  }

  function setLink() {
    const url = window.prompt('URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
    else editor.chain().focus().unsetLink().run()
  }

  const inTable = editor.isActive('table')

  return (
    <>
      {/* Inject table styles once */}
      <style>{TABLE_CSS}</style>

      <div style={{ background: E.bg, border: `1px solid ${E.border}` }}>
        {/* ── Toolbar ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 4,
            padding: '8px 12px',
            background: E.surfaceB,
            borderBottom: `1px solid ${E.border}`,
          }}
        >
          {/* Text formatting */}
          <Btn label="B" action={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} extra={{ fontWeight: 700 }} />
          <Btn label="I" action={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} extra={{ fontStyle: 'italic' }} />

          <div style={divider} />

          {/* Headings */}
          <Btn label="H2" action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} />
          <Btn label="H3" action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} />

          <div style={divider} />

          {/* Lists */}
          <Btn label="• List" action={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} />
          <Btn label="1. List" action={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} />

          <div style={divider} />

          {/* Blocks */}
          <Btn label='" Quote' action={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} />
          <Btn label="{} Code" action={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} />
          <Btn label="↗ Link" action={setLink} active={editor.isActive('link')} />

          <div style={divider} />

          {/* Table controls */}
          {!inTable ? (
            <Btn
              label="+ Table"
              title="Insert a 3×3 table with header row"
              action={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            />
          ) : (
            <>
              <span style={{ fontFamily: E.mono, fontSize: 9, color: E.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 2 }}>Table:</span>
              <Btn label="+ Row ↓" title="Add row below" action={() => editor.chain().focus().addRowAfter().run()} />
              <Btn label="− Row" title="Delete current row" action={() => editor.chain().focus().deleteRow().run()} />
              <Btn label="+ Col →" title="Add column right" action={() => editor.chain().focus().addColumnAfter().run()} />
              <Btn label="− Col" title="Delete current column" action={() => editor.chain().focus().deleteColumn().run()} />
              <Btn label="Merge" title="Merge selected cells" action={() => editor.chain().focus().mergeOrSplit().run()} />
              <Btn label="Header" title="Toggle header cell" action={() => editor.chain().focus().toggleHeaderCell().run()} active={editor.isActive('tableHeader')} />
              <Btn label="✕ Table" title="Delete entire table" action={() => editor.chain().focus().deleteTable().run()} extra={{ color: '#b83025', borderColor: '#b83025' }} />
            </>
          )}

          <div style={{ marginLeft: 'auto' }} />
          <Btn label="✕ Clear" action={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
        </div>

        {/* ── Editor body ── */}
        <EditorContent
          editor={editor}
          style={{
            minHeight: 500,
            padding: '24px 40px',
            color: E.ink,
            fontFamily: E.mono,
            fontSize: 13,
            lineHeight: 1.95,
            outline: 'none',
          }}
        />
      </div>
    </>
  )
}
