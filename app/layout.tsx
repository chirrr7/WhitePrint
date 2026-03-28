import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { StancesTicker } from '@/components/StancesTicker'
import { getStances } from '@/lib/stances'
import { SEO_CONFIG } from '@/lib/seo.config'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MobileNav } from '@/components/mobile-nav'
import { MobileHeader } from '@/components/mobile-header'
import './globals.css'
import '@/styles/mobile.css'

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: 'Whiteprint Research',
    template: '%s — Whiteprint Research',
  },
  description: SEO_CONFIG.siteDescription,
  openGraph: {
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-light-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const stances = getStances()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#f7f6f3' }}>
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
      </body>
    </html>
  )
}
