import { NextResponse } from "next/server"
import { getAllPosts, getArchivedPosts } from "@/lib/posts"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() ?? ""
  const tag = searchParams.get("tag")?.toLowerCase() ?? ""
  const includeArchived = searchParams.get("archived") === "1"

  const [publishedPosts, archivedPosts] = await Promise.all([
    getAllPosts(),
    includeArchived ? getArchivedPosts() : Promise.resolve([]),
  ])

  const postsBySlug = new Map(publishedPosts.map((post) => [post.slug, post]))

  archivedPosts.forEach((post) => {
    postsBySlug.set(post.slug, post)
  })

  let posts = Array.from(postsBySlug.values())

  if (tag) {
    posts = posts.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === tag)
    )
  }

  if (query) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        (p.topicLabel?.toLowerCase().includes(query) ?? false) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    )
  }

  return NextResponse.json(posts)
}
