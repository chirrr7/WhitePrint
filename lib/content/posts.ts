import fs from "fs"
import path from "path"
import type { ReactNode } from "react"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import remarkGfm from "remark-gfm"
import { z } from "zod"
import { articleBodyComponents, postBodyComponents } from "@/components/post-body"
import {
  getPostCategoryLabel,
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
import type { Database } from "@/lib/supabase/database.types"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"

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

type DatabasePostRow = Pick<
  Database["public"]["Tables"]["posts"]["Row"],
  | "created_at"
  | "featured"
  | "homepage"
  | "id"
  | "published_at"
  | "slug"
  | "summary"
  | "title"
  | "topic_id"
  | "updated_at"
  | "body"
  | "body_mdx"
>

type PublicTopic = Pick<
  Database["public"]["Tables"]["topics"]["Row"],
  "id" | "name" | "slug"
>

interface PostgrestLikeError {
  code?: string
  message?: string
}

let publicSupabase: ReturnType<typeof createSupabaseClient<Database>> | null = null

function getPublicSupabase() {
  if (!publicSupabase) {
    publicSupabase = createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return publicSupabase
}

function isMissingBodyMdxColumn(error: PostgrestLikeError | null | undefined) {
  return error?.code === "42703" && error.message?.includes("body_mdx")
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

function buildFilesystemPostMeta(source: PostSource): PostMeta {
  const { content, frontmatter } = readPostSourceData(source)
  const slugFromFile = source.fileName.replace(/\.(md|mdx)$/, "")
  const slug = frontmatter.slug ?? slugFromFile

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    category: frontmatter.category,
    source: "filesystem",
    tags: frontmatter.tags,
    excerpt: frontmatter.excerpt,
    readTime: frontmatter.readTime ?? estimateReadTime(content),
    featured: false,
    homepage: false,
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
    topicLabel: getPostCategoryLabel(frontmatter.category),
    topicSlug: frontmatter.category,
    marketNoteTable: frontmatter.marketNoteTable as MarketNoteTableData | undefined,
    reportDownload: frontmatter.reportDownload as ReportDownloadData | undefined,
    sidebarCards: frontmatter.sidebarCards as SidebarCard[] | undefined,
  }
}

function getFilesystemPostSources(): PostSource[] {
  return [
    ...getSourcesFromDirectory(mdxPostsDirectory, ".mdx"),
    ...getSourcesFromDirectory(legacyPostsDirectory, ".md"),
  ]
}

function sortPosts(posts: PostMeta[]) {
  return posts.sort((left, right) => {
    if (left.date === right.date) {
      return left.title.localeCompare(right.title)
    }

    return left.date > right.date ? -1 : 1
  })
}

function getAllFilesystemPostMeta(): PostMeta[] {
  const posts = getFilesystemPostSources().map(buildFilesystemPostMeta)
  return sortPosts(posts)
}

function getFilesystemPostSourceBySlug(slug: string): PostSource | null {
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

function normalizeTopicValue(value: string | null | undefined) {
  return value
    ? value
        .trim()
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
    : ""
}

function humanizeTopicSlug(topicSlug: string) {
  return topicSlug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function resolveDatabasePostCategory(topic: PublicTopic | null | undefined): PostCategory {
  const candidates = [normalizeTopicValue(topic?.slug), normalizeTopicValue(topic?.name)]

  if (candidates.some((value) => value === "equity" || value === "equity-research" || value === "equities")) {
    return "equity"
  }

  if (
    candidates.some(
      (value) =>
        value === "market-notes" ||
        value === "market-note" ||
        value === "marketnotes" ||
        value === "notes",
    )
  ) {
    return "market-notes"
  }

  return "macro"
}

function toPostDate(value: string | null | undefined, fallback: string | null | undefined) {
  const candidate = value ?? fallback

  if (!candidate) {
    return new Date().toISOString().slice(0, 10)
  }

  const parsed = new Date(candidate)

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}

function getDatabasePostContent(row: Pick<DatabasePostRow, "body" | "body_mdx">) {
  return row.body_mdx?.trim() || row.body?.trim() || ""
}

function buildDatabasePostMeta(row: DatabasePostRow, topic: PublicTopic | null | undefined): PostMeta {
  const category = resolveDatabasePostCategory(topic)
  const content = getDatabasePostContent(row)

  return {
    slug: row.slug,
    title: row.title,
    date: toPostDate(row.published_at, row.created_at),
    category,
    source: "database",
    tags: [],
    excerpt: row.summary,
    readTime: estimateReadTime(content),
    featured: row.featured,
    homepage: row.homepage,
    topicLabel: topic?.name ?? getPostCategoryLabel(category),
    topicSlug: topic?.slug ?? category,
  }
}

async function getTopicsByIds(topicIds: Array<number | null>) {
  const ids = Array.from(new Set(topicIds.filter((id): id is number => typeof id === "number")))

  if (!ids.length) {
    return new Map<number, PublicTopic>()
  }

  const supabase = getPublicSupabase()
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, slug")
    .in("id", ids)

  if (error) {
    throw error
  }

  return new Map((data ?? []).map((topic) => [topic.id, topic]))
}

async function getPublishedDatabasePostRows(): Promise<DatabasePostRow[]> {
  try {
    const supabase = getPublicSupabase()
    let { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, summary, body, body_mdx, topic_id, featured, homepage, published_at, created_at, updated_at",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .order("updated_at", { ascending: false })

    if (isMissingBodyMdxColumn(error)) {
      const fallback = await supabase
        .from("posts")
        .select(
          "id, title, slug, summary, body, topic_id, featured, homepage, published_at, created_at, updated_at",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .order("updated_at", { ascending: false })

      data = (fallback.data ?? []).map((row) => ({
        ...row,
        body_mdx: "",
      }))
      error = fallback.error
    }

    if (error) {
      throw error
    }

    return data ?? []
  } catch (error) {
    console.error("Failed to load published Supabase posts.", error)
    return []
  }
}

async function getPublishedDatabasePosts(): Promise<PostMeta[]> {
  const rows = await getPublishedDatabasePostRows()

  if (!rows.length) {
    return []
  }

  try {
    const topicsById = await getTopicsByIds(rows.map((row) => row.topic_id))
    return sortPosts(rows.map((row) => buildDatabasePostMeta(row, topicsById.get(row.topic_id ?? -1))))
  } catch (error) {
    console.error("Failed to load post topics for Supabase posts.", error)
    return sortPosts(rows.map((row) => buildDatabasePostMeta(row, null)))
  }
}

async function getPublishedDatabasePostBySlug(
  slug: string,
): Promise<{ content: string; post: PostMeta } | null> {
  try {
    const supabase = getPublicSupabase()
    let { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, summary, body, body_mdx, topic_id, featured, homepage, published_at, created_at, updated_at",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()

    if (isMissingBodyMdxColumn(error)) {
      const fallback = await supabase
        .from("posts")
        .select(
          "id, title, slug, summary, body, topic_id, featured, homepage, published_at, created_at, updated_at",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle()

      data = fallback.data ? { ...fallback.data, body_mdx: "" } : null
      error = fallback.error
    }

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    let topic: PublicTopic | null = null

    if (data.topic_id) {
      const topicsById = await getTopicsByIds([data.topic_id])
      topic = topicsById.get(data.topic_id) ?? null
    }

    return {
      content: getDatabasePostContent(data),
      post: buildDatabasePostMeta(data, topic),
    }
  } catch (error) {
    console.error(`Failed to load Supabase post for slug "${slug}".`, error)
    return null
  }
}

async function compilePostSource(
  source: string,
  components: typeof articleBodyComponents | typeof postBodyComponents,
) {
  const compiled = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return compiled.content
}

export function getFilesystemPosts(): PostMeta[] {
  return getAllFilesystemPostMeta()
}

export function hasFilesystemPostSlug(slug: string) {
  return Boolean(getFilesystemPostSourceBySlug(slug))
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const filesystemPosts = getAllFilesystemPostMeta()
  const databasePosts = await getPublishedDatabasePosts()
  const uniquePosts = new Map<string, PostMeta>()

  filesystemPosts.forEach((post) => {
    uniquePosts.set(post.slug, post)
  })

  databasePosts.forEach((post) => {
    if (uniquePosts.has(post.slug)) {
      console.warn(
        `Skipping database post "${post.slug}" because a filesystem post already uses that slug.`,
      )
      return
    }

    uniquePosts.set(post.slug, post)
  })

  return sortPosts(Array.from(uniquePosts.values()))
}

export async function getMdxPosts(): Promise<PostMeta[]> {
  const posts = getSourcesFromDirectory(mdxPostsDirectory, ".mdx").map(buildFilesystemPostMeta)
  return sortPosts(posts)
}

export async function getPostsByCategory(category: PostCategory): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.category === category)
}

export async function getPostsByTopicSlug(topicSlug: string): Promise<PostMeta[]> {
  const normalizedSlug = normalizeTopicValue(topicSlug)
  const posts = await getAllPosts()

  return posts.filter((post) => normalizeTopicValue(post.topicSlug) === normalizedSlug)
}

export async function getPostMetaBySlug(slug: string): Promise<PostMeta | null> {
  const filesystemSource = getFilesystemPostSourceBySlug(slug)

  if (filesystemSource) {
    return buildFilesystemPostMeta(filesystemSource)
  }

  const databasePost = await getPublishedDatabasePostBySlug(slug)
  return databasePost?.post ?? null
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filesystemSource = getFilesystemPostSourceBySlug(slug)

  if (filesystemSource) {
    const postMeta = buildFilesystemPostMeta(filesystemSource)
    const { content } = readPostSourceData(filesystemSource)

    return {
      ...postMeta,
      content: await compilePostSource(content, postBodyComponents),
    }
  }

  const databasePost = await getPublishedDatabasePostBySlug(slug)

  if (!databasePost) {
    return null
  }

  return {
    ...databasePost.post,
    content: await compilePostSource(databasePost.content, postBodyComponents),
  }
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagSet.add(tag)
    })
  })

  return Array.from(tagSet).sort()
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}

export async function getArticleBySlug(slug: string): Promise<Post | null> {
  const filesystemSource = getFilesystemPostSourceBySlug(slug)

  if (filesystemSource) {
    const postMeta = buildFilesystemPostMeta(filesystemSource)
    const { content } = readPostSourceData(filesystemSource)

    return {
      ...postMeta,
      content: await compilePostSource(content, articleBodyComponents),
    }
  }

  const databasePost = await getPublishedDatabasePostBySlug(slug)

  if (!databasePost) {
    return null
  }

  return {
    ...databasePost.post,
    content: await compilePostSource(databasePost.content, articleBodyComponents),
  }
}

export async function getTopicLabelBySlug(topicSlug: string) {
  const posts = await getPostsByTopicSlug(topicSlug)

  if (!posts.length) {
    return getPostCategoryLabel(
      resolveDatabasePostCategory({ id: 0, name: topicSlug, slug: topicSlug }),
    )
  }

  return posts[0].topicLabel ?? humanizeTopicSlug(topicSlug)
}
