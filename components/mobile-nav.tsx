"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  TrendingUp,
  FileSpreadsheet,
  Newspaper,
  Search,
} from "lucide-react"
import type React from "react"

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/macro", label: "Research", icon: TrendingUp },
  { href: "/models", label: "Models", icon: FileSpreadsheet },
  { href: "/market-notes", label: "Notes", icon: Newspaper },
  { href: "/search", label: "Search", icon: Search },
]

const MONO = '"JetBrains Mono", monospace'

const navStyle: React.CSSProperties = {
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
  padding: "6px 0 calc(6px + env(safe-area-inset-bottom, 0px))",
}

const tabStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  padding: "8px 12px",
  textDecoration: "none",
  WebkitTapHighlightColor: "transparent",
  transition: "color 0.15s",
}

const labelStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 9,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Spacer so content isn't hidden behind the fixed nav */}
      <div className="md:hidden" style={{ height: 68 }} />
      {/* The actual nav — only visible on mobile */}
      <nav className="md:hidden" style={navStyle} aria-label="Mobile navigation">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href + "/")
          const Icon = tab.icon
          const color = isActive ? "#fff" : "rgba(255,255,255,0.35)"
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{ ...tabStyle, color }}
            >
              <Icon
                style={{ width: 20, height: 20 }}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              <span style={{ ...labelStyle, color }}>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
