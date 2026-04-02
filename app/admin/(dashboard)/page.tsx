import Link from 'next/link'
import { getDashboardData } from '@/lib/admin/data'
import { formatAdminDate } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardData()
  const filesystemBacklog = dashboard.editorialHealth.unmanagedFilesystemPosts

  return (
    <div className={styles.pageStack}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>Overview</p>
        <h1 className={styles.pageTitle}>Editorial control room.</h1>
        <p className={styles.pageIntro}>
          Posts, coverage, pipeline items, homepage sequencing, and brand copy now
          run through the same admin system. This view is tuned for the redesign push:
          it shows what is managed cleanly and what still needs migration attention.
        </p>
        <div className={styles.quickLinks}>
          <Link href="/admin/posts/new" className={styles.primaryButton}>
            New post
          </Link>
          <Link href="/admin/stances/new" className={styles.secondaryButton}>
            New coverage
          </Link>
          <Link href="/admin/in-progress/new" className={styles.secondaryButton}>
            New work item
          </Link>
          <Link href="/admin/models" className={styles.secondaryButton}>
            Upload model
          </Link>
          <Link href="/admin/settings" className={styles.secondaryButton}>
            Edit site copy
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Draft posts</p>
          <p className={styles.statValue}>{dashboard.counts.drafts}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Published posts</p>
          <p className={styles.statValue}>{dashboard.counts.published}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Archived posts</p>
          <p className={styles.statValue}>{dashboard.counts.archived}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Stances</p>
          <p className={styles.statValue}>{dashboard.counts.stances}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>In progress</p>
          <p className={styles.statValue}>{dashboard.counts.inProgress}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Filesystem backlog</p>
          <p className={styles.statValue}>{filesystemBacklog.length}</p>
        </div>
      </div>

      <div className={styles.splitGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Launch readiness</h2>
              <p className={styles.panelIntro}>
                The redesign is safest when every public editorial surface flows through
                admin. This is the remaining migration and publishing checklist.
              </p>
            </div>
          </div>

          <div className={styles.list}>
            <div className={styles.noteCard}>
              <h3 className={styles.noteTitle}>Admin-managed now</h3>
              <p className={styles.noteBody}>
                Posts, coverage records, homepage settings, the public pipeline docket,
                and About page copy are all editable from admin.
              </p>
            </div>
            <div className={styles.noteCard}>
              <h3 className={styles.noteTitle}>Still to migrate</h3>
              <p className={styles.noteBody}>
                {filesystemBacklog.length
                  ? `${filesystemBacklog.length} filesystem post${filesystemBacklog.length === 1 ? '' : 's'} still need to be imported into admin.`
                  : 'No filesystem-only posts remain. The current public archive is on the shared publishing path.'}
              </p>
              <div className={styles.buttonRow}>
                <Link href="/admin/posts" className={styles.secondaryButton}>
                  Review posts backlog
                </Link>
                <Link href="/admin/homepage" className={styles.secondaryButton}>
                  Review homepage
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Latest model uploads</h2>
              <p className={styles.panelIntro}>
                Recent files in Supabase Storage, mirrored into the models table.
              </p>
            </div>
          </div>

          {dashboard.latestModels.length ? (
            <div className={styles.list}>
              {dashboard.latestModels.map((model) => (
                <div key={model.id} className={styles.listItem}>
                  <div>
                    <p className={styles.listItemTitle}>{model.title}</p>
                    <p className={styles.listItemMeta}>Version {model.version}</p>
                  </div>
                  <div className={styles.stackedMeta}>
                    <span className={styles.statusBadge} data-status="published">
                      Uploaded
                    </span>
                    <span className={styles.mono}>{formatAdminDate(model.uploadedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No model uploads yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
