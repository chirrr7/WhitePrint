'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { MobileHeader } from '@/components/mobile-header'
import { MobileNav } from '@/components/mobile-nav'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import type { Stance } from '@/lib/stances'

interface RootShellProps {
  children: React.ReactNode
  stances: Stance[]
}

export function RootShell({ children, stances }: RootShellProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <main>{children}</main>
        <Analytics />
      </>
    )
  }

  return (
    <>
      <div className="desktop-only">
        <Nav />
      </div>
      <ScrollReveal />
      <MobileHeader />
      <main>{children}</main>
      <div className="desktop-only">
        <Footer />
      </div>
      <MobileNav />
      <Analytics />
    </>
  )
}
