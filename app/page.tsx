import { getAllPosts, getPostsByCategory } from "@/lib/posts"
import { HomePage } from "./home-page"

export default function Page() {
  const allPosts = getAllPosts()
  const researchPosts = allPosts.filter((p) => p.category !== "market-notes").slice(0, 5)
  const marketNotes = getPostsByCategory("market-notes").slice(0, 5)
  const briefItems = allPosts.filter((p) => p.briefLabel).slice(0, 3)
  const featuredPost = allPosts.find((p) => p.featured) ?? researchPosts[0] ?? null

  return (
    <HomePage
      featuredPost={featuredPost}
      researchPosts={researchPosts}
      marketNotes={marketNotes}
      briefItems={briefItems}
      totalPosts={allPosts.length}
    />
  )
}
