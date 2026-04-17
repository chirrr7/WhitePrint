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
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>Settings</p>
          <h1 className={styles.pageTitle}>Site configuration</h1>
          <p className={styles.pageIntro}>
            Site identity, public copy, taxonomy, and admin access controls.
          </p>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      {/* --- Site Identity --- */}
      <form action={saveGeneralSettingsAction} className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Site identity</h2>
            <p className={styles.panelIntro}>
              Title, description, and brand framing used across metadata and the navbar.
            </p>
          </div>
        </div>

        <div className={styles.panelPadded}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>Site title</span>
              <input
                className={styles.input}
                type="text"
                name="siteTitle"
                defaultValue={general.siteTitle}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Site description</span>
              <textarea
                className={styles.textarea}
                name="siteDescription"
                rows={3}
                defaultValue={general.siteDescription}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Brand tagline</span>
              <input
                className={styles.input}
                type="text"
                name="brandTagline"
                defaultValue={general.brandTagline}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Nav CTA label</span>
              <input
                className={styles.input}
                type="text"
                name="navCtaLabel"
                defaultValue={general.navCtaLabel}
              />
            </label>

            <div className={styles.field}>
              <span className={styles.label}>Accent color</span>
              <div className={styles.accentSwatches}>
                {['#b83025', '#8a6c3a', '#2d6ab8', '#2d7a4f'].map((color) => (
                  <span
                    key={color}
                    className={styles.accentSwatch}
                    style={{ background: color }}
                    title={color}
                  />
                ))}
              </div>
              <p className={styles.fieldHint}>
                Current accent is locked to the Whiteprint red. Swatch picker is
                reserved for future theming.
              </p>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save identity
            </button>
          </div>
        </div>
      </form>

      {/* --- Contact & Social --- */}
      <form action={saveAboutSettingsAction} className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Contact & social</h2>
            <p className={styles.panelIntro}>
              Contact email, response expectations, and external profile links.
            </p>
          </div>
        </div>

        <div className={styles.panelPadded}>
          <div className={styles.formGrid}>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Contact intro</span>
                <input
                  className={styles.input}
                  type="text"
                  name="contactIntro"
                  defaultValue={about.contactIntro}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Response note</span>
                <input
                  className={styles.input}
                  type="text"
                  name="responseNote"
                  defaultValue={about.responseNote}
                />
              </label>
            </div>

            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>LinkedIn label</span>
                <input
                  className={styles.input}
                  type="text"
                  name="linkedinLabel"
                  defaultValue={about.linkedinLabel}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>LinkedIn URL</span>
                <input
                  className={styles.input}
                  type="url"
                  name="linkedinUrl"
                  defaultValue={about.linkedinUrl}
                />
              </label>
            </div>

            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Instagram label</span>
                <input
                  className={styles.input}
                  type="text"
                  name="instagramLabel"
                  defaultValue={about.instagramLabel}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Instagram URL</span>
                <input
                  className={styles.input}
                  type="url"
                  name="instagramUrl"
                  defaultValue={about.instagramUrl}
                />
              </label>
            </div>

            {/* Hidden fields so the About action preserves all existing values. */}
            <input type="hidden" name="heroTitle" value={about.heroTitle} />
            <input type="hidden" name="scheduleIntro" value={about.scheduleIntro} />
            <input
              type="hidden"
              name="introParagraphs"
              value={joinParagraphs(about.introParagraphs)}
            />
            <input
              type="hidden"
              name="scheduleItems"
              value={joinScheduleItems(about.scheduleItems)}
            />
            <input
              type="hidden"
              name="researchAvailabilityNote"
              value={about.researchAvailabilityNote}
            />
            <input type="hidden" name="howWeWork" value={joinParagraphs(about.howWeWork)} />
            <input
              type="hidden"
              name="whatWeBelieve"
              value={joinParagraphs(about.whatWeBelieve)}
            />
            <input type="hidden" name="whereWeAre" value={joinParagraphs(about.whereWeAre)} />
            <input type="hidden" name="disclaimer" value={about.disclaimer} />
            <input type="hidden" name="copyrightLine" value={about.copyrightLine} />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save contact
            </button>
          </div>
        </div>
      </form>

      {/* --- Admin Access --- */}
      <form action={saveGeneralSettingsAction} className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Admin access</h2>
            <p className={styles.panelIntro}>
              Primary contact address surfaced across admin and public site footers.
            </p>
          </div>
        </div>

        <div className={styles.panelPadded}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>Contact email</span>
              <input
                className={styles.input}
                type="email"
                name="contactEmail"
                defaultValue={general.contactEmail}
              />
            </label>

            {/* Preserve other general-settings values untouched */}
            <input type="hidden" name="siteTitle" value={general.siteTitle} />
            <input type="hidden" name="siteDescription" value={general.siteDescription} />
            <input type="hidden" name="brandTagline" value={general.brandTagline} />
            <input type="hidden" name="navCtaLabel" value={general.navCtaLabel} />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save admin access
            </button>
          </div>
        </div>
      </form>

      {/* --- Topics --- */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Topics</h2>
            <p className={styles.panelIntro}>
              Shared taxonomy for posts, models, and stances.
            </p>
          </div>
        </div>

        <div className={styles.panelPadded}>
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
              <textarea className={styles.textarea} name="description" rows={3} />
            </label>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Sort order</span>
                <input
                  className={styles.input}
                  type="number"
                  name="sort_order"
                  defaultValue="0"
                />
              </label>
              <label className={styles.checkboxCard}>
                <input type="checkbox" name="is_visible" value="true" defaultChecked />
                <div>
                  <span className={styles.checkboxTitle}>Visible to readers</span>
                  <span className={styles.checkboxHint}>
                    Only visible topics are readable on the public site.
                  </span>
                </div>
              </label>
            </div>
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.secondaryButton}>
                Add topic
              </button>
            </div>
          </form>
        </div>

        <div className={styles.list}>
          {topics.length ? (
            topics.map((topic) => (
              <div key={topic.id} className={styles.listItem}>
                <div className={styles.listItemHead}>
                  <p className={styles.listItemTitle}>{topic.name}</p>
                  <span
                    className={styles.statusBadge}
                    data-status={topic.is_visible ? 'published' : 'archived'}
                  >
                    {topic.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className={styles.listItemMeta}>
                  {topic.slug}
                  {topic.description ? ` · ${topic.description}` : ''} · updated{' '}
                  {formatAdminDate(topic.updated_at)}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No topics yet.</div>
          )}
        </div>
      </div>

      {/* --- About page long-form (retained from original) --- */}
      <form action={saveAboutSettingsAction} className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>About page copy</h2>
            <p className={styles.panelIntro}>
              Public About page content: hero, schedule, process, and disclaimer.
            </p>
          </div>
        </div>

        <div className={styles.panelPadded}>
          <div className={styles.formGrid}>
            <div className={styles.formGridTwo}>
              <label className={styles.field}>
                <span className={styles.label}>Hero title</span>
                <input
                  className={styles.input}
                  type="text"
                  name="heroTitle"
                  defaultValue={about.heroTitle}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Schedule intro</span>
                <input
                  className={styles.input}
                  type="text"
                  name="scheduleIntro"
                  defaultValue={about.scheduleIntro}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Intro paragraphs</span>
              <textarea
                className={styles.textareaTall}
                name="introParagraphs"
                rows={6}
                defaultValue={joinParagraphs(about.introParagraphs)}
              />
              <p className={styles.helpText}>Separate paragraphs with a blank line.</p>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Schedule items</span>
              <textarea
                className={styles.textarea}
                name="scheduleItems"
                rows={5}
                defaultValue={joinScheduleItems(about.scheduleItems)}
              />
              <p className={styles.helpText}>One per line: `Day | Topic`.</p>
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

            <label className={styles.field}>
              <span className={styles.label}>How we work</span>
              <textarea
                className={styles.textareaTall}
                name="howWeWork"
                rows={6}
                defaultValue={joinParagraphs(about.howWeWork)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>What we believe</span>
              <textarea
                className={styles.textarea}
                name="whatWeBelieve"
                rows={4}
                defaultValue={joinParagraphs(about.whatWeBelieve)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Where we are</span>
              <textarea
                className={styles.textarea}
                name="whereWeAre"
                rows={4}
                defaultValue={joinParagraphs(about.whereWeAre)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Disclaimer</span>
              <textarea
                className={styles.textareaTall}
                name="disclaimer"
                rows={6}
                defaultValue={about.disclaimer}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Copyright line</span>
              <input
                className={styles.input}
                type="text"
                name="copyrightLine"
                defaultValue={about.copyrightLine}
              />
            </label>

            {/* Preserve contact/social fields so this save does not clear them */}
            <input type="hidden" name="contactIntro" value={about.contactIntro} />
            <input type="hidden" name="responseNote" value={about.responseNote} />
            <input type="hidden" name="linkedinLabel" value={about.linkedinLabel} />
            <input type="hidden" name="linkedinUrl" value={about.linkedinUrl} />
            <input type="hidden" name="instagramLabel" value={about.instagramLabel} />
            <input type="hidden" name="instagramUrl" value={about.instagramUrl} />
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Save about page
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
