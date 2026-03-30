import Link from 'next/link'
import { deletePostAction, savePostAction } from '@/lib/admin/actions'
import type { PageMessage } from '@/lib/admin/messages'
import type { PostEditorData } from '@/lib/admin/data'
import styles from '@/app/admin/admin.module.css'

interface PostFormProps {
  message: PageMessage | null
  mode: 'create' | 'edit'
  models: PostEditorData['models']
  post: PostEditorData['post']
  stances: PostEditorData['stances']
  topics: PostEditorData['topics']
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString().slice(0, 16)
}

export function PostForm({
  message,
  mode,
  models,
  post,
  stances,
  topics,
}: PostFormProps) {
  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Posts</p>
          <h1 className={styles.pageTitle}>
            {mode === 'create' ? 'New post' : 'Edit post'}
          </h1>
          <p className={styles.pageIntro}>
            Start with simple structured fields. We can layer in richer editorial
            tooling later without changing the content model.
          </p>
        </div>
        <Link href="/admin/posts" className={styles.secondaryButton}>
          Back to posts
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <form action={savePostAction} className={styles.panel}>
        {post ? <input type="hidden" name="id" value={String(post.id)} /> : null}

        <div className={styles.formGrid}>
          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Title</span>
              <input
                className={styles.input}
                type="text"
                name="title"
                defaultValue={post?.title ?? ''}
                placeholder="Oracle margins are not what they seem"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Slug</span>
              <input
                className={styles.input}
                type="text"
                name="slug"
                defaultValue={post?.slug ?? ''}
                placeholder="oracle-margins-not-what-they-seem"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Summary</span>
            <textarea
              className={styles.textarea}
              name="summary"
              defaultValue={post?.summary ?? ''}
              rows={4}
              placeholder="One clean paragraph that explains the thesis and the point of view."
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Body MDX</span>
            <textarea
              className={styles.textareaTall}
              name="body_mdx"
              defaultValue={post?.body_mdx ?? post?.body ?? ''}
              rows={18}
              placeholder="Write the article body in MDX. Keep the prose and custom Whiteprint components exactly as you want them to render."
            />
          </label>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select
                className={styles.select}
                name="status"
                defaultValue={post?.status ?? 'draft'}
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
                defaultValue={toDateTimeLocal(post?.published_at)}
              />
            </label>
          </div>

          <div className={styles.formGridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Topic</span>
              <select
                className={styles.select}
                name="topic_id"
                defaultValue={post?.topic_id ? String(post.topic_id) : ''}
              >
                <option value="">No topic yet</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={String(topic.id)}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Linked stance</span>
              <select
                className={styles.select}
                name="stance_id"
                defaultValue={post?.stance_id ? String(post.stance_id) : ''}
              >
                <option value="">No linked stance</option>
                {stances.map((stance) => (
                  <option key={stance.id} value={String(stance.id)}>
                    {stance.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Linked model</span>
            <select
              className={styles.select}
              name="linked_model_id"
              defaultValue={post?.linked_model_id ? String(post.linked_model_id) : ''}
            >
              <option value="">No linked model</option>
              {models.map((model) => (
                <option key={model.id} value={String(model.id)}>
                  {model.label}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={post?.featured ?? false}
              />
              <div>
                <span className={styles.checkboxTitle}>Featured</span>
                <span className={styles.checkboxHint}>
                  Surface this post as a lead editorial pick.
                </span>
              </div>
            </label>
            <label className={styles.checkboxCard}>
              <input
                type="checkbox"
                name="homepage"
                value="true"
                defaultChecked={post?.homepage ?? false}
              />
              <div>
                <span className={styles.checkboxTitle}>Homepage candidate</span>
                <span className={styles.checkboxHint}>
                  Keep this ready for the homepage ordering controls.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            {mode === 'create' ? 'Create post' : 'Save changes'}
          </button>
          <Link href="/admin/posts" className={styles.secondaryButton}>
            Cancel
          </Link>
        </div>
      </form>

      {mode === 'edit' && post ? (
        <form action={deletePostAction} className={styles.panel}>
          <input type="hidden" name="id" value={String(post.id)} />
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Danger zone</h2>
              <p className={styles.panelIntro}>
                Deleting removes the record from the database. Archive if you only
                want it off the public surface.
              </p>
            </div>
          </div>
          <button type="submit" className={styles.dangerButton}>
            Delete post
          </button>
        </form>
      ) : null}
    </div>
  )
}
