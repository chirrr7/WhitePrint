import { PostCard } from "@/components/post-card"
import type { PostMeta } from "@/lib/posts"

interface CategoryPageProps {
  title: string
  description: string
  posts: PostMeta[]
}

export function CategoryPage({ title, description, posts }: CategoryPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg leading-relaxed">
          {description}
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12 text-center">
          No posts yet. Check back soon.
        </p>
      )}
    </div>
  )
}
