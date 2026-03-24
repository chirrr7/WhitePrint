import Link from "next/link"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import {
  DisclaimerBox,
  PullQuote,
  ResearchTable,
  ScenarioCard,
  ScenarioGrid,
  StatCard,
  StatGrid,
  StickyTable,
  StickyLayout,
} from "@/components/research-blocks"
import { cn } from "@/lib/utils"

function MdxLink({
  href = "",
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const sharedClassName = cn(
    "underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground",
    className,
  )

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={sharedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={sharedClassName} {...props}>
      {children}
    </a>
  )
}

function MdxTable({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-8 overflow-x-auto border border-border">
      <table
        className={cn("w-full min-w-[640px] border-collapse text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function MdxPre({
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={cn(
        "my-8 overflow-x-auto border border-border bg-muted/40 p-4 font-mono text-sm leading-6 text-foreground",
        className,
      )}
      {...props}
    />
  )
}

export function PostBody({ children }: { children: ReactNode }) {
  return (
    <div className="text-base text-foreground [&>*:first-child]:mt-0">
      {children}
    </div>
  )
}

// Article body components — bare HTML elements, styled via article.module.css descendant selectors
export const articleBodyComponents = {
  a: MdxLink,
  ResearchTable,
  PullQuote,
  StatGrid,
  StatCard,
  ScenarioGrid,
  ScenarioCard,
  DisclaimerBox,
  StickyTable,
  StickyLayout,
}

export const postBodyComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="mt-14 font-serif text-3xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-14 border-b-2 border-foreground pb-3 font-serif text-[1.7rem] font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-10 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="mt-8 font-serif text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-5 text-[1.03rem] leading-8 text-foreground" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-5 list-disc space-y-3 pl-6 text-[1.03rem] leading-8" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mt-5 list-decimal space-y-3 pl-6 text-[1.03rem] leading-8"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  a: MdxLink,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-muted-foreground" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 border-l-2 border-foreground pl-5 font-serif text-xl italic leading-8 text-muted-foreground"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-border" {...props} />
  ),
  table: MdxTable,
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-foreground text-background" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-border even:bg-muted/25 last:border-b-0" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-3 align-top text-sm leading-6 text-foreground" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.92em] text-foreground"
      {...props}
    />
  ),
  pre: MdxPre,
  ResearchTable,
  PullQuote,
  StatGrid,
  StatCard,
  ScenarioGrid,
  ScenarioCard,
  DisclaimerBox,
  StickyTable,
  StickyLayout,
}
