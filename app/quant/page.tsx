import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import type { PostMeta } from "@/lib/post-meta"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Quant Research",
  description: "Options pricing, derivatives analysis, and interactive financial models.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/quant`,
  },
}

const ACCENT = "#2d6ab8"
const BG = "#060810"
const SURFACE = "#0d0f1a"
const INK = "#f5f2eb"
const MUTED = "rgba(245,242,235,0.45)"
const BORDER = "rgba(245,242,235,0.08)"
const DISPLAY = "'Playfair Display', Georgia, serif"
const MONO = "'JetBrains Mono', monospace"

interface FrameworkItem {
  q: string
  a: string
}

interface QuantPostMeta extends PostMeta {
  meta?: {
    framework?: FrameworkItem[]
    has_simulator?: boolean
    key_stat?: { label: string; value: string }
  }
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function FrameworkGrid({ items }: { items: FrameworkItem[] }) {
  const display = items.slice(0, 4)
  const labels = ["What", "Why", "When", "How"]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        background: BORDER,
        marginTop: 12,
      }}
    >
      {display.map((item, i) => (
        <div key={i} style={{ background: BG, padding: "10px 12px" }}>
          <span
            style={{
              display: "block",
              fontFamily: MONO,
              fontSize: 9,
              color: ACCENT,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {item.q || labels[i]}
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: MUTED,
              lineHeight: 1.5,
            }}
          >
            {item.a}
          </span>
        </div>
      ))}
    </div>
  )
}

function ArticleCard({ post }: { post: QuantPostMeta }) {
  const framework = post.meta?.framework
  const hasSimulator = post.meta?.has_simulator

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="bg-[#0d0f1a] hover:bg-[#111626] transition-colors duration-150 ease-in-out"
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
        {hasSimulator && (
          <span
            style={{
              display: "inline-block",
              padding: "2px 7px",
              border: `1px solid ${ACCENT}`,
              color: ACCENT,
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.12em",
            }}
          >
            + Simulator
          </span>
        )}
      </div>
      <p
        style={{
          margin: "0 0 8px",
          fontFamily: MONO,
          fontSize: 15,
          fontWeight: 500,
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
      {framework && framework.length > 0 && <FrameworkGrid items={framework} />}
    </Link>
  )
}

export default async function QuantPage() {
  const allPosts = await getAllPosts()
  // "quant" is not in postCategories — filter by topicSlug or tag
  const posts = allPosts.filter(
    (p) =>
      p.topicSlug === "quant" ||
      (p.topicSlug ?? "").includes("quant") ||
      p.tags.includes("quant") ||
      p.tags.includes("options") ||
      p.tags.includes("derivatives"),
  ) as QuantPostMeta[]

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
          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: MONO,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              color: ACCENT,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            QUANT_LAB
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
            Options pricing, derivatives analysis, and interactive financial models.
          </p>
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
          Quantitative Research
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
            No quant research published yet.
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
