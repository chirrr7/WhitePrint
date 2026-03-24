import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SEO_CONFIG } from "@/lib/seo.config"
import { LiquiditySqueezeArticle } from "./article"

const post = {
  slug: "liquidity-squeeze-fed-march-2026",
  title: "Navigating the Liquidity Squeeze: Equity Positioning Ahead of Fed Decision Week",
  excerpt:
    "The FOMC convenes March 17-18 against a backdrop of residual funding market strain, a pending leadership transition, and a late-February geopolitical escalation in the Middle East.",
  date: "2026-03-10",
  tags: ["macro", "equity", "rates", "fed", "liquidity", "positioning", "factor-investing"],
} as const

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/posts/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.excerpt,
    url: `${SEO_CONFIG.siteUrl}/posts/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    tags: [...post.tags],
    siteName: SEO_CONFIG.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.excerpt,
  },
}

export default function LiquiditySqueezePage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-4">
        <Link
          href="/macro"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Macro
        </Link>
      </div>
      <LiquiditySqueezeArticle />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: SEO_CONFIG.siteName,
              url: SEO_CONFIG.siteUrl,
            },
            publisher: {
              "@type": "Organization",
              name: SEO_CONFIG.siteName,
              url: SEO_CONFIG.siteUrl,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SEO_CONFIG.siteUrl}/posts/${post.slug}`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
