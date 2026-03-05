import React from "react"

function parseMarkdown(md: string): string {
  let html = md
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />')
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
  
  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[\s-:|]+\|)\n((?:\|.+\|\n?)+)/gm, (_match, header: string, _sep: string, body: string) => {
    const headers = header.split('|').filter((c: string) => c.trim()).map((c: string) => `<th class="text-left py-2 px-3 border-b border-border font-medium text-sm">${c.trim()}</th>`)
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="py-2 px-3 border-b border-border text-sm">${c.trim()}</td>`)
      return `<tr>${cells.join('')}</tr>`
    })
    return `<table class="w-full my-6 border-collapse"><thead><tr>${headers.join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`
  })

  // Unordered lists
  html = html.replace(/^(\n?)((?:- .+\n?)+)/gm, (_match, _prefix, list: string) => {
    const items = list.trim().split('\n').map((item: string) => `<li>${item.replace(/^- /, '')}</li>`)
    return `<ul>${items.join('')}</ul>`
  })

  // Ordered lists
  html = html.replace(/^(\n?)((?:\d+\. .+\n?)+)/gm, (_match, _prefix, list: string) => {
    const items = list.trim().split('\n').map((item: string) => `<li>${item.replace(/^\d+\. /, '')}</li>`)
    return `<ol>${items.join('')}</ol>`
  })

  // Paragraphs
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<table')
      ) {
        return trimmed
      }
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')

  return html
}

export function PostBody({ content }: { content: string }) {
  const html = parseMarkdown(content)
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
