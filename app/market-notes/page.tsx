import type { Metadata } from "next"
import { getPostsByCategory } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Market Notes",
  description:
    "Short-form market notes on rates, equities, and macro developments.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/market-notes`,
  },
}

export default function MarketNotesPage() {
  const posts = getPostsByCategory("market-notes")
  return (
    <CategoryPage
      title="Market Notes"
      description="Short-form observations on markets, positioning, and price action."
      posts={posts}
    />
  )
}
