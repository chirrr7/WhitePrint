import Link from "next/link"
import { getAllPosts, getPostMetaBySlug, getPostsByCategory } from "@/lib/posts"
import { getAllModels } from "@/lib/models"
import { ArrowRight } from "lucide-react"
import { formatPostDate, getPostCategoryLabel, type PostMeta } from "@/lib/post-meta"

interface DeskBrief {
  eyebrow: string
  stance: string
  summary: string
  href: string
  cta: string
}

function ResearchFeatureCard({ post }: { post: PostMeta }) {
  return (
    <article className="border border-border bg-background p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-[0.18em]">
          {getPostCategoryLabel(post.category)}
        </span>
        <span aria-hidden="true">/</span>
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        <span aria-hidden="true">/</span>
        <span>{post.readTime} min read</span>
      </div>
      <h3 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground">
        <Link href={`/posts/${post.slug}`} className="transition-colors hover:text-muted-foreground">
          {post.title}
        </Link>
      </h3>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
        {post.excerpt}
      </p>
      <Link
        href={`/posts/${post.slug}`}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
      >
        Read Full Analysis <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  )
}

function MarketNoteCard({ post }: { post: PostMeta }) {
  return (
    <article className="border border-border bg-background p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Market Note
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {getPostCategoryLabel(post.category)}
      </div>
      <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground">
        <Link href={`/posts/${post.slug}`} className="transition-colors hover:text-muted-foreground">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-4 text-sm text-muted-foreground">
        {formatPostDate(post.date)} · {post.readTime} min
      </div>
      <Link
        href={`/posts/${post.slug}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
      >
        Read <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  )
}

export default function HomePage() {
  const featuredMacro =
    getPostMetaBySlug("liquidity-squeeze-fed-march-2026") ??
    getPostsByCategory("macro")[0] ??
    getAllPosts()[0]
  const featuredResearch = getAllPosts()
    .filter((post) => post.category !== "market-notes")
    .slice(0, 1)
  const marketNotes = getPostsByCategory("market-notes")
  const models = getAllModels().slice(0, 3)
  const deskBriefs: DeskBrief[] = [
    {
      eyebrow: "EM / Oil",
      stance: "Caution",
      summary:
        "If event-implied oil probabilities are taken seriously, the bigger macro question is which emerging markets are forced to absorb a longer energy shock.",
      href: "/posts/liquidity-squeeze-fed-march-2026",
      cta: "Analysis",
    },
    {
      eyebrow: "Oil",
      stance: "Caution",
      summary:
        "The late-February escalation has reintroduced energy volatility into the inflation narrative and complicates the Fed's path.",
      href: "/posts/eog-resources-the-base-case-is-priced-in",
      cta: "Equity View",
    },
    {
      eyebrow: "Fed",
      stance: "Hold",
      summary:
        "The March 17-18 decision is priced as a hold. The real signal is the dot plot revision and Powell's tone into the handover.",
      href: "/posts/fed-decision-week-three-things-to-watch",
      cta: "Market Note",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <section className="grid gap-14 border-b border-border pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="max-w-2xl">
          <div className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Whiteprint Research
          </div>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
            Independent Macro & Equity Research
          </p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Vol. I · No. 3
          </p>
          <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
            Rigorous analysis of macroeconomic trends, company valuations, and
            market structure. No conflicts, no hype -- just research.
          </p>
        </div>

        {featuredMacro ? (
          <aside className="border border-border bg-background">
            <div className="border-b border-border px-6 py-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Today's Desk
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="text-sm text-muted-foreground">
                Featured Macro {formatPostDate(featuredMacro.date)}
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">
                <Link
                  href={`/posts/${featuredMacro.slug}`}
                  className="transition-colors hover:text-muted-foreground"
                >
                  {featuredMacro.title}
                </Link>
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                {featuredMacro.excerpt}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-5">
                <div>
                  <div className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                    20
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Min read
                  </div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                    12
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Sources
                  </div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                    4
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Scenarios
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredMacro.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?tag=${encodeURIComponent(tag)}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <Link
                href={`/posts/${featuredMacro.slug}`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                Read Full Analysis <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="border-t border-border px-6 py-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Desk Brief
              </div>
              <div className="mt-5 space-y-4">
                {deskBriefs.map((brief) => (
                  <article key={brief.eyebrow} className="border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {brief.eyebrow}
                      </div>
                      <div className="text-sm text-foreground">{brief.stance}</div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {brief.summary}
                    </p>
                    <Link
                      href={brief.href}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {brief.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Desk Brief reflects published Whiteprint analysis. Not investment advice. For informational purposes only.
              </p>
            </div>
          </aside>
        ) : null}
      </section>

      <section className="border-b border-border py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
              Latest Research
            </h2>
          </div>
          <Link
            href="/macro"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All Research <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-6">
          {featuredResearch.map((post) => (
            <ResearchFeatureCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="border-b border-border py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
              Market Notes
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Short briefings for readers without a finance background.
            </p>
          </div>
          <Link
            href="/market-notes"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All Market Notes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {marketNotes.map((post) => (
            <MarketNoteCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Models Library
          </h2>
          <Link
            href="/models"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.slug}
              className="flex flex-col gap-3 border border-border p-6"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {model.category}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {model.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {model.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{model.format}</span>
                <Link
                  href="/models"
                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                >
                  Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
