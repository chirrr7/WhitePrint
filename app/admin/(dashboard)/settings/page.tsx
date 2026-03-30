import { createTopicAction, saveGeneralSettingsAction } from '@/lib/admin/actions'
import { getSettingsPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminSettingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const [message, { general, topics }] = await Promise.all([
    readPageMessage(searchParams),
    getSettingsPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Settings</p>
          <h1 className={styles.pageTitle}>Set the brand frame and taxonomy.</h1>
          <p className={styles.pageIntro}>
            General site settings live in one JSON record. Topics stay relational so
            posts, stances, and models can all point at the same taxonomy.
          </p>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.splitGrid}>
        <form action={saveGeneralSettingsAction} className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>General settings</h2>
              <p className={styles.panelIntro}>
                Site identity, brand line, and contact framing.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>Site title</span>
              <input className={styles.input} type="text" name="siteTitle" defaultValue={general.siteTitle} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Site description</span>
              <textarea
                className={styles.textarea}
                name="siteDescription"
                rows={4}
                defaultValue={general.siteDescription}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Brand tagline</span>
              <input className={styles.input} type="text" name="brandTagline" defaultValue={general.brandTagline} />
            </label>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Contact email</span>
                <input className={styles.input} type="email" name="contactEmail" defaultValue={general.contactEmail} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Navigation CTA label</span>
                <input className={styles.input} type="text" name="navCtaLabel" defaultValue={general.navCtaLabel} />
              </label>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save general settings
            </button>
          </div>
        </form>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Topics</h2>
              <p className={styles.panelIntro}>
                Create topics here so posts, models, and stances can reuse them.
              </p>
            </div>
          </div>

          <form action={createTopicAction} className={styles.formGrid}>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Name</span>
                <input className={styles.input} type="text" name="name" required />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Slug</span>
                <input className={styles.input} type="text" name="slug" />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.label}>Description</span>
              <textarea className={styles.textarea} name="description" rows={4} />
            </label>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Sort order</span>
                <input className={styles.input} type="number" name="sort_order" defaultValue="0" />
              </label>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="is_visible" value="true" defaultChecked />
                <div>
                  <span className={styles.checkboxTitle}>Visible to public readers</span>
                  <span className={styles.checkboxHint}>
                    Public topic reads are allowed only for visible topics.
                  </span>
                </div>
              </label>
            </div>
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.secondaryButton}>
                Save topic
              </button>
            </div>
          </form>

          <div className={styles.list} style={{ marginTop: '1rem' }}>
            {topics.length ? (
              topics.map((topic) => (
                <div key={topic.id} className={styles.listItem}>
                  <div>
                    <p className={styles.listItemTitle}>{topic.name}</p>
                    <p className={styles.listItemMeta}>
                      {topic.slug}
                      {topic.description ? ` / ${topic.description}` : ''}
                    </p>
                  </div>
                  <div className={styles.stackedMeta}>
                    <span className={styles.statusBadge} data-status={topic.is_visible ? 'published' : 'archived'}>
                      {topic.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className={styles.mono}>{formatAdminDate(topic.updated_at)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No topics yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
