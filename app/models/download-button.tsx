"use client"

const MONO = '"JetBrains Mono", monospace'
const INK = "#0a0a0a"
const ACCENT = "#b83025"

export function DownloadButton({ href, filename }: { href: string; filename: string }) {
  return (
    <a
      href={href}
      download={filename}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: MONO,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        background: INK,
        color: "#fff",
        padding: "11px 22px",
        fontSize: 9,
        fontWeight: 500,
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.background = ACCENT
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.background = INK
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download
    </a>
  )
}
