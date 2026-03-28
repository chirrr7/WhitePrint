"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, BarChart3, Newspaper } from "lucide-react"
import type React from "react"

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/equity", label: "Equity", icon: TrendingUp },
  { href: "/macro", label: "Macro", icon: BarChart3 },
  { href: "/market-notes", label: "Notes", icon: Newspaper },
]

const MONO = '"JetBrains Mono", monospace'

export function MobileNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Spacer so content isn't hidden behind the fixed nav */}
      <div className="mobile-only" style={{ height: 72 }} />
      {/* The actual nav — only visible on mobile */}
      <nav
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "#0a0a0a",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding:
            "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
        }}
        aria-label="Mobile navigation"
      >
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href ||
                pathname.startsWith(tab.href + "/")
          const Icon = tab.icon
          const color = isActive ? "#fff" : "rgba(255,255,255,0.35)"
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "10px 16px",
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
                transition: "color 0.15s",
                color,
              }}
            >
              <Icon
                style={{ width: 22, height: 22 }}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color,
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
