import type { Metadata } from "next"
import { MarketNoteTemplate } from "@/components/market-note-template"
import { SEO_CONFIG } from "@/lib/seo.config"

const post = {
  slug: "fed-decision-week-three-things-to-watch",
  title: "Fed Decision Week: Three Things to Watch",
  excerpt:
    "The Federal Reserve meets March 17-18. Rates are likely on hold, but policy tone could shape risk appetite for months.",
  date: "2026-03-10",
  tags: ["fed", "macro", "rates", "energy", "inflation"],
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

export default function FedDecisionWeekMarketNotePage() {
  return (
    <>
      <MarketNoteTemplate
        title={post.title}
        deck="The Federal Reserve meets March 17-18. Rates are not moving, but the message from this meeting could set the tone for markets into the second quarter."
        date={post.date}
        readTime={3}
        tags={[...post.tags]}
        summaryTable={{
          stance: "Cautious / Wait-and-See",
          confidence: "Medium-High",
          horizon: "1-4 weeks",
          quickAnswer:
            "Expect a hold, but trade the tone: the dot plot, energy inflation risk, and the leadership handover matter more than the rate decision itself.",
          whatChangesOurMind:
            "A softer dot plot, cleaner disinflation, and fading energy pressure would make this look more like a routine pause than a regime signal.",
        }}
        lede="The base case is straightforward: no rate move. The harder question is how restrictive the Fed sounds while inflation remains above target and energy markets stay unstable. This meeting matters because tone, not action, is likely to drive the next leg of cross-asset positioning."
        whyMarketsCare="Markets can absorb a hold. What they struggle with is a policy message that pushes cuts further out while growth data softens. If the Fed emphasizes inflation persistence, risk assets may struggle to extend. If language leaves room for easing later in the year, sentiment can recover quickly."
        signals={[
          {
            title: "Dot plot direction.",
            text: "A shift toward fewer projected cuts in 2026 would reinforce a higher-for-longer policy path.",
          },
          {
            title: "Energy pass-through.",
            text: "Any sign that energy pressure is feeding into inflation would reduce the Fed's flexibility.",
          },
          {
            title: "Leadership transition tone.",
            text: "Messaging around the Chair transition will matter for confidence in policy continuity.",
          },
        ]}
        bottomLine="The policy rate is likely unchanged. The market-moving variable is whether the Fed sounds willing to ease later this year or signals a longer restrictive stretch."
        disclaimer="This Market Note is for informational purposes only and does not constitute investment advice."
        companionHref="/posts/liquidity-squeeze-fed-march-2026"
        companionTitle="Companion to Full Research"
        companionText="For the complete framework, read the long-form Whiteprint macro report covering liquidity mechanics, regime scenarios, and sector implications."
      />
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
