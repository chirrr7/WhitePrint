import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  formatPostDate,
  getPostCategoryHref,
  getPostCategoryLabel,
} from "@/lib/post-meta"
import {
  getAllPosts,
  getPostBySlug,
  getPostMetaBySlug,
} from "@/lib/posts"
import { ArrowLeft } from "lucide-react"
import { PostBody } from "@/components/post-body"

interface Props {
  params: Promise<{ slug: string }>
}

const bespokePostSlugs = new Set([
  "fed-decision-week-three-things-to-watch",
  "liquidity-squeeze-fed-march-2026",
])

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts()
    .filter((post) => !bespokePostSlugs.has(post.slug))
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostMetaBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/posts/${post.slug}`,
      publishedTime: `${post.date}T00:00:00.000Z`,
      tags: post.tags,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <div className="max-w-3xl">
        <Link
          href={getPostCategoryHref(post.category)}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {getPostCategoryLabel(post.category)}
        </Link>

        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="uppercase tracking-widest font-medium">
              {getPostCategoryLabel(post.category)}
            </span>
            <span aria-hidden="true">/</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">/</span>
            <span>{post.readTime} min read</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className="border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>
      </div>

      <div className="border-t border-border pt-10">
        <div className="max-w-4xl">
          <PostBody>{post.content}</PostBody>
        </div>
      </div>
    </article>
  )
}
