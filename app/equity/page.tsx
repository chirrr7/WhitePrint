import type { Metadata } from "next"
import Link from "next/link"
import { getPostsByCategory } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import type { PostMeta } from "@/lib/post-meta"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Forensic Equity Research",
  description: "Deep forensic analysis of public company filings — footnotes, accounting signals, and FCF divergence.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/equity`,
  },
}

const ACCENT = "#b83025"
const BG = "#0a0a0a"
const SURFACE = "#111110"
const INK = "#f5f2eb"
const MUTED = "rgba(245,242,235,0.45)"
const BORDER = "rgba(245,242,235,0.08)"
const DISPLAY = "'Playfair Display', Georgia, serif"
const MONO = "'JetBrains Mono', monospace"

const reasonCards = [
  { num: "01", title: "10-K forensics", body: "Footnotes reveal what management hides — from lease obligations buried in note 7 to silent liability transfers." },
  { num: "02", title: "Accounting signal detection", body: "Useful-life extension tricks, off-balance-sheet exposure, and goodwill that should have been impaired three quarters ago." },
  { num: "03", title: "FCF vs net income divergence", body: "The tell of every blow-up. When accruals widen and cash conversion deteriorates, the earnings story ends." },
  { num: "04", title: "Thesis with evidence", body: "Every call backed by primary source — original filings, not consensus summaries or sell-side recycling." },
]

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function Stancebadge({ stance }: { stance: string }) {
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
        {post.stance && <Stancebadge stance={post.stance} />}
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

export default async function EquityPage() {
  const posts = await getPostsByCategory("equity")

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
        {/* Grain overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            pointerEvents: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Accent rule */}
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
            Forensic Equity Research
          </p>
          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: DISPLAY,
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: INK,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            We read the{" "}
            <em style={{ color: ACCENT, fontStyle: "italic", fontWeight: 600 }}>
              footnotes.
            </em>
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: DISPLAY,
              fontSize: 16,
              fontWeight: 300,
              color: MUTED,
              lineHeight: 1.7,
              maxWidth: 520,
            }}
          >
            Deep forensic analysis of public company filings.
          </p>
        </div>
      </section>

      {/* Reason cards */}
      <section style={{ padding: "64px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 1,
            background: BORDER,
          }}
        >
          {reasonCards.map((card) => (
            <div
              key={card.num}
              style={{
                background: SURFACE,
                backgroundColor: `color-mix(in srgb, ${SURFACE} 97%, ${ACCENT})`,
                border: `1px solid ${BORDER}`,
                padding: "28px 28px 32px",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: MONO,
                  fontSize: 10,
                  color: ACCENT,
                  letterSpacing: "0.18em",
                  marginBottom: 14,
                }}
              >
                {card.num}
              </span>
              <p
                style={{
                  margin: "0 0 10px",
                  fontFamily: DISPLAY,
                  fontSize: 16,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: DISPLAY,
                  fontSize: 13,
                  fontWeight: 400,
                  color: MUTED,
                  lineHeight: 1.7,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Article list */}
      <section style={{ padding: "0 48px 80px", maxWidth: 900, margin: "0 auto" }}>
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
          Published Research — Equity
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
            No equity research published yet.
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
