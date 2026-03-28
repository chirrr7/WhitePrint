import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts, getPostsByCategory } from "@/lib/posts"
import { formatPostDate, getPostCategoryLabel, type PostMeta } from "@/lib/post-meta"
import { SEO_CONFIG } from "@/lib/seo.config"
import { getStances } from "@/lib/stances"
import { MobileHome } from "@/components/mobile-home"
import s from "./home.module.css"

export const metadata: Metadata = {
  title: {
    absolute: "Whiteprint Research — Independent Macro & Equity Research",
  },
  description: SEO_CONFIG.siteDescription,
  alternates: {
    canonical: SEO_CONFIG.siteUrl,
  },
}

export default function HomePage() {
  const allPosts = getAllPosts()

  // Featured: most recent non-market-notes post
  const featuredPost =
    allPosts.find((p) => p.category !== "market-notes") ?? allPosts[0]

  // Desk briefs: 3 most recent non-market-notes posts
  const deskBriefPosts = allPosts
    .filter((p) => p.category !== "market-notes")
    .slice(0, 3)

  // Latest research: up to 4 most recent non-market-notes posts (exclude featured)
  const researchPosts = allPosts
    .filter((p) => p.category !== "market-notes" && p.slug !== featuredPost?.slug)
    .slice(0, 4)

  // Market notes: all market-notes posts
  const marketNotes = getPostsByCategory("market-notes")

  const stances = getStances()

  return (
    <>
      {featuredPost && (
        <MobileHome
          featured={featuredPost}
          briefs={deskBriefPosts}
          stances={stances}
        />
      )}
      <div className={`${s.wrapper} desktop-only`}>
        <div className={s.pageWrap}>

        {/* ── Today's Desk ── */}
        <div className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Today&apos;s Desk</span>
          <div className={s.sectionLabelRule} />
          <Link href="/macro" className={s.sectionLabelLink}>
            All Research →
          </Link>
        </div>

        {featuredPost ? (
          <div className={s.twoSpeed}>
            {/* Featured article */}
            <div className={s.featured}>
              <div className={s.kickerRow}>
                <span className={`${s.kickerPill} ${s.kickerDark}`}>
                  {getPostCategoryLabel(featuredPost.category)}
                </span>
                <span className={s.kickerDate}>
                  {formatPostDate(featuredPost.date)}
                </span>
              </div>

              <Link href={`/posts/${featuredPost.slug}`} className={s.featuredTitle}>
                {featuredPost.title}
              </Link>

              <div className={s.featuredDeck}>{featuredPost.excerpt}</div>

              <div className={s.featuredStats}>
                <div className={s.featuredStat}>
                  <span className={s.featuredStatVal}>{featuredPost.readTime}</span>
                  <span className={s.featuredStatLabel}>Min read</span>
                </div>
                <div className={s.featuredStat}>
                  <span className={s.featuredStatVal}>{featuredPost.tags.length}</span>
                  <span className={s.featuredStatLabel}>Tags</span>
                </div>
              </div>

              <Link href={`/posts/${featuredPost.slug}`} className={s.featuredCta}>
                Read Full Analysis →
              </Link>
            </div>

            {/* Desk Brief — driven by most recent posts */}
            <div className={s.deskBrief}>
              <div className={s.briefHead}>
                <span className={s.briefHeadTitle}>Desk Brief</span>
              </div>
              {deskBriefPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className={s.briefItem}
                >
                  <div className={s.briefItemTop}>
                    <span className={s.briefItemLabel}>
                      {post.eyebrow ?? post.tags[0] ?? getPostCategoryLabel(post.category)}
                    </span>
                  </div>
                  <p className={s.briefItemBody}>{post.excerpt}</p>
                  <span className={s.briefItemLink}>
                    {getPostCategoryLabel(post.category)} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Latest Research ── */}
        <div className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Latest Research</span>
          <div className={s.sectionLabelRule} />
          <Link href="/macro" className={s.sectionLabelLink}>
            All Research →
          </Link>
        </div>

        <div style={{ marginBottom: 52 }}>
          {researchPosts.map((post) => (
            <ResearchCard key={post.slug} post={post} />
          ))}
        </div>

        {/* ── Market Notes ── */}
        {marketNotes.length > 0 && (
          <>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelText}>Market Notes</span>
              <div className={s.sectionLabelRule} />
              <Link href="/market-notes" className={s.sectionLabelLink}>
                All Notes →
              </Link>
            </div>

            <div style={{ marginBottom: 52 }}>
              {marketNotes.map((post) => (
                <NoteCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}

        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SEO_CONFIG.siteName,
            url: SEO_CONFIG.siteUrl,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}

function ResearchCard({ post }: { post: PostMeta }) {
  return (
    <article className={s.rCard}>
      <div className={s.rCardInner}>
        <div className={s.rCardLeft}>
          <div className={s.rCardMeta}>
            {getPostCategoryLabel(post.category)} · {formatPostDate(post.date)} ·{" "}
            {post.readTime} min read
          </div>
          <Link href={`/posts/${post.slug}`} className={s.rCardTitle}>
            {post.title}
          </Link>
          <p className={s.rCardDeck}>{post.excerpt}</p>
        </div>
        <div className={s.rCardRight}>
          <Link href={`/posts/${post.slug}`} className={s.rCardCta}>
            Read Analysis →
          </Link>
        </div>
      </div>
    </article>
  )
}

function NoteCard({ post }: { post: PostMeta }) {
  return (
    <article className={s.nCard}>
      <div className={s.nCardInner}>
        <div className={s.nCardLeft}>
          <span className={s.nPillRed}>Market Note</span>
          <Link href={`/posts/${post.slug}`} className={s.nCardTitle}>
            {post.title}
          </Link>
          <p className={s.nCardDeck}>{post.excerpt}</p>
          <div className={s.nCardMeta}>
            {formatPostDate(post.date)} · {post.readTime} min
          </div>
        </div>
        <div className={s.nCardRight}>
          <Link href={`/posts/${post.slug}`} className={s.nCardCta}>
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
