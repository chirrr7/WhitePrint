import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
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
import { SEO_CONFIG } from "@/lib/seo.config"
import {
  getArticleBySlug,
  getPostMetaBySlug,
} from "@/lib/posts"
import { isMobilePreviewEnabled, withMobilePreviewHref } from "@/lib/mobile-preview"
import { cn } from "@/lib/utils"
import { sectionAccent } from "@/lib/tokens"
import { ArticleProgressBar } from "./progress-bar"
import { MobileArticleViewer } from "@/components/mobile-article-viewer"
import type { BriefData } from "@/components/TheBrief"
import { BriefToggle } from "./brief-toggle"
import s from "./article.module.css"
import marketNoteStyles from "./market-note.module.css"

// SimulatorSlot is created by another agent — import defensively
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimulatorSlot = dynamic(
  () =>
    import("@/components/simulators/index").then((mod) => mod.SimulatorSlot).catch(() => () => null)
)

interface Props {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostMetaBySlug(slug)
  if (!post) return {}

  const url = `${SEO_CONFIG.siteUrl}/posts/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      siteName: SEO_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

// Fetch brief_data + meta extras from Supabase without touching the main post layer
async function getPostExtras(slug: string): Promise<{
  briefData: BriefData | null
  simulatorType: string | null
}> {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("posts") as any)
      .select("brief_data, meta")
      .eq("slug", slug)
      .maybeSingle()
    if (!data) return { briefData: null, simulatorType: null }
    const briefData =
      data.brief_data && typeof data.brief_data === "object"
        ? (data.brief_data as BriefData)
        : null
    const simulatorType =
      data.meta &&
      typeof data.meta === "object" &&
      typeof (data.meta as Record<string, unknown>).simulator_type === "string"
        ? ((data.meta as Record<string, unknown>).simulator_type as string)
        : null
    return { briefData, simulatorType }
  } catch {
    return { briefData: null, simulatorType: null }
  }
}

export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const forceMobilePreview = isMobilePreviewEnabled(resolvedSearchParams.mobile)
  const [post, postExtras] = await Promise.all([
    getArticleBySlug(slug),
    getPostExtras(slug),
  ])
  if (!post) notFound()
  const { briefData, simulatorType } = postExtras

  const categoryHref = getPostCategoryHref(post.category)
  const categoryLabel = getPostCategoryLabel(post.category)
  const customSidebarCards = post.sidebarCards ?? []
  const hasCustomSidebarCards = customSidebarCards.length > 0
  const mobileHighlights = hasCustomSidebarCards
    ? customSidebarCards
        .flatMap((card) => card.rows.map((row) => ({ label: row.label, value: row.value })))
        .slice(0, 4)
    : post.marketNoteTable
      ? [
          { label: "Stance", value: post.marketNoteTable.stance },
          { label: "Confidence", value: post.marketNoteTable.confidence },
          { label: "Horizon", value: post.marketNoteTable.horizon },
        ]
      : [
          { label: "Category", value: categoryLabel },
          { label: "Published", value: formatPostDate(post.date) },
          { label: "Read time", value: `${post.readTime} min` },
        ]

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

  // Build mobile tables/sidebar content — wrap in s.wrapper so CSS variables are available
  const mobileTablesContent = (
    <div className={s.wrapper}>
      {post.marketNoteTable ? (
        <MarketNoteTable
          heading={getSummaryHeading(post.category)}
          {...post.marketNoteTable}
        />
      ) : null}

      {hasCustomSidebarCards ? (
        customSidebarCards.map((card) => (
          <div key={card.title} className={s.sidebarCard}>
            <div className={s.sidebarHead}>{card.title}</div>
            <div className={s.sidebarBody}>
              {card.rows.map((row) => (
                <div key={`${card.title}-${row.label}`} className={s.kvRow}>
                  <span className={s.kvLabel}>{row.label}</span>
                  <span className={getSidebarValueClass(row.tone)}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {card.note ? (
              <div className={s.sidebarNote}>{card.note}</div>
            ) : null}
          </div>
        ))
      ) : (
        <div className={s.sidebarCard}>
          <div className={s.sidebarHead}>Article Info</div>
          <div className={s.sidebarBody}>
            <div className={s.kvRow}>
              <span className={s.kvLabel}>Category</span>
              <span className={s.kvValueMono}>{categoryLabel}</span>
            </div>
            <div className={s.kvRow}>
              <span className={s.kvLabel}>Published</span>
              <span className={s.kvValueMono}>
                {formatPostDate(post.date)}
              </span>
            </div>
            <div className={s.kvRow}>
              <span className={s.kvLabel}>Read Time</span>
              <span className={`${s.kvValue} ${s.kvValueNeutral}`}>
                {post.readTime} min
              </span>
            </div>
          </div>
          <div className={s.sidebarNote}>
            All content is for informational purposes only and does not
            constitute investment advice.
          </div>
        </div>
      )}

      {post.tags.length > 0 && (
        <div className={s.sidebarCard} style={{ marginTop: 16 }}>
          <div className={s.sidebarHead}>Topics</div>
          <div className={s.tagCloud}>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={withMobilePreviewHref(`/search?tag=${encodeURIComponent(tag)}`, forceMobilePreview)}
                className={s.sidebarTag}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {post.reportDownload ? (
        <a
          href={post.reportDownload.href}
          download={post.reportDownload.filename}
          className={s.sidebarReportButton}
          style={{ marginTop: 16 }}
        >
          {post.reportDownload.label ?? "Report"}
        </a>
      ) : null}
    </div>
  )

  return (
    <>
      {/* ── Mobile Article Viewer ── */}
      <MobileArticleViewer
        title={post.title}
        displayTitle={post.displayTitle}
        backHref={categoryHref}
        category={categoryLabel}
        date={formatPostDate(post.date)}
        excerpt={post.excerpt}
        highlights={mobileHighlights}
        readTime={post.readTime}
        reportDownload={post.reportDownload}
        tagCount={post.tags.length}
        tags={post.tags}
        articleClassName={s.article}
        articleContent={
          <div className={s.wrapper}>
            {post.content}
          </div>
        }
        tablesContent={mobileTablesContent}
      />

      {/* ── Desktop Layout ── */}
      <div
        className={cn(
          "desktop-only",
          s.wrapper,
          post.category === "market-notes" && marketNoteStyles.wrapper,
        )}
        style={{ '--accent': sectionAccent[post.category] } as React.CSSProperties}
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
              <h1
                className={s.title}
                dangerouslySetInnerHTML={{ __html: post.displayTitle }}
              />
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
                    {formatTagLabel(tag)}
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

        {/* Brief — above article body, collapsed by default on desktop */}
        {briefData ? (
          <div style={{ maxWidth: 760, margin: "0 auto 32px", padding: "0 40px" }}>
            <BriefToggle brief={briefData} postTitle={post.title} postSlug={post.slug} />
          </div>
        ) : null}

        {/* Body layout */}
        <div className={s.layout}>
          {/* Main article */}
          <div id="article-body" className={s.article}>
            {post.marketNoteTable ? (
              <MarketNoteTable
                heading={getSummaryHeading(post.category)}
                {...post.marketNoteTable}
              />
            ) : null}
            {post.content}
            {/* Simulator slot — rendered if meta.simulator_type is set */}
            {simulatorType ? (
              <SimulatorSlot type={simulatorType} />
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className={s.sidebar}>
            {hasCustomSidebarCards ? (
              customSidebarCards.map((card) => (
                <div key={card.title} className={s.sidebarCard}>
                  <div className={s.sidebarHead}>{card.title}</div>
                  <div className={s.sidebarBody}>
                    {card.rows.map((row) => (
                      <div
                        key={`${card.title}-${row.label}`}
                        className={s.kvRow}
                      >
                        <span className={s.kvLabel}>{row.label}</span>
                        <span className={getSidebarValueClass(row.tone)}>
                          {row.value}
                        </span>
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
                      <span className={s.kvValueMono}>
                        {formatPostDate(post.date)}
                      </span>
                    </div>
                    <div className={s.kvRow}>
                      <span className={s.kvLabel}>Read Time</span>
                      <span className={`${s.kvValue} ${s.kvValueNeutral}`}>
                        {post.readTime} min
                      </span>
                    </div>
                  </div>
                  <div className={s.sidebarNote}>
                    All content is for informational purposes only and does not
                    constitute investment advice.
                  </div>
                </div>

                {post.tags.length > 0 && (
                  <div className={s.sidebarCard}>
                    <div className={s.sidebarHead}>Topics</div>
                    <div className={s.tagCloud}>
                      {post.tags.map((tag) => (
              <Link
                key={tag}
                href={withMobilePreviewHref(`/search?tag=${encodeURIComponent(tag)}`, forceMobilePreview)}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: SEO_CONFIG.siteName,
              url: SEO_CONFIG.siteUrl,
            },
            publisher: {
              "@type": "Organization",
              name: SEO_CONFIG.siteName,
              url: SEO_CONFIG.siteUrl,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SEO_CONFIG.siteUrl}/posts/${post.slug}`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}

function formatTagLabel(value: string) {
  const normalized = value.trim().toLowerCase()

  switch (normalized) {
    case "orcl":
      return "Oracle"
    case "eog":
      return "EOG"
    case "e-and-p":
      return "E&P"
    case "roic":
      return "ROIC"
    case "dcf":
      return "DCF"
    default:
      return normalized.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }
}
