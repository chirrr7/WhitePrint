import { saveHomepageSettingsAction } from '@/lib/admin/actions'
import { getHomepagePageData } from '@/lib/admin/data'
import { readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminHomepagePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminHomepagePage({
  searchParams,
}: AdminHomepagePageProps) {
  const [message, { settings, posts, stances }] = await Promise.all([
    readPageMessage(searchParams),
    getHomepagePageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Homepage</p>
          <h1 className={styles.pageTitle}>Tune what rises to the front page.</h1>
          <p className={styles.pageIntro}>
            These settings are stored as structured JSON in the site settings table so
            the public homepage can move over gradually instead of all at once.
          </p>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.splitGrid}>
        <form action={saveHomepageSettingsAction} className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Homepage controls</h2>
              <p className={styles.panelIntro}>
                Toggle sections on and off, then set ordering with one slug per line.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="showFeatured" value="true" defaultChecked={settings.showFeatured} />
                <div>
                  <span className={styles.checkboxTitle}>Show featured lead</span>
                  <span className={styles.checkboxHint}>Display the main hero post.</span>
                </div>
              </label>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="showDeskBriefs" value="true" defaultChecked={settings.showDeskBriefs} />
                <div>
                  <span className={styles.checkboxTitle}>Show desk briefs</span>
                  <span className={styles.checkboxHint}>Keep the short secondary stack visible.</span>
                </div>
              </label>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="showLatestResearch" value="true" defaultChecked={settings.showLatestResearch} />
                <div>
                  <span className={styles.checkboxTitle}>Show latest research</span>
                  <span className={styles.checkboxHint}>Keep the research stream on the homepage.</span>
                </div>
              </label>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="showMarketNotes" value="true" defaultChecked={settings.showMarketNotes} />
                <div>
                  <span className={styles.checkboxTitle}>Show market notes</span>
                  <span className={styles.checkboxHint}>Expose short-form note coverage.</span>
                </div>
              </label>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="showStances" value="true" defaultChecked={settings.showStances} />
                <div>
                  <span className={styles.checkboxTitle}>Show stance module</span>
                  <span className={styles.checkboxHint}>Reserve space for stance summaries.</span>
                </div>
              </label>
            </div>

            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Hero label</span>
                <input className={styles.input} type="text" name="heroLabel" defaultValue={settings.heroLabel} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Featured post slug</span>
                <input
                  className={styles.input}
                  type="text"
                  name="featuredPostSlug"
                  defaultValue={settings.featuredPostSlug}
                />
              </label>
            </div>

            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Latest research limit</span>
                <input
                  className={styles.input}
                  type="number"
                  name="latestResearchLimit"
                  defaultValue={String(settings.latestResearchLimit)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Market notes limit</span>
                <input
                  className={styles.input}
                  type="number"
                  name="marketNotesLimit"
                  defaultValue={String(settings.marketNotesLimit)}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Ordered post slugs</span>
              <textarea
                className={styles.textarea}
                name="orderedPostSlugs"
                defaultValue={settings.orderedPostSlugs.join('\n')}
                rows={8}
              />
              <p className={styles.helpText}>Use one post slug per line.</p>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Ordered stance slugs</span>
              <textarea
                className={styles.textarea}
                name="orderedStanceSlugs"
                defaultValue={settings.orderedStanceSlugs.join('\n')}
                rows={8}
              />
              <p className={styles.helpText}>Use one stance slug per line.</p>
            </label>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save homepage settings
            </button>
          </div>
        </form>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Reference slugs</h2>
              <p className={styles.panelIntro}>
                Use these current database slugs to control ordering.
              </p>
            </div>
          </div>

          <div className={styles.noteCard}>
            <h3 className={styles.noteTitle}>Posts</h3>
            {posts.length ? (
              <ul className={styles.referenceList}>
                {posts.map((post) => (
                  <li key={post.id} className={styles.referenceItem}>
                    <span>{post.title}</span>
                    <span className={styles.mono}>{post.slug}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>No posts saved yet.</div>
            )}
          </div>

          <div className={styles.noteCard}>
            <h3 className={styles.noteTitle}>Stances</h3>
            {stances.length ? (
              <ul className={styles.referenceList}>
                {stances.map((stance) => (
                  <li key={stance.id} className={styles.referenceItem}>
                    <span>{stance.title}</span>
                    <span className={styles.mono}>{stance.slug}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>No stances saved yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
