import type { Metadata } from "next"
import Link from "next/link"
import { MobileCoverageDashboard } from "@/components/mobile-coverage-dashboard"
import { isMobilePreviewEnabled, withMobilePreviewHref } from "@/lib/mobile-preview"
import { getCoverageStances } from "@/lib/stances"
import { SEO_CONFIG } from "@/lib/seo.config"
import s from "./page.module.css"

export const metadata: Metadata = {
  title: "Coverage",
  description: "Whiteprint coverage across covered names and themes.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/stances`,
  },
}

function formatStanceLabel(stance: "cautious" | "neutral" | "constructive") {
  switch (stance) {
    case "cautious":
      return "Cautious"
    case "constructive":
      return "Constructive"
    default:
      return "Neutral"
  }
}

function getStancePillClassName(
  stance: "cautious" | "neutral" | "constructive",
) {
  switch (stance) {
    case "cautious":
      return `${s.pill} ${s.pillCautious}`
    case "constructive":
      return `${s.pill} ${s.pillConstructive}`
    default:
      return `${s.pill} ${s.pillNeutral}`
  }
}

function formatStatusLabel(status: "monitoring" | "expired" | "active") {
  switch (status) {
    case "monitoring":
      return "Monitoring"
    case "expired":
      return "Expired"
    default:
      return "Active"
  }
}

function getStatusClassName(status: "monitoring" | "expired" | "active") {
  switch (status) {
    case "monitoring":
      return `${s.statusPill} ${s.statusMonitoring}`
    case "expired":
      return `${s.statusPill} ${s.statusExpired}`
    default:
      return `${s.statusPill} ${s.statusActive}`
  }
}

function formatScenarioLabel(
  kind: "bear" | "base" | "bull",
  scenarioType: "price" | "fcf",
) {
  const directional =
    kind === "base" ? "Neutral" : kind === "bull" ? "Bullish" : "Bearish"

  return scenarioType === "fcf" ? `${directional} FCF` : directional
}

function formatScenarioValue(
  value: number | null,
  scenarioType: "price" | "fcf",
) {
  if (value === null) {
    return "--"
  }

  if (scenarioType === "fcf") {
    return `$${value.toFixed(1).replace(/\.0$/, "")}B`
  }

  return `$${value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}`
}

function getScenarioCardClassName(kind: "bear" | "base" | "bull") {
  switch (kind) {
    case "base":
      return `${s.targetCard} ${s.targetCardBase}`
    case "bull":
      return `${s.targetCard} ${s.targetCardBull}`
    default:
      return `${s.targetCard} ${s.targetCardBear}`
  }
}

function getMobileCardClassName(
  stance: "cautious" | "neutral" | "constructive",
) {
  switch (stance) {
    case "cautious":
      return `${s.mobileCard} ${s.mobileCardCautious}`
    case "constructive":
      return `${s.mobileCard} ${s.mobileCardConstructive}`
    default:
      return `${s.mobileCard} ${s.mobileCardNeutral}`
  }
}

function formatConvictionLabel(conviction: "high" | "medium" | "low") {
  switch (conviction) {
    case "high":
      return "High conviction"
    case "low":
      return "Low conviction"
    default:
      return "Medium conviction"
  }
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase()
}

