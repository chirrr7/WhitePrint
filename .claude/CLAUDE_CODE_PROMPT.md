# WhitePrint Research — Claude Code Build Prompt

You are building a production-ready full-stack research publication platform for **Whiteprint Research** — an independent macro, equity, quant, and market notes publication. The codebase is a Next.js 15 app with Supabase (Postgres + Auth), Tailwind CSS v4, and MDX for content. The repo is at `chirrr7/WhitePrint` on GitHub.

Read the existing codebase thoroughly before making any changes. Preserve all existing API routes, Supabase schema, auth logic, and data-fetching patterns. This is an incremental redesign — not a rewrite.

---

## CRITICAL DESIGN RULES (read before building anything)

1. **Briefs and simulators live ONLY inside individual posts** — never on landing pages
2. **Landing pages are clean article lists** with section-specific headers only
3. **Mobile uses a bottom tab bar** (Instagram-style, 5 tabs: Home / Equity / Macro / Quant / Notes)
4. No graphs, charts, or interactive tools on any landing/index page

---

Apply these consistently across every component you create or modify.

```ts
// tokens.ts (create this file at lib/tokens.ts)
export const tokens = {
  bg:       '#0a0a0a',
  surface:  '#111110',
  surfaceB: '#161514',
  ink:      '#f5f2eb',
  muted:    'rgba(245,242,235,0.45)',
  subtle:   'rgba(245,242,235,0.2)',
  faint:    'rgba(245,242,235,0.06)',
  border:   'rgba(245,242,235,0.08)',
  accent:   '#b83025',

  // Section-specific accents (same chroma/lightness, different hue)
  equityAccent:      '#b83025',
  macroAccent:       '#8a6c3a',
  quantAccent:       '#2d6ab8',
  marketNotesAccent: '#2d7a4f',

  fontDisplay: "'Playfair Display', Georgia, serif",
  fontMono:    "'JetBrains Mono', monospace",
  fontSans:    "-apple-system, system-ui, sans-serif",

  radiusNone: '0px', // No border radius anywhere
};
```

**Rules:**
- Zero border radius on everything
- No box shadows
- Grain texture overlay on dark hero sections (SVG noise, opacity 0.025–0.035)
- JetBrains Mono for labels/nav/meta, Playfair Display for headlines/body, system font for form inputs
- Red accent `#b83025` only for equity/default. Each section type gets its own accent (above).

---

## 1. Admin Panel — Full Redesign

Replace the entire `app/admin/admin.module.css` and all admin page components with the following dark design system. The current admin is beige/light — replace it completely.

### 1a. Layout & Shell

**`app/admin/(dashboard)/layout.tsx`** — redesign to:
- Dark sidebar (220px, `#111110` bg, `rgba(245,242,235,0.08)` border-right)
- Main content area (`#0a0a0a` bg)
- Sidebar: logo top, nav middle, user+logout bottom
- Nav items: Dashboard, Posts, Stances, Models, In Progress, Settings
- Active state: left `2px solid #b83025` border + `#b83025` tinted background
- Nav labels: JetBrains Mono 7.5px, 0.12em tracking, uppercase, `rgba(245,242,235,0.45)` default, `#f5f2eb` active
- No rounded corners anywhere
- Sticky sidebar, scrollable main content

### 1b. Login Page

**`app/admin/login/page.tsx`** — redesign to:
- Full-screen `#0a0a0a` background with SVG grain overlay (opacity 0.025)
- Centered card (400px width): `#111110` bg, `rgba(245,242,235,0.08)` border
- Logo: Playfair Display 22px "Whiteprint *Research*" with `#b83025` italic emphasis
- Form fields: `rgba(245,242,235,0.06)` background, `rgba(245,242,235,0.08)` border, `#f5f2eb` text
- Focus state: border becomes `#b83025`
- Primary button: `#b83025` background, full-width
- JetBrains Mono labels

### 1c. Dashboard

**`app/admin/(dashboard)/page.tsx`** — redesign to:
- Page header: section name in JetBrains Mono accent, h1 in Playfair Display 22px
- Stats row (4 cells): published count, active stances, drafts, avg word count
  - Each cell: `#111110` bg, border, large Playfair Display number (28px), mono label below
- 2-column grid below: recent posts table (left) + active stances list (right)
- Recent posts: clickable rows that navigate to edit
- Stances: ticker, conviction bar (2px height, `#b83025` fill), direction badge

### 1d. Posts List

