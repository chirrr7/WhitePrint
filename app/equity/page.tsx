import type { Metadata } from "next"
import { getPostsByCategory } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import { CategoryPage } from "@/components/category-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Equity Research",
  description:
    "Institutional-quality equity research with scenario analysis, DCF frameworks, and valuation cross-checks.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/equity`,
  },
}

export default async function EquityPage() {
  const posts = await getPostsByCategory("equity")
  return (
    <CategoryPage
      title="Equity Research"
      description="Company analysis, valuation frameworks, and sector-level views on public equities."
      posts={posts}
    />
  )
}
