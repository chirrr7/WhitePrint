"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"

const NAV_HEIGHT = 52
const HERO_PIPELINE_SENTINEL_ID = "pipeline-nav-sentinel"

const researchLinks = [
  { href: "/equity", label: "Equity", accent: "#b83025" },
  { href: "/macro", label: "Macro", accent: "#8a6c3a" },
  { href: "/quant", label: "Quant", accent: "#2d6ab8" },
  { href: "/market-notes", label: "Market Notes", accent: "#2d7a4f" },
] as const

const navItems = [
  { href: "/research", label: "Research" },
  { href: "/#pipeline", label: "In Progress" },
  { href: "/stances", label: "Coverage" },
  { href: "/about", label: "About" },
] as const

type NavTheme = "over-hero" | "scrolled" | "over-light"

function getTheme(pathname: string, isOverLight: boolean, hasScrolled: boolean): NavTheme {
  if (pathname !== "/") {
    return "over-light"
  }

  if (isOverLight) {
    return "over-light"
  }

  return hasScrolled ? "scrolled" : "over-hero"
}

function isActivePath(pathname: string, href: string) {
  if (href === "/#pipeline") {
    return pathname === "/"
  }

  if (href === "/research") {
    return (
      pathname === "/research" ||
      pathname.startsWith("/equity") ||
      pathname.startsWith("/macro") ||
      pathname.startsWith("/quant") ||
      pathname.startsWith("/market-notes")
    )
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function ResearchDropdown({ theme }: { theme: NavTheme }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isActive =
    pathname.startsWith("/equity") ||
    pathname.startsWith("/macro") ||
    pathname.startsWith("/quant") ||
    pathname.startsWith("/market-notes") ||
    pathname === "/research"

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const isDark = theme === "over-hero"

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`wp-nav-link${isActive ? " is-active" : ""}`}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        Research
        <svg
          width="7"
          height="5"
          viewBox="0 0 7 5"
          fill="none"
          style={{
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.6,
          }}
        >
          <path d="M1 1L3.5 3.5L6 1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: 180,
            background: isDark ? "rgba(10,10,10,0.97)" : "rgba(250,249,247,0.98)",
            border: "1px solid rgba(245,242,235,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            zIndex: 300,
            padding: "4px 0",
          }}
        >
          {researchLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  textDecoration: "none",
                  transition: "background 0.12s ease",
                  background: active ? "rgba(245,242,235,0.04)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,242,235,0.06)"
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = active
                    ? "rgba(245,242,235,0.04)"
                    : "transparent"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 12,
                    background: link.accent,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: active
                      ? link.accent
                      : isDark
                        ? "rgba(245,242,235,0.65)"
                        : "rgba(15,15,15,0.7)",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Nav() {
  const pathname = usePathname()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isOverLight, setIsOverLight] = useState(pathname !== "/")

  useEffect(() => {
    if (pathname !== "/") {
      setHasScrolled(false)
      setIsOverLight(true)
      return
    }

    let frameId = 0
    let observer: IntersectionObserver | null = null

    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 24)
    }

    const attachObserver = () => {
      const sentinel = document.getElementById(HERO_PIPELINE_SENTINEL_ID)

      if (!sentinel) {
        frameId = window.requestAnimationFrame(attachObserver)
        return
      }

      const syncLightState = () => {
        const rect = sentinel.getBoundingClientRect()
        setIsOverLight(rect.top <= NAV_HEIGHT)
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsOverLight(entry.boundingClientRect.top <= NAV_HEIGHT && !entry.isIntersecting)
        },
        {
          threshold: 0,
          rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
        },
      )

      observer.observe(sentinel)
      syncLightState()
    }

    updateScrollState()
    setIsOverLight(false)
    window.addEventListener("scroll", updateScrollState, { passive: true })
    attachObserver()

    return () => {
      window.removeEventListener("scroll", updateScrollState)
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      observer?.disconnect()
    }
  }, [pathname])

  const theme = getTheme(pathname, isOverLight, hasScrolled)

  return (
    <header className="desktop-only">
      <nav className={`wp-nav ${theme}`} aria-label="Primary">
        <Link href="/" className="wp-nav-logo">
          Whiteprint
        </Link>

        <div className="wp-nav-links">
          <ResearchDropdown theme={theme} />
          {navItems
            .filter((item) => item.label !== "Research")
            .map((item) => {
              const active = isActivePath(pathname, item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`wp-nav-link${active ? " is-active" : ""}`}
                >
                  {item.label}
                </Link>
              )
            })}
        </div>

        <span className="wp-nav-right">whiteprintresearch.xyz</span>
      </nav>
    </header>
  )
}
