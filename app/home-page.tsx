"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { PostMeta } from "@/lib/posts"
import s from "./home.module.css"

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function categoryLabel(cat: string) {
  if (cat === "macro") return "Macro"
  if (cat === "equity") return "Equity Research"
  if (cat === "market-notes") return "Market Notes"
  return cat
}

function badgeClass(type?: string) {
  if (type === "hold") return s.badgeHold
  if (type === "caution") return s.badgeCaution
  return s.badgeWatch
}

interface HomePageProps {
  featuredPost: PostMeta | null
  researchPosts: PostMeta[]
  marketNotes: PostMeta[]
  briefItems: PostMeta[]
  totalPosts: number
}

export function HomePage({ featuredPost, researchPosts, marketNotes, briefItems, totalPosts }: HomePageProps) {
  const [liveDate, setLiveDate] = useState("")

  useEffect(() => {
    setLiveDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    )
  }, [])

  return (
    <div className={s.wrapper}>
      {/* Masthead */}
      <div className={s.masthead}>
        <div className={s.mastheadInner}>
          <div>
            <div className={s.mastheadWordmark}>Whiteprint <em>Research</em></div>
            <div className={s.mastheadTagline}>Independent Macro &amp; Equity Research</div>
          </div>
          <div className={s.mastheadRight}>
            <div className={s.mastheadDate}>{liveDate}</div>
            <div className={s.mastheadIssue}>Vol. I &middot; No. {totalPosts}</div>
          </div>
        </div>
      </div>

      <div className={s.pageWrap}>
        {/* TODAY'S DESK */}
        <div className={s.sectionLabel}>
          <span className={s.sectionLabelText}>Today&apos;s Desk</span>
          <div className={s.sectionLabelRule} />
        </div>

        <div className={s.twoSpeed}>
          {/* Featured */}
          {featuredPost && (
            <div className={s.featured}>
              <div className={s.featuredKicker}>
                <span className={`${s.kickerPill} ${s.kickerDark}`}>Featured</span>
                <span className={`${s.kickerPill} ${s.kickerDark}`}>{categoryLabel(featuredPost.category)}</span>
                <span className={s.kickerDate}>{formatDate(featuredPost.date)}</span>
              </div>
              <div className={s.featuredTitle} dangerouslySetInnerHTML={{
                __html: featuredPost.title
                  .replace(/Liquidity Squeeze:/g, '<em>Liquidity Squeeze:</em>')
              }} />
              <div className={s.featuredDeck}>{featuredPost.excerpt}</div>
              <div className={s.featuredStats}>
                {featuredPost.readTime && (
                  <div className={s.featuredStat}>
                    <div className={s.featuredStatVal}>{featuredPost.readTime.replace(/\s*min.*/, '')}</div>
                    <div className={s.featuredStatLabel}>Min read</div>
                  </div>
                )}
                {featuredPost.sources && (
                  <div className={s.featuredStat}>
                    <div className={s.featuredStatVal}>{featuredPost.sources}</div>
                    <div className={s.featuredStatLabel}>Sources</div>
                  </div>
                )}
                {featuredPost.scenarios && (
                  <div className={s.featuredStat}>
                    <div className={s.featuredStatVal}>{featuredPost.scenarios}</div>
                    <div className={s.featuredStatLabel}>Scenarios</div>
                  </div>
                )}
              </div>
              <div className={s.featuredTags}>
                {featuredPost.tags.map((tag) => (
                  <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`} className={s.tag}>#{tag}</Link>
                ))}
              </div>
              <Link href={`/posts/${featuredPost.slug}`} className={s.featuredCta}>
                Read Full Analysis &#8594;
              </Link>
            </div>
          )}

          {/* Desk Brief */}
          <div className={s.deskBrief}>
            <div className={s.briefHead}>
              <span className={s.briefHeadTitle}>Desk Brief</span>
              <span className={s.briefHeadDate}>{liveDate ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
            </div>
            {briefItems.map((item) => (
              <div key={item.slug} className={s.briefItem}>
                <div className={s.briefItemHeader}>
                  <span className={s.briefItemLabel}>{item.briefLabel}</span>
                  <div className={s.briefItemSep} />
                  <span className={`${s.briefBadge} ${badgeClass(item.briefBadgeType)}`}>{item.briefBadge}</span>
                </div>
                <div className={s.briefItemBody}>{item.briefSummary}</div>
                <Link href={`/posts/${item.slug}`} className={s.briefItemLink}>
                  {item.category === "market-notes" ? "Market Note" : "Full Analysis"} &#8594;
                </Link>
              </div>
            ))}
            <div className={s.briefFooter}>
              <div className={s.briefFooterText}>
                Desk Brief reflects published Whiteprint analysis.<br />
                Not investment advice. For informational purposes only.
              </div>
            </div>
          </div>
        </div>

        {/* LATEST RESEARCH */}
        {researchPosts.length > 0 && (
          <>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelText}>Latest Research</span>
              <div className={s.sectionLabelRule} />
              <Link href="/macro" className={s.sectionLabelLink}>All Research &#8594;</Link>
            </div>
            <div className={s.researchGrid}>
              {researchPosts.map((post) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className={s.rCard}>
                  <div className={s.rCardInner}>
                    <div className={s.rCardBody}>
                      <div className={s.rCardKicker}>
                        <span className={`${s.kickerPill} ${s.kickerDark}`}>{categoryLabel(post.category)}</span>
                        <span className={s.rCardDate}>{formatShortDate(post.date)}</span>
                      </div>
                      <div className={s.rCardTitle}>{post.title}</div>
                      <div className={s.rCardDeck}>{post.excerpt}</div>
                    </div>
                    <div className={s.rCardAside}>
                      <div className={s.rCardMeta}>
                        {post.readTime}{post.sources ? ` \u00B7 ${post.sources} sources` : ""}
                      </div>
                      <span className={s.rCardCta}>Read Full Analysis &#8594;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* MARKET NOTES */}
        {marketNotes.length > 0 && (
          <>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelText}>Market Notes</span>
              <div className={s.sectionLabelRule} />
              <Link href="/market-notes" className={s.sectionLabelLink}>All Notes &#8594;</Link>
            </div>
            <div className={s.notesWrap}>
              <div>
                {marketNotes.map((note) => (
                  <Link key={note.slug} href={`/posts/${note.slug}`} className={s.nCard}>
                    <div className={s.nCardInner}>
                      <div className={s.nCardBody}>
                        <div className={s.nCardKicker}>
                          <span className={s.nPillRed}>Market Note</span>
                          <span className={`${s.kickerPill} ${s.kickerDark}`}>Macro</span>
                        </div>
                        <div className={s.nCardTitle}>{note.title}</div>
                        <div className={s.nCardDeck}>{note.excerpt}</div>
                      </div>
                      <div className={s.nCardAside}>
                        <div className={s.nCardMeta}>{formatShortDate(note.date)} &middot; {note.readTime}</div>
                        <span className={s.nCardRead}>Read &#8594;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className={s.notesBar}>
                <span className={s.notesBarText}>Short briefings for readers without a finance background.</span>
                <Link href="/market-notes" className={s.notesBarLink}>All Market Notes &#8594;</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
