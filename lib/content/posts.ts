import fs from "fs"
import path from "path"
import type { ReactNode } from "react"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { z } from "zod"
import { articleBodyComponents, postBodyComponents } from "@/components/post-body"
import {
  type MarketNoteTableData,
  type PostConviction,
  postCategories,
  type PostCategory,
  type PostMeta,
  type PostScenarioType,
  type PostStatus,
  type PostStance,
  type ReportDownloadData,
  type SidebarCard,
} from "@/lib/post-meta"

const mdxPostsDirectory = path.join(process.cwd(), "content", "posts")
const legacyPostsDirectory = path.join(process.cwd(), "posts")

export const postCategorySchema = z.enum(postCategories)

const postSlugSchema = z.string().trim().regex(/^[a-z0-9-]+$/)
const postStanceSchema = z.enum(["cautious", "neutral", "constructive"])
const postConvictionSchema = z.enum(["high", "medium", "low"])
const postStatusSchema = z.enum(["monitoring", "expired", "active"])
const postScenarioTypeSchema = z.enum(["price", "fcf"])
const sidebarValueToneSchema = z.enum(["neutral", "positive", "warning", "negative"])
const sidebarCardRowSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
  tone: sidebarValueToneSchema.optional(),
})
const sidebarCardSchema = z.object({
  title: z.string().trim().min(1),
  rows: z.array(sidebarCardRowSchema).min(1),
  note: z.string().trim().min(1).optional(),
})
const marketNoteTableSchema = z.object({
  stance: z.string().trim().min(1),
  confidence: z.string().trim().min(1),
  horizon: z.string().trim().min(1),
  quickAnswer: z.string().trim().min(1),
  whatChangesOurMind: z.string().trim().min(1),
})
const reportDownloadSchema = z.object({
  href: z.string().trim().min(1),
  filename: z.string().trim().min(1),
  label: z.string().trim().min(1).optional(),
})

const postFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  slug: postSlugSchema.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: postCategorySchema,
  tags: z.array(z.string().trim().min(1)).default([]),
  excerpt: z.string().trim().min(1),
  readTime: z.number().int().positive().optional(),
  ticker: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  stance: postStanceSchema.optional(),
  conviction: postConvictionSchema.optional(),
  stanceThesis: z.string().trim().min(1).optional(),
  status: postStatusSchema.optional(),
  scenarioType: postScenarioTypeSchema.optional(),
  stanceMetric: z.string().trim().min(1).optional(),
  bear: z.number().finite().optional(),
  base: z.number().finite().optional(),
  bull: z.number().finite().optional(),
  // Optional editorial fields
  displayTitle: z.string().trim().optional(),
  eyebrow: z.string().trim().optional(),
  marketNoteTable: marketNoteTableSchema.optional(),
  reportDownload: reportDownloadSchema.optional(),
  sidebarCards: z.array(sidebarCardSchema).max(4).optional(),
})

export interface Post extends PostMeta {
  content: ReactNode
}

interface PostSource {
  fullPath: string
  fileName: string
}

interface PostSourceData {
  content: string
  frontmatter: z.infer<typeof postFrontmatterSchema>
}

function estimateReadTime(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[>#*_~|]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(words / 225))
}

function getSourcesFromDirectory(
  directory: string,
  extension: ".md" | ".mdx",
): PostSource[] {
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(extension))
    .map((fileName) => ({
      fullPath: path.join(directory, fileName),
      fileName,
    }))
}

function readPostSourceData(source: PostSource): PostSourceData {
  const raw = fs.readFileSync(source.fullPath, "utf8")
  const { data, content } = matter(raw)
  const parsed = postFrontmatterSchema.safeParse(data)

  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${source.fullPath}: ${parsed.error.issues
        .map((issue) => issue.path.join(".") + " " + issue.message)
        .join(", ")}`,
    )
  }

  return {
    content,
    frontmatter: parsed.data,
  }
}

function buildPostMeta(source: PostSource): PostMeta {
  const { content, frontmatter } = readPostSourceData(source)
  const slugFromFile = source.fileName.replace(/\.(md|mdx)$/, "")
  const slug = frontmatter.slug ?? slugFromFile

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    category: frontmatter.category,
    tags: frontmatter.tags,
    excerpt: frontmatter.excerpt,
    readTime: frontmatter.readTime ?? estimateReadTime(content),
    ticker: frontmatter.ticker,
    name: frontmatter.name,
    stance: frontmatter.stance as PostStance | undefined,
    conviction: frontmatter.conviction as PostConviction | undefined,
    stanceThesis: frontmatter.stanceThesis,
    status: frontmatter.status as PostStatus | undefined,
    scenarioType: frontmatter.scenarioType as PostScenarioType | undefined,
    stanceMetric: frontmatter.stanceMetric,
    bear: frontmatter.bear,
    base: frontmatter.base,
    bull: frontmatter.bull,
    displayTitle: frontmatter.displayTitle,
    eyebrow: frontmatter.eyebrow,
    marketNoteTable: frontmatter.marketNoteTable as MarketNoteTableData | undefined,
    reportDownload: frontmatter.reportDownload as ReportDownloadData | undefined,
    sidebarCards: frontmatter.sidebarCards as SidebarCard[] | undefined,
  }
}

function getAllPostMeta(): PostMeta[] {
  const posts = [
    ...getSourcesFromDirectory(mdxPostsDirectory, ".mdx"),
    ...getSourcesFromDirectory(legacyPostsDirectory, ".md"),
  ].map(buildPostMeta)

  const uniquePosts = new Map<string, PostMeta>()

  posts.forEach((post) => {
    if (uniquePosts.has(post.slug)) {
      throw new Error(`Duplicate post slug detected: ${post.slug}`)
    }

    uniquePosts.set(post.slug, post)
  })

  return Array.from(uniquePosts.values()).sort((left, right) => {
    if (left.date === right.date) {
      return left.title.localeCompare(right.title)
    }

    return left.date > right.date ? -1 : 1
  })
}

function getPostSourceBySlug(slug: string): PostSource | null {
  const mdxPath = path.join(mdxPostsDirectory, `${slug}.mdx`)
  if (fs.existsSync(mdxPath)) {
    return {
      fullPath: mdxPath,
      fileName: `${slug}.mdx`,
    }
  }

  const markdownPath = path.join(legacyPostsDirectory, `${slug}.md`)
  if (fs.existsSync(markdownPath)) {
    return {
      fullPath: markdownPath,
      fileName: `${slug}.md`,
    }
  }

  return null
}

export function getAllPosts(): PostMeta[] {
  return getAllPostMeta()
}

export function getPostsByCategory(category: PostCategory): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getPostMetaBySlug(slug: string): PostMeta | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const source = getPostSourceBySlug(slug)
  if (!source) {
    return null
  }

  const postMeta = buildPostMeta(source)
  const { content } = readPostSourceData(source)

  const compiled = await compileMDX({
    source: content,
    components: postBodyComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return {
    ...postMeta,
    content: compiled.content,
  }
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()

  getAllPosts().forEach((post) => {
    post.tags.forEach((tag) => {
      tagSet.add(tag)
    })
  })

  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag))
}

// Compiles MDX using article-specific components (bare HTML — styled via article.module.css)
export async function getArticleBySlug(slug: string): Promise<Post | null> {
  const source = getPostSourceBySlug(slug)
  if (!source) return null

  const postMeta = buildPostMeta(source)
  const { content } = readPostSourceData(source)

  const compiled = await compileMDX({
    source: content,
    components: articleBodyComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return {
    ...postMeta,
    content: compiled.content,
  }
}
