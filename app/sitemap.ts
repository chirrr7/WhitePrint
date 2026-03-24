import type { MetadataRoute } from "next"
import { getMdxPosts } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"

export default function sitemap(): MetadataRoute.Sitemap {
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

  const postEntries: MetadataRoute.Sitemap = getMdxPosts().map((post) => ({
    url: new URL(`/posts/${post.slug}`, SEO_CONFIG.siteUrl).toString(),
    lastModified: new Date(`${post.date}T00:00:00.000Z`),
    changeFrequency: "never",
    priority: 0.6,
  }))

  return [...staticEntries, ...postEntries]
}
