import Link from 'next/link'
import { getDashboardData } from '@/lib/admin/data'
import { formatAdminDate } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardData()

  return (
    <div className={styles.pageStack}>
      <div className={styles.heroCard}>
        <p className={styles.eyebrow}>Overview</p>
        <h1 className={styles.pageTitle}>Editorial operations at a glance.</h1>
        <p className={styles.pageIntro}>
          Drafts, live research, archived work, active stances, work-in-progress,
          and the most recent model uploads are all visible here.
        </p>
        <div className={styles.quickLinks}>
          <Link href="/admin/posts/new" className={styles.primaryButton}>
            New post
          </Link>
          <Link href="/admin/models" className={styles.secondaryButton}>
            Upload model
          </Link>
          <Link href="/admin/homepage" className={styles.secondaryButton}>
            Tune homepage
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
      </div>

      <div className={styles.splitGrid}>
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

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>What this panel covers</h2>
              <p className={styles.panelIntro}>
                Posts have full CRUD first. The other sections are intentionally
                lightweight so the structure is stable before we add richer tools.
              </p>
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.noteCard}>
              <h3 className={styles.noteTitle}>Posts</h3>
              <p className={styles.noteBody}>
                Create, edit, archive, and delete research pieces with topic, stance,
                model, and homepage flags.
              </p>
            </div>
            <div className={styles.noteCard}>
              <h3 className={styles.noteTitle}>Homepage and settings</h3>
              <p className={styles.noteBody}>
                Store homepage sequencing and brand-level settings in Supabase so the
                public site can switch over cleanly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
