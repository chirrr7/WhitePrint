import Link from 'next/link'
import { deleteStanceAction, saveStanceAction } from '@/lib/admin/actions'
import type { StanceEditorData } from '@/lib/admin/data'
import type { PageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface StanceFormProps {
  linkedPosts: StanceEditorData['linkedPosts']
  message: PageMessage | null
  mode: 'create' | 'edit'
  stance: StanceEditorData['stance']
  topics: StanceEditorData['topics']
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString().slice(0, 16)
}

export function StanceForm({ linkedPosts, message, mode, stance, topics }: StanceFormProps) {
  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Coverage</p>
          <h1 className={styles.pageTitle}>
            {mode === 'create' ? 'New coverage record' : 'Edit coverage record'}
          </h1>
          <p className={styles.pageIntro}>
            These fields now drive the public coverage page, ticker, and home stance
            strip directly. Link posts to a coverage record from the post editor.
          </p>
        </div>
        <Link href="/admin/stances" className={styles.secondaryButton}>
          Back to coverage
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <form action={saveStanceAction} className={styles.panel}>
        {stance ? <input type="hidden" name="id" value={String(stance.id)} /> : null}

        <div className={styles.formGrid}>
          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Internal title</span>
              <p className={styles.fieldHint}>
                Use the article title or a clear coverage label. This stays internal-facing.
              </p>
              <input
                className={styles.input}
                type="text"
                name="title"
                defaultValue={stance?.title ?? ''}
                placeholder="Oracle coverage record"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Slug</span>
              <p className={styles.fieldHint}>
                Keep this aligned with the related post slug when possible.
              </p>
              <input
                className={styles.input}
                type="text"
                name="slug"
                defaultValue={stance?.slug ?? ''}
                placeholder="oracle-coverage"
              />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Ticker</span>
              <p className={styles.fieldHint}>
                Required for public coverage cards and ticker displays.
              </p>
              <input
                className={styles.input}
                type="text"
                name="ticker"
                defaultValue={stance?.ticker ?? ''}
                placeholder="ORCL"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Display name</span>
              <p className={styles.fieldHint}>
                This is the reader-facing name used across coverage surfaces.
              </p>
              <input
                className={styles.input}
                type="text"
                name="name"
                defaultValue={stance?.name ?? ''}
                placeholder="Oracle"
                required
              />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Publication status</span>
              <select
                className={styles.select}
                name="status"
                defaultValue={stance?.status ?? 'draft'}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Published at</span>
              <input
                className={styles.input}
                type="datetime-local"
                name="published_at"
                defaultValue={toDateTimeLocal(stance?.published_at)}
              />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Coverage category</span>
              <p className={styles.fieldHint}>
                Determines whether the coverage sits under Macro, Equity, or Market Notes.
              </p>
              <select
                className={styles.select}
                name="coverage_category"
                defaultValue={stance?.coverage_category ?? 'equity'}
              >
                <option value="macro">Macro</option>
                <option value="equity">Equity Research</option>
                <option value="market-notes">Market Notes</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Topic</span>
              <p className={styles.fieldHint}>
                Match the post topic so filters and archives stay aligned.
              </p>
              <select
                className={styles.select}
                name="topic_id"
                defaultValue={stance?.topic_id ? String(stance.topic_id) : ''}
              >
                <option value="">No topic yet</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={String(topic.id)}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Opinion</span>
              <p className={styles.fieldHint}>
                This is the directional Whiteprint stance shown on public coverage cards.
              </p>
              <select
                className={styles.select}
                name="opinion"
                defaultValue={stance?.opinion ?? 'neutral'}
              >
                <option value="cautious">Cautious</option>
                <option value="neutral">Neutral</option>
                <option value="constructive">Constructive</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Conviction</span>
              <p className={styles.fieldHint}>
                Use this to communicate confidence level, not upside size.
              </p>
              <select
                className={styles.select}
                name="conviction"
                defaultValue={stance?.conviction ?? 'medium'}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Coverage status</span>
              <p className={styles.fieldHint}>
                Active, monitoring, or expired drives the public status badge.
              </p>
              <select
                className={styles.select}
                name="coverage_status"
                defaultValue={stance?.coverage_status ?? 'active'}
              >
                <option value="active">Active</option>
                <option value="monitoring">Monitoring</option>
                <option value="expired">Expired</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Scenario type</span>
              <p className={styles.fieldHint}>
                Choose the metric readers should see for bear, base, and bull values.
              </p>
              <select
                className={styles.select}
                name="scenario_type"
                defaultValue={stance?.scenario_type ?? 'price'}
              >
                <option value="price">Price</option>
                <option value="fcf">FCF</option>
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Summary</span>
            <p className={styles.fieldHint}>
              Short internal summary for admin lists and quick scanning.
            </p>
            <textarea
              className={styles.textarea}
              name="summary"
              defaultValue={stance?.summary ?? ''}
              rows={4}
              placeholder="Short admin-facing note for this coverage record."
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Public thesis</span>
            <p className={styles.fieldHint}>
              This is the exact thesis line shown on the public coverage page.
            </p>
            <textarea
              className={styles.textarea}
              name="thesis"
              defaultValue={stance?.thesis ?? ''}
              rows={4}
              placeholder="The exact one- or two-sentence thesis shown on the public coverage page."
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Tags</span>
            <p className={styles.fieldHint}>
              One tag per line or comma-separated. These power filters and search shortcuts.
            </p>
            <textarea
              className={styles.textarea}
              name="tags"
              defaultValue={stance?.tags.join('\n') ?? ''}
              rows={4}
              placeholder="orcl&#10;cloud-infrastructure&#10;roic"
            />
            <p className={styles.helpText}>
              Use one tag per line or commas. They power the public coverage filters and
              search shortcuts.
            </p>
          </label>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Bear case</span>
              <input
                className={styles.input}
                type="number"
                name="bear"
                step="0.01"
                defaultValue={stance?.bear ?? ''}
                placeholder="95"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Base case</span>
              <input
                className={styles.input}
                type="number"
                name="base"
                step="0.01"
                defaultValue={stance?.base ?? ''}
                placeholder="125"
              />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Bull case</span>
              <input
                className={styles.input}
                type="number"
                name="bull"
                step="0.01"
                defaultValue={stance?.bull ?? ''}
                placeholder="155"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Linked posts</span>
              <div className={styles.emptyState}>
                {linkedPosts.length ? (
                  linkedPosts.map((post) => (
                    <div key={post.id}>
                      <Link href={`/admin/posts/${post.id}`}>{post.title}</Link>
                      <span className={styles.listItemMeta}> ({post.slug})</span>
                    </div>
                  ))
                ) : (
                  <span>No posts linked yet. Link one from the post editor.</span>
                )}
              </div>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Internal body / notes</span>
            <p className={styles.fieldHint}>
              Use this for working notes, scenario context, and anything not meant for readers.
            </p>
            <textarea
              className={styles.textareaTall}
              name="body"
              defaultValue={stance?.body ?? ''}
              rows={14}
              placeholder="Optional working notes, scenario context, or internal rationale."
            />
          </label>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            {mode === 'create' ? 'Create coverage record' : 'Save changes'}
          </button>
          <Link href="/admin/stances" className={styles.secondaryButton}>
            Cancel
          </Link>
        </div>
      </form>

      {mode === 'edit' && stance ? (
        <form action={deleteStanceAction} className={styles.panel}>
          <input type="hidden" name="id" value={String(stance.id)} />
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Danger zone</h2>
              <p className={styles.panelIntro}>
                Deleting removes the coverage record from the public coverage page and
                any linked home/ticker surfaces.
              </p>
            </div>
          </div>
          <button type="submit" className={styles.dangerButton}>
            Delete coverage record
          </button>
        </form>
      ) : null}
    </div>
  )
}
