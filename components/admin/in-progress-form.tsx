import Link from 'next/link'
import { deleteInProgressItemAction, saveInProgressItemAction } from '@/lib/admin/actions'
import type { InProgressEditorData } from '@/lib/admin/data'
import type { PageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface InProgressFormProps {
  item: InProgressEditorData['item']
  message: PageMessage | null
  mode: 'create' | 'edit'
}

export function InProgressForm({ item, message, mode }: InProgressFormProps) {
  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>In progress</p>
          <h1 className={styles.pageTitle}>
            {mode === 'create' ? 'New work item' : 'Edit work item'}
          </h1>
          <p className={styles.pageIntro}>
            These entries feed the public pipeline docket and give the editorial desk a
            live picture of what is being researched, blocked, or ready to publish.
          </p>
        </div>
        <Link href="/admin/in-progress" className={styles.secondaryButton}>
          Back to pipeline
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <form action={saveInProgressItemAction} className={styles.panel}>
        {item ? <input type="hidden" name="id" value={String(item.id)} /> : null}

        <div className={styles.formGrid}>
          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Title</span>
              <input
                className={styles.input}
                type="text"
                name="title"
                defaultValue={item?.title ?? ''}
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Slug</span>
              <input
                className={styles.input}
                type="text"
                name="slug"
                defaultValue={item?.slug ?? ''}
                placeholder="energy-shipping-lanes"
              />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select
                className={styles.select}
                name="status"
                defaultValue={item?.status ?? 'active'}
              >
                <option value="backlog">Backlog</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Priority</span>
              <input
                className={styles.input}
                type="number"
                name="priority"
                defaultValue={String(item?.priority ?? 0)}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Summary</span>
            <textarea
              className={styles.textarea}
              name="summary"
              rows={4}
              defaultValue={item?.summary ?? ''}
              placeholder="Short note that explains the angle and why it matters."
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Internal notes</span>
            <textarea
              className={styles.textareaTall}
              name="body"
              rows={12}
              defaultValue={item?.body ?? ''}
              placeholder="Working notes, reporting tasks, source gaps, or handoff context."
            />
          </label>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            {mode === 'create' ? 'Create work item' : 'Save changes'}
          </button>
          <Link href="/admin/in-progress" className={styles.secondaryButton}>
            Cancel
          </Link>
        </div>
      </form>

      {mode === 'edit' && item ? (
        <form action={deleteInProgressItemAction} className={styles.panel}>
          <input type="hidden" name="id" value={String(item.id)} />
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Danger zone</h2>
              <p className={styles.panelIntro}>
                Deleting removes this item from the internal pipeline and the public
                docket modules that depend on it.
              </p>
            </div>
          </div>
          <button type="submit" className={styles.dangerButton}>
            Delete work item
          </button>
        </form>
      ) : null}
    </div>
  )
}
