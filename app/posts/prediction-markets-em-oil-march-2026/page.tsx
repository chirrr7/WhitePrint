import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PredictionMarketsEmArticle } from "./article"

export const metadata: Metadata = {
  title: "Prediction Markets See the Conflict. Emerging Markets May Bear the Cost.",
  description:
    "If event-implied oil probabilities are taken seriously, the bigger macro question is which emerging markets are forced to absorb a longer energy shock.",
}

export default function PredictionMarketsEmPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-4">
        <Link
          href="/market-notes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Market Notes
        </Link>
      </div>
      <PredictionMarketsEmArticle />
    </>
  )
}
