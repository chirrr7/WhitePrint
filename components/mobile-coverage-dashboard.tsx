"use client"

import Link from "next/link"
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useSearchParams } from "next/navigation"
import { withMobilePreviewHref } from "@/lib/mobile-preview"
import type { Stance } from "@/lib/stances"
import s from "./mobile-coverage-dashboard.module.css"

type StatusFilter = "all" | Stance["status"]

interface CoverageTag {
  count: number
  tag: string
}

function formatStanceLabel(stance: Stance["stance"]) {
  switch (stance) {
    case "cautious":
      return "Cautious"
    case "constructive":
      return "Constructive"
    default:
      return "Neutral"
  }
}

function formatStatusLabel(status: Stance["status"]) {
  switch (status) {
    case "monitoring":
      return "Monitoring"
    case "expired":
      return "Expired"
    default:
      return "Active"
  }
}

function formatConvictionLabel(conviction: Stance["conviction"]) {
  switch (conviction) {
    case "high":
      return "High conviction"
    case "low":
      return "Low conviction"
    default:
      return "Medium conviction"
  }
}

function formatScenarioLabel(kind: "bear" | "base" | "bull", scenarioType: Stance["scenarioType"]) {
  const directional = kind === "base" ? "Neutral" : kind === "bull" ? "Bullish" : "Bearish"
  return scenarioType === "fcf" ? `${directional} FCF` : directional
}

function formatScenarioValue(value: number | null, scenarioType: Stance["scenarioType"]) {
  if (value === null) {
    return "--"
  }

  if (scenarioType === "fcf") {
    return `$${value.toFixed(1).replace(/\.0$/, "")}B`
  }

  return `$${value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}`
}

function getRailToneClassName(stance: Stance["stance"]) {
  switch (stance) {
    case "constructive":
      return s.railCardConstructive
    case "cautious":
      return s.railCardCautious
    default:
      return s.railCardNeutral
  }
}

function humanizeTag(value: string) {
  const normalized = value.trim().toLowerCase()

  switch (normalized) {
    case "orcl":
      return "Oracle"
    case "eog":
      return "EOG"
    case "e-and-p":
      return "E&P"
    case "roic":
      return "ROIC"
    case "dcf":
      return "DCF"
    default:
      return normalized.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }
}

