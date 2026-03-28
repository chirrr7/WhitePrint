import Link from "next/link"
import type { PostMeta } from "@/lib/post-meta"
import { formatPostDate, getPostCategoryLabel } from "@/lib/post-meta"
import type { Stance } from "@/lib/stances"

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Source Serif 4", Georgia, serif'
const DISPLAY = '"Playfair Display", Georgia, serif'

function stanceColor(stance: string) {
  switch (stance) {
    case "cautious":
      return "#b83025"
    case "constructive":
      return "#1b6a47"
    default:
      return "#8e6d26"
  }
}

export function MobileHome({
  featured,
  briefs,
  stances,
}: {
  featured: PostMeta
  briefs: PostMeta[]
  stances: Stance[]
}) {
  const tickerItems = [...stances, ...stances]

  return (
    <div
      className="mobile-only"
      style={{
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "calc(100dvh - 44px - 72px)",
      }}
    >
      {/* Featured / Deskbrief */}
      <div style={{ padding: "24px 16px 20px" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 14,
          }}
        >
          {getPostCategoryLabel(featured.category)} ·{" "}
          {formatPostDate(featured.date)}
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
            color: "#fff",
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
            color: "rgba(255,255,255,0.4)",
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
            color: "#b83025",
            textDecoration: "none",
            padding: "10px 20px",
            border: "1px solid rgba(184,48,37,0.35)",
            display: "inline-block",
          }}
        >
          Read Analysis →
        </Link>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          margin: "0 16px",
        }}
      />

      {/* Ticker */}
      <div style={{ overflow: "hidden", padding: "12px 0" }}>
        <div
          className="mobile-ticker-track"
          style={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
            paddingLeft: 16,
          }}
        >
          {tickerItems.map((stance, i) => (
            <Link
              key={`${stance.slug}-m-${i}`}
              href={`/posts/${stance.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                paddingRight: 16,
                marginRight: 16,
                borderRight: "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {stance.ticker}
              </span>
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {stance.name}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: stanceColor(stance.stance),
                }}
              >
                {stance.stance}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          margin: "0 16px",
        }}
      />

      {/* Desk Brief */}
      <div style={{ padding: "20px 16px 24px" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 8,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
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
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 8,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b83025",
                display: "block",
                marginBottom: 5,
              }}
            >
              {post.eyebrow ??
                post.tags[0] ??
                getPostCategoryLabel(post.category)}
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 13,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.45)",
                display: "block",
              }}
            >
              {post.excerpt}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
