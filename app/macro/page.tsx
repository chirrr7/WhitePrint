import type { Metadata } from "next"
import { getPostsByCategory } from "@/lib/posts"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Macro Research",
  description:
    "Macroeconomic analysis covering rates, currencies, commodities, and global monetary policy.",
}

export default function MacroPage() {
  const posts = getPostsByCategory("macro")
  return (
    <CategoryPage
      title="Macro"
      description="Analysis of macroeconomic trends, monetary policy, rates, and global capital flows."
      posts={posts}
    />
  )
}
