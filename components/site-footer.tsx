import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background pb-20 md:pb-0">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Link href="/" className="font-serif text-lg font-bold tracking-tight text-foreground">
              Whiteprint
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Independent macroeconomic analysis, equity research, and financial models.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Research</span>
              <Link href="/macro" className="text-sm text-foreground hover:text-muted-foreground transition-colors">Macro</Link>
              <Link href="/equity" className="text-sm text-foreground hover:text-muted-foreground transition-colors">Equity</Link>
              <Link href="/market-notes" className="text-sm text-foreground hover:text-muted-foreground transition-colors">Market Notes</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Resources</span>
              <Link href="/models" className="text-sm text-foreground hover:text-muted-foreground transition-colors">Models</Link>
              <Link href="/about" className="text-sm text-foreground hover:text-muted-foreground transition-colors">About</Link>
              <Link href="/rss.xml" className="text-sm text-foreground hover:text-muted-foreground transition-colors">RSS Feed</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {'\u00A9'} 2026 Whiteprint. All rights reserved. All content is for informational purposes only and does not constitute investment advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
