import type { Metadata } from "next"
import { EogStandalone } from "./standalone"

export const metadata: Metadata = {
  title: "EOG Resources: The Base Case Is Priced In",
  description: "EOG Resources long-form equity research page.",
}

export default function EogResourcesPage() {
  return <EogStandalone />
}
