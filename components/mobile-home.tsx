import Link from "next/link"
import { MobileDeskPreview } from "@/components/mobile-desk-preview"
import { StancesTicker } from "@/components/StancesTicker"
import { withMobilePreviewHref } from "@/lib/mobile-preview"
import { formatPostDate, getPostCategoryLabel, type PostMeta } from "@/lib/post-meta"
import type { Stance } from "@/lib/stances"

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Source Serif 4", Georgia, serif'
const DISPLAY = '"Playfair Display", Georgia, serif'

export function MobileHome({
  briefs,
  featured,
  forceMobilePreview = false,
  heroLabel,
  showDeskBriefs = true,
  showStances = true,
  stances,
}: {
  briefs: PostMeta[]
  featured: PostMeta
  forceMobilePreview?: boolean
  heroLabel?: string
  showDeskBriefs?: boolean
  showStances?: boolean
  stances: Stance[]
}) {
  return (
    <div
      className="mobile-only mobile-home-shell"
      style={{
        background: "var(--mobile-page-bg)",
        color: "var(--mobile-page-fg)",
        minHeight: "calc(100dvh - 44px - 72px)",
      }}
    >
      <div className="mobile-home-lead" style={{ padding: "24px 16px 20px" }}>
        {heroLabel ? (
          <div
            className="mobile-home-label mav-stagger-1"
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
          className="mobile-home-meta mav-stagger-2"
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
          href={withMobilePreviewHref(`/posts/${featured.slug}`, forceMobilePreview)}
          className="mobile-tap-red mobile-home-title mav-stagger-3"
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
          className="mobile-home-excerpt mav-stagger-4"
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
          href={withMobilePreviewHref(`/posts/${featured.slug}`, forceMobilePreview)}
          className="mobile-tap-red mobile-home-cta mav-stagger-5"
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
          Read analysis →
        </Link>
      </div>

      {showStances ? <StancesTicker stances={stances} /> : null}

      {showDeskBriefs && briefs.length ? (
        <div className="mobile-home-briefs" style={{ padding: "20px 16px 24px" }}>
          <div
            className="mobile-home-briefs-label"
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--mobile-page-subtle)",
              marginBottom: 14,
            }}
          >
            Research Desk
          </div>
          <MobileDeskPreview
            forceMobilePreview={forceMobilePreview}
            posts={briefs}
          />
        </div>
      ) : null}
    </div>
  )
}
