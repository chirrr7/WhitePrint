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

Reusable MDX components are available automatically inside every post. You do not need to import them.

```mdx
---
title: "Example Post"
date: "2026-03-21"
category: "macro"
tags: ["macro", "rates"]
excerpt: "One-sentence summary for cards and metadata."
readTime: 6
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