interface StancesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function StancesPage({ searchParams }: StancesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const forceMobilePreview = isMobilePreviewEnabled(resolvedSearchParams.mobile)
  const requestedTag =
    typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : ""
  const activeTag = normalizeTag(requestedTag)
  const allStances = await getCoverageStances()
  const tagCounts = new Map<string, number>()

  allStances.forEach((stance) => {
    stance.tags.forEach((tag) => {
      const normalizedTag = normalizeTag(tag)
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) ?? 0) + 1)
    })
  })

  const coverageTags = Array.from(tagCounts.entries())
    .sort((left, right) => {
      if (right[1] === left[1]) {
        return left[0].localeCompare(right[0])
      }

      return right[1] - left[1]
    })
    .map(([tag, count]) => ({ tag, count }))

  const stances = activeTag
    ? allStances.filter((stance) =>
        stance.tags.some((tag) => normalizeTag(tag) === activeTag),
      )
    : allStances
  const activeCount = stances.filter((stance) => stance.status === "active").length
  const monitoringCount = stances.filter(
    (stance) => stance.status === "monitoring",
  ).length
  const scenarioCount = stances.filter(
    (stance) =>
      stance.bear !== null || stance.base !== null || stance.bull !== null,
  ).length
  const latestDate = stances[0]?.date ?? "Live"

  return (
    <div className={s.page}>
      <header className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.eyebrow}>Whiteprint Research</div>
          <h1 className={s.title}>Coverage</h1>
          <p className={s.deck}>
            Current Whiteprint coverage across macro, equities, and market notes,
            with opinion-linked tags that connect research to the live stance map.
          </p>

          {coverageTags.length > 0 ? (
            <div className={s.filterBar}>
              <Link
                href={withMobilePreviewHref("/stances", forceMobilePreview)}
                className={`${s.filterChip} ${!activeTag ? s.filterChipActive : ""}`}
              >
                All
              </Link>
              {coverageTags.map(({ tag }) => (
                <Link
                  key={tag}
                  href={withMobilePreviewHref(`/stances?tag=${encodeURIComponent(tag)}`, forceMobilePreview)}
                  className={`${s.filterChip} ${activeTag === tag ? s.filterChipActive : ""}`}
                >
                  {humanizeTag(tag)}
                </Link>
              ))}
            </div>
          ) : null}

          {activeTag ? (
            <div className={s.filterSummary}>
              <span>Showing Whiteprint opinions tagged {humanizeTag(activeTag)}.</span>
              <Link
                href={withMobilePreviewHref(`/search?tag=${encodeURIComponent(activeTag)}`, forceMobilePreview)}
                className={s.filterSummaryLink}
              >
                Open research search
              </Link>
            </div>
          ) : null}

          <div className={`${s.mobileHeroPanel} mobile-only`}>
            <div className={s.mobileHeroStats}>
              <div className={s.mobileHeroStat}>
                <span className={s.mobileHeroStatLabel}>Tracked</span>
                <span className={s.mobileHeroStatValue}>{stances.length}</span>
              </div>
              <div className={s.mobileHeroStat}>
                <span className={s.mobileHeroStatLabel}>Active</span>
                <span className={s.mobileHeroStatValue}>{activeCount}</span>
              </div>
              <div className={s.mobileHeroStat}>
                <span className={s.mobileHeroStatLabel}>Scenario</span>
                <span className={s.mobileHeroStatValue}>{scenarioCount}</span>
              </div>
            </div>
            <div className={s.mobileHeroNote}>
              <span className={s.mobileHeroNoteLabel}>Latest refresh</span>
              <span className={s.mobileHeroNoteValue}>{latestDate}</span>
              <span className={s.mobileHeroNoteDivider} />
              <span className={s.mobileHeroNoteValue}>
                {monitoringCount} monitoring
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className={`${s.body} desktop-only`}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <colgroup>
              <col className={s.colCoverage} />
              <col className={s.colStance} />
              <col className={s.colConviction} />
              <col className={s.colThesis} />
              <col className={s.colTargets} />
              <col className={s.colStatus} />
              <col className={s.colDate} />
              <col className={s.colPost} />
            </colgroup>
            <thead className={s.thead}>
              <tr>
                <th>Coverage</th>
                <th>Stance</th>
                <th>Conviction</th>
                <th>Thesis</th>
                <th>Bearish / Neutral / Bullish</th>
                <th>Status</th>
                <th>Date</th>
                <th>Post</th>
              </tr>
            </thead>
            <tbody>
              {stances.map((stance) => (
                <tr key={stance.slug} className={s.row}>
                  <td className={s.cell}>
                    <span className={s.ticker}>{stance.ticker}</span>
                    <span className={s.name}>{stance.name}</span>
                    <span className={s.category}>{stance.category}</span>
                    {stance.tags.length > 0 ? (
                      <div className={s.coverageTagRow}>
                        {stance.tags.map((tag) => (
                          <Link
                            key={`${stance.slug}-${tag}`}
                            href={withMobilePreviewHref(`/search?tag=${encodeURIComponent(tag)}`, forceMobilePreview)}
                            className={s.coverageTag}
                          >
                            {humanizeTag(tag)}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </td>
                  <td className={s.cell}>
                    <span className={getStancePillClassName(stance.stance)}>
                      {formatStanceLabel(stance.stance)}
                    </span>
                  </td>
                  <td className={s.cell}>
                    <span className={s.conviction}>{stance.conviction}</span>
                  </td>
                  <td className={`${s.cell} ${s.thesis}`}>{stance.thesis}</td>
                  <td className={`${s.cell} ${s.targets}`}>
                    {stance.bear === null &&
                    stance.base === null &&
                    stance.bull === null ? (
                      <span className={s.targetEmpty}>No scenario frame</span>
                    ) : (
                      <div className={s.targetGrid}>
                        <div className={getScenarioCardClassName("bear")}>
                          <span className={s.targetValue}>
                            {formatScenarioValue(stance.bear, stance.scenarioType)}
                          </span>
                          <span className={s.targetLabel}>
                            {formatScenarioLabel("bear", stance.scenarioType)}
                          </span>
                        </div>
                        <div className={getScenarioCardClassName("base")}>
                          <span className={s.targetValue}>
                            {formatScenarioValue(stance.base, stance.scenarioType)}
                          </span>
                          <span className={s.targetLabel}>
                            {formatScenarioLabel("base", stance.scenarioType)}
                          </span>
                        </div>
                        <div className={getScenarioCardClassName("bull")}>
                          <span className={s.targetValue}>
                            {formatScenarioValue(stance.bull, stance.scenarioType)}
                          </span>
                          <span className={s.targetLabel}>
                            {formatScenarioLabel("bull", stance.scenarioType)}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className={`${s.cell} ${s.statusCell}`}>
                    <span className={getStatusClassName(stance.status)}>
                      <span className={s.statusDot} />
                      {formatStatusLabel(stance.status)}
                    </span>
                  </td>
                  <td className={`${s.cell} ${s.date} ${s.dateCell}`}>
                    {stance.date}
                  </td>
                  <td className={`${s.cell} ${s.postCell}`}>
                    {stance.postSlug ? (
                      <Link href={withMobilePreviewHref(`/posts/${stance.postSlug}`, forceMobilePreview)} className={s.link}>
                        Open
                      </Link>
                    ) : (
                      <span className={s.targetEmpty}>No linked post</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${s.mobileBody} mobile-only`}>
        <div className={s.mobileIntro}>
          <span className={s.mobileIntroEyebrow}>Current view</span>
          <p className={s.mobileIntroText}>
            A quick read on where Whiteprint is constructive, neutral, or
            cautious right now.
          </p>
        </div>
        <MobileCoverageDashboard
          coverageTags={coverageTags}
          initialTag={activeTag}
          stances={stances}
        />
      </div>
    </div>
  )
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
