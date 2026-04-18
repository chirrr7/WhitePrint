import Link from "next/link"
import {
  formatPostDate,
  getPostCategoryHref,
  getPostCategoryLabel,
  type PostMeta,
} from "@/lib/post-meta"
import { sectionAccent, tokens } from "@/lib/tokens"

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article
      className="group py-6 border-b border-border last:border-b-0"
      style={{ '--accent': sectionAccent[post.category] ?? tokens.accent } as React.CSSProperties}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Link
            href={getPostCategoryHref(post.category)}
            className="uppercase tracking-widest font-medium hover:text-foreground transition-colors"
          >
            {getPostCategoryLabel(post.category)}
          </Link>
          <span aria-hidden="true">{'/'}</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">{'/'}</span>
          <span>{post.readTime} min read</span>
        </div>
        <Link href={`/posts/${post.slug}`} className="block">
          {post.displayTitle ? (
            <h3
              className="font-serif text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-muted-foreground [&_em]:text-accent [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: post.displayTitle }}
            />
          ) : (
            <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:text-muted-foreground transition-colors">
              {post.title}
            </h3>
          )}
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {post.excerpt}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {post.reportDownload ? (
            <a
              href={post.reportDownload.href}
              download={post.reportDownload.filename}
              className="text-xs uppercase tracking-[0.18em] text-accent hover:text-foreground transition-colors"
            >
              {post.reportDownload.label ?? "Model"}
            </a>
          ) : null}
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {formatTagLabel(tag)}
            </Link>
          ))}
        </div>
      </div>
    </article>
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
