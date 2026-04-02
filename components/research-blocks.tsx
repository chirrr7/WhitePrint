import { Children, isValidElement, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { MarketNoteTableData } from "@/lib/post-meta"

type StatTone = "neutral" | "positive" | "warning" | "negative"
type ScenarioTone =
  | "neutral"
  | "base"
  | "conflict"
  | "bull"
  | "bear"
  | "positive"
  | "warning"
  | "negative"

export interface StatGridItem {
  label: ReactNode
  value: ReactNode
  detail?: ReactNode
  tone?: StatTone
}

export interface ScenarioCardItem {
  name: ReactNode
  probability?: ReactNode
  title?: ReactNode
  summary: ReactNode
  outcome?: ReactNode
  tone?: ScenarioTone
}

const statToneClasses: Record<StatTone, string> = {
  neutral: "text-foreground",
  positive: "text-emerald-700",
  warning: "text-amber-700",
  negative: "text-rose-700",
}

const scenarioToneClasses: Record<ScenarioTone, string> = {
  neutral: "border-l-border",
  base: "border-l-stone-500",
  conflict: "border-l-amber-700",
  bull: "border-l-emerald-700",
  bear: "border-l-rose-700",
  positive: "border-l-emerald-700",
  warning: "border-l-amber-700",
  negative: "border-l-rose-700",
}

const disclaimerToneClasses: Record<StatTone, string> = {
  neutral: "border-l-foreground bg-background",
  positive: "border-l-emerald-700 bg-emerald-50/60",
  warning: "border-l-amber-700 bg-amber-50/60",
  negative: "border-l-rose-700 bg-rose-50/60",
}

export function ResearchTable({
  headers,
  rows,
  caption,
  notes,
  children,
}: {
  headers?: ReactNode[]
  rows?: ReactNode[][]
  caption?: ReactNode
  notes?: ReactNode
  children?: ReactNode
}) {
  const hasStructuredData = Array.isArray(headers) && Array.isArray(rows)

  return (
    <div
      className="my-10"
      data-mobile-table-modal={hasStructuredData ? "1" : undefined}
      data-mobile-table-title={typeof caption === "string" ? caption : "Research Table"}
    >
      {hasStructuredData ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead className="bg-foreground text-background">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={`header-${index}`}
                    className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="border-b border-border even:bg-muted/25 last:border-b-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="px-4 py-3 align-top text-sm leading-6 text-foreground"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
      {caption ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{caption}</p>
      ) : null}
      {notes ? (
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {notes}
        </p>
      ) : null}
    </div>
  )
}

export function MarketNoteTable({
  heading = "Market Note Summary",
  stance,
  confidence,
  horizon,
  quickAnswer,
  whatChangesOurMind,
  className,
}: MarketNoteTableData & { heading?: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "my-10 overflow-hidden border border-border bg-background",
        className,
      )}
      data-mobile-table-modal="1"
      data-mobile-table-title={typeof heading === "string" ? heading : "Market Note Summary"}
    >
      <div className="border-b border-border bg-foreground px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-background">
        {heading}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-border">
              <th className="w-[36%] bg-muted/25 px-4 py-4 text-left align-top font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:w-48">
                Whiteprint Stance
              </th>
              <td className="border-l-4 border-l-[#c0392b] px-5 py-4 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-[1.9rem]">
                {stance}
              </td>
            </tr>
            <tr className="border-b border-border">
              <th className="bg-muted/25 px-4 py-4 text-left align-top font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Confidence
              </th>
              <td className="px-5 py-4 font-serif text-lg font-semibold text-foreground">
                {confidence}
              </td>
            </tr>
            <tr className="border-b border-border">
              <th className="bg-muted/25 px-4 py-4 text-left align-top font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Horizon
              </th>
              <td className="px-5 py-4 font-mono text-sm uppercase tracking-[0.14em] text-foreground">
                {horizon}
              </td>
            </tr>
            <tr className="border-b border-border">
              <th className="bg-muted/25 px-4 py-4 text-left align-top font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Quick Answer
              </th>
              <td className="px-5 py-4 text-sm leading-6 text-foreground">
                {quickAnswer}
              </td>
            </tr>
            <tr>
              <th className="bg-muted/25 px-4 py-4 text-left align-top font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                What Changes Our Mind
              </th>
              <td className="px-5 py-4 text-sm leading-6 text-foreground">
                {whatChangesOurMind}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function PullQuote({
  quote,
  attribution,
  children,
}: {
  quote?: ReactNode
  attribution?: ReactNode
  children?: ReactNode
}) {
  return (
    <figure
      style={{
        position: "relative",
        margin: "44px 0",
        overflow: "hidden",
        background: "#0a0a0a",
        padding: "28px 32px 28px 28px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 4,
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 80,
          lineHeight: 1,
          color: "#b83025",
          opacity: 0.8,
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        &ldquo;
      </div>
      <blockquote
        style={{
          position: "relative",
          paddingLeft: 36,
          margin: 0,
          fontFamily: '"Source Serif 4", Georgia, serif',
          fontSize: 20,
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "#fff",
          border: "none",
        }}
      >
        {quote ?? children}
      </blockquote>
      {attribution ? (
        <figcaption
          style={{
            marginTop: 16,
            paddingLeft: 36,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#b83025",
          }}
        >
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function StickyTable({
  title,
  children,
}: {
  title?: ReactNode
  children: ReactNode
}) {
  return (
    <div style={{ position: "sticky", top: 88 }}>
      {title ? (
        <div
          style={{
            background: "#0a0a0a",
            color: "#fff",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "8px 14px",
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          border: "1px solid #dedad4",
          borderTop: title ? "none" : "1px solid #dedad4",
          background: "#fff",
          overflowX: "auto",
        }}
      >
        {children}
      </div>
    </div>
  )
}

StickyTable.displayName = "StickyTable"

export function StickyLayout({ children }: { children: ReactNode }) {
  let panel: ReactNode = null
  const prose: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (child.type as any).displayName === "StickyTable") {
      panel = child
    } else {
      prose.push(child)
    }
  })

  return (
    <div className="sticky-layout-grid">
      <div>{prose}</div>
      <div>{panel}</div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  detail,
  tone = "neutral",
}: StatGridItem) {
  return (
    <div className="bg-background p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "mt-2 font-serif text-3xl font-semibold tracking-tight",
          statToneClasses[tone],
        )}
      >
        {value}
      </div>
      {detail ? (
        <div className="mt-2 font-mono text-[11px] text-muted-foreground">
          {detail}
        </div>
      ) : null}
    </div>
  )
}

export function StatGrid({
  items,
  children,
}: {
  items?: StatGridItem[]
  children?: ReactNode
}) {
  return (
    <div className="my-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
      {Array.isArray(items)
        ? items.map((item, index) => <StatCard key={`stat-${index}`} {...item} />)
        : children}
    </div>
  )
}

export function ScenarioCard({
  name,
  probability,
  title,
  summary,
  outcome,
  tone = "neutral",
}: ScenarioCardItem) {
  return (
    <div
      className={cn(
        "border border-border border-l-4 bg-background p-5",
        scenarioToneClasses[tone],
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {name}
        </div>
        {probability ? (
          <div className="font-serif text-lg font-semibold italic text-foreground">
            {probability}
          </div>
        ) : null}
      </div>
      {title ? (
        <div className="mt-3 font-serif text-lg font-semibold tracking-tight text-foreground">
          {title}
        </div>
      ) : null}
      <div className="mt-2 text-sm leading-6 text-muted-foreground">
        {summary}
      </div>
      {outcome ? (
        <div className="mt-4 border-t border-border pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
          {outcome}
        </div>
      ) : null}
    </div>
  )
}

export function ScenarioGrid({
  items,
  children,
}: {
  items?: ScenarioCardItem[]
  children?: ReactNode
}) {
  return (
    <div className="my-10 grid gap-4 md:grid-cols-2">
      {Array.isArray(items)
        ? items.map((item, index) => <ScenarioCard key={`scenario-${index}`} {...item} />)
        : children}
    </div>
  )
}

export function DisclaimerBox({
  title = "Note",
  tone = "neutral",
  children,
}: {
  title?: ReactNode
  tone?: StatTone
  children: ReactNode
}) {
  return (
    <aside
      className={cn(
        "my-10 border border-border border-l-4 px-5 py-4",
        disclaimerToneClasses[tone],
      )}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      <div className="mt-2 text-sm leading-6 text-foreground">{children}</div>
    </aside>
  )
}
