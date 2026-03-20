import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EogResourcesArticle } from "./article"

export const metadata: Metadata = {
  title: "EOG Resources: The Base Case Is Priced In",
  description: "EOG Resources long-form equity research page.",
}

export default function EogResourcesPage() {
  return <EogResourcesArticle />
}
