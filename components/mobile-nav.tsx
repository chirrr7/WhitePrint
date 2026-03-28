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

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/macro", label: "Research", icon: TrendingUp },
  { href: "/models", label: "Models", icon: FileSpreadsheet },
  { href: "/market-notes", label: "Notes", icon: Newspaper },
  { href: "/search", label: "Search", icon: Search },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname === tab.href || pathname.startsWith(tab.href + "/")
        const Icon = tab.icon
        return (
          <Link key={tab.href} href={tab.href} className={`mobile-bottom-tab${isActive ? " mobile-bottom-tab--active" : ""}`}>
            <Icon className="mobile-bottom-icon" strokeWidth={isActive ? 2.2 : 1.5} />
            <span className="mobile-bottom-label">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
