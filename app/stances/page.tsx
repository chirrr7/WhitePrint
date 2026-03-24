import type { Metadata } from "next"
import Link from "next/link"
import { getStances } from "@/lib/stances"
import s from "./page.module.css"

export const metadata: Metadata = {
  title: "Coverage",
  description:
    "Latest Whiteprint coverage, conviction levels, and scenario framing sourced directly from published posts.",
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

function getStancePillClassName(stance: "cautious" | "neutral" | "constructive") {
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

function formatScenarioValue(value: number | null, scenarioType: "price" | "fcf") {
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

export default async function StancesPage() {
  const stances = getStances()

  return (
    <div className={s.page}>
      <header className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.eyebrow}>Whiteprint Research</div>
          <h1 className={s.title}>Coverage</h1>
          <p className={s.deck}>
            Current Whiteprint coverage across macro, equities, and market notes.
          </p>
        </div>
      </header>

      <div className={s.body}>
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
                    {stance.bear === null && stance.base === null && stance.bull === null ? (
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
                  <td className={`${s.cell} ${s.date} ${s.dateCell}`}>{stance.date}</td>
                  <td className={`${s.cell} ${s.postCell}`}>
                    <Link href={`/posts/${stance.slug}`} className={s.link}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
