import type { Metadata } from "next"
import { HeroSection } from "@/components/HeroSection"
import { MobileHome } from "@/components/mobile-home"
import { PipelineDocket } from "@/components/PipelineDocket"
import { ResearchSection } from "@/components/ResearchSection"
import { StancesTicker } from "@/components/StancesTicker"
import { isMobilePreviewEnabled } from "@/lib/mobile-preview"
import { getPublicGeneralSettings, getHomepageContentData } from "@/lib/public-site"
import { SEO_CONFIG } from "@/lib/seo.config"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicGeneralSettings()

  return {
    title: {
      absolute: `${settings.siteTitle} - Independent Macro & Equity Research`,
    },
    description: settings.siteDescription,
    alternates: {
      canonical: SEO_CONFIG.siteUrl,
    },
  }
}

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const forceMobilePreview = isMobilePreviewEnabled(resolvedSearchParams.mobile)
  
  const [generalSettings, homepageData] = await Promise.all([
    getPublicGeneralSettings(),
    getHomepageContentData(),
  ])

  return (
    <>
      {homepageData.leadPost ? (
        <MobileHome
          briefs={homepageData.mobileBriefPosts}
          featured={homepageData.leadPost}
          forceMobilePreview={forceMobilePreview}
          heroLabel={homepageData.settings.heroLabel}
          showDeskBriefs={homepageData.settings.showDeskBriefs}
          showStances={homepageData.settings.showStances}
          stances={homepageData.stances}
        />
      ) : null}

      <div className="desktop-only">
        <HeroSection />
        {homepageData.settings.showStances ? <StancesTicker stances={homepageData.stances} /> : null}
        <PipelineDocket />
        <ResearchSection
          deskBriefs={homepageData.deskBriefItems}
          featured={homepageData.featuredPost}
          latest={homepageData.latestPosts}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: generalSettings.siteTitle,
            url: SEO_CONFIG.siteUrl,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
