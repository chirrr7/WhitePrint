"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { withMobilePreviewHref } from "@/lib/mobile-preview"

const MONO = '"JetBrains Mono", monospace'

const tabs = [
  { id: "home", label: "Home", href: "/", accent: "#f5f2eb" },
  { id: "equity", label: "Equity", href: "/equity", accent: "#b83025" },
  { id: "macro", label: "Macro", href: "/macro", accent: "#8a6c3a" },
  { id: "quant", label: "Quant", href: "/quant", accent: "#2d6ab8" },
  { id: "notes", label: "Notes", href: "/market-notes", accent: "#2d7a4f" },
] as const

function HomeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter">
      <path d="M3 9.5L10 3l7 6.5V17H13v-4h-6v4H3V9.5z" />
    </svg>
  )
}

function EquityIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square">
      <line x1="3" y1="16" x2="3" y2="10" />
      <line x1="8" y1="16" x2="8" y2="6" />
      <line x1="13" y1="16" x2="13" y2="9" />
      <line x1="18" y1="16" x2="18" y2="4" />
    </svg>
  )
}

function MacroIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square">
      <circle cx="10" cy="10" r="7" />
      <ellipse cx="10" cy="10" rx="3.5" ry="7" />
      <line x1="3" y1="10" x2="17" y2="10" />
    </svg>
  )
}

function QuantIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter">
      <polyline points="2,13 5,8 8,11 11,5 14,9 17,4" />
    </svg>
  )
}

function NotesIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square">
      <rect x="4" y="2" width="12" height="16" />
      <line x1="7" y1="7" x2="13" y2="7" />
      <line x1="7" y1="10" x2="13" y2="10" />
      <line x1="7" y1="13" x2="11" y2="13" />
    </svg>
  )
}

const ICONS = {
  home: HomeIcon,
  equity: EquityIcon,
  macro: MacroIcon,
  quant: QuantIcon,
  notes: NotesIcon,
} as const

function isTabActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function MobileNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const forceMobilePreview = searchParams.get("mobile") === "1"

  return (
    <>
      {/* Spacer so content isn't hidden behind the fixed nav */}
      <div className="mobile-only" style={{ height: 72 }} />
      {/* The actual nav — only visible on mobile */}
      <nav
        className="mobile-only-flex"
        style={{
          position: forceMobilePreview ? "absolute" : "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "0.5px solid rgba(0,0,0,0.1)",
          height: 72,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          justifyContent: "space-around",
          alignItems: "stretch",
        }}
        aria-label="Mobile navigation"
      >
        {tabs.map((tab) => {
          const isActive = isTabActive(pathname, tab.href)
          const Icon = ICONS[tab.id]
          const color = isActive ? tab.accent : "rgba(0,0,0,0.3)"

          return (
            <Link
              key={tab.href}
              href={withMobilePreviewHref(tab.href, forceMobilePreview)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "8px 4px",
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
                color,
                transition: "color 0.15s ease",
              }}
            >
              <Icon size={20} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color,
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
