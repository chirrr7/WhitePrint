import Link from "next/link"
import type { Stance } from "@/lib/stances"
import s from "./StancesTicker.module.css"

function getStanceClassName(stance: Stance["stance"]) {
  switch (stance) {
    case "cautious":
      return `${s.stance} ${s.stanceCautious}`
    case "constructive":
      return `${s.stance} ${s.stanceConstructive}`
    default:
      return `${s.stance} ${s.stanceNeutral}`
  }
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

export function StancesTicker({ stances }: { stances: Stance[] }) {
  if (stances.length === 0) {
    return null
  }

  const items = [...stances, ...stances]

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <Link href="/stances" className={s.label}>
          Latest Stances
        </Link>
        <div className={s.track}>
          <div className={s.marquee}>
            {items.map((stance, index) => (
              <Link
                key={`${stance.slug}-${index}`}
                href={`/posts/${stance.slug}`}
                className={s.item}
              >
                <span className={s.ticker}>{stance.ticker}</span>
                <span className={s.name}>{stance.name}</span>
                <span className={getStanceClassName(stance.stance)}>
                  {formatStanceLabel(stance.stance)}
                </span>
                <span className={s.date}>{stance.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
