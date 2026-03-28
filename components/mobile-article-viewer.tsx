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
const DISPLAY = '"Playfair Display", Georgia, serif'

export function MobileArticleViewer({
  title,
  displayTitle,
  category,
  date,
  articleClassName,
  articleContent,
  tablesContent,
}: {
  title: string
  displayTitle?: string
  category: string
  date: string
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

  const goBack = useCallback(() => {
    setPanel("landing")
  }, [])

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
        background: "#faf9f7",
        zIndex: 100,
      }}
    >
      {/* Three-panel slider */}
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
              : "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Article Panel ── */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ padding: "16px 16px 32px" }}>
            <button
              onClick={goBack}
              style={{
                background: "none",
                border: "none",
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#909090",
                padding: "4px 0",
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              ← Back
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
                margin: "12px 0 20px",
              }}
            />

            <div className={articleClassName}>{articleContent}</div>

            <div
              style={{
                textAlign: "center",
                padding: "28px 0 8px",
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#909090",
              }}
            >
              Swipe left for data →
            </div>
          </div>
        </div>

        {/* ── Landing Panel ── */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "28px 20px 0" }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#909090",
                marginBottom: 14,
              }}
            >
              {category} · {date}
            </div>
            {displayTitle ? (
              <h1
                dangerouslySetInnerHTML={{ __html: displayTitle }}
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: "#0f0f0f",
                  margin: 0,
                }}
              />
            ) : (
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: "#0f0f0f",
                  margin: 0,
                }}
              >
                {title}
              </h1>
            )}
          </div>

          {/* Divider with accent */}
          <div style={{ margin: "24px 20px", position: "relative" }}>
            <div style={{ height: 1, background: "#e2e0db" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -0.5,
                width: 28,
                height: 2,
                background: "#c0392b",
              }}
            />
          </div>

          {/* Tap hints */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
              padding: "0 20px",
            }}
          >
            <button
              onClick={() => setPanel("article")}
              className="mobile-tap-red"
              style={{
                background: "none",
                border: "1px solid #e2e0db",
                padding: "20px 28px",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#5a5a5a",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ← Post
            </button>

            <button
              onClick={() => setPanel("tables")}
              className="mobile-tap-red"
              style={{
                background: "none",
                border: "1px solid #e2e0db",
                padding: "20px 28px",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#5a5a5a",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Tables →
            </button>
          </div>
        </div>

        {/* ── Tables Panel ── */}
        <div
          style={{
            width: "100vw",
            height: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ padding: "16px 16px 32px" }}>
            <button
              onClick={goBack}
              style={{
                background: "none",
                border: "none",
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#909090",
                padding: "4px 0",
                marginBottom: 16,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>

            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#909090",
                marginBottom: 16,
              }}
            >
              Data &amp; Analysis
            </div>

            {tablesContent}

            <div
              style={{
                textAlign: "center",
                padding: "28px 0 8px",
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#909090",
              }}
            >
              ← Swipe right for article
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
