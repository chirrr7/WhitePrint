import Link from "next/link"
import s from "./market-note-template.module.css"

export interface MarketNoteSignal {
  title: string
  text: string
}

interface MarketNoteTemplateProps {
  title: string
  deck: string
  date: string
  readTime: number
  tags: string[]
  lede: string
  whyMarketsCare: string
  signals: MarketNoteSignal[]
  bottomLine: string
  disclaimer: string
  companionHref: string
  companionTitle: string
  companionText: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function MarketNoteTemplate({
  title,
  deck,
  date,
  readTime,
  tags,
  lede,
  whyMarketsCare,
  signals,
  bottomLine,
  disclaimer,
  companionHref,
  companionTitle,
  companionText,
}: MarketNoteTemplateProps) {
  return (
    <div className={s.wrapper}>
      <header className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroMeta}>
            <span className={s.notePill}>Market Note</span>
            <Link href="/macro" className={s.categoryPill}>Macro</Link>
            <span className={s.metaItem}>{formatDate(date)}</span>
            <span className={`${s.metaItem} ${s.metaDot}`}>/</span>
            <span className={s.metaItem}>{readTime} min read</span>
          </div>

          <h1 className={s.title}>{title}</h1>
          <p className={s.deck}>{deck}</p>

          <div className={s.tags}>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className={s.tag}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className={s.layout}>
        <article>
          <p className={s.lede}>{lede}</p>

          <section className={s.section}>
            <h2 className={s.sectionHeading}>Why Markets Care</h2>
            <p className={s.sectionBody}>{whyMarketsCare}</p>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionHeading}>Signals Investors Are Watching</h2>
            <ol className={s.signalsList}>
              {signals.map((signal) => (
                <li key={signal.title}>
                  <strong>{signal.title}</strong> {signal.text}
                </li>
              ))}
            </ol>
          </section>

          <section className={s.bottomLine}>
            <div className={s.bottomLineLabel}>Bottom Line</div>
            <p className={s.bottomLineText}>{bottomLine}</p>
          </section>

          <p className={s.disclaimer}>{disclaimer}</p>

          <section className={s.cta}>
            <div>
              <div className={s.ctaTitle}>{companionTitle}</div>
              <p className={s.ctaText}>{companionText}</p>
            </div>
            <Link href={companionHref} className={s.ctaLink}>
              Read Full Analysis →
            </Link>
          </section>
        </article>
      </div>
    </div>
  )
}
