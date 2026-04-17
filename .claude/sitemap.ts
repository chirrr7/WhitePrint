import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date()
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/macro", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/equity", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/market-notes", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/models", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/stances", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: new URL(route.path, SEO_CONFIG.siteUrl).toString(),
    lastModified: today,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const posts = await getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(`/posts/${post.slug}`, SEO_CONFIG.siteUrl).toString(),
    lastModified: new Date(`${post.date}T00:00:00.000Z`),
    changeFrequency: "never",
    priority: 0.6,
  }))

  const topicEntries: MetadataRoute.Sitemap = Array.from(
    new Map(
      posts
        .filter(
          (post) =>
            post.topicSlug &&
            !["macro", "equity", "market-notes"].includes(post.topicSlug),
        )
        .map((post) => [
          post.topicSlug!,
          {
            url: new URL(`/topics/${post.topicSlug}`, SEO_CONFIG.siteUrl).toString(),
            lastModified: new Date(`${post.date}T00:00:00.000Z`),
            changeFrequency: "weekly" as const,
            priority: 0.5,
          },
        ]),
    ).values(),
  )

  return [...staticEntries, ...topicEntries, ...postEntries]
}