**`app/admin/(dashboard)/posts/page.tsx`** — redesign to:
- Search input + type filter tabs (Equity / Macro / Quant / Market Notes / All)
- Table with columns: Title (Playfair Display), Type (coloured mono), Verdict, Status badge, Word count, Date
- Hover row: `rgba(245,242,235,0.04)` background
- Status badges: `published` = green, `draft` = muted — no rounded corners
- Click row → navigate to edit page
- "+ New Post" button top-right: `#b83025` background

### 1e. Post Editor — WYSIWYG

**`app/admin/(dashboard)/posts/[id]/page.tsx`** and **`app/admin/(dashboard)/posts/new/page.tsx`**

**Top bar** has two tabs: `Article | Brief`. Saving always persists both.

**Article tab** — WYSIWYG editor (see full spec below).

**Brief tab** — structured Brief builder:
- Verdict dropdown (SHORT / LONG / NEUTRAL / WATCH / SHORT VOL / LONG VOL)
- Up to 5 accordion counts, each with:
  - Title (Playfair Display input)
  - Signal level (High Signal / Critical / Moderate / Watch)
  - Claim — one sentence (textarea)
  - Proof block: Source field + Key Figure field (side by side)
  - Interpretation — 1–2 sentences (textarea)
- Conclusion textarea
- Saves to `posts.brief_data` JSONB

**WYSIWYG editor body** (Article tab):
- Inline-editable title (Playfair Display 26px, click to edit, `#b83025` underline on focus)
- Dropdowns: research type, verdict, date picker, URL slug
- Word count (live)
- "Save Draft" ghost button + "Publish" primary button in top bar

**Editor body:**
- `div[contentEditable="true"]` styled to match the exact published article layout (Playfair Display 15px body, 1.95 line-height, max-width 720px, centered)
- **Save selection on blur/mouseup/keyup** into a `savedRange` ref
- **Floating format toolbar** appears on any text selection:
  - Positioned above the selection using `getBoundingClientRect()`
  - Dark background (`#1a1816`), `rgba(245,242,235,0.14)` border
  - Buttons: **B** (bold), *I* (italic), U (underline), H1, H2, H3, " (blockquote), {} (code), ↗ (link), A + color picker
  - Each button: `onMouseDown={e => e.preventDefault()}` to preserve selection
  - `exec(cmd)` function: restore `savedRange` → `focus()` → `document.execCommand(cmd)`
- **Block gutter** (left side, appears on hover): p, H2, —, ⊞ (insert table)
- **Table insertion**: 3×3 HTML table with matching dark styles
- Article CSS applied inline: h1/h2/h3, p, blockquote, pre, hr, table, td all styled to match published article

**Brief Builder** (tab within post editor):
- Toggle between "Article" and "Brief" tabs in the editor top bar
- Brief tab shows the structured Brief form: verdict, 3–5 counts each with title/signal/claim/source/value/interpretation
- Brief preview panel on the right (live)
- Saving the brief writes to `posts.brief_data` JSONB column (add migration if not exists)

### 1f. Stances

**`app/admin/(dashboard)/stances/page.tsx`** — redesign to:
- Filter tabs: Active / Closed / All
- Grid of stance cards (3 columns desktop, 1 mobile):
  - Ticker (JetBrains Mono 16px), name below
  - Direction badge (Short = `#b83025`, Long = `#2d7a4f`, Neutral = muted)
  - Conviction bar (2px, `#b83025` fill, percentage label)
  - Asset type in section accent color
  - Filed date
- Click card → edit stance

### 1g. In Progress Panel — with Redaction Control

**`app/admin/(dashboard)/in-progress/page.tsx`** — redesign with:
- List of pipeline items from `pipeline_docket` table
- Each item has:
  - **Inline-editable title** (click to edit, red underline on focus)
  - **Stage selector** dropdown: Idea / Research / Drafting / Review / Ready
  - **Progress slider** (0–100%, 2px bar below, `#b83025` fill)
  - **Type selector** (equity / macro / quant / market-notes)
  - **Redact Title toggle** (right side of card):
    - When OFF: public homepage shows real title
    - When ON: public homepage shows blurred placeholder blocks instead of title
    - Toggle button: `border: 1px solid accent` when active, labelled "Redacted" / "Redact Title"
    - Public preview shown inline: either the real title (truncated) or 4–5 grey blur-block rectangles
  - This writes `pipeline_docket.redacted = true/false` to Supabase
- "+ Add Item" button top-right
- Info banner explaining the public homepage connection

### 1h. Settings

