import Link from 'next/link'
import { getPostsPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminPostsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const [message, { posts }] = await Promise.all([
    readPageMessage(searchParams),
    getPostsPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Posts</p>
          <h1 className={styles.pageTitle}>Manage the research archive.</h1>
          <p className={styles.pageIntro}>
            This is the first fully CRUD-managed area. Everything else in the admin
            is designed around this post model.
          </p>
        </div>
        <Link href="/admin/posts/new" className={styles.primaryButton}>
          New post
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Connections</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <p className={styles.tableTitle}>{post.title}</p>
                    <p className={styles.tableSubtitle}>{post.slug}</p>
                  </td>
                  <td>
                    <span className={styles.statusBadge} data-status={post.status}>
                      {post.status}
                    </span>
                    <p className={styles.tableSubtitle}>
                      {post.featured ? 'Featured' : 'Standard'}
                      {post.homepage ? ' / Homepage' : ''}
                    </p>
                  </td>
                  <td>
                    <p className={styles.tableSubtitle}>
                      Topic: {post.topicLabel ?? 'None'}
                    </p>
                    <p className={styles.tableSubtitle}>
                      Stance: {post.stanceLabel ?? 'None'}
                    </p>
                    <p className={styles.tableSubtitle}>
                      Model: {post.linkedModelLabel ?? 'None'}
                    </p>
                  </td>
                  <td>
                    <p className={styles.tableTitle}>{formatAdminDate(post.updatedAt)}</p>
                    <p className={styles.tableSubtitle}>
                      Published: {formatAdminDate(post.publishedAt)}
                    </p>
                  </td>
                  <td>
                    <Link href={`/admin/posts/${post.id}`} className={styles.secondaryButton}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!posts.length ? (
          <div className={styles.emptyState}>No posts in the database yet.</div>
        ) : null}
      </div>
    </div>
  )
}
