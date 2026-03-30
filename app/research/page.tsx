import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { SEO_CONFIG } from "@/lib/seo.config"
import s from "./page.module.css"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Research",
  description: "Published Whiteprint research across equity, macro, and market notes.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/research`,
  },
}

export default async function ResearchIndexPage() {
  const posts = await getAllPosts()

  return (
    <div className={s.page}>
      <section className={s.hero}>
        <div className={s.wrap}>
          <div className={s.eyebrow}>Whiteprint Research</div>
          <h1 className={s.title}>All published research.</h1>
          <p className={s.sub}>
            Equity, macro, and market notes in one archive. Independent work, no house view, no
            affiliation.
          </p>
        </div>
      </section>

      <section className={s.listing}>
        <div className={s.wrap}>
          <div className={s.header}>
            <span className={s.label}>Research Archive</span>
            <div className={s.rule} />
            <span className={s.count}>{posts.length} notes</span>
          </div>

          <div className={s.cards}>
            {posts.map((post) => (
              <article key={post.slug} className={`${s.card} fade-in-up`}>
                <div>
                  <div className={s.cardKicker}>
                    <span className={`${s.pill} ${s.pillDark}`}>{post.topicLabel ?? post.category}</span>
                    {post.tags[0] ? <span className={`${s.pill} ${s.pillTag}`}>{humanize(post.tags[0])}</span> : null}
                    <span className={s.date}>{formatDateLabel(post.date)}</span>
                  </div>

                  <h2 className={s.cardTitle}>{post.displayTitle ?? post.title}</h2>
                  <p className={s.cardDeck}>{post.excerpt}</p>
                </div>

                <div className={s.cardAside}>
                  <div className={s.meta}>{post.readTime} min read</div>
                  <Link href={`/posts/${post.slug}`} className={s.cta}>
                    Read Full Note →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function formatDateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function humanize(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}
