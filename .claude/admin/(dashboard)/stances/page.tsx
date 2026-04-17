import Link from 'next/link'
import { getStancesPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminStancesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function formatCategoryLabel(value: string) {
  switch (value) {
    case 'macro':
      return 'Macro'
    case 'market-notes':
      return 'Market Notes'
    default:
      return 'Equity Research'
  }
}

export default async function AdminStancesPage({ searchParams }: AdminStancesPageProps) {
  const [message, { stances }] = await Promise.all([
    readPageMessage(searchParams),
    getStancesPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Coverage</p>
          <h1 className={styles.pageTitle}>Manage public stance records.</h1>
          <p className={styles.pageIntro}>
            Coverage records now power the public coverage page, homepage ticker, and
            stance strip directly. Posts can link back into them, but the coverage view
            is no longer derived from post frontmatter.
          </p>
        </div>
        <Link href="/admin/stances/new" className={styles.primaryButton}>
          New coverage record
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
            <h2 className={styles.panelTitle}>Saved coverage</h2>
            <p className={styles.panelIntro}>
              These are the database-backed records driving the public coverage experience.
            </p>
          </div>
        </div>

        {stances.length ? (
          <div className={styles.list}>
            {stances.map((stance) => (
              <div key={stance.id} className={styles.listItem}>
                <div>
                  <p className={styles.listItemTitle}>
                    {stance.ticker || 'TBD'} · {stance.name || stance.title}
                  </p>
                  <p className={styles.listItemMeta}>
                    {formatCategoryLabel(stance.coverageCategory)} · {stance.opinion} ·{' '}
                    {stance.conviction} · {stance.coverageStatus}
                  </p>
                  <p className={styles.listItemMeta}>
                    {stance.thesis || stance.summary || stance.slug}
                  </p>
                  <p className={styles.listItemMeta}>
                    Tags: {stance.tags.length ? stance.tags.join(', ') : 'No tags yet'}
                  </p>
                  <p className={styles.listItemMeta}>
                    Linked posts:{' '}
                    {stance.linkedPostLabels.length
                      ? stance.linkedPostLabels.join(', ')
                      : 'No posts linked yet'}
                  </p>
                </div>
                <div className={styles.stackedMeta}>
                  <span className={styles.statusBadge} data-status={stance.status}>
                    {stance.status}
                  </span>
                  <span className={styles.mono}>{formatAdminDate(stance.updatedAt)}</span>
                  <Link href={`/admin/stances/${stance.id}`} className={styles.secondaryButton}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>No coverage records saved yet.</div>
        )}
      </div>
    </div>
  )
}
