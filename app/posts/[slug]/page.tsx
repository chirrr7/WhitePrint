import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  formatPostDate,
  getPostCategoryHref,
  getPostCategoryLabel,
  type PostCategory,
  type SidebarValueTone,
} from "@/lib/post-meta"
import { MarketNoteTable } from "@/components/research-blocks"
import {
  getAllPosts,
  getArticleBySlug,
  getPostMetaBySlug,
} from "@/lib/posts"
import { cn } from "@/lib/utils"
import { ArticleProgressBar } from "./progress-bar"
import s from "./article.module.css"
import marketNoteStyles from "./market-note.module.css"

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
  const post = await getArticleBySlug(slug)
  if (!post) notFound()

  const categoryHref = getPostCategoryHref(post.category)
  const categoryLabel = getPostCategoryLabel(post.category)
  const customSidebarCards = post.sidebarCards ?? []
  const hasCustomSidebarCards = customSidebarCards.length > 0

  function getSidebarValueClass(tone: SidebarValueTone = "neutral") {
    switch (tone) {
      case "positive":
        return `${s.kvValue} ${s.kvValuePositive}`
      case "warning":
        return `${s.kvValue} ${s.kvValueWarning}`
      case "negative":
        return `${s.kvValue} ${s.kvValueNegative}`
      default:
        return `${s.kvValue} ${s.kvValueNeutral}`
    }
  }

  function getSummaryHeading(category: PostCategory) {
    switch (category) {
      case "macro":
        return "Macro Summary"
      case "equity":
        return "Equity Research Summary"
      case "market-notes":
        return "Market Note Summary"
      default:
        return "Whiteprint Summary"
    }
  }

  return (
    <div
      className={cn(
        s.wrapper,
        post.category === "market-notes" && marketNoteStyles.wrapper,
      )}
    >
      <ArticleProgressBar />

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroMeta}>
            <Link href={categoryHref} className={s.categoryPill}>
              {categoryLabel}
            </Link>
            <span className={s.heroDate}>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </span>
            <div className={s.heroRule} />
          </div>

          {post.displayTitle ? (
            <h1 className={s.title} dangerouslySetInnerHTML={{ __html: post.displayTitle }} />
          ) : (
            <h1 className={s.title}>{post.title}</h1>
          )}

          <p className={s.heroDeck}>{post.excerpt}</p>

          {post.tags.length > 0 && (
            <div className={s.tags}>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tag=${encodeURIComponent(tag)}`}
                  className={s.tag}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className={s.byline}>
            <div className={s.bylineText}>
              <div className={s.bylineName}>Whiteprint Research</div>
              <div className={s.bylineSub}>Independent Analysis</div>
            </div>
            <div className={s.bylineStats}>
              <div className={s.bylineStat}>
                <span className={s.bylineStatVal}>{post.readTime}</span>
                Min Read
              </div>
              <div className={s.bylineStat}>
                <span className={s.bylineStatVal}>{post.tags.length}</span>
                Tags
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body layout */}
      <div className={s.layout}>
        {/* Main article */}
        <div className={s.article}>
          {post.marketNoteTable ? (
            <MarketNoteTable
              heading={getSummaryHeading(post.category)}
              {...post.marketNoteTable}
            />
          ) : null}
          {post.content}
        </div>

        {/* Sidebar */}
        <aside className={s.sidebar}>
          {hasCustomSidebarCards ? (
            customSidebarCards.map((card) => (
              <div key={card.title} className={s.sidebarCard}>
                <div className={s.sidebarHead}>{card.title}</div>
                <div className={s.sidebarBody}>
                  {card.rows.map((row) => (
                    <div key={`${card.title}-${row.label}`} className={s.kvRow}>
                      <span className={s.kvLabel}>{row.label}</span>
                      <span className={getSidebarValueClass(row.tone)}>{row.value}</span>
                    </div>
                  ))}
                </div>
                {card.note ? (
                  <div className={s.sidebarNote}>{card.note}</div>
                ) : null}
              </div>
            ))
          ) : (
            <>
              <div className={s.sidebarCard}>
                <div className={s.sidebarHead}>Article Info</div>
                <div className={s.sidebarBody}>
                  <div className={s.kvRow}>
                    <span className={s.kvLabel}>Category</span>
                    <span className={s.kvValueMono}>{categoryLabel}</span>
                  </div>
                  <div className={s.kvRow}>
                    <span className={s.kvLabel}>Published</span>
                    <span className={s.kvValueMono}>{formatPostDate(post.date)}</span>
                  </div>
                  <div className={s.kvRow}>
                    <span className={s.kvLabel}>Read Time</span>
                    <span className={`${s.kvValue} ${s.kvValueNeutral}`}>{post.readTime} min</span>
                  </div>
                </div>
                <div className={s.sidebarNote}>
                  All content is for informational purposes only and does not constitute investment advice.
                </div>
              </div>

              {post.tags.length > 0 && (
                <div className={s.sidebarCard}>
                  <div className={s.sidebarHead}>Topics</div>
                  <div className={s.tagCloud}>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?tag=${encodeURIComponent(tag)}`}
                        className={s.sidebarTag}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {post.reportDownload ? (
            <a
              href={post.reportDownload.href}
              download={post.reportDownload.filename}
              className={s.sidebarReportButton}
            >
              {post.reportDownload.label ?? "Report"}
            </a>
          ) : null}

          {/* Back link */}
          <div style={{ marginTop: 8 }}>
            <Link
              href={categoryHref}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#909090",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← Back to {categoryLabel}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
