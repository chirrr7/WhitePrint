import Link from "next/link"
import { StancesTicker } from "@/components/StancesTicker"
import { formatPostDate, getPostCategoryLabel, type PostMeta } from "@/lib/post-meta"
import type { Stance } from "@/lib/stances"

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Source Serif 4", Georgia, serif'
const DISPLAY = '"Playfair Display", Georgia, serif'

export function MobileHome({
  briefs,
  featured,
  heroLabel,
  showDeskBriefs = true,
  showStances = true,
  stances,
}: {
  briefs: PostMeta[]
  featured: PostMeta
  heroLabel?: string
  showDeskBriefs?: boolean
  showStances?: boolean
  stances: Stance[]
}) {
  return (
    <div
      className="mobile-only"
      style={{
        background: "var(--mobile-page-bg)",
        color: "var(--mobile-page-fg)",
        minHeight: "calc(100dvh - 44px - 72px)",
      }}
    >
      <div style={{ padding: "24px 16px 20px" }}>
        {heroLabel ? (
          <div
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            {heroLabel}
          </div>
        ) : null}

        <div
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--mobile-page-muted)",
            marginBottom: 14,
          }}
        >
          {getPostCategoryLabel(featured.category)} · {formatPostDate(featured.date)}
        </div>

        <Link
          href={`/posts/${featured.slug}`}
          className="mobile-tap-red"
          style={{
            fontFamily: DISPLAY,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "var(--mobile-page-fg)",
            textDecoration: "none",
            display: "block",
            marginBottom: 14,
          }}
        >
          {featured.title}
        </Link>

        <p
          style={{
            fontFamily: SERIF,
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--mobile-page-muted)",
            fontStyle: "italic",
            margin: "0 0 20px",
          }}
        >
          {featured.excerpt}
        </p>

        <Link
          href={`/posts/${featured.slug}`}
          className="mobile-tap-red"
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
            padding: "10px 20px",
            border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
            display: "inline-block",
          }}
        >
          Read Analysis →
        </Link>
      </div>

      {showStances ? <StancesTicker stances={stances} /> : null}

      {showDeskBriefs && briefs.length ? (
        <div style={{ padding: "20px 16px 24px" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--mobile-page-subtle)",
              marginBottom: 14,
            }}
          >
            Desk Brief
          </div>

          {briefs.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="mobile-tap-red"
              style={{
                display: "block",
                padding: "14px 0",
                borderBottom: "1px solid var(--mobile-page-line)",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {post.eyebrow ?? post.tags[0] ?? getPostCategoryLabel(post.category)}
              </span>
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--mobile-page-muted)",
                  display: "block",
                }}
              >
                {post.excerpt}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
