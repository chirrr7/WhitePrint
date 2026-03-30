import type { Metadata } from "next"
import { headers } from "next/headers"
import { HeroSection } from "@/components/HeroSection"
import { MobileHome } from "@/components/mobile-home"
import { PipelineDocket } from "@/components/PipelineDocket"
import { ResearchSection } from "@/components/ResearchSection"
import { StancesTicker } from "@/components/StancesTicker"
import { getAllPosts } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import { getStances } from "@/lib/stances"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: {
    absolute: "Whiteprint Research — Independent Macro & Equity Research",
  },
  description: SEO_CONFIG.siteDescription,
  alternates: {
    canonical: SEO_CONFIG.siteUrl,
  },
}

export default async function HomePage() {
  const userAgent = (await headers()).get("user-agent") ?? ""
  const isMobileRequest = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent,
  )

  let featuredPost = null
  let deskBriefPosts: Awaited<ReturnType<typeof getAllPosts>> = []
  let stances: ReturnType<typeof getStances> = []

  if (isMobileRequest) {
    const [allPosts, mobileStances] = await Promise.all([getAllPosts(), getStances()])
    featuredPost = allPosts.find((post) => post.category !== "market-notes") ?? allPosts[0] ?? null
    deskBriefPosts = allPosts.filter((post) => post.category !== "market-notes").slice(0, 3)
    stances = mobileStances
  }

  return (
    <>
      {isMobileRequest && featuredPost ? (
        <MobileHome featured={featuredPost} briefs={deskBriefPosts} stances={stances} />
      ) : null}

      <div className="desktop-only">
        <HeroSection />
        <StancesTicker stances={stances} />
        <PipelineDocket />
        <ResearchSection />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SEO_CONFIG.siteName,
            url: SEO_CONFIG.siteUrl,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
