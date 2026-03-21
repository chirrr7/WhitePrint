import Link from "next/link"
import { getAllPosts, getPostMetaBySlug, getPostsByCategory } from "@/lib/posts"
import { formatPostDate, getPostCategoryLabel, type PostMeta } from "@/lib/post-meta"
import s from "./home.module.css"

interface DeskBrief {
  eyebrow: string
  stance: "Caution" | "Hold" | "Neutral"
  summary: string
  href: string
  cta: string
}

export default function HomePage() {
  const featuredMacro =
    getPostMetaBySlug("liquidity-squeeze-fed-march-2026") ??
    getPostsByCategory("macro")[0] ??
    getAllPosts()[0]

  const researchPosts = getAllPosts()
    .filter((post) => post.category !== "market-notes")
    .slice(0, 3)

  const marketNotes = getPostsByCategory("market-notes")

  const deskBriefs: DeskBrief[] = [
    {
      eyebrow: "EM / Oil",
      stance: "Caution",
      summary:
        "If event-implied oil probabilities are taken seriously, the bigger macro question is which emerging markets are forced to absorb a longer energy shock.",
      href: "/posts/liquidity-squeeze-fed-march-2026",
      cta: "Analysis",
    },
    {
      eyebrow: "Oil",
      stance: "Caution",
      summary:
        "The late-February escalation has reintroduced energy volatility into the inflation narrative and complicates the Fed's path.",
      href: "/posts/eog-resources-the-base-case-is-priced-in",
      cta: "Equity View",
    },
    {
      eyebrow: "Fed",
      stance: "Hold",
      summary:
        "The March 17-18 decision is priced as a hold. The real signal is the dot plot revision and Powell's tone into the handover.",
      href: "/posts/fed-decision-week-three-things-to-watch",
      cta: "Market Note",
    },
  ]

  return (
    <div className={s.wrapper}>
      {/* Page content */}
      <div className={s.pageWrap}>

        {/* Section label: Today's Desk */}
        <div className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Today&apos;s Desk</span>
          <div className={s.sectionLabelRule} />
          <Link href="/macro" className={s.sectionLabelLink}>
            All Macro →
          </Link>
        </div>

        {/* Two-speed grid */}
        {featuredMacro ? (
          <div className={s.twoSpeed}>
            {/* Featured article */}
            <div className={s.featured}>
              <div className={s.kickerRow}>
                <span className={`${s.kickerPill} ${s.kickerDark}`}>
                  {getPostCategoryLabel(featuredMacro.category)}
                </span>
                <span className={s.kickerDate}>
                  {formatPostDate(featuredMacro.date)}
                </span>
              </div>

              <Link
                href={`/posts/${featuredMacro.slug}`}
                className={s.featuredTitle}
              >
                {featuredMacro.title}
              </Link>

              <div className={s.featuredDeck}>{featuredMacro.excerpt}</div>

              <div className={s.featuredStats}>
                <div className={s.featuredStat}>
                  <span className={s.featuredStatVal}>20</span>
                  <span className={s.featuredStatLabel}>Min read</span>
                </div>
                <div className={s.featuredStat}>
                  <span className={s.featuredStatVal}>12</span>
                  <span className={s.featuredStatLabel}>Sources</span>
                </div>
                <div className={s.featuredStat}>
                  <span className={s.featuredStatVal}>4</span>
                  <span className={s.featuredStatLabel}>Scenarios</span>
                </div>
              </div>

              <Link
                href={`/posts/${featuredMacro.slug}`}
                className={s.featuredCta}
              >
                Read Full Analysis →
              </Link>
            </div>

            {/* Desk Brief */}
            <div className={s.deskBrief}>
              <div className={s.briefHead}>
                <span className={s.briefHeadTitle}>Desk Brief</span>
              </div>
              {deskBriefs.map((brief) => (
                <Link
                  key={brief.eyebrow}
                  href={brief.href}
                  className={s.briefItem}
                >
                  <div className={s.briefItemTop}>
                    <span className={s.briefItemLabel}>{brief.eyebrow}</span>
                    <div className={s.briefItemSep} />
                    <span
                      className={
                        brief.stance === "Hold" ? s.badgeHold : s.badgeCaution
                      }
                    >
                      {brief.stance}
                    </span>
                  </div>
                  <p className={s.briefItemBody}>{brief.summary}</p>
                  <span className={s.briefItemLink}>{brief.cta} →</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* Section label: Latest Research */}
        <div className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Latest Research</span>
          <div className={s.sectionLabelRule} />
          <Link href="/macro" className={s.sectionLabelLink}>
            All Research →
          </Link>
        </div>

        {/* Research cards */}
        <div style={{ marginBottom: 52 }}>
          {researchPosts.map((post) => (
            <ResearchCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Section label: Market Notes */}
        <div className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Market Notes</span>
          <div className={s.sectionLabelRule} />
          <Link href="/market-notes" className={s.sectionLabelLink}>
            All Notes →
          </Link>
        </div>

        {/* Market Note cards */}
        <div style={{ marginBottom: 52 }}>
          {marketNotes.map((post) => (
            <NoteCard key={post.slug} post={post} />
          ))}
        </div>

      </div>
    </div>
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