**`app/admin/(dashboard)/settings/page.tsx`** — redesign to match dark aesthetic:
- Sections: Site Identity, Contact & Social, Admin Access
- `site_settings` table already exists — wire all fields
- Accent color picker (updates CSS variable site-wide)
- Clean form fields matching admin design system

---

## 2. Research Type Landing Pages

Create four dedicated landing pages. Each has a unique visual treatment and accent color, but shares the same nav and footer.

### Shared: Updated Nav

Update `components/Nav.tsx` to add section navigation:
- Logo + main nav: Research, Stances, Models, Market Notes, About
- "Research" dropdown/submenu: Equity, Macro, Quant, Market Notes

### 2a. `/equity` — Forensic Equity

**Visual:** Dark `#0a0a0a`, red `#b83025` accent

**Hero:**
- Eyebrow: JetBrains Mono "Forensic Equity Research"
- H1: Playfair Display "We read *the footnotes.*" (italic emphasis in red)
- Subtitle: "Deep forensic analysis of public company filings."

**4 Reason Cards** (2×2 grid, below hero) — NO simulations, NO briefs:
- Card 01: "10-K forensics — footnotes reveal what management hides"
- Card 02: "Accounting signal detection — useful-life tricks, off-BS exposure"
- Card 03: "FCF vs net income divergence — the tell of every blow-up"
- Card 04: "Thesis with evidence — every call backed by primary source"
- Each card: dark border, faint red bg, mono number top-left, Playfair body

**Article list** below the cards. Each card shows: date, verdict badge, "Brief" badge (if `brief_data` exists), title. **The Brief itself does not appear on this page** — the badge just links to the post.

### 2b. `/macro` — Global Macro

**Visual:** Slightly warmer dark (`#080806`), amber `#8a6c3a` accent

**Hero:** H1: "Structural views. *Not noise.*"

**Indicators strip** — text only, NO charts:
- Pull from `macro_indicators` table (or static fallback)
- Each row: label (mono, muted) | value (mono, 11px) | delta (colour-coded)
- Label: "Key Indicators · {date}"

**Article list** below. Clean cards only — NO yield curve SVG, NO data charts on the landing page.

### 2c. `/quant` — Quantitative Research

**Visual:** Dark navy-black (`#060810`), blue `#2d6ab8` accent

**Hero:**
- H1: JetBrains Mono "QUANT_LAB"
- Subtitle: "Options pricing, derivatives analysis, and interactive financial models."

**Article list** — each card shows a What/Why/When/How 2×2 grid from `post.meta.framework`:
```json
{
  "framework": [
    { "q": "What", "a": "…" },
    { "q": "Why",  "a": "…" },
    { "q": "When", "a": "…" },
    { "q": "How",  "a": "…" }
  ]
}
```
Cards with `meta.has_simulator: true` show a "+ Simulator" badge. **The simulator does NOT appear on this landing page** — it lives inside the post only.

### 2d. `/market-notes` — Market Notes

**Visual:** Slightly green-dark (`#080908`), green `#2d7a4f` accent

**Hero:** H1: "Filed within *24 hours.*"

**Feed layout** — date-stamped list, one key stat per note:
- Large date number (day) + month label on the left
- Title + one key statistic on the right (from `post.meta.key_stat`)
- Key stat: coloured dot + "Key figure" label + value
- NO graphs, NO charts — pure text feed

---

---

## 3. Mobile Navigation — Bottom Tab Bar

On all pages at `< 768px`, render a fixed bottom tab bar (Instagram-style):

```tsx
// components/MobileNav.tsx
const tabs = [
  { id: 'home',   label: 'Home',   href: '/',             accent: '#0f0f0f' },
  { id: 'equity', label: 'Equity', href: '/equity',       accent: '#b83025' },
  { id: 'macro',  label: 'Macro',  href: '/macro',        accent: '#8a6c3a' },
  { id: 'quant',  label: 'Quant',  href: '/quant',        accent: '#2d6ab8' },
  { id: 'notes',  label: 'Notes',  href: '/market-notes', accent: '#2d7a4f' },
];
```

**Styling:**
- Height: 72px, fixed bottom, full width
- Background: `rgba(white, 0.95)` with `backdrop-filter: blur(16px)`
- `border-top: 0.5px solid rgba(0,0,0,0.1)`
- 5 tabs, evenly spaced, icon + label
- Active tab: icon and label use the section accent colour
- Inactive: `rgba(0,0,0,0.3)`
- Add `padding-bottom: 72px` to all page content containers on mobile so content isn't hidden behind the bar

