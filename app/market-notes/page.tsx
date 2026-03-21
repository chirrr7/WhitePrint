import type { Metadata } from "next"
import { getPostsByCategory } from "@/lib/posts"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Market Notes",
  description:
    "Short-form observations on markets, positioning, and real-time developments.",
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
