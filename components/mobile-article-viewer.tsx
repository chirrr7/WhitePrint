"use client"

import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type TouchEvent,
} from "react"

type Panel = "landing" | "article" | "tables"

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Source Serif 4", Georgia, serif'
const DISPLAY = '"Playfair Display", Georgia, serif'

export function MobileArticleViewer({
  title,
  displayTitle,
  category,
  date,
  excerpt,
  readTime,
  tagCount,
  articleClassName,
  articleContent,
  tablesContent,
}: {
  title: string
  displayTitle?: string
  category: string
  date: string
  excerpt?: string
  readTime?: number
  tagCount?: number
  articleClassName?: string
  articleContent: ReactNode
  tablesContent: ReactNode
}) {
  const [panel, setPanel] = useState<Panel>("landing")
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    locked: false,
    dir: "" as "" | "h" | "v",
  })
  const [dragX, setDragX] = useState(0)

  const panelIndex = panel === "article" ? 0 : panel === "landing" ? 1 : 2
  const baseVW = -panelIndex * 100

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (panel === "landing") return
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        locked: false,
        dir: "",
      }
      setDragX(0)
    },
    [panel],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (panel === "landing") return
      const ref = touchRef.current
      const dx = e.touches[0].clientX - ref.startX
      const dy = e.touches[0].clientY - ref.startY

      if (!ref.locked) {
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          ref.locked = true
          ref.dir = Math.abs(dx) > Math.abs(dy) ? "h" : "v"
        }
        return
      }

      if (ref.dir !== "h") return
      e.preventDefault()
      if (panel === "article" && dx > 0) return
      if (panel === "tables" && dx < 0) return
      setDragX(dx)
    },
    [panel],
  )

  const onTouchEnd = useCallback(() => {
    if (panel === "landing") return
    const threshold = 70

    if (dragX < -threshold && panel === "article") {
      setPanel("tables")
    } else if (dragX > threshold && panel === "tables") {
      setPanel("article")
    }

    setDragX(0)
  }, [dragX, panel])

  const goBack = useCallback(() => setPanel("landing"), [])

  return (
    <div
      className="mobile-only"
      style={{
        position: "fixed",
        top: 44,
        left: 0,
        right: 0,
        bottom: 72,
        overflow: "hidden",
        background: "#0a0a0a",
        zIndex: 100,
      }}
    >
      <div
        className="mobile-slider"
        style={{
          display: "flex",
          width: "300vw",
          height: "100%",
          transform: `translateX(calc(${baseVW}vw + ${dragX}px))`,
          transition:
            dragX !== 0
              ? "none"
              : "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ════════════════════════════════════════════
            ARTICLE PANEL
            ════════════════════════════════════════════ */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: "#faf9f7",
            position: "relative",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, #c0392b 30%, transparent)",
            }}
          />

          <div style={{ padding: "14px 16px 40px" }}>
            {/* Back row */}
            <button
              onClick={goBack}
              style={{
                background: "none",
                border: "1px solid #e2e0db",
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#909090",
                padding: "6px 12px",
                cursor: "pointer",
                marginBottom: 20,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ← Brief
            </button>

            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#0f0f0f",
                margin: "0 0 4px",
              }}
            >
              {title}
            </h1>
            <div
              style={{
                width: 28,
                height: 2,
                background: "#c0392b",
                margin: "14px 0 24px",
              }}
            />

            <div className={articleClassName}>{articleContent}</div>
          </div>

          {/* Right-edge swipe hint */}
          <div
            style={{
              position: "fixed",
              right: 0,
              top: "45%",
              width: 3,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, rgba(192,57,43,0.25), transparent)",
              borderRadius: "3px 0 0 3px",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ════════════════════════════════════════════
            LANDING PANEL — "The Brief"
            ════════════════════════════════════════════ */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#0a0a0a",
            overflow: "hidden",
          }}
        >
          {/* Full-width red separator */}
          <div style={{ height: 2, background: "#c0392b", flexShrink: 0 }} />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "24px 20px 16px",
              overflow: "hidden",
            }}
          >
            {/* Category + Date */}
            <div className="mav-stagger-1" style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#c0392b",
                  display: "inline-block",
                  padding: "3px 8px",
                  border: "1px solid rgba(192,57,43,0.3)",
                  marginRight: 12,
                }}
              >
                {category}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                {date}
              </span>
            </div>

            {/* Title */}
            <div className="mav-stagger-2">
              {displayTitle ? (
                <h1
                  dangerouslySetInnerHTML={{ __html: displayTitle }}
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    margin: "0 0 16px",
                  }}
                />
              ) : (
                <h1
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    margin: "0 0 16px",
                  }}
                >
                  {title}
                </h1>
              )}
            </div>

            {/* Animated red accent bar */}
            <div
              className="mav-accent-grow"
              style={{
                height: 3,
                background: "#c0392b",
                marginBottom: 18,
                borderRadius: 1,
              }}
            />

            {/* Excerpt */}
            {excerpt && (
              <p
                className="mav-stagger-3"
                style={{
                  fontFamily: SERIF,
                  fontSize: 14,
                  lineHeight: 1.65,
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.35)",
                  margin: "0 0 20px",
                  maxWidth: 320,
                }}
              >
                {excerpt}
              </p>
            )}

            {/* Stats row */}
            {(readTime || tagCount) && (
              <div
                className="mav-stagger-3"
                style={{
                  display: "flex",
                  gap: 20,
                  marginBottom: 24,
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {readTime && (
                  <div>
                    <div
                      style={{
                        fontFamily: DISPLAY,
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {readTime}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 8,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.2)",
                        marginTop: 4,
                      }}
                    >
                      Min Read
                    </div>
                  </div>
                )}
                {tagCount !== undefined && tagCount > 0 && (
                  <div>
                    <div
                      style={{
                        fontFamily: DISPLAY,
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {tagCount}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 8,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.2)",
                        marginTop: 4,
                      }}
                    >
                      Topics
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Navigation cards */}
            <div
              className="mav-stagger-4"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {/* ARTICLE card */}
              <button
                onClick={() => setPanel("article")}
                className="mav-card-pulse"
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "16px 14px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  WebkitTapHighlightColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Abstract text lines */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      height: 2,
                      width: "85%",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 1,
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      width: "60%",
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 1,
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      width: "92%",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 1,
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      width: "40%",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 1,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    ← Analysis
                  </span>
                  <span
                    className="mav-dot-pulse"
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#c0392b",
                    }}
                  />
                </div>
              </button>

              {/* DATA card */}
              <button
                onClick={() => setPanel("tables")}
                className="mav-card-pulse"
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "16px 14px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  WebkitTapHighlightColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Abstract data grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 3,
                  }}
                >
                  {[14, 22, 10, 18, 8, 24, 12, 20, 16].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: h,
                        background: `rgba(255,255,255,${0.04 + (i % 3) * 0.025})`,
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Data →
                  </span>
                  <span
                    className="mav-dot-pulse"
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#c0392b",
                    }}
                  />
                </div>
              </button>
            </div>

            {/* Hint */}
            <div
              className="mav-stagger-5"
              style={{
                textAlign: "center",
                marginTop: 16,
                fontFamily: MONO,
                fontSize: 8,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.1)",
              }}
            >
              Tap to navigate
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            TABLES / DATA PANEL
            ════════════════════════════════════════════ */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: "#f5f3ee",
            position: "relative",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(270deg, #c0392b 30%, transparent)",
            }}
          />

          <div style={{ padding: "14px 16px 40px" }}>
            {/* Back row */}
            <button
              onClick={goBack}
              style={{
                background: "none",
                border: "1px solid #dedad4",
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#909090",
                padding: "6px 12px",
                cursor: "pointer",
                marginBottom: 20,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ← Brief
            </button>

            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#909090",
                }}
              >
                Data &amp; Analysis
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "#dedad4",
                }}
              />
            </div>

            {tablesContent}
          </div>

          {/* Left-edge swipe hint */}
          <div
            style={{
              position: "fixed",
              left: 0,
              top: "45%",
              width: 3,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, rgba(192,57,43,0.25), transparent)",
              borderRadius: "0 3px 3px 0",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  )
}
