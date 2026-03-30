import matter from "gray-matter"
import Link from "next/link"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"
import type { Database } from "@/lib/supabase/database.types"
import s from "./ResearchSection.module.css"

type PostRow = Database["public"]["Tables"]["posts"]["Row"]
type TopicRow = Pick<Database["public"]["Tables"]["topics"]["Row"], "id" | "name" | "slug">
type DeskBriefItem = Database["public"]["Tables"]["desk_brief"]["Row"]

interface ParsedFrontmatter {
  date?: string
  displayTitle?: string
  excerpt?: string
  readTime?: number
  tags?: string[]
}

interface ResearchCardData {
  slug: string
  title: string
  excerpt: string
  dateLabel: string
  readTime: number
  sourcesCount: number | null
  scenariosCount: number | null
  primaryLabel: string
  secondaryLabel: string | null
}

export async function ResearchSection() {
  const { deskBriefs, featured, latest } = await getResearchSectionData()

  return (
    <section className={s.section} id="research">
      <div className={s.wrap}>
        <div className={`${s.headerRow} ${s.headerRowLight}`}>
          <span className={s.labelLight}>Featured</span>
          <div className={s.ruleLight} />
        </div>

        {featured ? (
          <div className={`${s.featuredCard} fade-in-up`}>
            <div className={s.featuredBody}>
              <div className={s.featuredKicker}>
                <span className={`${s.pill} ${s.pillDark}`}>{featured.primaryLabel}</span>
                {featured.secondaryLabel ? (
                  <span className={`${s.pill} ${s.pillTag}`}>{featured.secondaryLabel}</span>
                ) : null}
                <span className={s.pillDate}>{featured.dateLabel}</span>
              </div>

              <h2
                className={s.featuredTitle}
                dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(featured.title) }}
              />
              <p className={s.featuredDeck}>{featured.excerpt}</p>

              <div className={s.featuredStats}>
                <div className={s.fStat}>
                  <div className={s.fStatVal}>{featured.readTime}</div>
                  <div className={s.fStatLabel}>Min read</div>
                </div>
                <div className={s.fStat}>
                  <div className={s.fStatVal}>{formatCountValue(featured.sourcesCount)}</div>
                  <div className={s.fStatLabel}>Sources</div>
                </div>
                <div className={s.fStat}>
                  <div className={s.fStatVal}>{formatCountValue(featured.scenariosCount)}</div>
                  <div className={s.fStatLabel}>Scenarios</div>
                </div>
              </div>

              <Link href={`/posts/${featured.slug}`} className={s.featuredCta}>
                Read Full Analysis →
              </Link>
            </div>

            <div className={s.deskBrief}>
              <div className={s.briefHead}>
                <span className={s.briefHeadTitle}>Desk Brief</span>
              </div>

              {deskBriefs.map((item) => (
                <div key={item.id} className={s.briefItem}>
                  <div className={s.briefItemHdr}>
                    <span className={s.briefItemLbl}>{item.label}</span>
                    <div className={s.briefSep} />
                    <span className={`${s.briefBadge} ${getDeskBadgeClassName(item.badge)}`}>
                      {item.badge}
                    </span>
                  </div>

                  <p className={s.briefItemBody}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className={`${s.headerRow} ${s.headerRowLight} ${s.latestHeader}`}>
          <span className={s.labelLight}>Latest Research</span>
          <div className={s.ruleLight} />
          <Link href="/research" className={s.linkLight}>
            All Research →
          </Link>
        </div>

        <div className={s.rgWrap}>
          {latest.map((post) => (
            <article key={post.slug} className={`${s.rCard} fade-in-up`}>
              <div>
                <div className={s.rCardKicker}>
                  <span className={`${s.pill} ${s.pillDark}`}>{post.primaryLabel}</span>
                  {post.secondaryLabel ? (
                    <span className={`${s.pill} ${s.pillTag}`}>{post.secondaryLabel}</span>
                  ) : null}
                  <span className={s.rPillDate}>{post.dateLabel}</span>
                </div>

                <h3
                  className={s.rCardTitle}
                  dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(post.title) }}
                />
                <p className={s.rCardDeck}>{post.excerpt}</p>
              </div>

              <div className={s.rCardAside}>
                <div className={s.rCardMeta}>
                  {post.readTime} min
                  {post.secondaryLabel ? ` · ${post.secondaryLabel}` : ` · ${post.primaryLabel}`}
                </div>
                <Link href={`/posts/${post.slug}`} className={s.rCardCta}>
                  Read Full Note →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

async function getResearchSectionData() {
  const supabase = createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey)

  const [featuredResult, latestResult, deskBriefResult, topicsResult] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, slug, summary, body, body_mdx, status, featured, published_at, created_at, topic_id, sources_count, scenarios_count",
      )
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("posts")
      .select(
        "id, title, slug, summary, body, body_mdx, status, featured, published_at, created_at, topic_id, sources_count, scenarios_count",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4),
    supabase
      .from("desk_brief")
      .select("id, label, badge, body, sort_order, visible")
      .eq("visible", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .limit(3),
    supabase.from("topics").select("id, name, slug"),
  ])

  if (featuredResult.error) {
    console.error("Failed to load featured post.", featuredResult.error)
  }

  if (latestResult.error) {
    console.error("Failed to load latest posts.", latestResult.error)
  }

  if (deskBriefResult.error) {
    console.error("Failed to load desk brief items.", deskBriefResult.error)
  }

  if (topicsResult.error) {
    console.error("Failed to load topics.", topicsResult.error)
  }

  const topicsById = new Map<number, TopicRow>((topicsResult.data ?? []).map((topic) => [topic.id, topic]))
  const featuredRow = (featuredResult.data as PostRow | null) ?? null
  const latestRows = ((latestResult.data ?? []) as PostRow[]).filter((post) => post.slug !== featuredRow?.slug)
  const featured = featuredRow ? mapPostToCard(featuredRow, topicsById) : null
  const latest = latestRows.slice(0, 3).map((post) => mapPostToCard(post, topicsById))
  const deskBriefs = ((deskBriefResult.data ?? []) as DeskBriefItem[]).filter((item) => item.visible !== false)

  return {
    deskBriefs,
    featured,
    latest,
  }
}

function mapPostToCard(post: PostRow, topicsById: Map<number, TopicRow>): ResearchCardData {
  const source = post.body_mdx?.trim() || post.body?.trim() || ""
  const { data } = parseFrontmatter(source)
  const topic = post.topic_id ? topicsById.get(post.topic_id) ?? null : null
  const title = asString(data.displayTitle) || post.title
  const excerpt = asString(data.excerpt) || post.summary
  const dateValue = asString(data.date) || toIsoDate(post.published_at, post.created_at)
  const tags = Array.isArray(data.tags) ? data.tags.filter((value): value is string => typeof value === "string") : []

  return {
    slug: post.slug,
    title,
    excerpt,
    dateLabel: formatDateLabel(dateValue),
    readTime: typeof data.readTime === "number" ? data.readTime : estimateReadTime(source),
    sourcesCount: post.sources_count,
    scenariosCount: post.scenarios_count,
    primaryLabel: topic?.name ?? "Research",
    secondaryLabel: tags[0] ? humanizeLabel(tags[0]) : null,
  }
}

function parseFrontmatter(source: string) {
  if (!source.trim()) {
    return { data: {} as ParsedFrontmatter }
  }

  try {
    const parsed = matter(source)
    return { data: parsed.data as ParsedFrontmatter }
  } catch {
    return { data: {} as ParsedFrontmatter }
  }
}

function estimateReadTime(content: string) {
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

function toIsoDate(value: string | null, fallback: string) {
  const candidate = value ?? fallback
  const parsed = new Date(candidate)

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}

function formatDateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function formatCountValue(value: number | null) {
  return typeof value === "number" ? `${value}` : "—"
}

function getDeskBadgeClassName(value: string) {
  const normalized = value.trim().toLowerCase()

  switch (normalized) {
    case "hold":
      return s.badgeHold
    case "watch":
      return s.badgeWatch
    default:
      return s.badgeCaution
  }
}

function humanizeLabel(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function sanitizeInlineHtml(value: string) {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  return escaped
    .replace(/&lt;em&gt;/g, "<em>")
    .replace(/&lt;\/em&gt;/g, "</em>")
}
