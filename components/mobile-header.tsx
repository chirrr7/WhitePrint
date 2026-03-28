"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"

const MONO = '"JetBrains Mono", monospace'
const DISPLAY = '"Playfair Display", Georgia, serif'

export function MobileHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="mobile-only">
      {/* Spacer for fixed header */}
      <div style={{ height: 44 }} />

      {/* Fixed compact bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          background: "#0a0a0a",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          height: 44,
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            style={{
              fontFamily: DISPLAY,
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            Whiteprint{" "}
            <em style={{ color: "#b83025", fontStyle: "italic" }}>Research</em>
          </span>
        </button>
      </header>

      {/* Full-screen overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: "#0a0a0a",
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
                color: "#fff",
              }}
            >
              Whiteprint{" "}
              <em style={{ color: "#b83025", fontStyle: "italic" }}>
                Research
              </em>
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.5)",
                padding: 8,
              }}
              aria-label="Close menu"
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { href: "/about", label: "About" },
              { href: "/search", label: "Search" },
              { href: "/stances", label: "Coverage" },
              { href: "/models", label: "Models" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:
                    pathname === link.href
                      ? "#fff"
                      : "rgba(255,255,255,0.4)",
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
              color: "rgba(255,255,255,0.12)",
            }}
          >
            Independent Macro &amp; Equity Research
          </div>
        </div>
      )}
    </div>
  )
}
