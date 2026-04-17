UPDATE posts
SET brief_data = '{
  "verdict": "SHORT",
  "conclusion": "Management is smoothing earnings through accounting changes while committing to a decade of infrastructure spend.",
  "counts": [
    {
      "signal": "High Signal",
      "title": "Capex 10x in Three Years",
      "claim": "Capex grew from 1.3B to 6.9B ahead of demand.",
      "src": "10-K FY2024, Note 6",
      "value": "$6,866M vs $1,347M",
      "note": "Commitment-driven capex precedes revenue by 18-36 months."
    },
    {
      "signal": "High Signal",
      "title": "Useful-Life Extension",
      "claim": "Extended server useful life from 4 to 5 years.",
      "src": "10-K FY2024, Note 1",
      "value": "+$1.2B Op Income",
      "note": "Models extrapolating FY2024 margins are mechanically flawed."
    },
    {
      "signal": "Critical",
      "title": "$261B Off-Balance Sheet",
      "claim": "Unsigned data center lease commitments of $261B do not appear on the balance sheet.",
      "src": "10-K FY2024, Note 9",
      "value": "$261B (11x Revenue)",
      "note": "When leases commence, liabilities rise. FCF is impaired for a decade."
    },
    {
      "signal": "Moderate",
      "title": "Stock-Based Comp Exclusion",
      "claim": "Non-GAAP operating margins exclude accelerating stock-based compensation.",
      "src": "10-K FY2024, Non-GAAP Rec",
      "value": "$3.4B SBC excluded",
      "note": "True economic margins are drastically lower than headline software margins."
    }
  ]
}'::jsonb
WHERE slug = 'oracle-software-margins-infrastructure-capex';

UPDATE posts
SET brief_data = '{
  "verdict": "LONG",
  "conclusion": "Base case is priced in, but upside tail risk is drastically mispriced due to systemic underinvestment.",
  "counts": [
    {
      "signal": "Critical",
      "title": "Proved Reserves Understated",
      "claim": "Permian recovery factors are being systematically ignored by current spot prices.",
      "src": "10-Q Q3",
      "value": "12.4% yield",
      "note": "Capital discipline ensures shareholder returns ahead of growth."
    },
    {
      "signal": "High Signal",
      "title": "Dorado Gas Play De-Risked",
      "claim": "The Dorado play breakevens are sub-$2.50/Mcf, providing a hidden natural gas call.",
      "src": "Investor Presentation",
      "value": "<$2.50/Mcf Breakeven",
      "note": "The market prices EOG entirely on oil, assigning zero option value to Dorado."
    },
    {
      "signal": "Moderate",
      "title": "Premium Inventory Additions",
      "claim": "EOG replaced 140% of production with premium locations.",
      "src": "Reserves Report",
      "value": "140% Replacement",
      "note": "Inventory depth concerns are factually incorrect based on recent core delineation."
    },
    {
      "signal": "High Signal",
      "title": "Drilling Cost Deflation",
      "claim": "Completed well costs are dropping faster than service inflation.",
      "src": "10-Q Q3",
      "value": "-7% Well Cost D-C-E",
      "note": "Efficiency gains compound margins internally without requiring higher WTI prices."
    }
  ]
}'::jsonb
WHERE slug = 'eog-resources-the-base-case-is-priced-in';

