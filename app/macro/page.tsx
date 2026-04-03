import type { Metadata } from "next"
import { getPostsByCategory } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import { CategoryPage } from "@/components/category-page"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Macro Research",
  description:
    "Macroeconomic analysis covering Fed policy, rates, liquidity, and global macro themes.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/macro`,
  },
}

export default async function MacroPage() {
  const posts = await getPostsByCategory("macro")
  return (
    <CategoryPage
      title="Macro"
      description="Analysis of macroeconomic trends, monetary policy, rates, and global capital flows."
      posts={posts}
    />
  )
}
