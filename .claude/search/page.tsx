import type { Metadata } from "next"
import { SearchView } from "@/components/search-view"

export const metadata: Metadata = {
  title: "Search",
  description: "Search Whiteprint research posts by keyword or tag.",
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Search
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg leading-relaxed">
          Find research by keyword, topic, or tag.
        </p>
      </header>
      <SearchView />
    </div>
  )
}
