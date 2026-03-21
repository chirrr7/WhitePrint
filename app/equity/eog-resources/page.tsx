"use client"

import { useEffect } from "react"
import type { Metadata } from "next"

const styles = `
.eog-wp {
  --bg: #faf9f7; --surface: #ffffff; --ink: #0f0f0f; --ink-2: #1c1c1c;
  --muted: #5a5a5a; --subtle: #909090; --border: #e2e0db; --border-light: #eeece8;
  --accent: #c0392b; --accent-2: #d4500a; --gold: #9a7b2f;
  --positive: #1a6b3a; --negative: #b82020; --tag-bg: #f0ede8;
  --mono: 'JetBrains Mono', monospace; --serif: 'Source Serif 4', Georgia, serif;
  --display: 'Playfair Display', Georgia, serif; --max-content: 720px;
  background: var(--bg); color: var(--ink); font-family: var(--serif); font-size: 17px; line-height: 1.7; -webkit-font-smoothing: antialiased;
}
.eog-wp a { color: inherit; text-decoration: none; }
#eog-progress { position: fixed; top: 52px; left: 0; height: 2px; background: var(--accent); width: 0%; z-index: 99; transition: width 0.1s linear; }
.eog-wp .hero { background: var(--surface); border-bottom: 1px solid var(--border); padding: 64px 32px 56px; }
.eog-wp .hero-inner { max-width: 860px; margin: 0 auto; animation: eogFadeUp 0.6s ease both; }
.eog-wp .hero-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.eog-wp .category-pill { font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; background: var(--ink); color: #fff; padding: 4px 10px; }
.eog-wp .hero-date { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; color: var(--muted); }
.eog-wp .hero-rule { width: 32px; height: 2px; background: var(--accent); margin-left: auto; }
.eog-wp h1 { font-family: var(--display); font-size: clamp(30px, 5vw, 52px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--ink); margin-bottom: 20px; max-width: 760px; }
.eog-wp h1 em { font-style: italic; color: var(--accent); }
.eog-wp .hero-deck { font-family: var(--serif); font-size: 18.5px; font-weight: 300; font-style: italic; color: var(--muted); line-height: 1.65; max-width: 640px; margin-bottom: 32px; border-left: 3px solid var(--border); padding-left: 18px; }
.eog-wp .tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 32px; }
.eog-wp .tag { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; background: var(--tag-bg); color: var(--muted); padding: 4px 10px; border: 1px solid var(--border); }
.eog-wp .byline { display: flex; align-items: center; gap: 16px; padding-top: 24px; border-top: 1px solid var(--border); }
.eog-wp .byline-text { font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; }
.eog-wp .byline-name { color: var(--ink); font-weight: 500; text-transform: uppercase; }
.eog-wp .byline-sub { color: var(--subtle); margin-top: 2px; }
.eog-wp .byline-stats { margin-left: auto; display: flex; gap: 20px; }
.eog-wp .byline-stat { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; color: var(--subtle); text-align: right; }
.eog-wp .byline-stat strong { display: block; font-size: 15px; font-weight: 500; color: var(--ink); letter-spacing: -0.01em; font-family: var(--display); }
.eog-wp .layout { max-width: 1100px; margin: 0 auto; padding: 56px 32px 96px; display: grid; grid-template-columns: 1fr 280px; gap: 72px; align-items: start; animation: eogFadeUp 0.6s 0.15s ease both; }
.eog-wp .article h2 { font-family: var(--display); font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); margin: 52px 0 16px; padding-bottom: 12px; border-bottom: 2px solid var(--ink); }
.eog-wp .article h3 { font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin: 36px 0 12px; }
.eog-wp .article p { font-family: var(--serif); font-size: 16.5px; line-height: 1.82; color: var(--ink-2); margin-bottom: 22px; max-width: var(--max-content); }
.eog-wp .article p:first-of-type::first-letter { font-family: var(--display); font-size: 68px; font-weight: 900; float: left; line-height: 0.78; margin: 6px 10px 0 -3px; color: var(--accent); }
.eog-wp .article ul { margin: 0 0 22px 0; padding-left: 0; list-style: none; max-width: var(--max-content); }
.eog-wp .article ul li { font-family: var(--serif); font-size: 16px; line-height: 1.75; color: var(--ink-2); padding: 8px 0 8px 20px; border-bottom: 1px solid var(--border-light); position: relative; }
.eog-wp .article ul li::before { content: '·'; position: absolute; left: 0; color: var(--accent); font-weight: 700; font-size: 20px; line-height: 1.4; }
.eog-wp .article li:last-child { border-bottom: none; }
.eog-wp .article li strong { font-weight: 600; color: var(--ink); }
.eog-wp .pull-quote { margin: 44px 0; padding: 28px 32px 28px 28px; background: var(--ink); color: #fff; position: relative; max-width: var(--max-content); }
.eog-wp .pull-quote::before { content: '\\201C'; font-family: var(--display); font-size: 96px; line-height: 0.65; position: absolute; top: 16px; left: 20px; color: var(--accent); opacity: 0.5; }
.eog-wp .pull-quote p { font-family: var(--display) !important; font-size: 19px !important; font-style: italic !important; line-height: 1.5 !important; color: #fff !important; margin: 0 0 10px !important; padding-left: 36px; max-width: 100% !important; }
.eog-wp .pull-quote p::first-letter { float: none !important; font-size: inherit !important; margin: 0 !important; color: inherit !important; }
.eog-wp .pull-quote cite { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #c8a04a; padding-left: 36px; }
.eog-wp .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); margin: 36px 0; max-width: var(--max-content); }
.eog-wp .metric { background: var(--surface); padding: 18px 16px; }
.eog-wp .metric-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--subtle); margin-bottom: 6px; }
.eog-wp .metric-value { font-family: var(--display); font-size: 24px; font-weight: 700; line-height: 1; color: var(--ink); }
.eog-wp .metric-value.neg { color: var(--negative); }
.eog-wp .metric-value.warn { color: var(--accent-2); }
.eog-wp .metric-value.pos { color: var(--positive); }
.eog-wp .metric-value.neutral { color: var(--ink); }
.eog-wp .metric-sub { font-family: var(--mono); font-size: 10px; color: var(--subtle); margin-top: 4px; }
.eog-wp .table-wrap { overflow-x: auto; margin: 20px 0 32px; max-width: var(--max-content); border: 1px solid var(--border); }
.eog-wp table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.eog-wp thead tr { background: var(--ink); }
.eog-wp thead th { font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #ddd; padding: 10px 14px; text-align: left; white-space: nowrap; }
.eog-wp tbody td { padding: 10px 14px; border-bottom: 1px solid var(--border-light); color: var(--ink-2); line-height: 1.55; vertical-align: top; }
.eog-wp tbody tr:last-child td { border-bottom: none; }
.eog-wp tbody tr:nth-child(even) td { background: #faf9f7; }
.eog-wp tbody tr:hover td { background: #f5f2ec; }
.eog-wp td strong { font-weight: 600; color: var(--ink); }
.eog-wp .badge { display: inline-block; font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 7px; font-weight: 500; }
.eog-wp .badge-pos { background: #e8f4ec; color: #1a6b3a; }
.eog-wp .badge-neg { background: #fbeaea; color: #b82020; }
.eog-wp .badge-n  { background: #f0ede8; color: #5a5a5a; }
.eog-wp .badge-warn { background: #fdf3e7; color: #d4500a; }
.eog-wp .scenario-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0 32px; max-width: var(--max-content); }
.eog-wp .scenario-card { border: 1px solid var(--border); padding: 18px; background: var(--surface); }
.eog-wp .scenario-card.bear { border-left: 3px solid var(--negative); }
.eog-wp .scenario-card.base { border-left: 3px solid var(--gold); }
.eog-wp .scenario-card.bull { border-left: 3px solid var(--positive); }
.eog-wp .scenario-card.conflict { border-left: 3px solid var(--accent-2); }
.eog-wp .scenario-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.eog-wp .scenario-name { font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.eog-wp .scenario-prob { font-family: var(--display); font-size: 15px; font-weight: 700; color: var(--ink); font-style: italic; }
.eog-wp .scenario-title { font-family: var(--display); font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.eog-wp .scenario-body { font-family: var(--serif); font-size: 13px; line-height: 1.65; color: var(--muted); }
.eog-wp .scenario-outcome { margin-top: 10px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 0.04em; padding-top: 8px; border-top: 1px solid var(--border-light); }
.eog-wp .section-divider { display: flex; align-items: center; gap: 12px; margin: 48px 0; max-width: var(--max-content); }
.eog-wp .section-divider::before, .eog-wp .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.eog-wp .section-divider span { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--subtle); }
.eog-wp .callout { border: 1px solid var(--border); border-left: 3px solid var(--accent); padding: 18px 20px; margin: 32px 0; background: var(--surface); max-width: var(--max-content); }
.eog-wp .callout-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
.eog-wp .callout p { font-size: 14.5px !important; line-height: 1.65 !important; color: var(--muted) !important; margin-bottom: 0 !important; max-width: 100% !important; }
.eog-wp .callout p::first-letter { float: none !important; font-size: inherit !important; margin: 0 !important; color: inherit !important; }
.eog-wp .disclaimer { border: 1px solid var(--border-light); border-left: 3px solid var(--subtle); padding: 14px 18px; margin: 32px 0; background: #faf9f7; max-width: var(--max-content); }
.eog-wp .disclaimer p { font-family: var(--mono) !important; font-size: 11px !important; line-height: 1.6 !important; color: var(--subtle) !important; margin: 0 !important; letter-spacing: 0.03em; }
.eog-wp .disclaimer p::first-letter { float: none !important; font-size: inherit !important; margin: 0 !important; color: inherit !important; }
.eog-wp .references { max-width: var(--max-content); margin-top: 48px; padding-top: 24px; border-top: 2px solid var(--ink); }
.eog-wp .references h2 { margin-top: 0 !important; }
.eog-wp .ref-list { margin-top: 16px; }
.eog-wp .ref-item { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--border-light); font-family: var(--serif); font-size: 13px; line-height: 1.5; color: var(--muted); }
.eog-wp .ref-item:last-child { border-bottom: none; }
.eog-wp .ref-num { font-family: var(--mono); font-size: 10px; font-weight: 500; color: var(--accent); flex-shrink: 0; padding-top: 1px; }
.eog-wp .sidebar { position: sticky; top: 72px; }
.eog-wp .sidebar-card { border: 1px solid var(--border); background: var(--surface); margin-bottom: 20px; overflow: hidden; }
.eog-wp .sidebar-head { background: var(--ink); color: #fff; font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; padding: 9px 14px; }
.eog-wp .sidebar-body { padding: 14px; }
.eog-wp .kv-row { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 0; border-bottom: 1px dotted var(--border); }
.eog-wp .kv-row:last-child { border-bottom: none; }
.eog-wp .kv-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; color: var(--muted); }
.eog-wp .kv-value { font-family: var(--display); font-size: 16px; font-weight: 700; }
.eog-wp .kv-value.neg { color: var(--negative); }
.eog-wp .kv-value.warn { color: var(--accent-2); }
.eog-wp .kv-value.pos { color: var(--positive); }
.eog-wp .kv-value.neutral { color: var(--ink); }
.eog-wp .sidebar-note { font-family: var(--serif); font-size: 12.5px; line-height: 1.6; color: var(--muted); padding: 12px 14px; border-top: 1px solid var(--border-light); font-style: italic; }
.eog-wp .price-target-card { border: 1px solid var(--border); background: var(--ink); margin-bottom: 20px; overflow: hidden; }
.eog-wp .price-target-head { font-family: var(--mono); font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.35); padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.eog-wp .price-target-body { padding: 18px 14px; }
.eog-wp .price-target-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.eog-wp .price-target-value { font-family: var(--display); font-size: 38px; font-weight: 900; color: #fff; line-height: 1; letter-spacing: -0.03em; margin-bottom: 4px; }
.eog-wp .price-target-upside { font-family: var(--mono); font-size: 11px; font-weight: 500; color: var(--positive); letter-spacing: 0.06em; margin-bottom: 18px; }
.eog-wp .price-target-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.eog-wp .price-target-row:last-child { border-bottom: none; }
.eog-wp .price-target-row-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.08em; color: rgba(255,255,255,0.3); }
.eog-wp .price-target-row-val { font-family: var(--mono); font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.6); }
.eog-wp .risk-item { display: flex; gap: 8px; padding: 7px 0; border-bottom: 1px dotted var(--border); font-family: var(--serif); font-size: 12.5px; line-height: 1.5; color: var(--muted); }
.eog-wp .risk-item:last-child { border-bottom: none; }
.eog-wp .risk-icon { flex-shrink: 0; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); margin-top: 7px; }
.eog-wp .neg { color: var(--negative); }
@keyframes eogFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 860px) {
  .eog-wp .layout { grid-template-columns: 1fr; gap: 40px; }
  .eog-wp .sidebar { position: static; }
  .eog-wp .metrics-row { grid-template-columns: repeat(2, 1fr); }
  .eog-wp .scenario-grid { grid-template-columns: 1fr; }
  .eog-wp .byline-stats { display: none; }
}
@media (max-width: 560px) {
  .eog-wp h1 { font-size: 28px; }
}
`

