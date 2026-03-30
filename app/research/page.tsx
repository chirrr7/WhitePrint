import type { Metadata } from "next"
import Link from "next/link"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { getAllPosts } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"
import type { Database } from "@/lib/supabase/database.types"
import s from "./page.module.css"

type ArchivedPostRow = Pick<
  Database["public"]["Tables"]["posts"]["Row"],
  "slug" | "title" | "summary" | "published_at" | "created_at"
>

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Research",
  description: "Published Whiteprint research across equity, macro, and market notes.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/research`,
  },
}

export default async function ResearchIndexPage() {
  const [posts, archivedPosts] = await Promise.all([getAllPosts(), getArchivedPosts()])

  return (
    <div className={s.page}>
      <section className={s.hero}>
        <div className={s.wrap}>
          <div className={s.eyebrow}>Whiteprint Research</div>
          <h1 className={s.title}>Research archive.</h1>
          <p className={s.sub}>
            Published equity, macro, and market notes in one archive, with a separate section for
            retired work.
          </p>
        </div>
      </section>

      <section className={s.listing}>
        <div className={s.wrap}>
          <div className={s.header}>
            <span className={s.label}>Published Research</span>
            <div className={s.rule} />
            <span className={s.count}>{posts.length} notes</span>
          </div>

          <div className={s.cards}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className={`${s.card} fade-in-up`}>
                <div>
                  <div className={s.cardKicker}>
                    <span className={`${s.pill} ${s.pillDark}`}>{post.topicLabel ?? post.category}</span>
                    {post.tags[0] ? <span className={`${s.pill} ${s.pillTag}`}>{humanize(post.tags[0])}</span> : null}
                    <span className={s.date}>{formatDateLabel(post.date)}</span>
                  </div>

                  <h2
                    className={s.cardTitle}
                    dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(post.displayTitle ?? post.title) }}
                  />
                  <p className={s.cardDeck}>{post.excerpt}</p>
                </div>

                <div className={s.cardAside}>
                  <div className={s.meta}>{post.readTime} min read</div>
                  <span className={s.cta}>Read Full Note →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className={s.archiveHeader}>
            <span className={s.label}>Archive</span>
            <div className={s.rule} />
            <span className={s.count}>{archivedPosts.length} archived</span>
          </div>

          <div className={s.archiveList}>
            {archivedPosts.length ? (
              archivedPosts.map((post) => (
                <div key={post.slug} className={s.archiveItem}>
                  <div>
                    <div className={s.archiveDate}>{post.dateLabel}</div>
                    <h2 className={s.archiveTitle}>{post.title}</h2>
                    <p className={s.archiveDeck}>{post.excerpt}</p>
                  </div>
                  <span className={s.archiveStatus}>Archived</span>
                </div>
              ))
            ) : (
              <div className={s.archiveEmpty}>No archived research is currently exposed.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function formatDateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function humanize(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
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

async function getArchivedPosts() {
  const supabase = createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey)
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, summary, published_at, created_at")
    .eq("status", "archived")
    .order("published_at", { ascending: false })
    .limit(12)

  if (error) {
    console.error("Failed to load archived posts.", error)
    return []
  }

  return ((data ?? []) as ArchivedPostRow[]).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.summary,
    dateLabel: formatDateLabel(toIsoDate(post.published_at ?? post.created_at)),
  }))
}

function toIsoDate(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}
