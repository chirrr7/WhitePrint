import Link from 'next/link'
import { saveInProgressItemAction } from '@/lib/admin/actions'
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
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>Pipeline</p>
          <h1 className={styles.pageTitle}>In progress</h1>
          <p className={styles.pageIntro}>
            Work items the editorial desk is pushing through backlog, research,
            drafting, review, and ready-to-publish.
          </p>
        </div>
        <Link href="/admin/in-progress/new" className={styles.primaryButton}>
          + Add Item
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.infoBanner}>
        These items appear on the public homepage. Redacted titles show as blur
        blocks to readers.
      </div>

      <div className={styles.panel}>
        {items.length ? (
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.id} className={styles.pipelineRow}>
                <div style={{ display: 'grid', gap: 6 }}>
                  {item.redacted ? (
                    <span className={styles.redactedBlocks} aria-label="Redacted title">
                      <span className={styles.redactedBlock} />
                      <span className={styles.redactedBlock} style={{ width: 28 }} />
                      <span className={styles.redactedBlock} style={{ width: 38 }} />
                      <span className={styles.redactedBlock} style={{ width: 22 }} />
                    </span>
                  ) : (
                    <h3 className={styles.pipelineTitle}>{item.title}</h3>
                  )}
                  <p className={styles.listItemMeta}>
                    {item.slug} · priority {item.priority} · updated{' '}
                    {formatAdminDate(item.updatedAt)}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span className={styles.statusBadge} data-status={item.status}>
                    {item.status}
                  </span>

                  <form action={saveInProgressItemAction}>
                    <input type="hidden" name="id" value={String(item.id)} />
                    <input type="hidden" name="title" value={item.title} />
                    <input type="hidden" name="slug" value={item.slug} />
                    <input type="hidden" name="summary" value={item.summary ?? ''} />
                    <input type="hidden" name="status" value={item.status} />
                    <input
                      type="hidden"
                      name="priority"
                      value={String(item.priority ?? 0)}
                    />
                    {/* Toggle: if currently redacted, submit without value (unchecked = false);
                        if not redacted, submit redacted=true. */}
                    {item.redacted ? null : (
                      <input type="hidden" name="redacted" value="true" />
                    )}
                    <button
                      type="submit"
                      className={`${styles.redactToggle} ${
                        item.redacted ? styles.redactToggleActive : ''
                      }`}
                      aria-pressed={item.redacted}
                    >
                      {item.redacted ? 'Redacted' : 'Redact title'}
                    </button>
                  </form>

                  <Link
                    href={`/admin/in-progress/${item.id}`}
                    className={styles.secondaryButton}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>No pipeline items yet.</div>
        )}
      </div>
    </div>
  )
}
