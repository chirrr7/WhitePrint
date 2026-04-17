import Link from 'next/link'
import { getInProgressPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminInProgressPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminInProgressPage({
  searchParams,
}: AdminInProgressPageProps) {
  const [message, { items }] = await Promise.all([
    readPageMessage(searchParams),
    getInProgressPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>In progress</p>
          <h1 className={styles.pageTitle}>Keep the pipeline visible.</h1>
          <p className={styles.pageIntro}>
            Backlog, active pieces, blocked work, and finished-but-not-yet-published
            items can all live here.
          </p>
        </div>
        <Link href="/admin/in-progress/new" className={styles.primaryButton}>
          New work item
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Pipeline ledger</h2>
              <p className={styles.panelIntro}>
                What the team is working through now, and what readers may see on the
                homepage docket.
              </p>
            </div>
          </div>
          {items.length ? (
            <div className={styles.list}>
              {items.map((item) => (
                <div key={item.id} className={styles.listItem}>
                  <div>
                    <p className={styles.listItemTitle}>{item.title}</p>
                    <p className={styles.listItemMeta}>{item.summary || item.slug}</p>
                    <p className={styles.listItemMeta}>Priority: {item.priority}</p>
                  </div>
                  <div className={styles.stackedMeta}>
                    <span className={styles.statusBadge} data-status={item.status}>
                      {item.status}
                    </span>
                    <span className={styles.mono}>{formatAdminDate(item.updatedAt)}</span>
                    <Link href={`/admin/in-progress/${item.id}`} className={styles.secondaryButton}>
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No in-progress items saved yet.</div>
          )}
      </div>
    </div>
  )
}
