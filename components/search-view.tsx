"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback, Suspense } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import type { PostMeta } from "@/lib/post-meta"
import { formatPostDate, getPostCategoryLabel } from "@/lib/post-meta"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") ?? ""
  const initialTag = searchParams.get("tag") ?? ""
  const initialIncludeArchived = searchParams.get("archived") === "1"
  const [query, setQuery] = useState(initialQuery)
  const [tag, setTag] = useState(initialTag)
  const [includeArchived, setIncludeArchived] = useState(initialIncludeArchived)
  const [results, setResults] = useState<PostMeta[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
    setTag(initialTag)
    setIncludeArchived(initialIncludeArchived)
  }, [initialIncludeArchived, initialQuery, initialTag])

  const doSearch = useCallback(async (q: string, t: string, archived: boolean) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (t) params.set("tag", t)
    if (archived) params.set("archived", "1")
    const res = await fetch(`/api/search?${params.toString()}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (query || tag) {
      doSearch(query, tag, includeArchived)
      return
    }

    setResults([])
  }, [includeArchived, tag, doSearch, query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (tag) params.set("tag", tag)
    if (includeArchived) params.set("archived", "1")
    router.push(`/search?${params.toString()}`)
    doSearch(query, tag, includeArchived)
  }

  const handleArchiveToggle = () => {
    const nextValue = !includeArchived
    setIncludeArchived(nextValue)

    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (tag) params.set("tag", tag)
    if (nextValue) params.set("archived", "1")
    router.push(`/search?${params.toString()}`)
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
        <label className="mt-4 inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <input
            type="checkbox"
            checked={includeArchived}
            onChange={handleArchiveToggle}
            className="h-3.5 w-3.5 accent-[var(--accent)]"
          />
          Include Archive
        </label>
        {tag && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <p>
              Filtering by tag: <span className="text-foreground font-medium">{formatTagLabel(tag)}</span>
            </p>
            <Link
              href={`/stances?tag=${encodeURIComponent(tag)}`}
              className="text-xs uppercase tracking-[0.18em] text-foreground hover:text-muted-foreground transition-colors"
            >
              View coverage →
            </Link>
          </div>
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
                  {getPostCategoryLabel(post.category)}
                </span>
                <span aria-hidden="true">{'/'}</span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </div>
              <Link href={`/posts/${post.slug}`}>
                {post.displayTitle ? (
                  <h3
                    className="font-serif text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground [&_em]:text-accent [&_em]:italic"
                    dangerouslySetInnerHTML={{ __html: post.displayTitle }}
                  />
                ) : (
                  <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground hover:text-muted-foreground transition-colors">
                    {post.title}
                  </h3>
                )}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {post.reportDownload ? (
                  <a
                    href={post.reportDownload.href}
                    download={post.reportDownload.filename}
                    className="text-xs uppercase tracking-[0.18em] text-accent hover:text-foreground transition-colors"
                  >
                    {post.reportDownload.label ?? "Model"}
                  </a>
                ) : null}
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/search?tag=${encodeURIComponent(t)}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {formatTagLabel(t)}
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

function formatTagLabel(value: string) {
  const normalized = value.trim().toLowerCase()

  switch (normalized) {
    case "orcl":
      return "Oracle"
    case "eog":
      return "EOG"
    case "e-and-p":
      return "E&P"
    case "roic":
      return "ROIC"
    case "dcf":
      return "DCF"
    default:
      return normalized.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }
}
