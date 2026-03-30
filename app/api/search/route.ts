import { NextResponse } from "next/server"
import { getAllPosts } from "@/lib/posts"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() ?? ""
  const tag = searchParams.get("tag")?.toLowerCase() ?? ""

  let posts = await getAllPosts()

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
