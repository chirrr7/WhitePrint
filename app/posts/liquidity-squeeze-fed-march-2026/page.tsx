import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LiquiditySqueezeArticle } from "./article"

export const metadata: Metadata = {
  title: "Navigating the Liquidity Squeeze: Equity Positioning Ahead of Fed Decision Week",
  description:
    "The FOMC convenes March 17–18 against a backdrop of residual funding market strain, a pending leadership transition, and a late-February geopolitical escalation in the Middle East.",
}

export default function LiquiditySqueezePage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-4">
        <Link
          href="/macro"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Macro
        </Link>
      </div>
      <LiquiditySqueezeArticle />
    </>
  )
}
