import Link from 'next/link'
import {
  importFilesystemPostAction,
  runLegacyMigrationTestAction,
  syncFilesystemArchiveAction,
} from '@/lib/admin/actions'
import { getPostsPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminPostsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const [message, { filesystemBacklog, posts }] = await Promise.all([
    readPageMessage(searchParams),
    getPostsPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Posts</p>
          <h1 className={styles.pageTitle}>Manage the editorial archive.</h1>
          <p className={styles.pageIntro}>
            Database-backed posts are fully editable here. Filesystem posts now show up
            as a migration backlog so we can bring the whole archive under admin control.
          </p>
        </div>
        <div className={styles.buttonRow}>
          <form action={syncFilesystemArchiveAction}>
            <button type="submit" className={styles.secondaryButton}>
              Sync live archive
            </button>
          </form>
          <Link href="/admin/posts/new" className={styles.primaryButton}>
            New post
          </Link>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Filesystem backlog</h2>
            <p className={styles.panelIntro}>
              These posts still exist as repository files and are not yet fully managed
              through admin. The full archive sync preserves frontmatter, creates or
              updates stance records when metadata exists, and suppresses the old
              filesystem fallback.
            </p>
          </div>
          {filesystemBacklog.length ? (
            <form action={syncFilesystemArchiveAction}>
              <button type="submit" className={styles.primaryButton}>
                Sync all filesystem posts
              </button>
            </form>
          ) : null}
        </div>

        {filesystemBacklog.length ? (
          <div className={styles.list}>
            {filesystemBacklog.map((post) => (
              <div key={post.slug} className={styles.listItem}>
                <div>
                  <p className={styles.listItemTitle}>{post.title}</p>
                  <p className={styles.listItemMeta}>
                    {post.category} / {post.date} / {post.slug}
                  </p>
                  <p className={styles.listItemMeta}>{post.excerpt}</p>
                </div>
                <form action={importFilesystemPostAction}>
                  <input type="hidden" name="slug" value={post.slug} />
                  <button type="submit" className={styles.secondaryButton}>
                    Import to admin
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            No filesystem-only posts left. The live archive is fully flowing through admin.
          </div>
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Whiteprint migration test</h2>
            <p className={styles.panelIntro}>
              Import the live Oracle, EOG, and Eight Body Problem articles into Supabase,
              then suppress the old filesystem archive so the public site is forced to read
              those migrated versions.
            </p>
          </div>
          <form action={runLegacyMigrationTestAction}>
            <button type="submit" className={styles.primaryButton}>
              Run migration test
            </button>
          </form>
        </div>

        <div className={styles.referenceList}>
          <div className={styles.referenceItem}>
            <span>Oracle</span>
            <span className={styles.mono}>oracle-software-margins-infrastructure-capex</span>
          </div>
          <div className={styles.referenceItem}>
            <span>EOG Resources</span>
            <span className={styles.mono}>eog-resources-the-base-case-is-priced-in</span>
          </div>
          <div className={styles.referenceItem}>
            <span>Eight Body Problem</span>
            <span className={styles.mono}>the-eight-body-problem</span>
          </div>
        </div>
      </div>

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
