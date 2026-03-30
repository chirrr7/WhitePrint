'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname } from 'next/navigation'
import { MobileHeader } from '@/components/mobile-header'
import { MobileNav } from '@/components/mobile-nav'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StancesTicker } from '@/components/StancesTicker'
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
        <SiteHeader />
        <StancesTicker stances={stances} />
      </div>
      <MobileHeader />
      <main>{children}</main>
      <div className="desktop-only">
        <SiteFooter />
      </div>
      <MobileNav />
      <Analytics />
    </>
  )
}
