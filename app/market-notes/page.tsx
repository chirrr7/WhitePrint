import type { Metadata } from "next"
import Link from "next/link"
import { getPostsByCategory } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import type { PostMeta } from "@/lib/post-meta"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Market Notes",
  description: "Short-form market observations filed within 24 hours of price action.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/market-notes`,
  },
}

const ACCENT = "#2d7a4f"
const BG = "#080908"
const SURFACE = "#0f120f"
const INK = "#f5f2eb"
const MUTED = "rgba(245,242,235,0.45)"
const BORDER = "rgba(245,242,235,0.08)"
const DISPLAY = "'Playfair Display', Georgia, serif"
const MONO = "'JetBrains Mono', monospace"

interface KeyStat {
  label: string
  value: string
}

interface MarketNotePostMeta extends PostMeta {
  meta?: {
    key_stat?: KeyStat
    framework?: Array<{ q: string; a: string }>
    has_simulator?: boolean
  }
}

function parseDateParts(date: string) {
  const d = new Date(`${date}T00:00:00`)
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear().toString(),
  }
}

function NoteRow({ post }: { post: PostMeta }) {
  const { day, month, year } = parseDateParts(post.date)
  const keyStat = (post as MarketNotePostMeta).meta?.key_stat

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="hover:opacity-70 transition-opacity duration-150 ease-in-out"
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: 24,
        padding: "24px 0",
        borderBottom: `1px solid ${BORDER}`,
        textDecoration: "none",
        alignItems: "flex-start",
      }}
    >
      {/* Date column */}
      <div style={{ textAlign: "right", paddingTop: 4 }}>
        <span
          style={{
            display: "block",
            fontFamily: DISPLAY,
            fontSize: 40,
            fontWeight: 700,
            color: INK,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {day}
        </span>
        <span
          style={{
            display: "block",
            fontFamily: MONO,
            fontSize: 9,
            color: MUTED,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {month} {year}
        </span>
      </div>

      {/* Content column */}
      <div>
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: DISPLAY,
            fontSize: 17,
            fontWeight: 600,
            color: INK,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {post.title}
        </p>
        {post.excerpt && (
          <p
            style={{
              margin: "0 0 12px",
              fontFamily: DISPLAY,
              fontSize: 13,
              fontWeight: 400,
              color: MUTED,
              lineHeight: 1.65,
            }}
          >
            {post.excerpt}
          </p>
        )}
        {keyStat && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              border: `1px solid ${BORDER}`,
              background: SURFACE,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                background: ACCENT,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: MUTED,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {keyStat.label}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: INK,
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              {keyStat.value}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default async function MarketNotesPage() {
  const posts = await getPostsByCategory("market-notes")

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          background: BG,
          padding: "120px 48px 64px",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: ACCENT,
          }}
        />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <p
            style={{
              margin: "0 0 24px",
              fontFamily: MONO,
              fontSize: 10,
              color: ACCENT,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Market Notes
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: DISPLAY,
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: INK,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Filed within 24 hours.
          </h1>
        </div>
      </section>

      {/* Feed */}
      <section style={{ padding: "48px 48px 80px", maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: MUTED,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 8,
            borderBottom: `1px solid ${BORDER}`,
            paddingBottom: 16,
          }}
        >
          Notes — most recent first
        </p>
        {posts.length === 0 ? (
          <div
            style={{
              padding: "48px 32px",
              border: `1px solid ${BORDER}`,
              textAlign: "center",
              color: MUTED,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.12em",
            }}
          >
            No market notes published yet.
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <NoteRow key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
