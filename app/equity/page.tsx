import type { Metadata } from "next"
import { getPostsByCategory } from "@/lib/posts"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Equity Research",
  description:
    "Deep-dive company analysis, valuation models, and sector overviews.",
}

export default function EquityPage() {
  const posts = getPostsByCategory("equity")
  return (
    <CategoryPage
      title="Equity Research"
      description="Company analysis, valuation frameworks, and sector-level views on public equities."
      posts={posts}
    />
  )
}
