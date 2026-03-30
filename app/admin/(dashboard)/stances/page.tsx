import { createStanceAction } from '@/lib/admin/actions'
import { getStancesPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminStancesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminStancesPage({ searchParams }: AdminStancesPageProps) {
  const [message, { stances, topics }] = await Promise.all([
    readPageMessage(searchParams),
    getStancesPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Stances</p>
          <h1 className={styles.pageTitle}>Track active convictions.</h1>
          <p className={styles.pageIntro}>
            This page stays intentionally simple for now: clean inputs for stance
            objects plus a database-backed ledger of current entries.
          </p>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.splitGrid}>
        <form action={createStanceAction} className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>New stance</h2>
              <p className={styles.panelIntro}>
                Save stance records separately from posts so they can power future
                dashboards, tickers, and summaries.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Title</span>
                <input className={styles.input} type="text" name="title" required />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Slug</span>
                <input className={styles.input} type="text" name="slug" />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Summary</span>
              <textarea className={styles.textarea} name="summary" rows={4} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Body</span>
              <textarea className={styles.textareaTall} name="body" rows={10} />
            </label>

            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Status</span>
                <select className={styles.select} name="status" defaultValue="draft">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Topic</span>
                <select className={styles.select} name="topic_id" defaultValue="">
                  <option value="">No topic yet</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={String(topic.id)}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Published at</span>
              <input className={styles.input} type="datetime-local" name="published_at" />
            </label>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save stance
            </button>
          </div>
        </form>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Saved stances</h2>
              <p className={styles.panelIntro}>Current stance records in Postgres.</p>
            </div>
          </div>
          {stances.length ? (
            <div className={styles.list}>
              {stances.map((stance) => (
                <div key={stance.id} className={styles.listItem}>
                  <div>
                    <p className={styles.listItemTitle}>{stance.title}</p>
                    <p className={styles.listItemMeta}>
                      {stance.summary || stance.slug}
                    </p>
                    <p className={styles.listItemMeta}>
                      Topic: {stance.topicLabel ?? 'None'}
                    </p>
                  </div>
                  <div className={styles.stackedMeta}>
                    <span className={styles.statusBadge} data-status={stance.status}>
                      {stance.status}
                    </span>
                    <span className={styles.mono}>{formatAdminDate(stance.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No stances saved yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
