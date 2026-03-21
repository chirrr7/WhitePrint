import type { Metadata } from "next"
import Link from "next/link"
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google"
import { ProgressBar } from "./ProgressBar"
import styles from "./eog.module.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-source-serif",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "EOG Resources: The Base Case Is Priced In",
  description:
    "At $140, the market is already paying for $90 oil and clean execution. The 9% upside to our base DCF is narrow. The more important question is whether the Gulf conflict makes the Conflict-Up scenario the more honest anchor for the next 12 months.",
}

export default function EOGPage() {
  return (
    <div
      className={`${styles.wrapper} ${playfairDisplay.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <ProgressBar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroMeta}>
            <Link href="/equity" className={styles.categoryPill}>
              Equity Research
            </Link>
            <span className={styles.heroDate}>March 18, 2026</span>
            <div className={styles.heroRule}></div>
          </div>

          <h1>
            EOG Resources:<br />
            The Base Case <em>Is Priced In</em>
          </h1>

          <p className={styles.heroDeck}>
            At $140, the market is already paying for $90 oil and clean execution. The 9% upside
            to our base DCF is narrow. The more important question is whether the Gulf conflict
            makes the Conflict-Up scenario the more honest anchor for the next 12 months.
          </p>

          <div className={styles.tags}>
            <Link href="/search?tag=equity" className={styles.tag}>#equity</Link>
            <Link href="/search?tag=e-and-p" className={styles.tag}>#e-and-p</Link>
            <Link href="/search?tag=oil" className={styles.tag}>#oil</Link>
            <Link href="/search?tag=dcf" className={styles.tag}>#dcf</Link>
            <Link href="/search?tag=energy" className={styles.tag}>#energy</Link>
            <Link href="/search?tag=eog" className={styles.tag}>#eog</Link>
          </div>

          <div className={styles.byline}>
            <div className={styles.bylineText}>
              <div className={styles.bylineName}>Whiteprint Research</div>
              <div className={styles.bylineSub}>Equity Research — E&amp;P Coverage · March 2026</div>
            </div>
            <div className={styles.bylineStats}>
              <div className={styles.bylineStat}><strong>20 min</strong>read</div>
              <div className={styles.bylineStat}><strong>4</strong>scenarios</div>
              <div className={styles.bylineStat}><strong>DCF</strong>model</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className={styles.layout}>
        <article className={styles.article}>

          <h2>The Setup</h2>

          <p>
            EOG Resources trades at approximately $140. Our base-case DCF — WTI at $90 declining
            to $80 by 2030, WACC 8.95%, 2% terminal growth — implies $152.73. That is 9% upside.
            The probability-weighted price across all four scenarios is $146.85, which is 4.8%
            above the current quote. On a pure base-case framing, this stock is not cheap. The
            market has already done most of the work pricing a constructive oil environment.
          </p>

          <p>
            What makes the setup interesting rather than simply &#8220;fairly valued&#8221; is the
            macro context. On the day this note was finalized, Brent crude briefly touched $119
            before partially reversing on reports that Israel is helping to reopen the Strait of
            Hormuz. Oil has traded above $107 following Iran&rsquo;s threats to energy facilities
            in Saudi Arabia, the UAE, and Qatar. That is not a base-case environment. That is the
            Conflict-Up scenario playing out in real time. At $172.82, the Conflict-Up DCF implies
            23% upside from current levels, and the live macro backdrop raises a legitimate question
            about whether the current 15% probability weight on that scenario still reflects the
            actual distribution of outcomes.
          </p>

          <p>
            The company itself is not the issue. EOG is doing exactly what a disciplined E&amp;P
            should: generating $6.1 billion of free cash flow in the base case on a $6.5 billion
            capital program, returning 100% of free cash flow to shareholders, and maintaining a
            $50 WTI breakeven that covers the dividend even in a severe downturn. The operational
            story is clean. The valuation story is that most of it is already priced at $140, and
            the stock now needs either the conflict to stay elevated or execution to come in ahead
            of expectations to generate material upside from here.
          </p>

          <div className={styles.metricsRow}>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Current Price</div>
              <div className={`${styles.metricValue} ${styles.neutral}`}>~$140</div>
              <div className={styles.metricSub}>NYSE: EOG, Mar 18 2026</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Base DCF</div>
              <div className={`${styles.metricValue} ${styles.pos}`}>$152.73</div>
              <div className={styles.metricSub}>+9.0% upside · WTI $90→$80</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Prob-Weighted</div>
              <div className={`${styles.metricValue} ${styles.pos}`}>$146.85</div>
              <div className={styles.metricSub}>+4.8% upside · 4-scenario blend</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Conflict-Up DCF</div>
              <div className={`${styles.metricValue} ${styles.warn}`}>$172.82</div>
              <div className={styles.metricSub}>+23.3% upside · WTI $95→$85</div>
            </div>
          </div>

          <div className={styles.disclaimer}>
            <p>
              All implied prices are outputs from an internal DCF model and are for analytical
              discussion only. They do not constitute investment recommendations. All valuation is
              materially sensitive to commodity price assumptions and model inputs.
            </p>
          </div>

          <h2>What the Model Is Actually Saying</h2>

          <h3>Four Scenarios, One Dominant Variable</h3>
          <p>
            The model runs four scenarios differentiated primarily by the WTI price path. Gas
            assumptions also differ, with the Conflict-Up and Bull cases including a mild uplift
            in Henry Hub from LNG re-routing and energy security flows. Oil dominates the output.
            EOG&rsquo;s own disclosed sensitivity of $223 million pretax per $1/bbl of crude is
            the clearest way to understand why: run $5 above base-case oil for a year and you add
            over $1 billion of pretax operating cash. Capitalize that across a 7-year explicit DCF
            period plus terminal value, and the share price impact is not trivial.
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutLabel}>Model Note — OCF Sensitivity</div>
            <p>
              EOG&rsquo;s 2026 plan disclosure: $223M pretax OCF per $1/bbl crude (including
              associated NGL price change and derivative impacts), and $83M pretax per $0.10/Mcf
              gas. The Conflict-Up scenario runs WTI $95 in 2026 versus $90 in the base — that $5
              differential alone adds roughly $1.1B of pretax operating cash in year one, before
              gas uplift. At a 7.0% FCF yield on EV, that translates materially into implied
              equity value.
            </p>
          </div>

          <h3>The FCF Build by Year</h3>
          <p>
            The table below shows the full 7-year unlevered FCF projection for each scenario,
            exactly as it runs through the DCF engine. Bear case FCF recovers gradually as the
            oil path in that scenario lifts from $55 in 2026 to $62 by 2030 — the company does
            not go into distress, but free cash generation is severely compressed in the near term.
            The three upper scenarios are more tightly clustered than their price paths might
            suggest, because higher oil drives both higher revenue and higher production taxes.
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>2026E</th><th>2027E</th><th>2028E</th>
                  <th>2029E</th><th>2030E</th><th>2031E</th><th>2032E</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Bear</strong> <span className={`${styles.badge} ${styles.badgeNeg}`}>$55 WTI</span></td>
                  <td>$1.57</td><td>$1.62</td><td>$2.20</td>
                  <td>$2.67</td><td>$3.06</td><td>$3.13</td><td>$3.20</td>
                </tr>
                <tr>
                  <td><strong>Base</strong> <span className={`${styles.badge} ${styles.badgeN}`}>$90 WTI</span></td>
                  <td>$6.10</td><td>$6.19</td><td>$6.25</td>
                  <td>$6.30</td><td>$6.16</td><td>$6.32</td><td>$6.44</td>
                </tr>
                <tr>
                  <td><strong>Conflict-Up</strong> <span className={`${styles.badge} ${styles.badgeWarn}`}>$95 WTI</span></td>
                  <td>$6.97</td><td>$7.14</td><td>$7.30</td>
                  <td>$7.19</td><td>$6.88</td><td>$7.05</td><td>$7.19</td>
                </tr>
                <tr>
                  <td><strong>Bull</strong> <span className={`${styles.badge} ${styles.badgePos}`}>$100 WTI</span></td>
                  <td>$7.71</td><td>$7.92</td><td>$8.11</td>
                  <td>$8.00</td><td>$7.82</td><td>$8.02</td><td>$8.18</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            All figures in $B. The Conflict-Up FCF path is roughly 14% above base throughout the
            projection period — meaningful, but not dramatic. The leverage in the DCF is not just
            in annual FCF but in the terminal value, which is capitalized at WACC minus g (6.95%
            spread at 8.95% WACC and 2% terminal growth). A scenario that sustains higher FCF into
            the terminal year produces a disproportionately larger implied price.
          </p>

          <h2>Scenario Analysis</h2>

          <div className={styles.scenarioGrid}>
            <div className={`${styles.scenarioCard} ${styles.base}`}>
              <div className={styles.scenarioHeader}>
                <span className={styles.scenarioName}>Base Case</span>
                <span className={styles.scenarioProb}>45%</span>
              </div>
              <div className={styles.scenarioTitle}>$90→$80 WTI · Controlled Easing</div>
              <div className={styles.scenarioBody}>
                Geopolitical risk premium supports near-term pricing; $80 mid-cycle reflects Saudi
                fiscal breakeven and long-run marginal cost of supply. Gas near EIA STEO strip at
                $2.60/Mcf. 2026E EBITDA $15.6B, FCF $6.1B.
              </div>
              <div className={styles.scenarioOutcome} style={{ color: "var(--gold)" }}>
                DCF: $152.73 · EV/EBITDA: $150.79 · Upside: +9.0%
              </div>
            </div>

            <div className={`${styles.scenarioCard} ${styles.conflict}`}>
              <div className={styles.scenarioHeader}>
                <span className={styles.scenarioName}>Conflict-Up</span>
                <span className={styles.scenarioProb}>15%</span>
              </div>
              <div className={styles.scenarioTitle}>$95→$85 WTI · Sustained Disruption</div>
              <div className={styles.scenarioBody}>
                Prolonged Gulf supply disruption holds WTI elevated through 2026-27. Gas lifted to
                $3.00/Mcf by LNG re-routing and energy security flows. 2026E EBITDA $17.0B, FCF
                $7.0B.
              </div>
              <div className={styles.scenarioOutcome} style={{ color: "var(--accent-2)" }}>
                DCF: $172.82 · EV/EBITDA: $165.10 · Upside: +23.3%
              </div>
            </div>

            <div className={`${styles.scenarioCard} ${styles.bull}`}>
              <div className={styles.scenarioHeader}>
                <span className={styles.scenarioName}>Bull Case</span>
                <span className={styles.scenarioProb}>20%</span>
              </div>
              <div className={styles.scenarioTitle}>$100→$90 WTI · OPEC+ Discipline</div>
              <div className={styles.scenarioBody}>
                Deeper OPEC+ cuts combined with strong demand and an LNG export boom. Gas
                $3.20/Mcf. 2026E EBITDA $18.3B, FCF $7.7B. Requires sustained supply discipline
                beyond what markets are currently pricing as durable.
              </div>
              <div className={styles.scenarioOutcome} style={{ color: "var(--positive)" }}>
                DCF: $196.42 · EV/EBITDA: $177.69 · Upside: +40.1%
              </div>
            </div>

            <div className={`${styles.scenarioCard} ${styles.bear}`}>
              <div className={styles.scenarioHeader}>
                <span className={styles.scenarioName}>Bear Case</span>
                <span className={styles.scenarioProb}>20%</span>
              </div>
              <div className={styles.scenarioTitle}>$55→$62 WTI · Macro Demand Shock</div>
              <div className={styles.scenarioBody}>
                US recession or sharp global demand contraction breaks WTI to $55. FCF collapses
                to $1.6B. EOG&rsquo;s $50 breakeven covers the regular dividend, but buybacks
                stop. Gas $2.20/Mcf. 2026E EBITDA $7.8B.
              </div>
              <div className={styles.scenarioOutcome} style={{ color: "var(--negative)" }}>
                DCF: $64.58 · EV/EBITDA: $71.33 · Downside: -53.9%
              </div>
            </div>
          </div>

          <div className={styles.sectionDivider}><span>Valuation Cross-Check</span></div>

          <h2>Triangulation</h2>
          <p>
            DCF and EV/EBITDA are within a few dollars of each other across all four scenarios,
            which is reassuring. It means the model is not leaning on heroic terminal value
            assumptions to generate the implied prices. The base-case TV/EV ratio is 62.3%,
            slightly above the 60% target but acceptable for an E&amp;P with a multi-decade
            reserve life. FCF yield on EV at base is 7.0%, which is in line with large-cap E&amp;P
            peers that maintain high capital return discipline.
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>WTI 2026E</th>
                  <th>DCF Implied</th>
                  <th>EV/EBITDA (5.5x)</th>
                  <th>Upside / (Down)</th>
                  <th>Prob Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Bear</strong></td>
                  <td>$55</td><td>$64.58</td><td>$71.33</td>
                  <td className={styles.neg}>-53.9%</td><td>20%</td>
                </tr>
                <tr>
                  <td><strong>Base</strong></td>
                  <td>$90</td><td>$152.73</td><td>$150.79</td>
                  <td>+9.0%</td><td>45%</td>
                </tr>
                <tr>
                  <td><strong>Conflict-Up</strong></td>
                  <td>$95</td><td>$172.82</td><td>$165.10</td>
                  <td>+23.3%</td><td>15%</td>
                </tr>
                <tr>
                  <td><strong>Bull</strong></td>
                  <td>$100</td><td>$196.42</td><td>$177.69</td>
                  <td>+40.1%</td><td>20%</td>
                </tr>
                <tr>
                  <td><strong>Prob-Weighted</strong></td>
                  <td>—</td>
                  <td><strong>$146.85</strong></td>
                  <td>—</td>
                  <td>+4.8%</td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.pullQuote}>
            <p>
              The base case is priced in. The question is whether the Conflict-Up weight of 15%
              should be closer to 30% given current energy market conditions, and whether the
              market has already begun to ask that question.
            </p>
            <cite>Whiteprint Research, March 2026</cite>
          </div>

          <h2>Sensitivity: WTI vs WACC</h2>
          <p>
            The matrix below shows implied DCF price at different WTI assumptions and WACC levels.
            The model runs WACC at 8.95%, which sits between the 8.5% and 9.0% columns. At the
            base WTI of $90, implied prices range from $170 at 8.5% WACC to $146 at 9.5%, a $24
            range that illustrates the model&rsquo;s WACC sensitivity. The more important
            observation is the WTI sensitivity: moving from $90 to $95, the Conflict-Up oil path,
            at any WACC adds roughly $20 to $23 to the implied price.
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>WTI $/bbl</th>
                  <th>WACC 7.5%</th><th>WACC 8.0%</th><th>WACC 8.5%</th>
                  <th>WACC 9.0%</th><th>WACC 9.5%</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>$55 [Bear]</strong></td><td>$73</td><td>$66</td><td>$61</td><td>$56</td><td>$51</td></tr>
                <tr><td><strong>$70</strong></td><td>$142</td><td>$130</td><td>$119</td><td>$110</td><td>$102</td></tr>
                <tr><td><strong>$80</strong></td><td>$188</td><td>$172</td><td>$158</td><td>$146</td><td>$136</td></tr>
                <tr><td><strong>$90 ◄ Base</strong></td><td>$234</td><td>$214</td><td>$197</td><td>$183</td><td>$170</td></tr>
                <tr><td><strong>$95 [Conflict-Up]</strong></td><td>$257</td><td>$235</td><td>$217</td><td>$201</td><td>$187</td></tr>
                <tr><td><strong>$100 [Bull]</strong></td><td>$280</td><td>$256</td><td>$236</td><td>$219</td><td>$204</td></tr>
              </tbody>
            </table>
          </div>

          <p>
            Note the sensitivity matrix uses a simplified overlay against the base operating model
            FCF path, which produces higher absolute numbers than the full DCF. The
            scenario-specific DCF prices in the previous table ($152.73 base, $172.82
            Conflict-Up) are the more reliable outputs as they run through the full operating
            model. Use the matrix for directional sensitivity, not absolute price targets.
          </p>

          <h2>The Conflict Overlay Changes the Probability Weight, Not the Model</h2>

          <p>
            The four scenarios and their DCF outputs are fixed. What the Gulf conflict does is
            shift the probability weights, and that is a judgment call, not a model output. At the
            current 15% weight on Conflict-Up, the scenario contributes $26 to the
            probability-weighted price of $146.85. Raising that weight to 30% and reducing Base
            from 45% to 30% moves the probability-weighted price to roughly $155, approximately
            $8 higher and meaningfully above the current market price.
          </p>

          <p>
            Whether that reweighting is warranted depends on how the supply picture develops.
            Brent at $119 intraday with Iran threatening Saudi and UAE infrastructure represents
            an elevated conflict tail, but the same session saw a partial reversal following
            reports of diplomatic movement. The energy market&rsquo;s behavior, sharp spikes
            followed by partial reversals without a clean directional trend, is consistent with
            elevated uncertainty being priced rather than confirmed structural supply impairment.
            That supports keeping a high Conflict-Up weight without treating it as the modal
            scenario until supply disruption is demonstrated on a sustained basis.
          </p>

          <h2>The Company: What Has Not Changed</h2>

          <h3>2025 Actuals and 2026 Plan</h3>
          <p>
            EOG reported $10 billion of net cash from operating activities for full-year 2025,
            approximately $4.7 billion of free cash flow, and returned 100% of that free cash flow
            to shareholders through dividends and buybacks. The 2026 plan calls for $6.5 billion
            of total capital at midpoint, completing 585 net wells, with oil volume growth of
            approximately 5% and total production growth of approximately 13% including the
            full-year contribution from Encino. The regular quarterly dividend is $1.02 per share
            ($4.08 annualized), and $3.3 billion remains on the buyback authorization.
          </p>

          <h3>Why the $50 Breakeven Matters Right Now</h3>
          <p>
            In a week where oil has swung from $90 to $119 and back toward $107, EOG&rsquo;s
            downside protection argument does not depend on oil staying elevated. The company
            discloses a $50 WTI breakeven that covers the capital program and the regular
            dividend. In the bear case at $55 oil, the DCF implies $64.58, a 54% drawdown from
            current price that is severe, but the company is not impaired at the balance sheet
            level. The asymmetry is that significant downside sits in the stock, not in the
            enterprise, and it is a function of multiple compression that would accompany a demand
            shock rather than operational distress.
          </p>

          <h3>Gas is Now a Bigger Part of the Story</h3>
          <p>
            Post-Encino, EOG&rsquo;s total 2026E production is 1,397 MBoed with gas at
            approximately 3,085 Mbcfd. Gas revenue in the base case is $2.28 billion for 2026E,
            not dominant relative to oil&rsquo;s $17.5 billion, but material enough that the
            Henry Hub path matters at the margin. In the Conflict-Up scenario, gas is assumed at
            $3.00/Mcf versus $2.60 in the base, on the rationale that LNG re-routing and energy
            security demand add a mild premium. That $0.40/Mcf uplift is worth approximately $332
            million pretax on an annualized basis at current volumes, using EOG&rsquo;s disclosed
            $83M per $0.10/Mcf sensitivity. It is a supporting contributor to the Conflict-Up FCF
            uplift, not the primary driver.
          </p>

          <h2>Risks</h2>

          <ul>
            <li>
              <strong>Oil reverts to strip.</strong> If the Gulf situation de-escalates and WTI
              falls back toward $68 to $70, the base case compresses materially. The sensitivity
              matrix shows $130 to $146 at $80 WTI depending on WACC, which is around current
              market price with limited upside at those levels.
            </li>
            <li>
              <strong>Asymmetric bear downside.</strong> The bear case at $64.58 is a 54%
              drawdown. At $55 WTI sustained, the multiple would compress aggressively even though
              the company&rsquo;s balance sheet and dividend are structurally protected. The
              downside is in the stock, not in the business.
            </li>
            <li>
              <strong>Scenario weight misjudgment.</strong> The probability-weighted price is only
              above market if the weights are calibrated correctly. At 45% base and 20% bear, the
              weighted price is $146.85. Shifting the bear weight to 30% drops the weighted price
              below the current market price.
            </li>
            <li>
              <strong>Capital returns are discretionary.</strong> The 100% FCF return policy
              depends on cash availability. In the bear case, buybacks stop. The regular dividend
              is more durable given the $50 breakeven, but it is not contractually guaranteed.
            </li>
            <li>
              <strong>Execution risk on 585 wells.</strong> The 2026 capital plan is not small. A
              miss on volume or well cost, even in a supportive oil environment, would compress the
              multiple. Management&rsquo;s track record is strong, but it is not guaranteed.
            </li>
          </ul>

          <h2>Conclusion</h2>

          <p>
            EOG is a high-quality E&amp;P operator that has delivered on its stated plan. The
            valuation reflects that. At $140, the base case DCF of $152.73 offers 9% upside,
            which is enough to maintain a position but not enough to add aggressively unless the
            oil path improves. The probability-weighted price of $146.85 is only modestly above
            the current quote, which means the market is not obviously mispricing this on a
            balanced probability view.
          </p>

          <p>
            The scenario that changes that conclusion is Conflict-Up. At $172.82 with a WTI path
            of $95 fading to $85, and 23% upside, there is a reasonable analytical case for a
            higher weight on this scenario given the current Gulf situation. Raising the
            Conflict-Up weight from 15% to 30% moves the probability-weighted price toward $155,
            which begins to look more compelling against current levels.
          </p>

          <p>
            This is not an undiscovered value situation. The stock needs the oil macro to
            cooperate, and it is trading as if it will. What EOG provides is a best-in-class
            operator through which to express that oil view, with $50 WTI downside protection and
            a management team that has demonstrated consistent capital discipline.
          </p>

          <div className={styles.references}>
            <h2>Sources</h2>
            <div className={styles.refList}>
              <div className={styles.refItem}>
                <span className={styles.refNum}>[1]</span>
                <span>
                  EOG Resources. (2026, Feb 24).{" "}
                  <em>Full-Year 2025 Earnings Release, Supplemental Data and 2026 Capital Plan.</em>{" "}
                  EOG Investor Relations.
                </span>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refNum}>[2]</span>
                <span>
                  EOG Resources. (2026).{" "}
                  <em>
                    Commodity Price Sensitivity Disclosure — 2026 Plan ($223M/bbl oil, $83M per
                    $0.10/Mcf gas).
                  </em>{" "}
                  EOG 2025 Annual Report / Supplemental Materials.
                </span>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refNum}>[3]</span>
                <span>
                  EIA. (2026, Mar).{" "}
                  <em>Short-Term Energy Outlook (STEO) — March 2026.</em>{" "}
                  U.S. Energy Information Administration.
                </span>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refNum}>[4]</span>
                <span>
                  CNBC. (2026, Mar 17–18).{" "}
                  <em>
                    Oil tops $107 after Iran threatens oil facilities in Saudi, UAE, Qatar; Brent
                    briefly touches $119.
                  </em>{" "}
                  CNBC.com.
                </span>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refNum}>[5]</span>
                <span>
                  Whiteprint Research. (2026, Mar).{" "}
                  <em>
                    EOG Resources DCF Model — Revised with corrected gas/NGL volumes and
                    four-scenario engine.
                  </em>{" "}
                  Internal Valuation Model.
                </span>
              </div>
            </div>
          </div>

        </article>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className={styles.sidebar}>

          <div className={styles.priceTargetCard}>
            <div className={styles.priceTargetHead}>Prob-Weighted Target</div>
            <div className={styles.priceTargetBody}>
              <div className={styles.priceTargetLabel}>4-Scenario Blend</div>
              <div className={styles.priceTargetValue}>$146.85</div>
              <div className={styles.priceTargetUpside}>+4.8% vs. ~$140 market</div>
              <div className={styles.priceTargetRow}>
                <span className={styles.priceTargetRowLabel}>Base DCF (45%)</span>
                <span className={styles.priceTargetRowVal}>$152.73</span>
              </div>
              <div className={styles.priceTargetRow}>
                <span className={styles.priceTargetRowLabel}>Conflict-Up DCF (15%)</span>
                <span className={styles.priceTargetRowVal}>$172.82</span>
              </div>
              <div className={styles.priceTargetRow}>
                <span className={styles.priceTargetRowLabel}>Bull DCF (20%)</span>
                <span className={styles.priceTargetRowVal}>$196.42</span>
              </div>
              <div className={styles.priceTargetRow}>
                <span className={styles.priceTargetRowLabel}>Bear DCF (20%)</span>
                <span className={styles.priceTargetRowVal}>$64.58</span>
              </div>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHead}>Model Parameters</div>
            <div className={styles.sidebarBody}>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>WACC</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>8.95%</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Terminal Growth</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>2.0%</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>TV / EV (base)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>62.3%</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>FCF Yield on EV</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>7.0%</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>EV (base, $B)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>$87.0B</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Net Debt</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>$4.54B</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Shares Out.</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>540M</span>
              </div>
            </div>
            <div className={styles.sidebarNote}>
              Effective tax rate 24%. 7-year explicit FCF period. Mid-year discounting. Beta 0.90,
              ERP 5.5%, Rf 4.5%.
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHead}>2026E Operating Summary</div>
            <div className={styles.sidebarBody}>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Total Prod. (MBoed)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>1,397</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Total Revenue ($B)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>$22.2B</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>EBITDA (base, $B)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>$15.6B</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>EBITDA Margin</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>70.5%</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Total Capex ($B)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>$6.5B</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>FCF (base, $B)</span>
                <span className={`${styles.kvValue} ${styles.pos}`}>$6.1B</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>WTI Breakeven</span>
                <span className={`${styles.kvValue} ${styles.pos}`}>$50/bbl</span>
              </div>
            </div>
            <div className={styles.sidebarNote}>
              Source: EOG Feb 24 2026 earnings release and 2026 guidance. Gas at 3,085 Mbcfd
              post-Encino. FCF net of SBC.
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHead}>Sensitivity: $1 WTI = ?</div>
            <div className={styles.sidebarBody}>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>OCF Impact (pretax)</span>
                <span className={`${styles.kvValue} ${styles.warn}`}>$223M</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>After-Tax (~24%)</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>~$170M</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Gas: $0.10/Mcf</span>
                <span className={`${styles.kvValue} ${styles.neutral}`}>$83M pretax</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>C-Up vs Base oil</span>
                <span className={`${styles.kvValue} ${styles.warn}`}>+$5/bbl</span>
              </div>
            </div>
            <div className={styles.sidebarNote}>
              EOG 2025 Annual Report supplemental. Includes derivative impacts. The $5/bbl
              Conflict-Up premium adds ~$1.1B pretax OCF in 2026E versus base.
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHead}>Key Risks</div>
            <div className={styles.sidebarBody} style={{ padding: "12px 14px" }}>
              <div className={styles.riskItem}>
                <div className={styles.riskIcon}></div>
                <div>Oil reverts to strip: base case upside disappears at $70 WTI</div>
              </div>
              <div className={styles.riskItem}>
                <div className={styles.riskIcon}></div>
                <div>Bear case is -54%: stock, not balance sheet, bears the risk</div>
              </div>
              <div className={styles.riskItem}>
                <div className={styles.riskIcon}></div>
                <div>Conflict-Up weight may be understated given current Gulf conditions</div>
              </div>
              <div className={styles.riskItem}>
                <div className={styles.riskIcon}></div>
                <div>Capital return policy is discretionary: buybacks cut in bear</div>
              </div>
              <div className={styles.riskItem}>
                <div className={styles.riskIcon}></div>
                <div>585-well execution: volume miss compresses multiple</div>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}
