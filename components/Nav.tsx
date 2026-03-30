"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const NAV_HEIGHT = 52
const HERO_PIPELINE_SENTINEL_ID = "pipeline-nav-sentinel"

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

    </header>
  )
}
