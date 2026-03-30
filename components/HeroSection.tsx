"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

const NOTE_IDS = ["note0", "note1", "note2", "note3"] as const
const ANNOTATION_IDS = ["ann0", "ann1", "ann2", "ann3"] as const

const timings = [
  { delay: 300, action: "document" },
  { delay: 900, action: "ann0" },
  { delay: 1500, action: "note0" },
  { delay: 2200, action: "ann1" },
  { delay: 3000, action: "note1" },
  { delay: 3200, action: "circle" },
  { delay: 3800, action: "note2" },
  { delay: 4200, action: "ann3" },
  { delay: 5000, action: "note3" },
  { delay: 7000, action: "dim" },
  { delay: 7500, action: "tagline" },
  { delay: 8200, action: "hint" },
  { delay: 8600, action: "replay" },
] as const

type ActionName = (typeof timings)[number]["action"]

type HeroState = {
  activeAnnotations: Record<(typeof ANNOTATION_IDS)[number], boolean>
  visibleDocument: boolean
  visibleNotes: Record<(typeof NOTE_IDS)[number], boolean>
  showHint: boolean
  showReplay: boolean
  showTagline: boolean
  dimDocument: boolean
}

const initialState: HeroState = {
  activeAnnotations: {
    ann0: false,
    ann1: false,
    ann2: false,
    ann3: false,
  },
  visibleDocument: false,
  visibleNotes: {
    note0: false,
    note1: false,
    note2: false,
    note3: false,
  },
  showHint: false,
  showReplay: false,
  showTagline: false,
  dimDocument: false,
}

const noteCopy = {
  note0: "↑ 10× vs FY2022",
  note1: "+$1.2B to op. income",
  note2: "off-balance sheet",
  note3: "FCF: +$13.8B → −$394M",
} as const