export function MobileCoverageDashboard({
  coverageTags,
  initialTag,
  stances,
}: {
  coverageTags: CoverageTag[]
  initialTag: string
  stances: Stance[]
}) {
  const searchParams = useSearchParams()
  const forceMobilePreview = searchParams.get("mobile") === "1"
  const [tagFilter, setTagFilter] = useState(initialTag)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(stances[0]?.slug ?? null)
  const deferredTagFilter = useDeferredValue(tagFilter)
  const deferredStatusFilter = useDeferredValue(statusFilter)
  const isFiltering = deferredTagFilter !== tagFilter || deferredStatusFilter !== statusFilter

  const filteredStances = useMemo(() => {
    return stances.filter((stance) => {
      const matchesTag =
        !deferredTagFilter ||
        stance.tags.some((tag) => tag.trim().toLowerCase() === deferredTagFilter)
      const matchesStatus =
        deferredStatusFilter === "all" || stance.status === deferredStatusFilter

      return matchesTag && matchesStatus
    })
  }, [deferredStatusFilter, deferredTagFilter, stances])

  useEffect(() => {
    if (!filteredStances.length) {
      setSelectedSlug(null)
      return
    }

    if (!selectedSlug || !filteredStances.some((stance) => stance.slug === selectedSlug)) {
      setSelectedSlug(filteredStances[0].slug)
    }
  }, [filteredStances, selectedSlug])

  const selectedStance =
    filteredStances.find((stance) => stance.slug === selectedSlug) ?? filteredStances[0] ?? null

  return (
    <section className={s.dashboard}>
      <div className={s.controls}>
        <div className={s.controlGroup}>
          <div className={s.controlLabel}>Desk filter</div>
          <div className={s.chipRow}>
            <button
              type="button"
              className={`${s.filterChip} ${tagFilter === "" ? s.filterChipActive : ""}`}
              onClick={() => {
                startTransition(() => {
                  setTagFilter("")
                })
              }}
            >
              All coverage
            </button>
            {coverageTags.map((tag) => (
              <button
                key={tag.tag}
                type="button"
                className={`${s.filterChip} ${tagFilter === tag.tag ? s.filterChipActive : ""}`}
                onClick={() => {
                  startTransition(() => {
                    setTagFilter(tag.tag)
                  })
                }}
              >
                {humanizeTag(tag.tag)}
              </button>
            ))}
          </div>
        </div>

        <div className={s.controlGroup}>
          <div className={s.controlLabel}>Status</div>
          <div className={s.chipRow}>
            {[
              { id: "all" as const, label: "All" },
              { id: "active" as const, label: "Active" },
              { id: "monitoring" as const, label: "Monitoring" },
              { id: "expired" as const, label: "Expired" },
            ].map((status) => (
              <button
                key={status.id}
                type="button"
                className={`${s.statusChip} ${statusFilter === status.id ? s.statusChipActive : ""}`}
                onClick={() => {
                  startTransition(() => {
                    setStatusFilter(status.id)
                  })
                }}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.metaRow}>
        <span>{filteredStances.length} names in view</span>
        <span>{selectedStance ? `Focused on ${selectedStance.ticker}` : "No active selection"}</span>
        {isFiltering ? <span className={s.metaPending}>Updating</span> : null}
      </div>

      <div className={s.rail}>
        {filteredStances.map((stance) => (
          <button
            key={stance.slug}
            type="button"
            className={`${s.railCard} ${getRailToneClassName(stance.stance)} ${
              selectedStance?.slug === stance.slug ? s.railCardActive : ""
            }`}
            onClick={() => {
              startTransition(() => {
                setSelectedSlug(stance.slug)
              })
            }}
          >
            <div className={s.railTop}>
              <span className={s.railTicker}>{stance.ticker}</span>
              <span className={s.railDate}>{stance.date}</span>
            </div>

            <h2 className={s.railName}>{stance.name}</h2>
            <p className={s.railThesis}>{stance.thesis}</p>

            <div className={s.railMeta}>
              <span className={s.miniPill}>{formatStanceLabel(stance.stance)}</span>
              <span className={s.miniPill}>{formatStatusLabel(stance.status)}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedStance ? (
        <article className={s.focusCard}>
          <div className={s.focusHeader}>
            <span className={s.focusKicker}>Coverage focus</span>
            <div className={s.focusTitleRow}>
              <div className={s.focusTitleWrap}>
                <span className={s.focusTicker}>{selectedStance.ticker}</span>
                <h2 className={s.focusTitle}>{selectedStance.name}</h2>
              </div>
              <div className={s.focusPills}>
                <span className={s.miniPill}>{formatStanceLabel(selectedStance.stance)}</span>
                <span className={s.miniPill}>{formatStatusLabel(selectedStance.status)}</span>
              </div>
            </div>
          </div>

          <p className={s.focusThesis}>{selectedStance.thesis}</p>

          <div className={s.focusMeta}>
            <span>{formatConvictionLabel(selectedStance.conviction)}</span>
            <span>{selectedStance.scenarioType === "fcf" ? "FCF frame" : "Price frame"}</span>
            <span>{selectedStance.date}</span>
          </div>

          <div className={s.scenarioGrid}>
            {(["bear", "base", "bull"] as const).map((scenario) => (
              <div
                key={scenario}
                className={`${s.scenarioCard} ${
                  scenario === "bear"
                    ? s.scenarioCardBear
                    : scenario === "base"
                      ? s.scenarioCardBase
                      : s.scenarioCardBull
                }`}
              >
                <span className={s.scenarioValue}>
                  {formatScenarioValue(selectedStance[scenario], selectedStance.scenarioType)}
                </span>
                <span className={s.scenarioLabel}>
                  {formatScenarioLabel(scenario, selectedStance.scenarioType)}
                </span>
              </div>
            ))}
          </div>

          {selectedStance.tags.length > 0 ? (
            <div className={s.topicRow}>
              {selectedStance.tags.map((tag) => (
                <Link
                  key={`${selectedStance.slug}-${tag}`}
                  href={withMobilePreviewHref(`/search?tag=${encodeURIComponent(tag)}`, forceMobilePreview)}
                  className={s.topicLink}
                >
                  {humanizeTag(tag)}
                </Link>
              ))}
            </div>
          ) : null}

          <div className={s.actionRow}>
            {selectedStance.postSlug ? (
              <Link
                href={withMobilePreviewHref(`/posts/${selectedStance.postSlug}`, forceMobilePreview)}
                className={s.focusAction}
              >
                Open analysis
              </Link>
            ) : (
              <span className={s.focusAction}>No linked post</span>
            )}

            <Link
              href={withMobilePreviewHref(
                `/search?tag=${encodeURIComponent(selectedStance.tags[0] ?? selectedStance.ticker.toLowerCase())}`,
                forceMobilePreview,
              )}
              className={`${s.focusAction} ${s.focusActionSecondary}`}
            >
              Open search
            </Link>
          </div>
        </article>
      ) : (
        <div className={s.emptyState}>No coverage matches the current mobile filter set.</div>
      )}
    </section>
  )
}
