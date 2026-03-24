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

function formatDirectionalLabel(stance: "cautious" | "neutral" | "constructive") {
  switch (stance) {
    case "cautious":
      return "Bearish"
    case "constructive":
      return "Bullish"
    default:
      return "Neutral"
  }
}

function getDirectionalClassName(stance: "cautious" | "neutral" | "constructive") {
  switch (stance) {
    case "cautious":
      return `${s.direction} ${s.directionBearish}`
    case "constructive":
      return `${s.direction} ${s.directionBullish}`
    default:
      return `${s.direction} ${s.directionNeutral}`
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

function formatScenarioLabel(kind: "bear" | "base" | "bull") {
  switch (kind) {
    case "base":
      return "Neutral"
    case "bull":
      return "Bull"
    default:
      return "Bear"
  }
}

function formatScenarioValue(value: number | null) {
  if (value === null) {
    return "--"
  }

  if (Number.isInteger(value)) {
    return value.toLocaleString("en-US")
  }

  const fixed = value.toFixed(2)
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")
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
            <thead className={s.thead}>
              <tr>
                <th>Coverage</th>
                <th>Stance</th>
                <th>Conviction</th>
                <th>Thesis</th>
                <th>Bear / Neutral / Bull</th>
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
                    <div className={s.stanceStack}>
                      <span className={getStancePillClassName(stance.stance)}>
                        {formatStanceLabel(stance.stance)}
                      </span>
                      <span className={getDirectionalClassName(stance.stance)}>
                        {formatDirectionalLabel(stance.stance)}
                      </span>
                    </div>
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
                        <div className={`${s.targetCard} ${s.targetCardBear}`}>
                          <span className={s.targetValue}>
                            {formatScenarioValue(stance.bear)}
                          </span>
                          <span className={s.targetLabel}>
                            {formatScenarioLabel("bear")}
                          </span>
                        </div>
                        <div className={`${s.targetCard} ${s.targetCardBase}`}>
                          <span className={s.targetValue}>
                            {formatScenarioValue(stance.base)}
                          </span>
                          <span className={s.targetLabel}>
                            {formatScenarioLabel("base")}
                          </span>
                        </div>
                        <div className={`${s.targetCard} ${s.targetCardBull}`}>
                          <span className={s.targetValue}>
                            {formatScenarioValue(stance.bull)}
                          </span>
                          <span className={s.targetLabel}>
                            {formatScenarioLabel("bull")}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className={s.cell}>
                    <span className={getStatusClassName(stance.status)}>
                      <span className={s.statusDot} />
                      {formatStatusLabel(stance.status)}
                    </span>
                  </td>
                  <td className={`${s.cell} ${s.date}`}>{stance.date}</td>
                  <td className={s.cell}>
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
