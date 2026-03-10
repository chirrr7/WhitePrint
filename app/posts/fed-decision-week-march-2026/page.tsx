import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FedDecisionWeekArticle } from "./article"

export const metadata: Metadata = {
  title: "Fed Decision Week: Three Things to Watch",
  description:
    "The Federal Reserve meets March 17–18. Rates are not moving — but the signals that come out of this meeting could shape how markets behave for months.",
}

export default function FedDecisionWeekPage() {
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
      <FedDecisionWeekArticle />
    </>
  )
}
