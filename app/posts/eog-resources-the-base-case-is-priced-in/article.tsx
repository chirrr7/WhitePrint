"use client"

import { useEffect } from "react"
import s from "./article.module.css"

const EOG_ARTICLE_HTML = String.raw`
<header class="hero">
  <div class="hero-inner">
    <div class="hero-meta">
      <a href="/equity" class="category-pill">Equity Research</a>
      <span class="hero-date">March 18, 2026</span>
      <div class="hero-rule"></div>
    </div>
    <h1>EOG Resources:<br>The Base Case <em>Is Priced In</em></h1>
    <p class="hero-deck">At $140, the market is already paying for $90 oil and clean execution. The 9% upside to our base DCF is narrow. The more important question is whether the Gulf conflict makes the Conflict-Up scenario the more honest anchor for the next 12 months.</p>
  </div>
</header>

<div class="layout">
  <article class="article">
    <h2>The Setup</h2>
    <p>EOG Resources trades at approximately $140. Our base-case DCF — WTI at $90 declining to $80 by 2030, WACC 8.95%, 2% terminal growth — implies $152.73. That is 9% upside. The probability-weighted price across all four scenarios is $146.85, which is 4.8% above the current quote.</p>
    <p>What makes the setup interesting rather than simply "fairly valued" is the macro context. On the day this note was finalized, Brent crude briefly touched $119 before partially reversing on reports that Israel is helping to reopen the Strait of Hormuz. Oil has traded above $107 following Iran's threats to energy facilities in Saudi Arabia, the UAE, and Qatar.</p>

    <div class="metrics-row">
      <div class="metric"><div class="metric-label">Current Price</div><div class="metric-value neutral">~$140</div><div class="metric-sub">NYSE: EOG, Mar 18 2026</div></div>
      <div class="metric"><div class="metric-label">Base DCF</div><div class="metric-value pos">$152.73</div><div class="metric-sub">+9.0% upside · WTI $90→$80</div></div>
      <div class="metric"><div class="metric-label">Prob-Weighted</div><div class="metric-value pos">$146.85</div><div class="metric-sub">+4.8% upside · 4-scenario blend</div></div>
      <div class="metric"><div class="metric-label">Conflict-Up DCF</div><div class="metric-value warn">$172.82</div><div class="metric-sub">+23.3% upside · WTI $95→$85</div></div>
    </div>

    <h2>Scenario Analysis</h2>
    <div class="scenario-grid">
      <div class="scenario-card base">
        <div class="scenario-header"><span class="scenario-name">Base Case</span><span class="scenario-prob">45%</span></div>
        <div class="scenario-title">$90→$80 WTI · Controlled Easing</div>
        <div class="scenario-body">2026E EBITDA $15.6B, FCF $6.1B.</div>
        <div class="scenario-outcome" style="color: var(--gold)">DCF: $152.73 · Upside: +9.0%</div>
      </div>
      <div class="scenario-card conflict">
        <div class="scenario-header"><span class="scenario-name">Conflict-Up</span><span class="scenario-prob">15%</span></div>
        <div class="scenario-title">$95→$85 WTI · Sustained Disruption</div>
        <div class="scenario-body">2026E EBITDA $17.0B, FCF $7.0B.</div>
        <div class="scenario-outcome" style="color: var(--accent-2)">DCF: $172.82 · Upside: +23.3%</div>
      </div>
      <div class="scenario-card bull">
        <div class="scenario-header"><span class="scenario-name">Bull Case</span><span class="scenario-prob">20%</span></div>
        <div class="scenario-title">$100→$90 WTI · OPEC+ Discipline</div>
        <div class="scenario-body">2026E EBITDA $18.3B, FCF $7.7B.</div>
        <div class="scenario-outcome" style="color: var(--positive)">DCF: $196.42 · Upside: +40.1%</div>
      </div>
      <div class="scenario-card bear">
        <div class="scenario-header"><span class="scenario-name">Bear Case</span><span class="scenario-prob">20%</span></div>
        <div class="scenario-title">$55→$62 WTI · Macro Demand Shock</div>
        <div class="scenario-body">2026E EBITDA $7.8B, FCF $1.6B.</div>
        <div class="scenario-outcome" style="color: var(--negative)">DCF: $64.58 · Downside: -53.9%</div>
      </div>
    </div>

    <h2>Conclusion</h2>
    <p>EOG is a high-quality E&amp;P operator that has delivered on its stated plan. At $140, the base case DCF of $152.73 offers 9% upside, while the probability-weighted price of $146.85 is only modestly above the current quote.</p>
    <p>This is not an undiscovered value situation. The stock needs the oil macro to cooperate, and it is trading as if it will.</p>
  </article>

  <aside class="sidebar">
    <div class="price-target-card">
      <div class="price-target-head">Prob-Weighted Target</div>
      <div class="price-target-body">
        <div class="price-target-label">4-Scenario Blend</div>
        <div class="price-target-value">$146.85</div>
        <div class="price-target-upside">+4.8% vs. ~$140 market</div>
      </div>
    </div>
  </aside>
</div>
`

export function EogResourcesArticle() {
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement
      const denominator = d.scrollHeight - d.clientHeight
      const pct = denominator > 0 ? (d.scrollTop / denominator) * 100 : 0
      const progress = document.getElementById("eog-progress")
      if (progress) progress.style.width = `${Math.min(pct, 100)}%`
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={s.wrapper}>
      <div id="eog-progress" className={s.progress} />
      <div dangerouslySetInnerHTML={{ __html: EOG_ARTICLE_HTML }} />
    </div>
  )
}
