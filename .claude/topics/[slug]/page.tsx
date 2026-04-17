import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { CategoryPage } from "@/components/category-page"
import { SEO_CONFIG } from "@/lib/seo.config"
import { getPostsByTopicSlug, getTopicLabelBySlug } from "@/lib/posts"

interface TopicPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

const sectionTopicRedirects = new Map([
  ["macro", "/macro"],
  ["equity", "/equity"],
  ["market-notes", "/market-notes"],
])

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params
  const sectionRedirect = sectionTopicRedirects.get(slug)

  if (sectionRedirect) {
    return {
      alternates: {
        canonical: `${SEO_CONFIG.siteUrl}${sectionRedirect}`,
      },
    }
  }

  const posts = await getPostsByTopicSlug(slug)

  if (!posts.length) {
    return {}
  }

  const title = await getTopicLabelBySlug(slug)

  return {
    title,
    description: `Research tagged to ${title} on Whiteprint Research.`,
    alternates: {
      canonical: `${SEO_CONFIG.siteUrl}/topics/${slug}`,
    },
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params
  const sectionRedirect = sectionTopicRedirects.get(slug)

  if (sectionRedirect) {
    redirect(sectionRedirect)
  }

  const posts = await getPostsByTopicSlug(slug)

  if (!posts.length) {
    notFound()
  }

  const title = await getTopicLabelBySlug(slug)

  return (
    <CategoryPage
      title={title}
      description={`Research and notes filed under ${title}.`}
      posts={posts}
    />
  )
}
