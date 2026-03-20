import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EogResourcesArticle } from "./article"

export const metadata: Metadata = {
  title: "EOG Resources: The Base Case Is Priced In",
  description:
    "At ~$140, much of EOG's base case appears priced. Scenario weighting now matters more than single-point valuation.",
}

export default function EogResourcesPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-4">
        <Link
          href="/equity"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Equity Research
        </Link>
      </div>
      <EogResourcesArticle />
    </>
  )
}
