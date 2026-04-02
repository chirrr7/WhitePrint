"use client"

import Link from "next/link"
import {
  startTransition,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useSearchParams } from "next/navigation"
import { MobileContentFrame } from "@/components/mobile-content-frame"
import { withMobilePreviewHref } from "@/lib/mobile-preview"

type Panel = "brief" | "read" | "data"

const MONO = '"JetBrains Mono", monospace'

interface MobileArticleHighlight {
  label: string
  value: string
}

interface MobileArticleReport {
  filename: string
  href: string
  label?: string
}

export function MobileArticleViewer({
  title,
  displayTitle,
  category,
  backHref,
  date,
  excerpt,
  highlights = [],
  readTime,
  reportDownload,
  tagCount,
  tags = [],
  articleClassName,
  articleContent,
  tablesContent,
}: {
  title: string
  displayTitle?: string
  category: string
  backHref: string
  date: string
  excerpt?: string
  highlights?: MobileArticleHighlight[]
  readTime?: number
  reportDownload?: MobileArticleReport
  tagCount?: number
  tags?: string[]
  articleClassName?: string
  articleContent: ReactNode
  tablesContent: ReactNode
}) {
  const searchParams = useSearchParams()
  const forceMobilePreview = searchParams.get("mobile") === "1"
  const [panel, setPanel] = useState<Panel>("brief")
  const [tableModal, setTableModal] = useState<{ html: string; title: string } | null>(null)
  const previewBackHref = withMobilePreviewHref(backHref, forceMobilePreview)

  const tagLinks = useMemo(
    () =>
      tags.map((tag) => ({
        label: tag,
        href: withMobilePreviewHref(`/search?tag=${encodeURIComponent(tag)}`, forceMobilePreview),
      })),
    [forceMobilePreview, tags],
  )

  const metaCards = useMemo(
    () => [
      readTime ? { label: "Read time", value: `${readTime} min` } : null,
      typeof tagCount === "number" && tagCount > 0
        ? { label: "Topics", value: `${tagCount}` }
        : null,
      { label: "Published", value: date },
    ].filter((card): card is MobileArticleHighlight => Boolean(card)),
    [date, readTime, tagCount],
  )

  const openPanel = (nextPanel: Panel) => {
    startTransition(() => {
      setPanel(nextPanel)
    })
  }

  const openTableModal = useCallback((payload: { html: string; title: string }) => {
    setTableModal(payload)
  }, [])

  const renderedTitle = displayTitle ? (
    <h1
      className="mobile-display-title mobile-brief-title"
      dangerouslySetInnerHTML={{ __html: displayTitle }}
    />
  ) : (
    <h1 className="mobile-brief-title">{title}</h1>
  )

  return (
    <div
      className="mobile-only mobile-article-viewer"
      style={{
        position: forceMobilePreview ? "absolute" : "fixed",
        top: 44,
        left: 0,
        right: 0,
        bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mobile-article-surface">
        <div className="mobile-article-tabs">
          <Link href={previewBackHref} className="mobile-article-tab mobile-article-tab-link">
            Desk
          </Link>
          {[
            { id: "brief", label: "Brief" },
            { id: "read", label: "Read" },
            { id: "data", label: "Data" },
          ].map((tab) => {
            const isActive = panel === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                className={`mobile-article-tab ${isActive ? "is-active" : ""}`}
                onClick={() => openPanel(tab.id as Panel)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {panel === "brief" ? (
          <section className="mobile-article-panel mobile-article-brief">
            <div className="mobile-brief-kicker">Research Desk Brief</div>

            <div className="mobile-brief-meta">
              <span className="mobile-brief-chip">{category}</span>
              <span className="mobile-brief-meta-text">{date}</span>
            </div>

            <div className="mav-stagger-1">{renderedTitle}</div>
            <div className="mav-accent-grow mobile-brief-accent" />

            {excerpt ? (
              <p className="mobile-brief-excerpt mav-stagger-2">{excerpt}</p>
            ) : null}

            <div className="mobile-brief-stat-grid mav-stagger-3">
              {metaCards.map((card) => (
                <div key={card.label} className="mobile-brief-stat-card">
                  <span className="mobile-brief-stat-label">{card.label}</span>
                  <span className="mobile-brief-stat-value">{card.value}</span>
                </div>
              ))}
            </div>

            {highlights.length > 0 ? (
              <div className="mobile-brief-section mav-stagger-4">
                <div className="mobile-brief-section-label">At a Glance</div>
                <div className="mobile-brief-glance-grid">
                  {highlights.map((highlight) => (
                    <div key={`${highlight.label}-${highlight.value}`} className="mobile-brief-glance-card">
                      <span className="mobile-brief-glance-label">{highlight.label}</span>
                      <span className="mobile-brief-glance-value">{highlight.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {tagLinks.length > 0 ? (
              <div className="mobile-brief-section mav-stagger-4">
                <div className="mobile-brief-section-label">Topics</div>
                <div className="mobile-brief-topic-row">
                  {tagLinks.map((tag) => (
                    <Link key={tag.label} href={tag.href} className="mobile-brief-topic">
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mobile-brief-actions mav-stagger-5">
              <button
                type="button"
                className="mobile-brief-primary"
                onClick={() => openPanel("read")}
              >
                Open analysis
              </button>
              <button
                type="button"
                className="mobile-brief-secondary"
                onClick={() => openPanel("data")}
              >
                Open data
              </button>
              <Link href={previewBackHref} className="mobile-brief-back">
                Back to {category}
              </Link>
              {reportDownload ? (
                <a
                  href={reportDownload.href}
                  download={reportDownload.filename}
                  className="mobile-brief-download"
                >
                  {reportDownload.label ?? "Download report"}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        {panel === "read" ? (
          <section className="mobile-article-panel mobile-article-scroll">
            <div className="mobile-article-header">
              <div className="mobile-article-header-meta">
                <span className="mobile-article-header-label">Reading</span>
                <span className="mobile-article-header-date">{category}</span>
              </div>
              <h2 className="mobile-article-header-title">{title}</h2>
              <div className="mobile-article-header-actions">
                <button
                  type="button"
                  className="mobile-article-utility"
                  onClick={() => openPanel("brief")}
                >
                  Brief
                </button>
                <button
                  type="button"
                  className="mobile-article-utility"
                  onClick={() => openPanel("data")}
                >
                  Data
                </button>
              </div>
            </div>

            <MobileContentFrame
              className={["mobile-article-content", "mobile-article-content-wrap", articleClassName]
                .filter(Boolean)
                .join(" ")}
              onOpenTable={openTableModal}
            >
              {articleContent}
            </MobileContentFrame>
          </section>
        ) : null}

        {panel === "data" ? (
          <section className="mobile-article-panel mobile-article-data">
            <div className="mobile-article-header">
              <div className="mobile-article-header-meta">
                <span className="mobile-article-header-label">Scenario frame</span>
                <span className="mobile-article-header-date">{date}</span>
              </div>
              <h2 className="mobile-article-header-title">Data and linked context</h2>
              <div className="mobile-article-header-actions">
                <button
                  type="button"
                  className="mobile-article-utility"
                  onClick={() => openPanel("brief")}
                >
                  Brief
                </button>
                <button
                  type="button"
                  className="mobile-article-utility"
                  onClick={() => openPanel("read")}
                >
                  Read
                </button>
              </div>
            </div>

            <MobileContentFrame
              className="mobile-tables-content mobile-data-content"
              onOpenTable={openTableModal}
            >
              {tablesContent}
            </MobileContentFrame>
          </section>
        ) : null}

        {tableModal ? (
          <div className="mobile-table-overlay">
            <div className="mobile-table-sheet">
              <div className="mobile-table-header">
                <div>
                  <div className="mobile-table-kicker">Expanded table</div>
                  <h3 className="mobile-table-title">{tableModal.title}</h3>
                </div>
                <button
                  type="button"
                  className="mobile-table-close"
                  onClick={() => setTableModal(null)}
                >
                  Close
                </button>
              </div>
              <div className="mobile-table-scroll">
                <div
                  className="mobile-table-html"
                  dangerouslySetInnerHTML={{ __html: tableModal.html }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
