"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Home, LineChart, Search, Sigma } from "lucide-react"
import type React from "react"
import { withMobilePreviewHref } from "@/lib/mobile-preview"

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/stances", label: "Coverage", icon: LineChart },
  { href: "/search", label: "Search", icon: Search },
  { href: "/models", label: "Models", icon: Sigma },
]

const MONO = '"JetBrains Mono", monospace'

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
          background: "var(--mobile-chrome-bg)",
          borderTop: "1px solid var(--mobile-chrome-border)",
          padding:
            "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
          justifyContent: "space-around",
          alignItems: "center",
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
          const color = isActive
            ? "var(--mobile-chrome-fg)"
            : "var(--mobile-chrome-muted)"
          return (
            <Link
              key={tab.href}
              href={withMobilePreviewHref(tab.href, forceMobilePreview)}
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