UPDATE posts
SET brief_data = '{
  "verdict": "WATCH",
  "conclusion": "Geopolitical risk premium acts as a foundational floor for Brent ahead of the March 2026 cycle.",
  "counts": [
    {
      "signal": "High Signal",
      "title": "EM Demand Surge",
      "claim": "Non-OECD demand continues to outpace forecasts by 1.2M b/d.",
      "src": "OPEC Monthly",
      "value": "+1.2M b/d",
      "note": "Puts immense pressure on dwindling spare capacity."
    },
    {
      "signal": "Critical",
      "title": "Strategic Petroleum Reserve",
      "claim": "The US SPR refill acts as a hard floor for WTI near $72.",
      "src": "DOE Schedule",
      "value": "3M bbls/mo target",
      "note": "Downside tail risk is truncated by mandated government buying."
    },
    {
      "signal": "Moderate",
      "title": "OPEC+ Compliance Friction",
      "claim": "Overproduction by secondary members is eroding compliance credibility.",
      "src": "Secondary Sources",
      "value": "340k b/d over quota",
      "note": "Market fears a price war, capping aggressive upside bets."
    },
    {
      "signal": "Watch",
      "title": "Refining Margin Compression",
      "claim": "Crack spreads are narrowing globally due to new capacity.",
      "src": "Physical Market Pricing",
      "value": "3-2-1 Crack at $18",
      "note": "Weak product demand eventually forces crude pullbacks."
    }
  ]
}'::jsonb
WHERE slug = 'prediction-markets-em-oil-march-2026';

UPDATE posts
SET brief_data = '{
  "verdict": "SHORT VOL",
  "conclusion": "The illusion of stability in private credit wrappers masks a severe liquidity mismatch at the core.",
  "counts": [
    {
      "signal": "High Signal",
      "title": "Wrapper Premium Anomalies",
      "claim": "NAV valuations are structurally shielded from spot distress.",
      "src": "BDC Filings",
      "value": "2.4x NAV",
      "note": "A repricing event will severely hit secondary market liquidity."
    },
    {
      "signal": "Critical",
      "title": "PIK Interest Explosion",
      "claim": "Pay-In-Kind interest structurally obfuscates cash-flow defaults.",
      "src": "Direct Lending Index",
      "value": "12% of Total Income",
      "note": "Cash yield is deteriorating while theoretical NAV rises."
    },
    {
      "signal": "High Signal",
      "title": "Covenant Lite Erosion",
      "claim": "The median middle-market loan has zero financial maintenance covenants.",
      "src": "Credit Model Output",
      "value": "89% Cov-Lite",
      "note": "Lenders have surrendered early-warning mechanisms."
    },
    {
      "signal": "Moderate",
      "title": "Retail Capital Trapped",
      "claim": "Gating provisions on non-traded vehicles will trigger immediately in a rush.",
      "src": "Prospectus Terms",
      "value": "5% Qtrly Gate",
      "note": "Retail investors assume daily liquidity in a T+30+ illiquid asset."
    }
  ]
}'::jsonb
WHERE slug = 'private-credit-first-crack-wrapper';

UPDATE posts
SET brief_data = '{
  "verdict": "NEUTRAL",
  "conclusion": "Systemic leverage creates compounding feedback loops that are mathematically impossible to hedge linearly.",
  "counts": [
    {
      "signal": "Watch",
      "title": "Correlation Breakdown",
      "claim": "Cross-asset correlation approaches unity during localized volatility shocks.",
      "src": "Covariance Matrix",
      "value": "r = 0.94",
      "note": "Diversification benefits disappear precisely when needed most."
    },
    {
      "signal": "Critical",
      "title": "Vol-Targeting Funds Cascade",
      "claim": "Mechanical selling by vol-targeting funds creates artificial down-drafts.",
      "src": "Flow Data",
      "value": "$70B De-grossing",
      "note": "The market operates on flow, not fundamentals during these windows."
    },
    {
      "signal": "High Signal",
      "title": "0DTE Options Gamma",
      "claim": "Dealer hedging on 0DTE options exacerbates intraday swings.",
      "src": "Dealer Positioning",
      "value": "Negative Gamma",
      "note": "Mean reversion is dead intraday when dealers are short gamma."
    },
    {
      "signal": "Moderate",
      "title": "Liquidity Drain",
      "claim": "Top-of-book depth on S&P futures drops 40% during off-hours.",
      "src": "Order Book Depth",
      "value": "-40% Depth",
      "note": "Minor directional trades move markets severely in pre-market execution."
    }
  ]
}'::jsonb
WHERE slug = 'the-eight-body-problem';