**Icons:** Use simple SVG paths (no emoji, no icon libraries):
- Home: house outline
- Equity: 3 bar chart
- Macro: globe with equator lines
- Quant: signal/waveform line
- Notes: document with lines

The existing `components/Nav.tsx` stays for desktop (≥ 768px). `MobileNav` is desktop-hidden, mobile-only.

---

## 4. The Brief — Format & Component

### 3a. Database

Add `brief_data` JSONB column to the `posts` table if not exists:

```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS brief_data JSONB;
```

`brief_data` schema:
```json
{
  "verdict": "SHORT",
  "counts": [
    {
      "num": "I",
      "title": "Capex Acceleration",
      "subtitle": "Pattern Break",
      "signal": "High Signal",
      "claim": "...",
      "src": "...",
      "value": "...",
      "note": "..."
    }
  ],
  "conclusion": "..."
}
```

### 3b. Brief Component

Create `components/TheBrief.tsx`:
- Props: `brief: BriefData`, `variant: 'article' | 'mobile' | 'email'`
- Dark hero header (article title, verdict badge, red bottom rule)
- Compact memo strip (Case No., verdict)
- Accordion counts (expandable): roman numeral, signal badge, title, claim, source block, red-bar annotation
- Conclusion section
- "Read Full Analysis →" CTA

**On article pages** (`app/posts/[slug]/page.tsx`):
- If post has `brief_data`, show a collapsible `<TheBrief />` component at the top of the article
- Collapsed by default on desktop (shows just verdict + "Read the Brief ↓")
- Expanded by default on mobile (it IS the reading surface; full article is "Read Full Analysis →")

### 4c. Brief on Mobile

On mobile (`< 768px`), article pages with `brief_data` should:
1. Show The Brief as the **primary** reading surface at the top of the page
2. Full article body appears below the conclusion (not hidden)
3. Sticky top bar: back button + share
4. "Read Full Analysis →" button after the conclusion scrolls down to article body
5. **The Brief does NOT appear on the `/equity`, `/macro`, `/quant`, or `/market-notes` landing pages** — only inside individual post pages

---

## 5. Quant Posts — Embedded Simulators

**IMPORTANT: Simulators live only inside individual post pages, not on the `/quant` landing page.**

Each quant post may have its own unique simulator. The `/quant` landing page only shows article cards with the What/Why/When/How framework grid from `post.meta.framework`.

### 5a. Simulator Architecture

For quant posts with `meta.simulator_type` set, inject an interactive React component between article sections.

Create `components/simulators/` directory with:

**`components/simulators/CDSSimulator.tsx`** — Credit Default Swap simulator:

Inputs (sliders):
- Notional ($M, 1–100)
- CDS Spread (bps, 25–1000)
- Maturity (years, 1–10)
- Recovery Rate (%, 0–80)
- Default trigger toggle + year slider (1 to maturity)

Outputs:
- Annual premium: `notional × spread / 10000`
- Payout on default: `notional × (1 − recovery/100)`
- Break-even probability: `spread / (1 − recovery/100) / 100` per year
- Perspective toggle: Protection Buyer / Protection Seller
- SVG bar chart: year-by-year cash flows, coloured by direction, default bar if triggered
- Net P&L display

Styling: blue `#2d6ab8` accent, subtle grid background, JetBrains Mono throughout

**`components/simulators/index.tsx`** — registry mapping `simulator_type` to component

**In `app/posts/[slug]/page.tsx`**: after the MDX body renders, check `post.meta.simulator_type` and render the appropriate simulator component.

---

## 5. Performance Improvements

### 5a. Skeleton Loading

Create `components/skeletons/` with:
- `ArticleCardSkeleton.tsx` — shimmer card for research list
- `ArticleBodySkeleton.tsx` — shimmer lines for article loading
- `StanceCardSkeleton.tsx`

Use `<Suspense fallback={<ArticleCardSkeleton />}>` around all data-fetching components.

Skeleton style: `#161514` background with `rgba(245,242,235,0.06)` shimmer animation (CSS keyframe `shimmer` sweeping left to right).

### 5b. Reading Progress Bar

In `app/posts/[slug]/page.tsx`, add a reading progress bar:
- 1px height, `#b83025` color
- Fixed at top of viewport (below nav)
- Width = scrollY / (documentHeight - viewportHeight) × 100%
- Already implemented in `progress-bar.tsx` — just ensure it's using the new accent color

