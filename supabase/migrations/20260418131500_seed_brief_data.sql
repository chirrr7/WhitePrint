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
      "signal": "Moderate",
      "title": "EM Demand Surge",
      "claim": "Non-OECD demand continues to outpace forecasts by 1.2M b/d.",
      "src": "OPEC Monthly",
      "value": "+1.2M b/d",
      "note": "Puts immense pressure on dwindling spare capacity."
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
    }
  ]
}'::jsonb
WHERE slug = 'the-eight-body-problem';
