"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const NAV_HEIGHT = 52
const HERO_PIPELINE_SENTINEL_ID = "pipeline-nav-sentinel"

const navItems = [
  { href: "/research", label: "Research" },
  { href: "/#pipeline", label: "In Progress" },
  { href: "/stances", label: "Stances" },
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
    return pathname === "/research"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
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
          {navItems.map((item) => {
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

      <style jsx>{`
        .wp-nav {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 36px;
          height: 52px;
          padding: 0 48px;
          border-bottom: 1px solid transparent;
          transition:
            background 0.4s ease,
            border-color 0.4s ease,
            color 0.3s ease,
            backdrop-filter 0.4s ease,
            -webkit-backdrop-filter 0.4s ease;
        }

        .wp-nav.over-hero {
          background: transparent;
        }

        .wp-nav.scrolled {
          background: rgba(10, 10, 10, 0.94);
          border-bottom-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .wp-nav.over-light {
          background: rgba(250, 249, 247, 0.96);
          border-bottom-color: var(--border);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .wp-nav-logo {
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--font-display-family), Georgia, serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .wp-nav.over-light .wp-nav-logo {
          color: var(--ink);
        }

        .wp-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .wp-nav-link {
          color: rgba(255, 255, 255, 0.3);
          font-family: var(--font-mono-family), monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          line-height: 1;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }

        .wp-nav-link:hover,
        .wp-nav-link.is-active {
          color: rgba(255, 255, 255, 0.75);
        }

        .wp-nav.over-light .wp-nav-link {
          color: var(--subtle);
        }

        .wp-nav.over-light .wp-nav-link:hover,
        .wp-nav.over-light .wp-nav-link.is-active {
          color: var(--ink);
        }

        .wp-nav-right {
          margin-left: auto;
          color: rgba(255, 255, 255, 0.18);
          font-family: var(--font-mono-family), monospace;
          font-size: 8px;
          letter-spacing: 0.16em;
          line-height: 1;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .wp-nav.over-light .wp-nav-right {
          color: var(--subtle);
        }

        @media (max-width: 1200px) {
          .wp-nav {
            padding: 0 32px;
          }
        }
      `}</style>
    </header>
  )
}