export function HeroSection() {
  const [state, setState] = useState<HeroState>(initialState)
  const [replayKey, setReplayKey] = useState(0)
  const [notePositions, setNotePositions] = useState<Record<(typeof NOTE_IDS)[number], number>>({
    note0: 0,
    note1: 0,
    note2: 0,
    note3: 0,
  })

  const timersRef = useRef<number[]>([])
  const annRefs = useRef<Record<(typeof ANNOTATION_IDS)[number], HTMLSpanElement | null>>({
    ann0: null,
    ann1: null,
    ann2: null,
    ann3: null,
  })
  const notePanelRef = useRef<HTMLDivElement | null>(null)
  const circleVisibleRef = useRef(false)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }, [])

  const drawCircle = useCallback(() => {
    const target = annRefs.current.ann2

    if (!target) {
      return
    }

    target.querySelectorAll("svg[data-ann-circle='true']").forEach((node) => node.remove())

    const width = target.offsetWidth + 20
    const height = target.offsetHeight + 10
    const cx = width / 2
    const cy = height / 2
    const rx = width / 2 - 2
    const ry = height / 2 - 2
    const circumference = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2)
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")

    svg.setAttribute("data-ann-circle", "true")
    svg.setAttribute("width", `${width}`)
    svg.setAttribute("height", `${height}`)
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    svg.style.position = "absolute"
    svg.style.top = "-5px"
    svg.style.left = "-10px"
    svg.style.pointerEvents = "none"
    svg.style.overflow = "visible"
    svg.style.zIndex = "2"

    const ellipse = document.createElementNS(svgNS, "ellipse")

    ellipse.setAttribute("cx", `${cx}`)
    ellipse.setAttribute("cy", `${cy}`)
    ellipse.setAttribute("rx", `${rx}`)
    ellipse.setAttribute("ry", `${ry}`)
    ellipse.setAttribute("fill", "none")
    ellipse.setAttribute("stroke", "#c0392b")
    ellipse.setAttribute("stroke-width", "1.5")
    ellipse.style.strokeDasharray = `${circumference}`
    ellipse.style.strokeDashoffset = `${circumference}`
    ellipse.style.transition = "stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)"

    svg.appendChild(ellipse)
    target.appendChild(svg)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        ellipse.style.strokeDashoffset = "0"
      })
    })
  }, [])

  const positionNotes = useCallback(() => {
    const notePanel = notePanelRef.current

    if (!notePanel) {
      return
    }

    const panelRect = notePanel.getBoundingClientRect()

    setNotePositions({
      note0: getNoteTop(annRefs.current.ann0, panelRect),
      note1: getNoteTop(annRefs.current.ann1, panelRect),
      note2: getNoteTop(annRefs.current.ann2, panelRect),
      note3: getNoteTop(annRefs.current.ann3, panelRect),
    })
  }, [])

  const applyAction = useCallback(
    (action: ActionName) => {
      switch (action) {
        case "document":
          setState((current) => ({ ...current, visibleDocument: true }))
          window.requestAnimationFrame(positionNotes)
          break
        case "ann0":
        case "ann1":
        case "ann3":
          setState((current) => ({
            ...current,
            activeAnnotations: {
              ...current.activeAnnotations,
              [action]: true,
            },
          }))
          break
        case "note0":
        case "note1":
        case "note2":
        case "note3":
          setState((current) => ({
            ...current,
            visibleNotes: {
              ...current.visibleNotes,
              [action]: true,
            },
          }))
          break
        case "circle":
          setState((current) => ({
            ...current,
            activeAnnotations: {
              ...current.activeAnnotations,
              ann2: true,
            },
          }))
          circleVisibleRef.current = true
          window.requestAnimationFrame(() => {
            drawCircle()
            positionNotes()
          })
          break
        case "dim":
          setState((current) => ({ ...current, dimDocument: true }))
          break
        case "tagline":
          setState((current) => ({ ...current, showTagline: true }))
          break
        case "hint":
          setState((current) => ({ ...current, showHint: true }))
          break
        case "replay":
          setState((current) => ({ ...current, showReplay: true }))
          break
      }
    },
    [drawCircle, positionNotes],
  )

  const runSequence = useCallback(() => {
    clearTimers()
    circleVisibleRef.current = false
    setState(initialState)

    ANNOTATION_IDS.forEach((id) => {
      annRefs.current[id]?.querySelectorAll("svg[data-ann-circle='true']").forEach((node) => node.remove())
    })

    const schedule = () => {
      timings.forEach(({ delay, action }) => {
        const timer = window.setTimeout(() => {
          applyAction(action)
        }, delay)

        timersRef.current.push(timer)
      })
    }

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        schedule()
        window.requestAnimationFrame(positionNotes)
      })
    } else {
      schedule()
      window.requestAnimationFrame(positionNotes)
    }
  }, [applyAction, clearTimers, positionNotes])

  useEffect(() => {
    runSequence()
  }, [replayKey, runSequence])

  useEffect(() => {
    const handleResize = () => {
      positionNotes()

      if (circleVisibleRef.current) {
        drawCircle()
      }
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      clearTimers()
      window.removeEventListener("resize", handleResize)
      ANNOTATION_IDS.forEach((id) => {
        annRefs.current[id]?.querySelectorAll("svg[data-ann-circle='true']").forEach((node) => node.remove())
      })
    }
  }, [clearTimers, drawCircle, positionNotes])

  const handleReplay = () => {
    setReplayKey((current) => current + 1)
  }

  return (
    <section className="wp-hero" id="hero">
      <div className="wp-hero-grain" />
      <div className="wp-hero-rule" />

      <div className="wp-hero-inner">
        <div className="wp-hero-doc-row">
          <div
            className={`wp-hero-doc${state.visibleDocument ? " doc-visible" : ""}${state.dimDocument ? " doc-dimmed" : ""}`}
          >
            <div className="wp-doc-header">
              <span className="wp-doc-header-left">FORM 10-K · ORACLE CORPORATION · FY2024 · SELECTED EXCERPT</span>
              <span className="wp-doc-header-right">NOTE 6 — PP&amp;E</span>
            </div>

            <div className="wp-doc-body">
              <p className="wp-doc-para">
                Capital expenditures for fiscal 2024 were{" "}
                <span
                  id="ann0"
                  ref={(node) => {
                    annRefs.current.ann0 = node
                  }}
                  className={`wp-ann${state.activeAnnotations.ann0 ? " ann-active" : ""}`}
                >
                  $6,866 million
                </span>
                , compared to $3,299 million for fiscal 2023 and $1,347 million for fiscal 2022. The
                increase reflects continued investment in cloud data centers and network infrastructure.
              </p>

              <p className="wp-doc-para">
                In fiscal 2024, we completed a review of the estimated useful lives of certain server
                equipment and{" "}
                <span
                  id="ann1"
                  ref={(node) => {
                    annRefs.current.ann1 = node
                  }}
                  className={`wp-ann${state.activeAnnotations.ann1 ? " ann-active" : ""}`}
                >
                  extended the estimated useful life from four years to five years
                </span>
                . This change in accounting estimate increased operating income by approximately $1.2
                billion.
              </p>

              <p className="wp-doc-para">
                As of May 31, 2024, we had data center lease commitments of approximately{" "}
                <span
                  id="ann2"
                  ref={(node) => {
                    annRefs.current.ann2 = node
                  }}
                  className={`wp-ann wp-ann-circle${state.activeAnnotations.ann2 ? " ann-active" : ""}`}
                >
                  $261 billion
                </span>{" "}
                that had not yet commenced and are not reflected on our consolidated balance sheet. These
                commitments have initial terms of 10 to 19 years.
              </p>

              <p className="wp-doc-para">
                Free cash flow for fiscal 2024 was{" "}
                <span
                  id="ann3"
                  ref={(node) => {
                    annRefs.current.ann3 = node
                  }}
                  className={`wp-ann${state.activeAnnotations.ann3 ? " ann-active" : ""}`}
                >
                  $(394) million
                </span>
                , compared to $13,757 million for fiscal 2021.
              </p>
            </div>
          </div>

          <div ref={notePanelRef} className="wp-note-panel" aria-hidden="true">
            {NOTE_IDS.map((noteId) => (
              <div
                key={noteId}
                id={noteId}
                className={`wp-mnote${state.visibleNotes[noteId] ? " note-visible" : ""}`}
                style={{ top: `${notePositions[noteId]}px` }}
              >
                <div className="wp-mnote-line" />
                <div className="wp-mnote-text">{noteCopy[noteId]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`wp-hero-tagline${state.showTagline ? " tagline-visible" : ""}`}>
          <div className="wp-tagline-eyebrow">WHITEPRINT RESEARCH</div>
          <h1 className="wp-tagline-headline">
            We read
            <br />
            <em>the footnotes.</em>
          </h1>
          <p className="wp-tagline-sub">
            Independent equity, macro, and forensic research. No house view. No affiliation.
          </p>
          <div className="wp-tagline-actions">
            <Link href="/research" className="wp-tagline-cta-primary">
              Browse Research
            </Link>
            <Link href="/#pipeline" className="wp-tagline-cta-secondary">
              What&apos;s in progress →
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`wp-replay-btn${state.showReplay ? " btn-visible" : ""}`}
        onClick={handleReplay}
      >
        ↺ Replay
      </button>

      <Link href="/#pipeline" className={`wp-scroll-hint${state.showHint ? " hint-visible" : ""}`}>
        <span className="wp-scroll-line" />
        <span className="wp-scroll-label">scroll</span>
      </Link>

      <style jsx>{`
        .wp-hero {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          overflow: hidden;
          background: var(--dark);
          padding: 100px 48px 80px;
        }

        .wp-hero-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.035;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        }

        .wp-hero-rule {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 5;
          height: 2px;
          background: var(--accent);
        }

        .wp-hero-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 960px;
        }

        .wp-hero-doc-row {
          display: flex;
          align-items: flex-start;
          gap: 0;
          width: 100%;
        }

        .wp-hero-doc {
          position: relative;
          flex: 1;
          min-width: 0;
          padding: 32px 36px;
          opacity: 0;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: opacity 0.9s ease, filter 1.2s ease;
        }

        .wp-hero-doc.doc-visible {
          opacity: 1;
        }

        .wp-hero-doc.doc-dimmed {
          opacity: 0.1;
          filter: blur(0.5px);
        }

        .wp-doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .wp-doc-header-left,
        .wp-doc-header-right {
          font-family: var(--font-mono-family), monospace;
          font-size: 7.5px;
          text-transform: uppercase;
        }

        .wp-doc-header-left {
          color: rgba(255, 255, 255, 0.18);
          letter-spacing: 0.22em;
        }

        .wp-doc-header-right {
          color: rgba(255, 255, 255, 0.12);
          letter-spacing: 0.18em;
        }

        .wp-doc-body {
          color: rgba(255, 255, 255, 0.28);
          font-family: var(--font-serif-family), Georgia, serif;
          font-size: 12px;
          font-weight: 300;
          line-height: 1.95;
        }

        .wp-doc-para {
          margin: 0 0 14px;
        }

        .wp-doc-para:last-child {
          margin-bottom: 0;
        }

        .wp-ann {
          position: relative;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.35s ease;
        }

        .wp-ann::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wp-ann.ann-active {
          color: rgba(255, 255, 255, 0.82);
        }

        .wp-ann.ann-active::after {
          transform: scaleX(1);
        }

        .wp-ann-circle {
          position: relative;
        }

        .wp-note-panel {
          position: relative;
          flex-shrink: 0;
          width: 200px;
          min-height: 200px;
          padding-left: 16px;
        }

        .wp-mnote {
          position: absolute;
          left: 0;
          display: flex;
          align-items: flex-start;
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          pointer-events: none;
          white-space: nowrap;
        }

        .wp-mnote.note-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .wp-mnote-line {
          width: 22px;
          height: 1px;
          flex-shrink: 0;
          margin-top: 9px;
          margin-right: 8px;
          background: var(--accent);
        }

        .wp-mnote-text {
          color: var(--accent);
          font-family: var(--font-mono-family), monospace;
          font-size: 9px;
          line-height: 1.6;
          letter-spacing: 0.05em;
        }

        .wp-hero-tagline {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 48px;
          opacity: 0;
          pointer-events: none;
          text-align: center;
          transform: translateY(16px);
          transition: opacity 1s ease, transform 1s ease;
        }

        .wp-hero-tagline.tagline-visible {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .wp-tagline-eyebrow {
          margin-bottom: 28px;
          color: rgba(255, 255, 255, 0.22);
          font-family: var(--font-mono-family), monospace;
          font-size: 8px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .wp-tagline-headline {
          margin: 0 0 28px;
          color: rgba(255, 255, 255, 0.96);
          font-family: var(--font-display-family), Georgia, serif;
          font-size: clamp(44px, 7vw, 80px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .wp-tagline-headline em {
          color: var(--accent);
          font-style: italic;
          font-weight: 600;
        }

        .wp-tagline-sub {
          max-width: 440px;
          margin: 0 0 36px;
          color: rgba(255, 255, 255, 0.35);
          font-family: var(--font-serif-family), Georgia, serif;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.7;
        }

        .wp-tagline-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .wp-tagline-cta-primary {
          display: inline-block;
          padding: 10px 22px;
          color: var(--dark);
          background: rgba(250, 249, 247, 0.92);
          font-family: var(--font-mono-family), monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 0.2s ease;
        }

        .wp-tagline-cta-primary:hover {
          background: #fff;
        }

        .wp-tagline-cta-secondary {
          padding-bottom: 1px;
          color: rgba(255, 255, 255, 0.35);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-mono-family), monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .wp-tagline-cta-secondary:hover {
          color: rgba(255, 255, 255, 0.7);
          border-bottom-color: rgba(255, 255, 255, 0.35);
        }

        .wp-scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0;
          text-decoration: none;
          transform: translateX(-50%);
          transition: opacity 0.6s ease;
        }

        .wp-scroll-hint.hint-visible {
          opacity: 1;
        }

        .wp-scroll-line {
          position: relative;
          display: block;
          width: 1px;
          height: 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.12);
        }

        .wp-scroll-line::after {
          content: "";
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.4);
          animation: scrollDrop 1.8s ease-in-out infinite;
        }

        .wp-scroll-label {
          color: rgba(255, 255, 255, 0.18);
          font-family: var(--font-mono-family), monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .wp-replay-btn {
          position: absolute;
          right: 48px;
          bottom: 28px;
          z-index: 10;
          opacity: 0;
          padding: 0;
          color: rgba(255, 255, 255, 0.18);
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-mono-family), monospace;
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: color 0.2s ease, opacity 0.6s ease;
        }

        .wp-replay-btn.btn-visible {
          opacity: 1;
        }

        .wp-replay-btn:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        @keyframes scrollDrop {
          0% {
            top: -100%;
          }

          100% {
            top: 100%;
          }
        }

        @media (max-width: 1200px) {
          .wp-hero {
            padding-right: 32px;
            padding-left: 32px;
          }

          .wp-hero-tagline {
            padding-right: 32px;
            padding-left: 32px;
          }

          .wp-replay-btn {
            right: 32px;
          }
        }
      `}</style>
    </section>
  )
}

function getNoteTop(annotation: HTMLSpanElement | null, panelRect: DOMRect) {
  if (!annotation) {
    return 0
  }

  const rect = annotation.getBoundingClientRect()
  return Math.max(0, rect.top - panelRect.top + rect.height / 2 - 10)
}
