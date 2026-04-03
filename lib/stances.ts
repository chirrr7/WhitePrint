import "server-only"

import { getAllPosts, getFilesystemPosts } from "@/lib/posts"
import {
  getPostCategoryLabel,
  type PostCategory,
  type PostConviction,
  type PostMeta,
  type PostScenarioType,
  type PostStance,
  type PostStatus,
} from "@/lib/post-meta"
import type { Database } from "@/lib/supabase/database.types"
import { createPublicClient } from "@/lib/supabase/public"

type StanceRow = Database["public"]["Tables"]["stances"]["Row"]

interface LinkedPost {
  slug: string
  title: string
}

export interface Stance {
  ticker: string
  name: string
  category: string
  tags: string[]
  stance: PostStance
  conviction: PostConviction
  thesis: string
  status: PostStatus
  scenarioType: PostScenarioType
  bear: number | null
  base: number | null
  bull: number | null
  date: string
  slug: string
  postSlug: string | null
  postTitle: string | null
}

const stanceDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatStanceDate(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return stanceDateFormatter.format(parsed)
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  )
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function normalizeCategory(value: unknown, fallback: PostCategory): PostCategory {
  return value === "macro" || value === "equity" || value === "market-notes" ? value : fallback
}

function normalizeStance(value: unknown, fallback: PostStance): PostStance {
  return value === "cautious" || value === "constructive" || value === "neutral" ? value : fallback
}

function normalizeConviction(value: unknown, fallback: PostConviction): PostConviction {
  return value === "high" || value === "medium" || value === "low" ? value : fallback
}

function normalizeCoverageStatus(value: unknown, fallback: PostStatus): PostStatus {
  return value === "active" || value === "expired" || value === "monitoring" ? value : fallback
}

function normalizeScenarioType(value: unknown, fallback: PostScenarioType): PostScenarioType {
  return value === "fcf" || value === "price" ? value : fallback
}

function mapPostsToStances(posts: PostMeta[]): Stance[] {
  return posts
    .filter((post) => Boolean(post.ticker && post.stance))
    .sort((left, right) => {
      if (left.date === right.date) {
        return left.title.localeCompare(right.title)
      }

      return left.date > right.date ? -1 : 1
    })
    .map((post) => ({
      ticker: post.ticker!,
      name: post.name ?? post.title,
      category: getPostCategoryLabel(post.category),
      tags: post.tags,
      stance: post.stance!,
      conviction: post.conviction ?? "medium",
      thesis: post.stanceThesis ?? post.excerpt,
      status: post.status ?? "active",
      scenarioType: post.scenarioType ?? "price",
      bear: post.bear ?? null,
      base: post.base ?? null,
      bull: post.bull ?? null,
      date: formatStanceDate(`${post.date}T00:00:00`),
      slug: post.slug,
      postSlug: post.slug,
      postTitle: post.title,
    }))
}

async function getPublishedLinkedPosts() {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("posts")
    .select("stance_id, slug, title, published_at, updated_at")
    .eq("status", "published")
    .not("stance_id", "is", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Failed to load published posts for coverage.", error)
    return new Map<number, LinkedPost>()
  }

  const linkedPosts = new Map<number, LinkedPost>()

  for (const post of data ?? []) {
    if (!post.stance_id || linkedPosts.has(post.stance_id)) {
      continue
    }

    linkedPosts.set(post.stance_id, {
      slug: post.slug,
      title: post.title,
    })
  }

  return linkedPosts
}

async function getDatabaseStances(posts: PostMeta[]) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("stances")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Failed to load published stances.", error)
    return null
  }

  if (!data?.length) {
    return []
  }

  const linkedPosts = await getPublishedLinkedPosts()
  const postBySlug = new Map(posts.map((post) => [post.slug, post]))

  return data.map((stanceRow) => {
    const linkedPost = linkedPosts.get(stanceRow.id) ?? null
    const linkedPostMeta = linkedPost ? postBySlug.get(linkedPost.slug) ?? null : null
    const fallbackCategory = linkedPostMeta?.category ?? "equity"
    const ticker =
      normalizeText(stanceRow.ticker) ||
      normalizeText(linkedPostMeta?.ticker) ||
      normalizeText(stanceRow.slug).slice(0, 5).toUpperCase()
    const name =
      normalizeText(stanceRow.name) ||
      normalizeText(linkedPostMeta?.name) ||
      normalizeText(stanceRow.title) ||
      linkedPost?.title ||
      ticker
    const tags = normalizeTags(stanceRow.tags)
    const dateValue =
      stanceRow.published_at ??
      stanceRow.updated_at ??
      (linkedPostMeta ? `${linkedPostMeta.date}T00:00:00` : new Date().toISOString())

    return {
      ticker,
      name,
      category: getPostCategoryLabel(normalizeCategory(stanceRow.coverage_category, fallbackCategory)),
      tags: tags.length > 0 ? tags : linkedPostMeta?.tags ?? [],
      stance: normalizeStance(stanceRow.opinion, linkedPostMeta?.stance ?? "neutral"),
      conviction: normalizeConviction(stanceRow.conviction, linkedPostMeta?.conviction ?? "medium"),
      thesis:
        normalizeText(stanceRow.thesis) ||
        normalizeText(stanceRow.summary) ||
        linkedPostMeta?.stanceThesis ||
        linkedPostMeta?.excerpt ||
        name,
      status: normalizeCoverageStatus(stanceRow.coverage_status, linkedPostMeta?.status ?? "active"),
      scenarioType: normalizeScenarioType(stanceRow.scenario_type, linkedPostMeta?.scenarioType ?? "price"),
      bear: normalizeNumber(stanceRow.bear) ?? linkedPostMeta?.bear ?? null,
      base: normalizeNumber(stanceRow.base) ?? linkedPostMeta?.base ?? null,
      bull: normalizeNumber(stanceRow.bull) ?? linkedPostMeta?.bull ?? null,
      date: formatStanceDate(dateValue),
      slug: stanceRow.slug,
      postSlug: linkedPost?.slug ?? null,
      postTitle: linkedPost?.title ?? null,
    } satisfies Stance
  })
}

export function getStances(): Stance[] {
  return mapPostsToStances(getFilesystemPosts())
}

export async function getCoverageStances(): Promise<Stance[]> {
  const posts = await getAllPosts()
  const databaseStances = await getDatabaseStances(posts)

  if (databaseStances && databaseStances.length > 0) {
    return databaseStances
  }

  return mapPostsToStances(posts)
}
