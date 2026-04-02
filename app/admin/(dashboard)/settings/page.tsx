import {
  createTopicAction,
  saveAboutSettingsAction,
  saveGeneralSettingsAction,
} from '@/lib/admin/actions'
import { getSettingsPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminSettingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function joinParagraphs(paragraphs: string[]) {
  return paragraphs.join('\n\n')
}

function joinScheduleItems(items: Array<{ day: string; topic: string }>) {
  return items.map((item) => `${item.day} | ${item.topic}`).join('\n')
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const [message, { about, general, topics }] = await Promise.all([
    readPageMessage(searchParams),
    getSettingsPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Settings</p>
          <h1 className={styles.pageTitle}>Set the brand frame and editorial voice.</h1>
          <p className={styles.pageIntro}>
            Brand settings, about-page copy, and topic taxonomy now live in one place so
            the public site can be run from admin instead of scattered code paths.
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
                Site identity, metadata framing, and the main contact controls.
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
                Create topics here so posts, models, and stances can reuse the same taxonomy.
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

      <form action={saveAboutSettingsAction} className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>About page</h2>
            <p className={styles.panelIntro}>
              Edit the editorial voice and explanatory copy shown on the public About page.
            </p>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Hero title</span>
              <input className={styles.input} type="text" name="heroTitle" defaultValue={about.heroTitle} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Schedule intro</span>
              <input className={styles.input} type="text" name="scheduleIntro" defaultValue={about.scheduleIntro} />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Intro paragraphs</span>
            <textarea
              className={styles.textareaTall}
              name="introParagraphs"
              rows={8}
              defaultValue={joinParagraphs(about.introParagraphs)}
            />
            <p className={styles.helpText}>Separate paragraphs with a blank line.</p>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Schedule items</span>
            <textarea
              className={styles.textarea}
              name="scheduleItems"
              rows={6}
              defaultValue={joinScheduleItems(about.scheduleItems)}
            />
            <p className={styles.helpText}>Use one line per item in the format `Day | Topic`.</p>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Research availability note</span>
            <input
              className={styles.input}
              type="text"
              name="researchAvailabilityNote"
              defaultValue={about.researchAvailabilityNote}
            />
          </label>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Contact intro</span>
              <input className={styles.input} type="text" name="contactIntro" defaultValue={about.contactIntro} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Response note</span>
              <input className={styles.input} type="text" name="responseNote" defaultValue={about.responseNote} />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>LinkedIn label</span>
              <input className={styles.input} type="text" name="linkedinLabel" defaultValue={about.linkedinLabel} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>LinkedIn URL</span>
              <input className={styles.input} type="url" name="linkedinUrl" defaultValue={about.linkedinUrl} />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Instagram label</span>
              <input className={styles.input} type="text" name="instagramLabel" defaultValue={about.instagramLabel} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Instagram URL</span>
              <input className={styles.input} type="url" name="instagramUrl" defaultValue={about.instagramUrl} />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>How we work</span>
            <textarea
              className={styles.textareaTall}
              name="howWeWork"
              rows={8}
              defaultValue={joinParagraphs(about.howWeWork)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>What we believe</span>
            <textarea
              className={styles.textarea}
              name="whatWeBelieve"
              rows={5}
              defaultValue={joinParagraphs(about.whatWeBelieve)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Where we are</span>
            <textarea
              className={styles.textarea}
              name="whereWeAre"
              rows={5}
              defaultValue={joinParagraphs(about.whereWeAre)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Disclaimer</span>
            <textarea
              className={styles.textareaTall}
              name="disclaimer"
              rows={8}
              defaultValue={about.disclaimer}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Copyright line</span>
            <input className={styles.input} type="text" name="copyrightLine" defaultValue={about.copyrightLine} />
          </label>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            Save About page
          </button>
        </div>
      </form>
    </div>
  )
}
