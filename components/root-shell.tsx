'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Footer } from '@/components/Footer'
import { MobileHeader } from '@/components/mobile-header'
import { MobileNav } from '@/components/mobile-nav'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import NextTopLoader from 'nextjs-toploader';

interface RootShellProps {
  children: React.ReactNode
}

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const isAdminRoute = pathname.startsWith('/admin')
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const forceMobilePreview = mounted && searchParams.get('mobile') === '1'
  const forceDark = mounted && searchParams.get('dark') === '1'

  useEffect(() => {
    if (forceDark) {
      document.documentElement.classList.add('force-dark', 'dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('force-dark', 'dark')
      document.documentElement.style.colorScheme = ''
    }
    return () => {
      document.documentElement.classList.remove('force-dark', 'dark')
      document.documentElement.style.colorScheme = ''
    }
  }, [forceDark])

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
      <NextTopLoader 
        color="var(--accent)" 
        showSpinner={false} 
        height={2} 
        shadow="0 0 10px var(--accent),0 0 5px var(--accent)" 
      />
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
