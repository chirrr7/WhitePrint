import { uploadModelAction } from '@/lib/admin/actions'
import { getModelsPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminModelsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminModelsPage({ searchParams }: AdminModelsPageProps) {
  const [message, { models, posts, topics }] = await Promise.all([
    readPageMessage(searchParams),
    getModelsPageData(),
  ])

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Models</p>
          <h1 className={styles.pageTitle}>Upload files into private storage.</h1>
          <p className={styles.pageIntro}>
            Files land in Supabase Storage and the metadata lands in Postgres. That
            keeps access rules and editorial context in the same system.
          </p>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <div className={styles.splitGrid}>
        <form
          action={uploadModelAction}
          className={styles.panel}
          encType="multipart/form-data"
        >
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Upload model</h2>
              <p className={styles.panelIntro}>
                Accepted formats follow the bucket policy in the SQL migration.
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
                <span className={styles.label}>Version</span>
                <input className={styles.input} type="text" name="version" required />
              </label>
            </div>

            <div className={styles.formGridTwo}>
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
              <label className={styles.field}>
                <span className={styles.label}>Post</span>
                <select className={styles.select} name="post_id" defaultValue="">
                  <option value="">No post linked</option>
                  {posts.map((post) => (
                    <option key={post.id} value={String(post.id)}>
                      {post.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>File</span>
              <input className={styles.input} type="file" name="file" required />
            </label>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Upload model
            </button>
          </div>
        </form>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Latest uploads</h2>
              <p className={styles.panelIntro}>
                Stored file paths are what tie Postgres records to Storage objects.
              </p>
            </div>
          </div>

          {models.length ? (
            <div className={styles.list}>
              {models.map((model) => (
                <div key={model.id} className={styles.listItem}>
                  <div>
                    <p className={styles.listItemTitle}>{model.title}</p>
                    <p className={styles.listItemMeta}>
                      Version {model.version} / {model.filePath}
                    </p>
                    <p className={styles.listItemMeta}>
                      Topic: {model.topicLabel ?? 'None'} / Post: {model.postLabel ?? 'None'}
                    </p>
                  </div>
                  <div className={styles.stackedMeta}>
                    <span className={styles.statusBadge} data-status="published">
                      Stored
                    </span>
                    <span className={styles.mono}>{formatAdminDate(model.uploadedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>No models uploaded yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
