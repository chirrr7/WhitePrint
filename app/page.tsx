import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { getAllModels } from "@/lib/models"
import { PostCard } from "@/components/post-card"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5)
  const models = getAllModels().slice(0, 3)

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
          Whiteprint
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
          Independent Macro & Equity Research
        </p>
        <p className="mt-6 text-sm text-muted-foreground max-w-lg leading-relaxed">
          Rigorous analysis of macroeconomic trends, company valuations, and
          market structure. No conflicts, no hype -- just research.
        </p>
      </section>

      {/* Latest Research */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Latest Research
          </h2>
          <Link
            href="/macro"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Models Library */}
      <section className="py-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Models Library
          </h2>
          <Link
            href="/models"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.slug}
              className="border border-border p-6 flex flex-col gap-3"
            >
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                {model.category}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {model.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {model.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {model.format}
                </span>
                <Link
                  href="/models"
                  className="text-sm text-foreground font-medium hover:text-muted-foreground transition-colors flex items-center gap-1"
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
