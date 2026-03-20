"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import s from "./article.module.css"

export function EogResourcesArticle() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      const d = document.documentElement
      const pct = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min(pct, 100)}%`
      }
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={s.wrapper}>
      <div ref={progressRef} className={s.progress} />

      <header className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroMeta}>
            <Link href="/equity" className={s.categoryPill}>Equity Research</Link>
            <span className={s.heroDate}>March 18, 2026</span>
            <div className={s.heroRule} />
          </div>
          <h1 className={s.title}>EOG Resources:<br />The Base Case <em>Is Priced In</em></h1>
          <p className={s.heroDeck}>
            At $140, the market is already paying for $90 oil and clean execution. The 9% upside to our base DCF is narrow. The more important question is whether the Gulf conflict makes the Conflict-Up scenario the more honest anchor for the next 12 months.
          </p>
          <div className={s.tags}>
            {[
              "equity",
              "e-and-p",
              "oil",
              "dcf",
              "energy",
              "eog",
            ].map((tag) => (
              <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`} className={s.tag}>
                #{tag}
              </Link>
            ))}
          </div>
          <div className={s.byline}>
            <div className={s.bylineText}>
              <div className={s.bylineName}>Whiteprint Research</div>
              <div className={s.bylineSub}>Equity Research — E&amp;P Coverage · March 2026</div>
            </div>
            <div className={s.bylineStats}>
              <div className={s.bylineStat}><strong>20 min</strong>read</div>
              <div className={s.bylineStat}><strong>4</strong>scenarios</div>
              <div className={s.bylineStat}><strong>DCF</strong>model</div>
            </div>
          </div>
        </div>
      </header>

      <div className={s.layout}>
        <article className={s.article}>
          <h2>The Setup</h2>
          <p className={s.articleFirstP}>EOG Resources trades at approximately $140. Our base-case DCF — WTI at $90 declining to $80 by 2030, WACC 8.95%, 2% terminal growth — implies $152.73. That is 9% upside. The probability-weighted price across all four scenarios is $146.85, which is 4.8% above the current quote.</p>
          <p>What makes the setup interesting rather than simply fairly valued is the macro context. On the day this note was finalized, Brent crude briefly touched $119 before partially reversing on reports that Israel is helping to reopen the Strait of Hormuz. Oil has traded above $107 following Iran&apos;s threats to energy facilities in Saudi Arabia, the UAE, and Qatar.</p>

          <div className={s.metricsRow}>
            <div className={s.metric}><div className={s.metricLabel}>Current Price</div><div className={`${s.metricValue} ${s.neutral}`}>~$140</div><div className={s.metricSub}>NYSE: EOG, Mar 18 2026</div></div>
            <div className={s.metric}><div className={s.metricLabel}>Base DCF</div><div className={`${s.metricValue} ${s.pos}`}>$152.73</div><div className={s.metricSub}>+9.0% upside · WTI $90→$80</div></div>
            <div className={s.metric}><div className={s.metricLabel}>Prob-Weighted</div><div className={`${s.metricValue} ${s.pos}`}>$146.85</div><div className={s.metricSub}>+4.8% upside · 4-scenario blend</div></div>
            <div className={s.metric}><div className={s.metricLabel}>Conflict-Up DCF</div><div className={`${s.metricValue} ${s.warn}`}>$172.82</div><div className={s.metricSub}>+23.3% upside · WTI $95→$85</div></div>
          </div>

          <h2>What the Model Is Actually Saying</h2>
          <p>The model runs four scenarios differentiated primarily by the WTI price path. Oil dominates the output. EOG&apos;s own disclosed sensitivity of $223 million pretax per $1/bbl of crude is the clearest way to understand why.</p>

          <div className={s.callout}>
            <div className={s.calloutLabel}>Model Note — OCF Sensitivity</div>
            <p>EOG&apos;s 2026 plan disclosure: $223M pretax OCF per $1/bbl crude and $83M pretax per $0.10/Mcf gas. The Conflict-Up scenario runs WTI $95 versus $90 in base.</p>
          </div>

          <div className={s.tableWrap}>
            <table>
              <thead><tr><th>Scenario</th><th>2026E</th><th>2027E</th><th>2028E</th><th>2029E</th><th>2030E</th><th>2031E</th><th>2032E</th></tr></thead>
              <tbody>
                <tr><td><strong>Bear</strong></td><td>$1.57</td><td>$1.62</td><td>$2.20</td><td>$2.67</td><td>$3.06</td><td>$3.13</td><td>$3.20</td></tr>
                <tr><td><strong>Base</strong></td><td>$6.10</td><td>$6.19</td><td>$6.25</td><td>$6.30</td><td>$6.16</td><td>$6.32</td><td>$6.44</td></tr>
                <tr><td><strong>Conflict-Up</strong></td><td>$6.97</td><td>$7.14</td><td>$7.30</td><td>$7.19</td><td>$6.88</td><td>$7.05</td><td>$7.19</td></tr>
                <tr><td><strong>Bull</strong></td><td>$7.71</td><td>$7.92</td><td>$8.11</td><td>$8.00</td><td>$7.82</td><td>$8.02</td><td>$8.18</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Scenario Analysis</h2>
          <div className={s.scenarioGrid}>
            <div className={`${s.scenarioCard} ${s.base}`}><div className={s.scenarioTitle}>Base Case — 45%</div><div className={s.scenarioBody}>$90→$80 WTI · Controlled easing.</div></div>
            <div className={`${s.scenarioCard} ${s.conflict}`}><div className={s.scenarioTitle}>Conflict-Up — 15%</div><div className={s.scenarioBody}>$95→$85 WTI · Sustained disruption.</div></div>
            <div className={`${s.scenarioCard} ${s.bull}`}><div className={s.scenarioTitle}>Bull — 20%</div><div className={s.scenarioBody}>$100→$90 WTI · OPEC+ discipline.</div></div>
            <div className={`${s.scenarioCard} ${s.bear}`}><div className={s.scenarioTitle}>Bear — 20%</div><div className={s.scenarioBody}>$55→$62 WTI · Macro demand shock.</div></div>
          </div>

          <div className={s.pullQuote}>
            <p>The base case is priced in. The main issue is whether Conflict-Up deserves a higher probability in the current setup.</p>
            <cite>Whiteprint Research, March 2026</cite>
          </div>

          <h2>Conclusion</h2>
          <p>EOG remains a high-quality E&amp;P operator, but at current levels this is no longer a deep-value setup under base assumptions. Upside now depends on oil path persistence and scenario reweighting.</p>
        </article>

        <aside className={s.sidebar}>
          <div className={s.priceTargetCard}>
            <div className={s.priceTargetHead}>Prob-Weighted Target</div>
            <div className={s.priceTargetBody}>
              <div className={s.priceTargetLabel}>4-Scenario Blend</div>
              <div className={s.priceTargetValue}>$146.85</div>
              <div className={s.priceTargetUpside}>+4.8% vs. ~$140 market</div>
            </div>
          </div>

          <div className={s.sidebarCard}>
            <div className={s.sidebarHead}>Model Parameters</div>
            <div className={s.sidebarBody}>
              <div className={s.kvRow}><span className={s.kvLabel}>WACC</span><span className={s.kvValue}>8.95%</span></div>
              <div className={s.kvRow}><span className={s.kvLabel}>Terminal Growth</span><span className={s.kvValue}>2.0%</span></div>
              <div className={s.kvRow}><span className={s.kvLabel}>TV / EV (base)</span><span className={s.kvValue}>62.3%</span></div>
            </div>
          </div>

          <div className={s.sidebarCard}>
            <div className={s.sidebarHead}>Context from Macro Coverage</div>
            <div className={s.sidebarNote}>
              For broader macro framing, see <Link href="/posts/liquidity-squeeze-fed-march-2026">Navigating the Liquidity Squeeze</Link> and <Link href="/posts/fed-decision-week-three-things-to-watch">Fed Decision Week</Link>.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
