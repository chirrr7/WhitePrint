import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "posts")

const visiblePostSlugs = new Set([
  "liquidity-squeeze-fed-march-2026",
  "fed-decision-week-three-things-to-watch",
])

export interface PostMeta {
  slug: string
  title: string
  date: string
  category: "macro" | "equity" | "market-notes"
  tags: string[]
  excerpt: string
  readTime: number
}

export interface Post extends PostMeta {
  content: string
}

function estimateReadTime(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[>#*_~\-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(words / 225))
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .filter((name) => visiblePostSlugs.has(name.replace(/\.md$/, "")))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)
      return {
        slug,
        title: data.title ?? "",
        date: data.date ?? "",
        category: data.category ?? "macro",
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? "",
        readTime: Number(data.readTime) || estimateReadTime(content),
      } as PostMeta
    })
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getPostBySlug(slug: string): Post | null {
  if (!visiblePostSlugs.has(slug)) return null
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    category: data.category ?? "macro",
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? "",
    readTime: Number(data.readTime) || estimateReadTime(content),
    content,
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}
