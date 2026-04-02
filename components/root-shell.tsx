'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname, useSearchParams } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { MobileHeader } from '@/components/mobile-header'
import { MobileNav } from '@/components/mobile-nav'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'

interface RootShellProps {
  children: React.ReactNode
}

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAdminRoute = pathname.startsWith('/admin')
  const forceMobilePreview = searchParams.get('mobile') === '1'

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
      <div className={forceMobilePreview ? 'force-mobile-preview mobile-preview-shell' : undefined}>
        <div className={forceMobilePreview ? 'mobile-preview-phone' : undefined}>
          <div className="desktop-only">
            <Nav />
          </div>
          <ScrollReveal />
          <MobileHeader />
          <main className={forceMobilePreview ? 'mobile-preview-main' : undefined}>{children}</main>
          <div className="desktop-only">
            <Footer />
          </div>
          <MobileNav />
        </div>
      </div>
      <Analytics />
    </>
  )
}
