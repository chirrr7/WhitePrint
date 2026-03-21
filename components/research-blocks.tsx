import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

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
  neutral: "border-l-muted-foreground bg-muted/40",
  positive: "border-l-emerald-700 bg-emerald-50/60",
  warning: "border-l-amber-700 bg-amber-50/60",
  negative: "border-l-rose-700 bg-rose-50/60",
}

export function ResearchTable({
  headers,
  rows,
  caption,
  notes,
}: {
  headers: ReactNode[]
  rows: ReactNode[][]
  caption?: ReactNode
  notes?: ReactNode
}) {
  return (
    <div className="my-10">
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

export function PullQuote({
  quote,
  attribution,
}: {
  quote: ReactNode
  attribution?: ReactNode
}) {
  return (
    <figure className="relative my-12 overflow-hidden bg-foreground px-7 py-8 text-background">
      <div className="absolute left-5 top-3 font-serif text-7xl text-amber-700/55">
        "
      </div>
      <blockquote className="relative pl-8 font-serif text-2xl italic leading-9 tracking-tight">
        {quote}
      </blockquote>
      {attribution ? (
        <figcaption className="mt-4 pl-8 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-200">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function StatGrid({ items }: { items: StatGridItem[] }) {
  return (
    <div className="my-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div key={`stat-${index}`} className="bg-background p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </div>
          <div
            className={cn(
              "mt-2 font-serif text-3xl font-semibold tracking-tight",
              statToneClasses[item.tone ?? "neutral"],
            )}
          >
            {item.value}
          </div>
          {item.detail ? (
            <div className="mt-2 font-mono text-[11px] text-muted-foreground">
              {item.detail}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ScenarioGrid({ items }: { items: ScenarioCardItem[] }) {
  return (
    <div className="my-10 grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={`scenario-${index}`}
          className={cn(
            "border border-border border-l-4 bg-background p-5",
            scenarioToneClasses[item.tone ?? "neutral"],
          )}
        >
          <div className="flex items-baseline justify-between gap-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {item.name}
            </div>
            {item.probability ? (
              <div className="font-serif text-lg font-semibold italic text-foreground">
                {item.probability}
              </div>
            ) : null}
          </div>
          {item.title ? (
            <div className="mt-3 font-serif text-lg font-semibold tracking-tight text-foreground">
              {item.title}
            </div>
          ) : null}
          <div className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.summary}
          </div>
          {item.outcome ? (
            <div className="mt-4 border-t border-border pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
              {item.outcome}
            </div>
          ) : null}
        </div>
      ))}
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
