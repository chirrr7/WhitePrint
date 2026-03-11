"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import s from "./article.module.css"

export function PredictionMarketsEmArticle() {
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
            <span className={s.heroDate}>March 11, 2026</span>
            <div className={s.heroRule} />
          </div>
          <h1 className={s.title}>
            Prediction Markets See the Conflict.<br /><em>Emerging Markets May Bear the Cost.</em>
          </h1>
          <p className={s.heroDeck}>
            If event-implied oil probabilities are taken seriously, the bigger macro question is no longer where crude trades tomorrow — but which emerging markets are forced to absorb a longer energy shock.
          </p>
          <div className={s.noteBadge}>
            <span className={s.noteBadgeLabel}>Format</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeVal}>Market Note</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeLabel}>Read</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeVal}>5 min</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeLabel}>Words</span>
            <span className={s.noteBadgeSep} />
            <span className={s.noteBadgeVal}>~750</span>
          </div>
          <div className={s.tags}>
            <Link href="/search?tag=oil" className={s.tag}>#oil</Link>
            <Link href="/search?tag=macro" className={s.tag}>#macro</Link>
            <Link href="/search?tag=em-fx" className={s.tag}>#em-fx</Link>
            <Link href="/search?tag=inflation" className={s.tag}>#inflation</Link>
            <Link href="/search?tag=geopolitics" className={s.tag}>#geopolitics</Link>
            <Link href="/search?tag=prediction-markets" className={s.tag}>#prediction-markets</Link>
          </div>
          <div className={s.byline}>
            <div className={s.bylineText}>
              <div className={s.bylineName}>Whiteprint Research</div>
              <div className={s.bylineSub}>Independent Macro &amp; Equity Research · March 2026</div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className={s.layout}>
        <article className={s.article}>

          <p className={s.lede}>
            Oil has stopped behaving like a local commodity story. It is now a macro transmission channel. Brent was trading around $90.84 on March 11 after a sharp stretch of volatility tied to the Middle East conflict, while the EIA said Brent could remain above $95 over the next two months before easing later in the year if supply disruptions abate. That qualifier matters more than the headline number itself.
          </p>

          <div className={s.metricsRow}>
            <div className={s.metric}>
              <div className={s.metricLabel}>Brent Spot</div>
              <div className={`${s.metricValue} ${s.metricValueWarn}`}>$90.84</div>
              <div className={s.metricSub}>Mar 11, 2026</div>
            </div>
            <div className={s.metric}>
              <div className={s.metricLabel}>Prob. Brent &gt; $90</div>
              <div className={`${s.metricValue} ${s.metricValueNeg}`}>28%</div>
              <div className={s.metricSub}>year-end tail risk</div>
            </div>
            <div className={s.metric}>
              <div className={s.metricLabel}>Prob. Brent &gt; $100</div>
              <div className={`${s.metricValue} ${s.metricValueNeg}`}>10%</div>
              <div className={s.metricSub}>extreme right tail</div>
            </div>
          </div>

          <h2>The Futures Curve Is Not a Clean Probability Distribution</h2>
          <p>
            The usual futures curve embeds carry, storage, physical tightness and producer hedging. For macro analysis, that can be useful but also noisy. A cleaner way to frame the question is to start with event-style oil scenarios, then ask what those scenarios imply for vulnerable emerging markets.
          </p>
          <p>
            In our internal scenario framework, the probability distribution still leans toward softer prices by year-end, but not enough to dismiss the right tail: roughly 28% for Brent above $90 and 10% for Brent above $100. That is not a base-case panic. It is, however, a meaningful tail. The probability-weighted expected Brent sits around $84.86, but that average obscures a distribution where nearly one-third of the weight points to an energy environment that most EM currency positioning has not priced.
          </p>

          <div className={s.callout}>
            <div className={s.calloutLabel}>Methodology Note</div>
            <p>The point is not that prediction-style markets know more than the physical oil market. They do not. The point is that they can be useful as a sentiment overlay. By stripping away the hedging noise of the physical oil trade, they isolate where collective conviction sits around terminal outcomes, which is precisely what matters when policy-sensitive currencies are being forced to price energy risk, inflation risk and external-balance risk at the same time. Brent estimates apply a static $6/bbl spread over December 2026 WTI bracket probabilities.</p>
          </div>

          <div className={s.sectionDivider}><span>EM Transmission</span></div>

          <h2>Higher Oil Is Not a Uniform EM Story</h2>
          <p>
            For importers, it widens current-account pressure, raises inflation pass-through and reduces room for rate cuts. For exporters, it can improve trade balances, support fiscal revenues and cushion the currency, at least up to the point where a broader risk-off shock overwhelms the commodity benefit. That distinction is becoming more relevant in the live macro backdrop. Reuters reported that the Iran-linked energy spike has reduced the room for rate cuts across emerging markets, with only six of 15 major EM central banks now expected to cut rates in the coming months, down from ten before the conflict escalated.
          </p>

          <div className={s.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Economy</th>
                  <th>Energy Trade Position</th>
                  <th>CPI Oil Weight &amp; Inflation Risk</th>
                  <th>FX Sensitivity to Oil Shocks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>India</strong></td>
                  <td>Imports ~85% of crude (~4.5 mb/d)</td>
                  <td>High. 7–8% CPI weight, subsidy pressure</td>
                  <td><span className={`${s.badge} ${s.badgeNeg}`}>Severe negative</span> INR depreciation pressure</td>
                </tr>
                <tr>
                  <td><strong>Turkey</strong></td>
                  <td>Imports nearly 100% of crude</td>
                  <td>Very High. ~15% CPI weight</td>
                  <td><span className={`${s.badge} ${s.badgeNeg}`}>Severe negative</span> Lira fragility amplified</td>
                </tr>
                <tr>
                  <td><strong>Colombia</strong></td>
                  <td>Exports ~900k bbl/day</td>
                  <td>Moderate. Domestic fuel reforms ongoing</td>
                  <td><span className={`${s.badge} ${s.badgePos}`}>Positive</span> Fiscal relief, COP support</td>
                </tr>
                <tr>
                  <td><strong>Brazil</strong></td>
                  <td>Marginal net exporter (Petrobras offshore)</td>
                  <td>Low. Limited inflation pass-through</td>
                  <td><span className={`${s.badge} ${s.badgePos}`}>Positive</span> BRL appreciation potential</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Turkey Is the Clearest Example of Why</h2>
          <p>
            It combines imported energy dependence with high inflation pass-through and an already fragile currency regime. In other words, it does not need Brent at $120 to feel pain. A persistent move that keeps Brent elevated into the $90–$100 range is enough to complicate easing expectations, keep imported inflation live and reintroduce pressure into the lira. In our framework, Turkey is not simply an oil loser. It is the market where tail-risk oil scenarios have the strongest policy consequences.
          </p>
          <p>
            India is different, but still exposed. The rupee benefits from deeper domestic capital markets and stronger macro management than many peers, yet the logic of the shock is straightforward: higher oil worsens the import bill, presses on the current account and narrows the room for policy flexibility. That does not guarantee a sharp INR repricing. It does suggest that if oil tail risks remain underappreciated, large importers such as India are more likely to experience a gradual valuation adjustment than a dramatic one-day break.
          </p>

          <h2>Brazil and Colombia Are the Contrast Cases</h2>
          <p>
            Both economies have oil-linked support channels that importers simply do not. Higher crude can improve external balances and offer at least some currency support. Colombia shows the stronger direct oil linkage. Brazil looks more balanced because domestic inflation and broader EM risk sentiment still matter. The key point is relative, not absolute: exporters do not become immune in a geopolitical shock, but they do enter it with a different transmission mechanism.
          </p>
          <p>
            That is the real analytical value of using scenario-style oil probabilities. They do not replace futures, and they should not be treated as superior price discovery. But they do help separate a macro question that is often blurred in commodity markets: not whether oil is volatile, but whether the distribution of outcomes is skewed enough to make some currencies look too relaxed.
          </p>

          <div className={s.bottomLine}>
            <div className={s.bottomLineLabel}>Bottom Line</div>
            <p>The current oil shock is not just a commodity event and not yet a universal EM crisis. It is a sorting mechanism. Importers with high pass-through and weaker policy flexibility remain the vulnerable end of the spectrum. Exporters with oil-linked external cushions remain better placed. That may prove more important than where Brent settles on any given day.</p>
          </div>

          <div className={s.disclaimer}>
            <p>This Market Note is for commentary and market analysis only. It is not investment advice or a recommendation to buy, sell, or hold any security, currency, or commodity. Internal scenario framework references Whiteprint EM Currency Oil Stress Model (March 2026). Brent modeling assumes a static $6/bbl spread over WTI.</p>
          </div>

          <div className={s.references}>
            <h2>Sources</h2>
            <div className={s.refList}>
              <div className={s.refItem}><span className={s.refNum}>[1]</span><span>Reuters. U.S. crude stocks rise; includes EIA Brent outlook context (March 11, 2026)</span></div>
              <div className={s.refItem}><span className={s.refNum}>[2]</span><span>Reuters. Iran-linked energy spike shrinks emerging markets&apos; room for rate cuts (March 11, 2026)</span></div>
              <div className={s.refItem}><span className={s.refNum}>[3]</span><span>EIA Short-Term Energy Outlook (STEO, March 2026)</span></div>
              <div className={s.refItem}><span className={s.refNum}>[4]</span><span>Kalshi. December 2026 WTI Bracket Probabilities (prediction market data)</span></div>
              <div className={s.refItem}><span className={s.refNum}>[5]</span><span>Whiteprint EM Currency Oil Stress Model. Internal Analysis (March 2026)</span></div>
            </div>
          </div>

        </article>
      </div>
    </div>
  )
}
