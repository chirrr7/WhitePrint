"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"
import { withMobilePreviewHref } from "@/lib/mobile-preview"

const MONO = '"JetBrains Mono", monospace'
const DISPLAY = '"Playfair Display", Georgia, serif'

export function MobileHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const forceMobilePreview = searchParams.get("mobile") === "1"

  return (
    <div className="mobile-only">
      {/* Spacer for fixed header */}
      <div style={{ height: 44 }} />

      {/* Fixed compact bar */}
      <header
        style={{
          position: forceMobilePreview ? "absolute" : "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          background: "var(--mobile-chrome-bg)",
          borderBottom: "1px solid var(--mobile-chrome-border)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          height: 44,
        }}
      >
        <Link
          href={withMobilePreviewHref("/", forceMobilePreview)}
          style={{
            textDecoration: "none",
            WebkitTapHighlightColor: "transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: DISPLAY,
              fontSize: 15,
              fontWeight: 700,
              color: "var(--mobile-chrome-fg)",
              lineHeight: 1,
            }}
          >
            Whiteprint{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              Research
            </em>
          </span>
        </Link>

        {/* Dedicated Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "var(--mobile-chrome-fg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <div style={{ width: 20, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 1.5, background: "currentColor", width: "100%" }} />
            <div style={{ height: 1.5, background: "currentColor", width: "100%" }} />
          </div>
        </button>
      </header>

      {/* Full-screen overlay */}
      {open && (
        <div
          style={{
            position: forceMobilePreview ? "absolute" : "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: "var(--mobile-chrome-bg)",
            display: "flex",
            flexDirection: "column",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 48,
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 15,
                fontWeight: 700,
                color: "var(--mobile-chrome-fg)",
              }}
            >
              Whiteprint{" "}
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
                Research
              </em>
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--mobile-chrome-muted)",
                padding: 8,
              }}
              aria-label="Close menu"
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/search", label: "Search" },
              { href: "/stances", label: "Coverage" },
              { href: "/models", label: "Models" },
            ].map((link) => (
              <Link
                key={link.href}
                href={withMobilePreviewHref(link.href, forceMobilePreview)}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:
                    pathname === link.href
                      ? "var(--mobile-chrome-fg)"
                      : "var(--mobile-chrome-muted)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              marginTop: "auto",
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--mobile-chrome-subtle)",
            }}
          >
            Independent Macro &amp; Equity Research
          </div>
        </div>
      )}
    </div>
  )
}