export default function EOGResourcesPage() {
  useEffect(() => {
    const p = document.getElementById("eog-progress")
    if (!p) return
    const onScroll = () => {
      const d = document.documentElement
      const pct = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100
      p.style.width = Math.min(pct, 100) + "%"
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="eog-wp">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div id="eog-progress" />

      <header className="hero">
        <div className="hero-inner">
          <div className="hero-meta">
            <a href="/equity" className="category-pill">Equity Research</a>
            <span className="hero-date">March 18, 2026</span>
            <div className="hero-rule" />
          </div>
          <h1>EOG Resources:<br />The Base Case <em>Is Priced In</em></h1>
          <p className="hero-deck">At $140, the market is already paying for $90 oil and clean execution. The 9% upside to our base DCF is narrow. The more important question is whether the Gulf conflict makes the Conflict-Up scenario the more honest anchor for the next 12 months.</p>
          <div className="tags">
            <a href="/search?tag=equity" className="tag">#equity</a>
            <a href="/search?tag=e-and-p" className="tag">#e-and-p</a>
            <a href="/search?tag=oil" className="tag">#oil</a>
            <a href="/search?tag=dcf" className="tag">#dcf</a>
            <a href="/search?tag=energy" className="tag">#energy</a>
            <a href="/search?tag=eog" className="tag">#eog</a>
          </div>
          <div className="byline">
            <div className="byline-text">
              <div className="byline-name">Whiteprint Research</div>
              <div className="byline-sub">Equity Research — E&amp;P Coverage · March 2026</div>
            </div>
            <div className="byline-stats">
              <div className="byline-stat"><strong>20 min</strong>read</div>
              <div className="byline-stat"><strong>4</strong>scenarios</div>
              <div className="byline-stat"><strong>DCF</strong>model</div>
            </div>
          </div>
        </div>
      </header>

      <div className="layout">
        <article className="article">

          <h2>The Setup</h2>

          <p>EOG Resources trades at approximately $140. Our base-case DCF — WTI at $90 declining to $80 by 2030, WACC 8.95%, 2% terminal growth — implies $152.73. That is 9% upside. The probability-weighted price across all four scenarios is $146.85, which is 4.8% above the current quote. On a pure base-case framing, this stock is not cheap. The market has already done most of the work pricing a constructive oil environment.</p>

          <p>What makes the setup interesting rather than simply &#8220;fairly valued&#8221; is the macro context. On the day this note was finalized, Brent crude briefly touched $119 before partially reversing on reports that Israel is helping to reopen the Strait of Hormuz. Oil has traded above $107 following Iran&rsquo;s threats to energy facilities in Saudi Arabia, the UAE, and Qatar. That is not a base-case environment. That is the Conflict-Up scenario playing out in real time. At $172.82, the Conflict-Up DCF implies 23% upside from current levels, and the live macro backdrop raises a legitimate question about whether the current 15% probability weight on that scenario still reflects the actual distribution of outcomes.</p>

          <p>The company itself is not the issue. EOG is doing exactly what a disciplined E&amp;P should: generating $6.1 billion of free cash flow in the base case on a $6.5 billion capital program, returning 100% of free cash flow to shareholders, and maintaining a $50 WTI breakeven that covers the dividend even in a severe downturn. The operational story is clean. The valuation story is that most of it is already priced at $140, and the stock now needs either the conflict to stay elevated or execution to come in ahead of expectations to generate material upside from here.</p>

          <div className="metrics-row">
            <div className="metric"><div className="metric-label">Current Price</div><div className="metric-value neutral">~$140</div><div className="metric-sub">NYSE: EOG, Mar 18 2026</div></div>
            <div className="metric"><div className="metric-label">Base DCF</div><div className="metric-value pos">$152.73</div><div className="metric-sub">+9.0% upside · WTI $90→$80</div></div>
            <div className="metric"><div className="metric-label">Prob-Weighted</div><div className="metric-value pos">$146.85</div><div className="metric-sub">+4.8% upside · 4-scenario blend</div></div>
            <div className="metric"><div className="metric-label">Conflict-Up DCF</div><div className="metric-value warn">$172.82</div><div className="metric-sub">+23.3% upside · WTI $95→$85</div></div>
          </div>

          <div className="disclaimer">
            <p>All implied prices are outputs from an internal DCF model and are for analytical discussion only. They do not constitute investment recommendations. All valuation is materially sensitive to commodity price assumptions and model inputs.</p>
          </div>

          <h2>What the Model Is Actually Saying</h2>

          <h3>Four Scenarios, One Dominant Variable</h3>
          <p>The model runs four scenarios differentiated primarily by the WTI price path. Gas assumptions also differ, with the Conflict-Up and Bull cases including a mild uplift in Henry Hub from LNG re-routing and energy security flows. Oil dominates the output. EOG&rsquo;s own disclosed sensitivity of $223 million pretax per $1/bbl of crude is the clearest way to understand why: run $5 above base-case oil for a year and you add over $1 billion of pretax operating cash. Capitalize that across a 7-year explicit DCF period plus terminal value, and the share price impact is not trivial.</p>

          <div className="callout">
            <div className="callout-label">Model Note — OCF Sensitivity</div>
            <p>EOG&rsquo;s 2026 plan disclosure: $223M pretax OCF per $1/bbl crude (including associated NGL price change and derivative impacts), and $83M pretax per $0.10/Mcf gas. The Conflict-Up scenario runs WTI $95 in 2026 versus $90 in the base — that $5 differential alone adds roughly $1.1B of pretax operating cash in year one, before gas uplift. At a 7.0% FCF yield on EV, that translates materially into implied equity value.</p>
          </div>

          <h3>The FCF Build by Year</h3>
          <p>The table below shows the full 7-year unlevered FCF projection for each scenario, exactly as it runs through the DCF engine. Bear case FCF recovers gradually as the oil path in that scenario lifts from $55 in 2026 to $62 by 2030 — the company does not go into distress, but free cash generation is severely compressed in the near term. The three upper scenarios are more tightly clustered than their price paths might suggest, because higher oil drives both higher revenue and higher production taxes.</p>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Scenario</th><th>2026E</th><th>2027E</th><th>2028E</th><th>2029E</th><th>2030E</th><th>2031E</th><th>2032E</th></tr></thead>
              <tbody>
                <tr><td><strong>Bear</strong> <span className="badge badge-neg">$55 WTI</span></td><td>$1.57</td><td>$1.62</td><td>$2.20</td><td>$2.67</td><td>$3.06</td><td>$3.13</td><td>$3.20</td></tr>
                <tr><td><strong>Base</strong> <span className="badge badge-n">$90 WTI</span></td><td>$6.10</td><td>$6.19</td><td>$6.25</td><td>$6.30</td><td>$6.16</td><td>$6.32</td><td>$6.44</td></tr>
                <tr><td><strong>Conflict-Up</strong> <span className="badge badge-warn">$95 WTI</span></td><td>$6.97</td><td>$7.14</td><td>$7.30</td><td>$7.19</td><td>$6.88</td><td>$7.05</td><td>$7.19</td></tr>
                <tr><td><strong>Bull</strong> <span className="badge badge-pos">$100 WTI</span></td><td>$7.71</td><td>$7.92</td><td>$8.11</td><td>$8.00</td><td>$7.82</td><td>$8.02</td><td>$8.18</td></tr>
              </tbody>
            </table>
          </div>

          <p>All figures in $B. The Conflict-Up FCF path is roughly 14% above base throughout the projection period — meaningful, but not dramatic. The leverage in the DCF is not just in annual FCF but in the terminal value, which is capitalized at WACC minus g (6.95% spread at 8.95% WACC and 2% terminal growth). A scenario that sustains higher FCF into the terminal year produces a disproportionately larger implied price.</p>

          <h2>Scenario Analysis</h2>

          <div className="scenario-grid">
            <div className="scenario-card base">
              <div className="scenario-header"><span className="scenario-name">Base Case</span><span className="scenario-prob">45%</span></div>
              <div className="scenario-title">$90→$80 WTI · Controlled Easing</div>
              <div className="scenario-body">Geopolitical risk premium supports near-term pricing; $80 mid-cycle reflects Saudi fiscal breakeven and long-run marginal cost of supply. Gas near EIA STEO strip at $2.60/Mcf. 2026E EBITDA $15.6B, FCF $6.1B.</div>
              <div className="scenario-outcome" style={{ color: "var(--gold)" }}>DCF: $152.73 · EV/EBITDA: $150.79 · Upside: +9.0%</div>
            </div>
            <div className="scenario-card conflict">
              <div className="scenario-header"><span className="scenario-name">Conflict-Up</span><span className="scenario-prob">15%</span></div>
              <div className="scenario-title">$95→$85 WTI · Sustained Disruption</div>
              <div className="scenario-body">Prolonged Gulf supply disruption holds WTI elevated through 2026-27. Gas lifted to $3.00/Mcf by LNG re-routing and energy security flows. 2026E EBITDA $17.0B, FCF $7.0B.</div>
              <div className="scenario-outcome" style={{ color: "var(--accent-2)" }}>DCF: $172.82 · EV/EBITDA: $165.10 · Upside: +23.3%</div>
            </div>
            <div className="scenario-card bull">
              <div className="scenario-header"><span className="scenario-name">Bull Case</span><span className="scenario-prob">20%</span></div>
              <div className="scenario-title">$100→$90 WTI · OPEC+ Discipline</div>
              <div className="scenario-body">Deeper OPEC+ cuts combined with strong demand and an LNG export boom. Gas $3.20/Mcf. 2026E EBITDA $18.3B, FCF $7.7B. Requires sustained supply discipline beyond what markets are currently pricing as durable.</div>
              <div className="scenario-outcome" style={{ color: "var(--positive)" }}>DCF: $196.42 · EV/EBITDA: $177.69 · Upside: +40.1%</div>
            </div>
            <div className="scenario-card bear">
              <div className="scenario-header"><span className="scenario-name">Bear Case</span><span className="scenario-prob">20%</span></div>
              <div className="scenario-title">$55→$62 WTI · Macro Demand Shock</div>
              <div className="scenario-body">US recession or sharp global demand contraction breaks WTI to $55. FCF collapses to $1.6B. EOG&rsquo;s $50 breakeven covers the regular dividend, but buybacks stop. Gas $2.20/Mcf. 2026E EBITDA $7.8B.</div>
              <div className="scenario-outcome" style={{ color: "var(--negative)" }}>DCF: $64.58 · EV/EBITDA: $71.33 · Downside: -53.9%</div>
            </div>
          </div>

          <div className="section-divider"><span>Valuation Cross-Check</span></div>

          <h2>Triangulation</h2>
          <p>DCF and EV/EBITDA are within a few dollars of each other across all four scenarios, which is reassuring. It means the model is not leaning on heroic terminal value assumptions to generate the implied prices. The base-case TV/EV ratio is 62.3%, slightly above the 60% target but acceptable for an E&amp;P with a multi-decade reserve life. FCF yield on EV at base is 7.0%, which is in line with large-cap E&amp;P peers that maintain high capital return discipline.</p>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Scenario</th><th>WTI 2026E</th><th>DCF Implied</th><th>EV/EBITDA (5.5x)</th><th>Upside / (Down)</th><th>Prob Weight</th></tr></thead>
              <tbody>
                <tr><td><strong>Bear</strong></td><td>$55</td><td>$64.58</td><td>$71.33</td><td className="neg">-53.9%</td><td>20%</td></tr>
                <tr><td><strong>Base</strong></td><td>$90</td><td>$152.73</td><td>$150.79</td><td>+9.0%</td><td>45%</td></tr>
                <tr><td><strong>Conflict-Up</strong></td><td>$95</td><td>$172.82</td><td>$165.10</td><td>+23.3%</td><td>15%</td></tr>
                <tr><td><strong>Bull</strong></td><td>$100</td><td>$196.42</td><td>$177.69</td><td>+40.1%</td><td>20%</td></tr>
                <tr><td><strong>Prob-Weighted</strong></td><td>—</td><td><strong>$146.85</strong></td><td>—</td><td>+4.8%</td><td>100%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="pull-quote">
            <p>The base case is priced in. The question is whether the Conflict-Up weight of 15% should be closer to 30% given current energy market conditions, and whether the market has already begun to ask that question.</p>
            <cite>Whiteprint Research, March 2026</cite>
          </div>

          <h2>Sensitivity: WTI vs WACC</h2>
          <p>The matrix below shows implied DCF price at different WTI assumptions and WACC levels. The model runs WACC at 8.95%, which sits between the 8.5% and 9.0% columns. At the base WTI of $90, implied prices range from $170 at 8.5% WACC to $146 at 9.5%, a $24 range that illustrates the model&rsquo;s WACC sensitivity. The more important observation is the WTI sensitivity: moving from $90 to $95, the Conflict-Up oil path, at any WACC adds roughly $20 to $23 to the implied price.</p>

          <div className="table-wrap">
            <table>
              <thead><tr><th>WTI $/bbl</th><th>WACC 7.5%</th><th>WACC 8.0%</th><th>WACC 8.5%</th><th>WACC 9.0%</th><th>WACC 9.5%</th></tr></thead>
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

          <p>Note the sensitivity matrix uses a simplified overlay against the base operating model FCF path, which produces higher absolute numbers than the full DCF. The scenario-specific DCF prices in the previous table ($152.73 base, $172.82 Conflict-Up) are the more reliable outputs as they run through the full operating model. Use the matrix for directional sensitivity, not absolute price targets.</p>

          <h2>The Conflict Overlay Changes the Probability Weight, Not the Model</h2>

          <p>The four scenarios and their DCF outputs are fixed. What the Gulf conflict does is shift the probability weights, and that is a judgment call, not a model output. At the current 15% weight on Conflict-Up, the scenario contributes $26 to the probability-weighted price of $146.85. Raising that weight to 30% and reducing Base from 45% to 30% moves the probability-weighted price to roughly $155, approximately $8 higher and meaningfully above the current market price.</p>

          <p>Whether that reweighting is warranted depends on how the supply picture develops. Brent at $119 intraday with Iran threatening Saudi and UAE infrastructure represents an elevated conflict tail, but the same session saw a partial reversal following reports of diplomatic movement. The energy market&rsquo;s behavior, sharp spikes followed by partial reversals without a clean directional trend, is consistent with elevated uncertainty being priced rather than confirmed structural supply impairment. That supports keeping a high Conflict-Up weight without treating it as the modal scenario until supply disruption is demonstrated on a sustained basis.</p>

          <h2>The Company: What Has Not Changed</h2>

          <h3>2025 Actuals and 2026 Plan</h3>
          <p>EOG reported $10 billion of net cash from operating activities for full-year 2025, approximately $4.7 billion of free cash flow, and returned 100% of that free cash flow to shareholders through dividends and buybacks. The 2026 plan calls for $6.5 billion of total capital at midpoint, completing 585 net wells, with oil volume growth of approximately 5% and total production growth of approximately 13% including the full-year contribution from Encino. The regular quarterly dividend is $1.02 per share ($4.08 annualized), and $3.3 billion remains on the buyback authorization.</p>

          <h3>Why the $50 Breakeven Matters Right Now</h3>
          <p>In a week where oil has swung from $90 to $119 and back toward $107, EOG&rsquo;s downside protection argument does not depend on oil staying elevated. The company discloses a $50 WTI breakeven that covers the capital program and the regular dividend. In the bear case at $55 oil, the DCF implies $64.58, a 54% drawdown from current price that is severe, but the company is not impaired at the balance sheet level. The asymmetry is that significant downside sits in the stock, not in the enterprise, and it is a function of multiple compression that would accompany a demand shock rather than operational distress.</p>

          <h3>Gas is Now a Bigger Part of the Story</h3>
          <p>Post-Encino, EOG&rsquo;s total 2026E production is 1,397 MBoed with gas at approximately 3,085 Mbcfd. Gas revenue in the base case is $2.28 billion for 2026E, not dominant relative to oil&rsquo;s $17.5 billion, but material enough that the Henry Hub path matters at the margin. In the Conflict-Up scenario, gas is assumed at $3.00/Mcf versus $2.60 in the base, on the rationale that LNG re-routing and energy security demand add a mild premium. That $0.40/Mcf uplift is worth approximately $332 million pretax on an annualized basis at current volumes, using EOG&rsquo;s disclosed $83M per $0.10/Mcf sensitivity. It is a supporting contributor to the Conflict-Up FCF uplift, not the primary driver.</p>

          <h2>Risks</h2>

          <ul>
            <li><strong>Oil reverts to strip.</strong> If the Gulf situation de-escalates and WTI falls back toward $68 to $70, the base case compresses materially. The sensitivity matrix shows $130 to $146 at $80 WTI depending on WACC, which is around current market price with limited upside at those levels.</li>
            <li><strong>Asymmetric bear downside.</strong> The bear case at $64.58 is a 54% drawdown. At $55 WTI sustained, the multiple would compress aggressively even though the company&rsquo;s balance sheet and dividend are structurally protected. The downside is in the stock, not in the business.</li>
            <li><strong>Scenario weight misjudgment.</strong> The probability-weighted price is only above market if the weights are calibrated correctly. At 45% base and 20% bear, the weighted price is $146.85. Shifting the bear weight to 30% drops the weighted price below the current market price.</li>
            <li><strong>Capital returns are discretionary.</strong> The 100% FCF return policy depends on cash availability. In the bear case, buybacks stop. The regular dividend is more durable given the $50 breakeven, but it is not contractually guaranteed.</li>
            <li><strong>Execution risk on 585 wells.</strong> The 2026 capital plan is not small. A miss on volume or well cost, even in a supportive oil environment, would compress the multiple. Management&rsquo;s track record is strong, but it is not guaranteed.</li>
          </ul>

          <h2>Conclusion</h2>

          <p>EOG is a high-quality E&amp;P operator that has delivered on its stated plan. The valuation reflects that. At $140, the base case DCF of $152.73 offers 9% upside, which is enough to maintain a position but not enough to add aggressively unless the oil path improves. The probability-weighted price of $146.85 is only modestly above the current quote, which means the market is not obviously mispricing this on a balanced probability view.</p>

          <p>The scenario that changes that conclusion is Conflict-Up. At $172.82 with a WTI path of $95 fading to $85, and 23% upside, there is a reasonable analytical case for a higher weight on this scenario given the current Gulf situation. Raising the Conflict-Up weight from 15% to 30% moves the probability-weighted price toward $155, which begins to look more compelling against current levels.</p>

          <p>This is not an undiscovered value situation. The stock needs the oil macro to cooperate, and it is trading as if it will. What EOG provides is a best-in-class operator through which to express that oil view, with $50 WTI downside protection and a management team that has demonstrated consistent capital discipline.</p>

          <div className="references">
            <h2>Sources</h2>
            <div className="ref-list">
              <div className="ref-item"><span className="ref-num">[1]</span><span>EOG Resources. (2026, Feb 24). <em>Full-Year 2025 Earnings Release, Supplemental Data and 2026 Capital Plan.</em> EOG Investor Relations.</span></div>
              <div className="ref-item"><span className="ref-num">[2]</span><span>EOG Resources. (2026). <em>Commodity Price Sensitivity Disclosure — 2026 Plan ($223M/bbl oil, $83M per $0.10/Mcf gas).</em> EOG 2025 Annual Report / Supplemental Materials.</span></div>
              <div className="ref-item"><span className="ref-num">[3]</span><span>EIA. (2026, Mar). <em>Short-Term Energy Outlook (STEO) — March 2026.</em> U.S. Energy Information Administration.</span></div>
              <div className="ref-item"><span className="ref-num">[4]</span><span>CNBC. (2026, Mar 17–18). <em>Oil tops $107 after Iran threatens oil facilities in Saudi, UAE, Qatar; Brent briefly touches $119.</em> CNBC.com.</span></div>
              <div className="ref-item"><span className="ref-num">[5]</span><span>Whiteprint Research. (2026, Mar). <em>EOG Resources DCF Model — Revised with corrected gas/NGL volumes and four-scenario engine.</em> Internal Valuation Model.</span></div>
            </div>
          </div>

        </article>

        <aside className="sidebar">

          <div className="price-target-card">
            <div className="price-target-head">Prob-Weighted Target</div>
            <div className="price-target-body">
              <div className="price-target-label">4-Scenario Blend</div>
              <div className="price-target-value">$146.85</div>
              <div className="price-target-upside">+4.8% vs. ~$140 market</div>
              <div className="price-target-row"><span className="price-target-row-label">Base DCF (45%)</span><span className="price-target-row-val">$152.73</span></div>
              <div className="price-target-row"><span className="price-target-row-label">Conflict-Up DCF (15%)</span><span className="price-target-row-val">$172.82</span></div>
              <div className="price-target-row"><span className="price-target-row-label">Bull DCF (20%)</span><span className="price-target-row-val">$196.42</span></div>
              <div className="price-target-row"><span className="price-target-row-label">Bear DCF (20%)</span><span className="price-target-row-val">$64.58</span></div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-head">Model Parameters</div>
            <div className="sidebar-body">
              <div className="kv-row"><span className="kv-label">WACC</span><span className="kv-value neutral">8.95%</span></div>
              <div className="kv-row"><span className="kv-label">Terminal Growth</span><span className="kv-value neutral">2.0%</span></div>
              <div className="kv-row"><span className="kv-label">TV / EV (base)</span><span className="kv-value neutral">62.3%</span></div>
              <div className="kv-row"><span className="kv-label">FCF Yield on EV</span><span className="kv-value neutral">7.0%</span></div>
              <div className="kv-row"><span className="kv-label">EV (base, $B)</span><span className="kv-value neutral">$87.0B</span></div>
              <div className="kv-row"><span className="kv-label">Net Debt</span><span className="kv-value neutral">$4.54B</span></div>
              <div className="kv-row"><span className="kv-label">Shares Out.</span><span className="kv-value neutral">540M</span></div>
            </div>
            <div className="sidebar-note">Effective tax rate 24%. 7-year explicit FCF period. Mid-year discounting. Beta 0.90, ERP 5.5%, Rf 4.5%.</div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-head">2026E Operating Summary</div>
            <div className="sidebar-body">
              <div className="kv-row"><span className="kv-label">Total Prod. (MBoed)</span><span className="kv-value neutral">1,397</span></div>
              <div className="kv-row"><span className="kv-label">Total Revenue ($B)</span><span className="kv-value neutral">$22.2B</span></div>
              <div className="kv-row"><span className="kv-label">EBITDA (base, $B)</span><span className="kv-value neutral">$15.6B</span></div>
              <div className="kv-row"><span className="kv-label">EBITDA Margin</span><span className="kv-value neutral">70.5%</span></div>
              <div className="kv-row"><span className="kv-label">Total Capex ($B)</span><span className="kv-value neutral">$6.5B</span></div>
              <div className="kv-row"><span className="kv-label">FCF (base, $B)</span><span className="kv-value pos">$6.1B</span></div>
              <div className="kv-row"><span className="kv-label">WTI Breakeven</span><span className="kv-value pos">$50/bbl</span></div>
            </div>
            <div className="sidebar-note">Source: EOG Feb 24 2026 earnings release and 2026 guidance. Gas at 3,085 Mbcfd post-Encino. FCF net of SBC.</div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-head">Sensitivity: $1 WTI = ?</div>
            <div className="sidebar-body">
              <div className="kv-row"><span className="kv-label">OCF Impact (pretax)</span><span className="kv-value warn">$223M</span></div>
              <div className="kv-row"><span className="kv-label">After-Tax (~24%)</span><span className="kv-value neutral">~$170M</span></div>
              <div className="kv-row"><span className="kv-label">Gas: $0.10/Mcf</span><span className="kv-value neutral">$83M pretax</span></div>
              <div className="kv-row"><span className="kv-label">C-Up vs Base oil</span><span className="kv-value warn">+$5/bbl</span></div>
            </div>
            <div className="sidebar-note">EOG 2025 Annual Report supplemental. Includes derivative impacts. The $5/bbl Conflict-Up premium adds ~$1.1B pretax OCF in 2026E versus base.</div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-head">Key Risks</div>
            <div className="sidebar-body" style={{ padding: "12px 14px" }}>
              <div className="risk-item"><div className="risk-icon" /><div>Oil reverts to strip: base case upside disappears at $70 WTI</div></div>
              <div className="risk-item"><div className="risk-icon" /><div>Bear case is -54%: stock, not balance sheet, bears the risk</div></div>
              <div className="risk-item"><div className="risk-icon" /><div>Conflict-Up weight may be understated given current Gulf conditions</div></div>
              <div className="risk-item"><div className="risk-icon" /><div>Capital return policy is discretionary: buybacks cut in bear</div></div>
              <div className="risk-item"><div className="risk-icon" /><div>585-well execution: volume miss compresses multiple</div></div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}
