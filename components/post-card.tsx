import Link from "next/link"
import {
  formatPostDate,
  getPostCategoryHref,
  getPostCategoryLabel,
  type PostMeta,
} from "@/lib/post-meta"

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-6 border-b border-border last:border-b-0">
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
          <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:text-muted-foreground transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
