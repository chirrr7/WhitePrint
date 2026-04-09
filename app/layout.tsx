import type { Metadata } from 'next'
import { Suspense } from 'react'
import { JetBrains_Mono, Playfair_Display, Source_Serif_4 } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RootShell } from '@/components/root-shell'
import { getPublicGeneralSettings } from '@/lib/public-site'
import { SEO_CONFIG } from '@/lib/seo.config'
import './globals.css'
import '@/styles/mobile.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicGeneralSettings()

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: {
      default: settings.siteTitle,
      template: `%s - ${settings.siteTitle}`,
    },
    description: settings.siteDescription,
    openGraph: {
      type: 'website',
      siteName: settings.siteTitle,
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f7f6f3"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0c0c0d"
        />
        <meta name="color-scheme" content="light dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={<main>{children}</main>}>
          <RootShell>{children}</RootShell>
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  )
}
