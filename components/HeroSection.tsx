"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import h from "./HeroSection.module.css"

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
  visibleDocument: true,
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

  const docClass = [
    h.doc,
    state.visibleDocument ? h.docVisible : "",
    state.dimDocument ? h.docDimmed : "",
  ].filter(Boolean).join(" ")

  return (
    <section className={h.hero} id="hero" style={{ backgroundColor: "#0a0a0a" }}>
      <div className={h.grain} />
      <div className={h.rule} />

      <div className={h.inner}>
        <div className={h.docRow}>
          <div className={docClass}>
            <div className={h.docHeader}>
              <span className={h.docHeaderLeft}>FORM 10-K · ORACLE CORPORATION · FY2024 · SELECTED EXCERPT</span>
              <span className={h.docHeaderRight}>NOTE 6 — PP&amp;E</span>
            </div>

            <div className={h.docBody}>
              <p className={h.docPara}>
                Capital expenditures for fiscal 2024 were{" "}
                <span
                  id="ann0"
                  ref={(node) => {
                    annRefs.current.ann0 = node
                  }}
                  className={`${h.ann}${state.activeAnnotations.ann0 ? ` ${h.annActive}` : ""}`}
                >
                  $6,866 million
                </span>
                , compared to $3,299 million for fiscal 2023 and $1,347 million for fiscal 2022. The
                increase reflects continued investment in cloud data centers and network infrastructure.
              </p>

              <p className={h.docPara}>
                In fiscal 2024, we completed a review of the estimated useful lives of certain server
                equipment and{" "}
                <span
                  id="ann1"
                  ref={(node) => {
                    annRefs.current.ann1 = node
                  }}
                  className={`${h.ann}${state.activeAnnotations.ann1 ? ` ${h.annActive}` : ""}`}
                >
                  extended the estimated useful life from four years to five years
                </span>
                . This change in accounting estimate increased operating income by approximately $1.2
                billion.
              </p>

              <p className={h.docPara}>
                As of May 31, 2024, we had data center lease commitments of approximately{" "}
                <span
                  id="ann2"
                  ref={(node) => {
                    annRefs.current.ann2 = node
                  }}
                  className={`${h.ann} ${h.annCircle}${state.activeAnnotations.ann2 ? ` ${h.annActive}` : ""}`}
                >
                  $261 billion
                </span>{" "}
                that had not yet commenced and are not reflected on our consolidated balance sheet. These
                commitments have initial terms of 10 to 19 years.
              </p>

              <p className={h.docPara}>
                Free cash flow for fiscal 2024 was{" "}
                <span
                  id="ann3"
                  ref={(node) => {
                    annRefs.current.ann3 = node
                  }}
                  className={`${h.ann}${state.activeAnnotations.ann3 ? ` ${h.annActive}` : ""}`}
                >
                  $(394) million
                </span>
                , compared to $13,757 million for fiscal 2021.
              </p>
            </div>
          </div>

          <div ref={notePanelRef} className={h.notePanel} aria-hidden="true">
            {NOTE_IDS.map((noteId) => (
              <div
                key={noteId}
                id={noteId}
                className={`${h.mnote}${state.visibleNotes[noteId] ? ` ${h.noteVisible}` : ""}`}
                style={{ top: `${notePositions[noteId]}px` }}
              >
                <div className={h.mnoteLine} />
                <div className={h.mnoteText}>{noteCopy[noteId]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${h.tagline}${state.showTagline ? ` ${h.taglineVisible}` : ""}`}>
          <div className={h.taglineEyebrow}>WHITEPRINT RESEARCH</div>
          <h1 className={h.taglineHeadline}>
            We read
            <br />
            <em>the footnotes.</em>
          </h1>
          <p className={h.taglineSub}>
            Independent equity, macro, and forensic research. No house view. No affiliation.
          </p>
          <div className={h.taglineActions}>
            <Link href="/research" className={h.ctaPrimary}>
              Browse Research
            </Link>
            <Link href="/#pipeline" className={h.ctaSecondary}>
              What&apos;s in progress →
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`${h.replayBtn}${state.showReplay ? ` ${h.btnVisible}` : ""}`}
        onClick={handleReplay}
      >
        ↺ Replay
      </button>

      <Link href="/#pipeline" className={`${h.scrollHint}${state.showHint ? ` ${h.hintVisible}` : ""}`}>
        <span className={h.scrollLine} />
        <span className={h.scrollLabel}>scroll</span>
      </Link>
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
