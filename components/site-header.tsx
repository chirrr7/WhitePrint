"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import type React from "react"

const navLinks = [
  { href: "/macro", label: "Macro" },
  { href: "/equity", label: "Equity Research" },
  { href: "/models", label: "Models" },
  { href: "/market-notes", label: "Market Notes" },
  { href: "/about", label: "About" },
]

const MONO = '"JetBrains Mono", monospace'
const DISPLAY = '"Playfair Display", Georgia, serif'

const navLinkStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  textDecoration: "none",
  transition: "color 0.15s",
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = pathname === "/"

  return (
    <header
      style={{
        background: "#0a0a0a",
        borderBottom: isHome ? "2px solid #b83025" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 40px",
          minHeight: isHome ? 72 : 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Wordmark */}
        <div>
          <Link
            href="/"
            style={{
              fontFamily: DISPLAY,
              fontSize: isHome ? "clamp(22px, 3vw, 34px)" : 17,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              display: "block",
              lineHeight: 1.1,
            }}
          >
            Whiteprint <em style={{ color: "#b83025", fontStyle: "italic" }}>Research</em>
          </Link>
          {isHome && (
            <div
              style={{
                fontFamily: MONO,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontSize: 9,
                marginTop: 6,
              }}
            >
              Independent Macro &amp; Equity Research
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          {isHome && (
            <div
              style={{
                fontFamily: MONO,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
                fontSize: 9,
              }}
            >
              Vol. I · No. 3
            </div>
          )}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: 24 }} aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={active}
                  style={navLinkStyle}
                >
                  {link.label}
                </NavLink>
              )
            })}
            <NavLink href="/search" active={false} style={navLinkStyle} dim>
              Search
            </NavLink>
          </nav>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          style={{ color: "#fff", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "#0a0a0a",
            padding: "16px 40px",
          }}
          aria-label="Mobile navigation"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ ...navLinkStyle, color: "rgba(255,255,255,0.6)" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              style={{ ...navLinkStyle, color: "rgba(255,255,255,0.4)" }}
            >
              Search
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

function NavLink({
  href,
  active,
  style,
  dim,
  children,
}: {
  href: string
  active: boolean
  style: React.CSSProperties
  dim?: boolean
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const color = hovered ? "#fff" : active ? "#fff" : dim ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.5)"
  return (
    <Link
      href={href}
      style={{ ...style, color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}
