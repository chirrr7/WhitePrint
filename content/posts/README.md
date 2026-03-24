# Publishing Posts

Create new posts in `content/posts` as a single `.mdx` file.

Frontmatter fields:

- `title`: post title
- `date`: publish date in `YYYY-MM-DD`
- `category`: `macro`, `equity`, or `market-notes`
- `tags`: array of lowercase tags
- `excerpt`: short summary used on cards and SEO
- `readTime`: optional integer minutes
- `slug`: optional override; otherwise the filename becomes the slug
- `ticker`: optional stance ticker / shorthand used by `/stances` and the ticker
- `name`: optional display name for the stance item
- `stance`: optional `cautious`, `neutral`, or `constructive`
- `conviction`: optional `high`, `medium`, or `low`
- `stanceThesis`: optional thesis text for `/stances`
- `status`: optional `active`, `monitoring`, or `expired`
- `bear` / `base` / `bull`: optional numeric scenario levels
- `marketNoteTable`: optional summary table for market notes (stance, confidence, horizon, quick answer, what changes our mind)
- `sidebarCards`: optional array of right-rail cards for the generic article sidebar

Reusable MDX components are available automatically inside every post. You do not need to import them.

```mdx
---
title: "Example Post"
date: "2026-03-21"
category: "market-notes"
tags: ["macro", "rates"]
excerpt: "One-sentence summary for cards and metadata."
readTime: 6
ticker: "ORCL"
name: "Oracle"
stance: "cautious"
conviction: "high"
stanceThesis: "Condensed analytical view shown on /stances."
status: "active"
bear: 105
base: 140
bull: 175
marketNoteTable:
  stance: "Constructive but selective"
  confidence: "Medium"
  horizon: "3-6 months"
  quickAnswer: "Stay involved, but only where new underwriting reflects the current regime."
  whatChangesOurMind: "Spreads tighten back toward old-cycle levels before defaults or marks fully clear."
sidebarCards:
  - title: "Key Indicators"
    rows:
      - label: "Current Price"
        value: "~$140"
      - label: "Base Case"
        value: "$152.73"
        tone: "positive"
    note: "Optional note shown under the card."
---

## Example Components

<StatGrid>
  <StatCard label="Current Price" value="~$140" detail="Illustrative only" />
  <StatCard
    label="Base Case"
    value="$152.73"
    detail="+9.0% upside"
    tone="positive"
  />
</StatGrid>

<DisclaimerBox title="Research note" tone="warning">
  Use this for caveats, methodology notes, or lightweight disclaimers.
</DisclaimerBox>

<PullQuote
  quote="A concise takeaway that deserves visual emphasis."
  attribution="Whiteprint Research"
/>

<ScenarioGrid>
  <ScenarioCard
    name="Base case"
    probability="50%"
    title="Orderly slowdown"
    summary="Short scenario summary."
    outcome="Target $152 | Upside +9.0%"
    tone="base"
  />
</ScenarioGrid>

<ResearchTable caption="Optional caption or source note.">
  <table>
    <thead>
      <tr>
        <th>Metric</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Revenue</td>
        <td>$22.2B</td>
      </tr>
    </tbody>
  </table>
</ResearchTable>
```

`sidebarCards` powers the standardized right-hand cards used by generic article pages. Use it for compact key indicators, scenario weights, dates, or model inputs you want pinned in the sidebar.

`marketNoteTable` powers the standardized summary table rendered automatically at the top of all generic posts. The heading adapts by category, but the box structure stays consistent site-wide.
