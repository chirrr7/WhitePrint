import type { Metadata } from "next"
import Link from "next/link"
import { getPostsByCategory } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import { createClient } from "@/lib/supabase/server"
import type { PostMeta } from "@/lib/post-meta"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Global Macro",
  description: "Structural macro views on rates, dollar, commodities, and global capital flows.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/macro`,
  },
}

const ACCENT = "#8a6c3a"
const BG = "#080806"
const SURFACE = "#111110"
const INK = "#f5f2eb"
const MUTED = "rgba(245,242,235,0.45)"
const BORDER = "rgba(245,242,235,0.08)"
const DISPLAY = "'Playfair Display', Georgia, serif"
const MONO = "'JetBrains Mono', monospace"

interface Indicator {
  label: string
  value: string
  delta: string
  direction: 1 | -1
}

const FALLBACK_INDICATORS: Indicator[] = [
  { label: "US 10Y", value: "4.52%", delta: "+3bps", direction: 1 },
  { label: "DXY", value: "104.2", delta: "-0.3", direction: -1 },
  { label: "WTI", value: "$78.4", delta: "+1.2", direction: 1 },
  { label: "VIX", value: "14.8", delta: "-0.4", direction: -1 },
]

async function getMacroIndicators(): Promise<Indicator[]> {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("macro_indicators")
      .select("label, value, delta, direction")
      .order("sort_order", { ascending: true })

    if (error || !data || data.length === 0) {
      return FALLBACK_INDICATORS
    }

    return data as Indicator[]
  } catch {
    return FALLBACK_INDICATORS
  }
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StanceBadge({ stance }: { stance: string }) {
  const colors: Record<string, string> = {
    cautious: "#b83025",
    neutral: "#8a6c3a",
    constructive: "#2d7a4f",
  }
  const color = colors[stance] ?? MUTED
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        border: `1px solid ${color}`,
        color,
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {stance}
    </span>
  )
}

function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="bg-[#111110] hover:bg-[#1a1a1a] transition-colors duration-150 ease-in-out"
      style={{
        display: "block",
        padding: "24px 28px",
        border: `1px solid ${BORDER}`,
        textDecoration: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: "0.06em" }}>
          {formatDate(post.date)}
        </span>
        {post.stance && <StanceBadge stance={post.stance} />}
      </div>
      <p
        style={{
          margin: "0 0 8px",
          fontFamily: DISPLAY,
          fontSize: 18,
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
            margin: 0,
            fontFamily: DISPLAY,
            fontSize: 13,
            fontWeight: 400,
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          {post.excerpt}
        </p>
      )}
    </Link>
  )
}

export default async function MacroPage() {
  const [posts, indicators] = await Promise.all([
    getPostsByCategory("macro"),
    getMacroIndicators(),
  ])

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          background: BG,
          padding: "120px 48px 80px",
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
            Global Macro
          </p>
          <h1
            style={{
              margin: "0 0 48px",
              fontFamily: DISPLAY,
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: INK,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Structural views. Not noise.
          </h1>

          {/* Indicators strip */}
          <div>
            <p
              style={{
                margin: "0 0 12px",
                fontFamily: MONO,
                fontSize: 9,
                color: MUTED,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textAlign: "right",
              }}
            >
              Key Indicators · {today}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                border: `1px solid ${BORDER}`,
                background: BORDER,
                gap: 1,
              }}
            >
              {indicators.map((ind) => (
                <div
                  key={ind.label}
                  style={{
                    background: SURFACE,
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: MUTED,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {ind.label}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      color: INK,
                      letterSpacing: "0.04em",
                      fontWeight: 500,
                    }}
                  >
                    {ind.value}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: ind.direction === 1 ? "#2d7a4f" : "#b83025",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {ind.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article list */}
      <section style={{ padding: "48px 48px 80px", maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: MUTED,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Published Research — Macro
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
            No macro research published yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: BORDER }}>
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
