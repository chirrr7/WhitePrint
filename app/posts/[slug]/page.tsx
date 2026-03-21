import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { ArrowLeft } from "lucide-react"
import { PostBody } from "@/components/post-body"

interface Props {
  params: Promise<{ slug: string }>
}

// Slugs with their own static page in app/posts/ are excluded here
// to prevent duplicate route generation between static and dynamic routes.
const STATIC_ROUTE_SLUGS = [
  "eog-resources-the-base-case-is-priced-in",
  "fed-decision-week-three-things-to-watch",
  "liquidity-squeeze-fed-march-2026",
]

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts
    .filter((post) => !STATIC_ROUTE_SLUGS.includes(post.slug))
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function categoryLabel(category: string) {
  switch (category) {
    case "macro":
      return "Macro"
    case "equity":
      return "Equity Research"
    case "market-notes":
      return "Market Notes"
    default:
      return category
  }
}

function categoryHref(category: string) {
  switch (category) {
    case "macro":
      return "/macro"
    case "equity":
      return "/equity"
    case "market-notes":
      return "/market-notes"
    default:
      return "/"
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={categoryHref(post.category)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {categoryLabel(post.category)}
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="uppercase tracking-widest font-medium">
            {categoryLabel(post.category)}
          </span>
          <span aria-hidden="true">{'/'}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">{'/'}</span>
          <span>{post.readTime} min read</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
          {post.title}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-2 py-1"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <div className="border-t border-border pt-10">
        <PostBody content={post.content} />
      </div>
    </article>
  )
}
