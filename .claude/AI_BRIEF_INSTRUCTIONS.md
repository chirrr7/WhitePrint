# WhitePrint AI Brief Generation Guidelines

This document provides standardized instructions for generating `BriefData` JSON objects for WhitePrint articles via AI workflows.

**System Prompt Extension:**
When executing the prompt to generate a Brief, the LLM should parse the Markdown content of the article and extract structured components adhering to these explicit format definitions.

## Category Requirements

### 1. Equity (`equity`)
- **Focus**: Forensic review of SEC filings, proxy statements, and earnings.
- **Verdict Options**: `SHORT`, `LONG`, `NEUTRAL`, `WATCH`
- **Counts Requirement**: 4-5 counts pulling exact numbers/figures from 10-K, 10-Q, or official filings that substantiate the research thesis.
- **Proof Structure**: `src` must be the filing (e.g., "10-K FY2024, Note 6"), `value` must be the isolated figure.

### 2. Macro (`macro`)
- **Focus**: Structural views, rates, yields, and policy shifts.
- **Verdict Options**: `SHORT`, `LONG`, `NEUTRAL`, `WATCH`
- **Counts Requirement**: 3-4 counts using macroeconomic indicators (e.g., CPI, DXY, Federal Reserve dot plots) that fundamentally justify the article's position.
- **Proof Structure**: `src` must be the Fed/BLS/IMF data source, `value` must be the core numeric indicator.

### 3. Quant (`quant` / OPDS)
- **Focus**: Pure algorithmic, model-based signal, options skew, volatility.
- **Verdict Options**: `SHORT VOL`, `LONG VOL`, `LONG SKEW`, `SHORT SKEW`, `NEUTRAL`
- **Counts Requirement**: 3-4 counts strictly answering fundamental questions (What, How, Why, When/Where) extracted from the article's data models.
- **Proof Structure**: `src` must represent the computed model output or signal stream.

### 4. Market Notes (`market-notes`)
- **Focus**: Short-form, rapid-fire coverage and monitoring.
- **Verdict Options**: `NEUTRAL`, `WATCH`
- **Counts Requirement**: Exactly 1 brief count containing the primary number or metric indicating why this note was published.

## JSON Schema

The AI must only output a valid JSON object matching this TypeScript interface exactly:

```json
{
  "verdict": "SHORT",
  "conclusion": "The one-to-two sentence final summary. No fluff.",
  "counts": [
    {
      "signal": "High Signal",
      "title": "Clear 4-5 word title",
      "claim": "One sentence explaining what you believe and why.",
      "src": "Data Source (e.g. 10-K FY2024 / BLS CPI)",
      "value": "Isolated Key Figure (e.g. $6.8B vs $1.3B)",
      "note": "One sentence interpretation of what this means."
    }
  ]
}
```

*Note: Valid Signals are restricted to: `"High Signal", "Critical", "Moderate", "Watch"`*
