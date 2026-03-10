"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import s from "./article.module.css"

export function FedDecisionWeekArticle() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      const d = document.documentElement
      const pct = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100
      if (progressRef.current) {
        progressRef.current.style.width = Math.min(pct, 100) + "%"
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={s.wrapper}>
      <div ref={progressRef} className={s.progress} />

      {/* Hero */}
      <header className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroMeta}>
            <span className={s.notePill}>Market Note</span>
            <Link href="/macro" className={s.categoryPill}>Macro</Link>
            <span className={s.heroDate}>March 10, 2026</span>
            <div className={s.heroRule} />
          </div>
          <h1 className={s.title}>
            Fed Decision Week:<br /><em>Three Things to Watch</em>
          </h1>
          <p className={s.heroDeck}>
            The Federal Reserve meets March 17–18. Rates are not moving — but the signals that come out of this meeting could shape how markets behave for months.
          </p>
          <div className={s.noteBadge}>
            <span className={s.noteBadgeLabel}>Format</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeVal}>Market Note</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeLabel}>Read</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeVal}>3 min</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeLabel}>Words</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeVal}>~160</span>
          </div>
          <div className={s.tags}>
            <Link href="/search?tag=fed" className={s.tag}>#fed</Link>
            <Link href="/search?tag=macro" className={s.tag}>#macro</Link>
            <Link href="/search?tag=rates" className={s.tag}>#rates</Link>
            <Link href="/search?tag=energy" className={s.tag}>#energy</Link>
            <Link href="/search?tag=inflation" className={s.tag}>#inflation</Link>
          </div>
          <div className={s.byline}>
            <div className={s.bylineText}>
              <div className={s.bylineName}>Whiteprint Research</div>
              <div className={s.bylineSub}>Independent Macro &amp; Equity Research · March 2026</div>
            </div>
            <div className={s.bylineRight}>
              <Link href="/posts/liquidity-squeeze-fed-march-2026" className={s.relatedLink}>Read full analysis &#8599;</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className={s.layout}>
        <article className={s.article}>

          <p className={s.lede}>
            The Federal Reserve&apos;s upcoming meeting is expected to end with no change to interest rates. With that outcome already priced in, the real question is what the Fed says — not what it does. Three overlapping pressures make this meeting unusually consequential: a fragile funding environment, a looming change in Fed leadership, and a geopolitical development that threatens to push energy prices higher at exactly the wrong time.
          </p>

          <div className={s.metricsRow}>
            <div className={s.metric}>
              <div className={s.metricLabel}>Current Rate</div>
              <div className={s.metricValue}>3.50–3.75%</div>
              <div className={s.metricSub}>unchanged since Dec 2025</div>
            </div>
            <div className={s.metric}>
              <div className={s.metricLabel}>Inflation (Jan CPI)</div>
              <div className={`${s.metricValue} ${s.metricValueWarn}`}>2.4%</div>
              <div className={s.metricSub}>above the Fed&apos;s 2% target</div>
            </div>
            <div className={s.metric}>
              <div className={s.metricLabel}>Prob. of Hold</div>
              <div className={`${s.metricValue} ${s.metricValueNeg}`}>~99%</div>
              <div className={s.metricSub}>CME FedWatch, Mar 6</div>
            </div>
          </div>

          <h2>Why Markets Care</h2>
          <p>
            When the Fed holds rates, the focus shifts to its language — specifically, whether it signals that cuts are coming sooner or later. Right now, inflation is still above the Fed&apos;s 2% target, and a recent escalation in the Middle East risks pushing energy prices higher, which would push inflation higher too. If the Fed sounds more cautious about cutting rates, it becomes harder for markets to get excited. If it sounds more open to easing, risk appetite could recover quickly. The statement and press conference on March 18 will be read very closely for any shift in tone.
          </p>

          <div className={s.sectionDivider}><span>Key Signals</span></div>

          <h2>Signals Investors Are Watching</h2>
          <ol className={s.signalsList}>
            <li><strong>The dot plot revision.</strong> The Fed publishes a chart — known as the dot plot — showing where each official expects rates to be at year-end. The December version suggested one rate cut in 2026. If March shows zero cuts, markets will interpret that as a more restrictive stance and may react negatively.</li>
            <li><strong>Energy prices and inflation.</strong> Recent tensions in the Middle East have introduced uncertainty around global oil supply routes. Higher energy costs raise inflation. If the February CPI report (due March 11) shows early signs of energy pass-through, the Fed&apos;s ability to signal future cuts becomes even more limited.</li>
            <li><strong>The Fed leadership handover.</strong> Jerome Powell&apos;s term as Chair ends in May. His likely successor has publicly favoured a smaller Fed balance sheet — a shift that could tighten financial conditions further. Markets are watching for any early signals about what that transition means for policy direction.</li>
          </ol>

          <div className={s.bottomLine}>
            <div className={s.bottomLineLabel}>Bottom Line</div>
            <p>The rate decision is settled. What matters on March 18 is whether the Fed sounds more or less willing to cut — and whether rising energy costs force it to stay restrictive longer than markets are hoping.</p>
          </div>

          <div className={s.disclaimer}>
            <p>This Market Note is for informational purposes only and does not constitute investment advice. All views represent Whiteprint Research analysis as of the date of publication.</p>
          </div>

          <div className={s.ctaStrip} id="full-article">
            <div className={s.ctaText}>
              <strong>Want the full picture?</strong>
              The deep-dive covers liquidity mechanics, factor positioning, sector sensitivities, and four detailed scenarios for the March 18 outcome.
            </div>
            <Link href="/posts/liquidity-squeeze-fed-march-2026" className={s.ctaBtn}>Read Full Analysis &#8594;</Link>
          </div>

        </article>
      </div>
    </div>
  )
}
