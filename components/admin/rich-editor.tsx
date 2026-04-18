'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { useEffect } from 'react'
import { tokens } from '@/lib/tokens'

interface RichEditorProps {
  initialContent: string
  onChange: (markdown: string) => void
}

const S = {
  bg: tokens.bg,
  surface: tokens.surface,
  surfaceB: '#161514',
  ink: tokens.ink,
  muted: tokens.muted,
  border: tokens.border,
  accent: tokens.accent,
  mono: tokens.fontMono,
}

const toolbarBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${S.border}`,
  color: S.ink,
  fontFamily: S.mono,
  fontSize: 10,
  padding: '4px 8px',
  cursor: 'pointer',
  borderRadius: 2,
}

export function RichEditor({ initialContent, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
      Markdown,
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

  function btn(label: string, action: () => void, extra?: React.CSSProperties) {
    return (
      <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={action} style={{ ...toolbarBtnStyle, ...extra }}>
        {label}
      </button>
    )
  }

  function setLink() {
    const url = window.prompt('URL:')
    if (url) editor!.chain().focus().setLink({ href: url }).run()
    else editor!.chain().focus().unsetLink().run()
  }

  return (
    <div style={{ background: S.bg, border: `1px solid ${S.border}` }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 12px', background: S.surfaceB, borderBottom: `1px solid ${S.border}` }}>
        {btn('B', () => editor.chain().focus().toggleBold().run(), { fontWeight: 700 })}
        {btn('I', () => editor.chain().focus().toggleItalic().run(), { fontStyle: 'italic' })}
        {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        {btn('• List', () => editor.chain().focus().toggleBulletList().run())}
        {btn('1. List', () => editor.chain().focus().toggleOrderedList().run())}
        {btn('" Quote', () => editor.chain().focus().toggleBlockquote().run())}
        {btn('{} Code', () => editor.chain().focus().toggleCodeBlock().run())}
        {btn('↗ Link', setLink)}
        {btn('✕ Clear', () => editor.chain().focus().clearNodes().unsetAllMarks().run())}
      </div>

      {/* Editor body */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: 500,
          padding: '24px 40px',
          color: S.ink,
          fontFamily: S.mono,
          fontSize: 13,
          lineHeight: 1.95,
          outline: 'none',
        }}
      />
    </div>
  )
}
