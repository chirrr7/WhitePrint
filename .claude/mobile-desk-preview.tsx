"use client"

import Link from "next/link"
import { useState, type KeyboardEvent } from "react"
import { withMobilePreviewHref } from "@/lib/mobile-preview"
import { formatPostDate, getPostCategoryLabel, type PostMeta } from "@/lib/post-meta"
import s from "./mobile-desk-preview.module.css"

interface MobileDeskPreviewProps {
  forceMobilePreview?: boolean
  posts: PostMeta[]
}

export function MobileDeskPreview({
  forceMobilePreview = false,
  posts,
}: MobileDeskPreviewProps) {
  const [selectedPost, setSelectedPost] = useState<PostMeta | null>(null)

  if (!posts.length) {
    return null
  }

  const visiblePosts = posts.slice(0, 5)

  return (
    <>
      <div className={s.list}>
        {visiblePosts.map((post) => (
          <button
            key={post.slug}
            type="button"
            className={s.item}
            onClick={() => setSelectedPost(post)}
          >
            <span className={s.eyebrow}>
              {post.eyebrow ?? post.tags[0] ?? getPostCategoryLabel(post.category)}
            </span>
            <h3 className={s.title}>{post.title}</h3>
            <span className={s.meta}>
              <span>{formatPostDate(post.date)}</span>
              <span>{post.readTime} min</span>
            </span>
          </button>
        ))}
      </div>

      {selectedPost ? (
        <div
          className={s.sheetOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${selectedPost.title}`}
          onClick={() => setSelectedPost(null)}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Escape") {
              setSelectedPost(null)
            }
          }}
        >
          <div className={s.sheet} onClick={(event) => event.stopPropagation()}>
            <div className={s.sheetHeader}>
              <span className={s.sheetLabel}>Research Desk Preview</span>
              <h3 className={s.sheetTitle}>{selectedPost.title}</h3>
              <div className={s.sheetMeta}>
                <span className={s.meta}>{getPostCategoryLabel(selectedPost.category)}</span>
                <span className={s.meta}>{formatPostDate(selectedPost.date)}</span>
                <span className={s.meta}>{selectedPost.readTime} min</span>
              </div>
            </div>

            <p className={s.sheetExcerpt}>{selectedPost.excerpt}</p>

            {selectedPost.tags.length > 0 ? (
              <div className={s.topicRow}>
                {selectedPost.tags.slice(0, 4).map((tag) => (
                  <span key={`${selectedPost.slug}-${tag}`} className={s.topic}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className={s.actions}>
              <Link
                href={withMobilePreviewHref(`/posts/${selectedPost.slug}`, forceMobilePreview)}
                className={s.primary}
              >
                Read more
              </Link>
              <button
                type="button"
                className={s.secondary}
                onClick={() => setSelectedPost(null)}
              >
                Close preview
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