### 5c. Page Transitions

In `app/layout.tsx`, add NProgress-style page transition:
- The shooting bullet loader in `globals.css` is already implemented — ensure it's active
- On navigation start: show the line + glowing red dot
- On navigation complete: fade out

### 5d. Image Optimization

Ensure all article images use `next/image` with appropriate `sizes` props. Add blur placeholders for hero images.

---

## 6. Component Checklist

Every component you create or modify must:

- [ ] Use the design tokens from `lib/tokens.ts`
- [ ] Have `border-radius: 0` (no rounded corners)
- [ ] Use JetBrains Mono for labels/tags/meta, Playfair Display for headlines
- [ ] Not use inline `border-radius` anywhere
- [ ] Pass TypeScript type checking
- [ ] Work on mobile (min-width: 320px)
- [ ] Be dark-mode only (no light mode toggle needed)

---

## 7. Database Migrations Required

Run these migrations in order:

```sql
-- 1. Brief data on posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS brief_data JSONB;

-- 2. Post meta (for simulator_type, key_stat, framework)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}';

-- 3. Macro indicators (for /macro page)
CREATE TABLE IF NOT EXISTS macro_indicators (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  delta TEXT,
  direction SMALLINT DEFAULT 0, -- -1 down, 0 flat, 1 up
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Redaction flag on pipeline_docket (may already exist)
ALTER TABLE pipeline_docket ADD COLUMN IF NOT EXISTS redacted BOOLEAN DEFAULT FALSE;

-- Enable RLS on macro_indicators
ALTER TABLE macro_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON macro_indicators FOR SELECT USING (true);
```

---

## 8. File Map — What to Create or Modify

```
MODIFY:
  app/admin/admin.module.css          ← full dark redesign
  app/admin/(dashboard)/layout.tsx    ← dark sidebar shell
  app/admin/(dashboard)/page.tsx      ← dark dashboard
  app/admin/(dashboard)/posts/page.tsx         ← dark posts list
  app/admin/(dashboard)/posts/[id]/page.tsx    ← WYSIWYG editor
  app/admin/(dashboard)/posts/new/page.tsx     ← WYSIWYG editor (new)
  app/admin/(dashboard)/stances/page.tsx       ← dark stances grid
  app/admin/(dashboard)/in-progress/page.tsx  ← redaction control
  app/admin/(dashboard)/settings/page.tsx     ← dark settings
  app/admin/login/page.tsx            ← dark login
  app/globals.css                     ← add section accent CSS vars
  components/Nav.tsx                  ← add section submenu
  components/PipelineDocket.tsx       ← apply redaction logic

CREATE:
  lib/tokens.ts                       ← design tokens
  app/equity/page.tsx                 ← equity landing
  app/macro/page.tsx                  ← macro landing (update existing)
  app/quant/page.tsx                  ← quant landing (new section)
  app/market-notes/page.tsx           ← market notes landing
  components/TheBrief.tsx             ← brief component
  components/simulators/CDSSimulator.tsx
  components/simulators/index.tsx
  components/skeletons/ArticleCardSkeleton.tsx
  components/skeletons/ArticleBodySkeleton.tsx

MIGRATIONS:
  supabase/migrations/YYYYMMDD_add_brief_and_meta.sql
  supabase/migrations/YYYYMMDD_add_macro_indicators.sql
  supabase/migrations/YYYYMMDD_add_pipeline_redaction.sql
```

---

## 9. Reference Designs

The following HTML prototype files are in this repo as design references. Study them before building:

- `admin/WhitePrint Admin.html` — full admin panel prototype (dark aesthetic, sidebar, WYSIWYG)
- `WhitePrint Research Pages.html` — all 4 research landing pages + CDS simulator
- `WhitePrint Brief — Mobile.html` — mobile Brief reading experience
- `WhitePrint Brief — Formats & Builder.html` — Brief admin builder
- `WhitePrint Mobile Reader.html` — mobile reader POV across all sections

These are pixel-accurate design references. Match them as closely as possible.

---

## 10. Quality Bar

- All pages must score green in Next.js build (`next build` with no errors)
- No TypeScript `any` — use proper types from `lib/supabase/database.types.ts`
- Admin routes protected by existing `getAdminIdentity()` auth check
- All Supabase queries use the server client (`lib/supabase/server.ts`)
- Mobile-first CSS — test at 375px, 768px, 1280px, 1440px

Start with the admin panel redesign (highest priority), then research landing pages, then the Brief component, then simulators, then performance.
