import { createInProgressItemAction } from '@/lib/admin/actions'
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
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.splitGrid}>
        <form action={createInProgressItemAction} className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>New work item</h2>
              <p className={styles.panelIntro}>
                Capture what is being researched right now without forcing it into the
                posts table too early.
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

            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Status</span>
                <select className={styles.select} name="status" defaultValue="active">
                  <option value="backlog">Backlog</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Priority</span>
                <input className={styles.input} type="number" name="priority" defaultValue="0" />
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
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save work item
            </button>
          </div>
        </form>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Pipeline ledger</h2>
              <p className={styles.panelIntro}>What the team is working through now.</p>
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No in-progress items saved yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
