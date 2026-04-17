import Link from "next/link"
import type { PostMeta } from "@/lib/post-meta"
import type { PublicDeskBrief } from "@/lib/public-site"
import s from "./ResearchSection.module.css"

interface ResearchSectionProps {
  deskBriefs: PublicDeskBrief[]
  featured: PostMeta | null
  latest: PostMeta[]
}

export function ResearchSection({ deskBriefs, featured, latest }: ResearchSectionProps) {
  if (!featured && latest.length === 0) {
    return null
  }

  return (
    <section className={s.section} id="research">
      <div className={s.wrap}>
        {featured ? (
          <>
            <div className={`${s.headerRow} ${s.headerRowLight}`}>
              <span className={s.labelLight}>Featured</span>
              <div className={s.ruleLight} />
            </div>

            <div className={`${s.featuredCard} ${!deskBriefs.length ? s.featuredCardSolo : ""} fade-in-up`}>
            <Link href={`/posts/${featured.slug}`} className={s.featuredBody}>
              <div className={s.featuredKicker}>
                <span className={`${s.pill} ${s.pillDark}`}>{featured.topicLabel ?? "Research"}</span>
                {featured.tags[0] ? (
                  <span className={`${s.pill} ${s.pillTag}`}>{humanizeLabel(featured.tags[0])}</span>
                ) : null}
                <span className={s.pillDate}>{formatDateLabel(featured.date)}</span>
              </div>

              <h2
                className={s.featuredTitle}
                dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(featured.displayTitle ?? featured.title) }}
              />
              <p className={s.featuredDeck}>{featured.excerpt}</p>

              <div className={s.featuredStats}>
                <div className={s.fStat}>
                  <div className={s.fStatVal}>{featured.readTime}</div>
                  <div className={s.fStatLabel}>Min read</div>
                </div>
                <div className={s.fStat}>
                  <div className={s.fStatVal}>{formatCountValue(featured.sourcesCount ?? null)}</div>
                  <div className={s.fStatLabel}>Sources</div>
                </div>
                <div className={s.fStat}>
                  <div className={s.fStatVal}>{formatCountValue(featured.scenariosCount ?? null)}</div>
                  <div className={s.fStatLabel}>Scenarios</div>
                </div>
              </div>

              <span className={s.featuredCta}>Read Full Analysis →</span>
            </Link>

            {deskBriefs.length ? (
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
            ) : null}
            </div>
          </>
        ) : null}

        {latest.length ? (
          <>
            <div className={`${s.headerRow} ${s.headerRowLight} ${s.latestHeader}`}>
              <span className={s.labelLight}>Latest Research</span>
              <div className={s.ruleLight} />
              <Link href="/research" className={s.linkLight}>
                All Research →
              </Link>
            </div>

            <div className={s.rgWrap}>
              {latest.map((post) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className={`${s.rCard} fade-in-up`}>
                  <div>
                    <div className={s.rCardKicker}>
                      <span className={`${s.pill} ${s.pillDark}`}>{post.topicLabel ?? "Research"}</span>
                      {post.tags[0] ? (
                        <span className={`${s.pill} ${s.pillTag}`}>{humanizeLabel(post.tags[0])}</span>
                      ) : null}
                      <span className={s.rPillDate}>{formatDateLabel(post.date)}</span>
                    </div>

                    <h3
                      className={s.rCardTitle}
                      dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(post.displayTitle ?? post.title) }}
                    />
                    <p className={s.rCardDeck}>{post.excerpt}</p>
                  </div>

                  <div className={s.rCardAside}>
                    <div className={s.rCardMeta}>
                      {post.readTime} min
                      {post.tags[0]
                        ? ` · ${humanizeLabel(post.tags[0])}`
                        : ` · ${post.topicLabel ?? "Research"}`}
                    </div>
                    <span className={s.rCardCta}>Read Full Note →</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
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

function sanitizeInlineHtml(value: string) {
  const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  return escaped.replace(/&lt;em&gt;/g, "<em>").replace(/&lt;\/em&gt;/g, "</em>")
}
