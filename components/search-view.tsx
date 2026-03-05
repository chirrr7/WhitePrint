"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback, Suspense } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import type { PostMeta } from "@/lib/posts"

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function categoryLabel(category: string) {
  switch (category) {
    case "macro":
      return "Macro"
    case "equity":
      return "Equity Research"
    case "market-notes":
      return "Market Notes"
    default:
      return category
  }
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") ?? ""
  const initialTag = searchParams.get("tag") ?? ""
  const [query, setQuery] = useState(initialQuery)
  const [tag] = useState(initialTag)
  const [results, setResults] = useState<PostMeta[]>([])
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (q: string, t: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (t) params.set("tag", t)
    const res = await fetch(`/api/search?${params.toString()}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (query || tag) {
      doSearch(query, tag)
    }
  }, [tag, doSearch, query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (tag) params.set("tag", tag)
    router.push(`/search?${params.toString()}`)
    doSearch(query, tag)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex items-center border border-border">
          <Search className="h-4 w-4 ml-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword..."
            className="flex-1 px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search posts"
          />
          <button
            type="submit"
            className="px-6 py-3 text-sm font-medium bg-foreground text-background hover:bg-muted-foreground transition-colors"
          >
            Search
          </button>
        </div>
        {tag && (
          <p className="mt-3 text-sm text-muted-foreground">
            Filtering by tag: <span className="text-foreground font-medium">#{tag}</span>
          </p>
        )}
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Searching...
        </p>
      ) : results.length > 0 ? (
        <div className="divide-y divide-border">
          {results.map((post) => (
            <article key={post.slug} className="py-6">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="uppercase tracking-widest font-medium">
                  {categoryLabel(post.category)}
                </span>
                <span aria-hidden="true">{'/'}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <Link href={`/posts/${post.slug}`}>
                <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground hover:text-muted-foreground transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/search?tag=${encodeURIComponent(t)}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (query || tag) ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No results found.
        </p>
      ) : null}
    </div>
  )
}

export function SearchView() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading search...</p>}>
      <SearchContent />
    </Suspense>
  )
}
