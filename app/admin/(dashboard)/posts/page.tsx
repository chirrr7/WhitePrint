import Link from 'next/link'
import {
  importFilesystemPostAction,
  runLegacyMigrationTestAction,
  syncFilesystemArchiveAction,
} from '@/lib/admin/actions'
import { getPostsPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'
import { sectionAccent } from '@/lib/tokens'

interface AdminPostsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type TypeFilter = 'all' | 'equity' | 'macro' | 'quant' | 'market-notes'

const TYPE_TABS: Array<{ key: TypeFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'equity', label: 'Equity' },
  { key: 'macro', label: 'Macro' },
  { key: 'quant', label: 'Quant' },
  { key: 'market-notes', label: 'Market Notes' },
]

function sectionAccentClass(type: string): string {
  switch (type) {
    case 'equity':
      return styles.sectionAccentEquity
    case 'macro':
      return styles.sectionAccentMacro
    case 'quant':
      return styles.sectionAccentQuant
    case 'market-notes':
      return styles.sectionAccentMarketNotes
    default:
      return ''
  }
}

function inferType(topicLabel: string | null): string {
  const lower = (topicLabel ?? '').toLowerCase()
  if (lower.includes('macro')) return 'macro'
  if (lower.includes('quant')) return 'quant'
  if (lower.includes('market') && lower.includes('note')) return 'market-notes'
  return 'equity'
}

function readString(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key]
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const [resolvedParams, message, { filesystemBacklog, posts }] = await Promise.all([
    searchParams,
    readPageMessage(searchParams),
    getPostsPageData(),
  ])

  const activeTypeRaw = readString(resolvedParams, 'type').toLowerCase()
  const activeType: TypeFilter = (TYPE_TABS.find((t) => t.key === activeTypeRaw)?.key ?? 'all') as TypeFilter
  const search = readString(resolvedParams, 'q').trim().toLowerCase()

  const decorated = posts.map((post) => ({
    ...post,
    _type: inferType(post.topicLabel),
  }))

  const filtered = decorated.filter((post) => {
    if (activeType !== 'all' && post._type !== activeType) return false
    if (search && !`${post.title} ${post.slug}`.toLowerCase().includes(search)) return false
    return true
  })

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>Posts</p>
          <h1 className={styles.pageTitle}>Editorial archive</h1>
          <p className={styles.pageIntro}>
            Browse, filter, and edit published and draft posts. Filesystem backlog items
            can be imported into the admin database.
          </p>
        </div>
        <div className={styles.buttonRow}>
          <form action={syncFilesystemArchiveAction}>
            <button type="submit" className={styles.secondaryButton}>
              Sync archive
            </button>
          </form>
          <Link href="/admin/posts/new" className={styles.primaryButton}>
            + New Post
          </Link>
        </div>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <form method="get" className={styles.searchBar}>
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by title or slug"
          className={styles.searchInput}
        />
        {activeType !== 'all' ? (
          <input type="hidden" name="type" value={activeType} />
        ) : null}
        <button type="submit" className={styles.secondaryButton}>
          Search
        </button>
      </form>

      <nav className={styles.filterTabs} aria-label="Filter posts by type">
        {TYPE_TABS.map((tab) => {
          const params = new URLSearchParams()
          if (tab.key !== 'all') params.set('type', tab.key)
          if (search) params.set('q', search)
          const href = params.toString() ? `?${params.toString()}` : '?'
          const isActive = activeType === tab.key
          return (
            <Link
              key={tab.key}
              href={href}
              className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ''}`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => {
                const accent = sectionAccent[post._type] ?? '#b83025'
                return (
                  <tr key={post.id} className={styles.tableRow}>
                    <td>
                      <Link href={`/admin/posts/${post.id}`} className={styles.rowLink}>
                        <p className={styles.tableTitle}>{post.title}</p>
                        <p className={styles.tableSubtitle}>{post.slug}</p>
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`${styles.typeTag} ${sectionAccentClass(post._type)}`}
                        style={{ color: accent }}
                      >
                        {post._type.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={styles.mono}>{post.topicLabel ?? '—'}</span>
                    </td>
                    <td>
                      <span className={styles.statusBadge} data-status={post.status}>
                        {post.status}
                      </span>
                    </td>
                    <td>
                      <span className={styles.mono}>{formatAdminDate(post.updatedAt)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!filtered.length ? (
          <div className={styles.emptyState}>
            {posts.length
              ? 'No posts match this filter.'
              : 'No posts in the database yet.'}
          </div>
        ) : null}
      </div>

      {filesystemBacklog.length ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Filesystem backlog</h2>
              <p className={styles.panelIntro}>
                Repository posts not yet imported into the admin database.
              </p>
            </div>
            <form action={syncFilesystemArchiveAction}>
              <button type="submit" className={styles.primaryButton}>
                Sync all
              </button>
            </form>
          </div>
          <div className={styles.list}>
            {filesystemBacklog.map((post) => (
              <div key={post.slug} className={styles.listItem}>
                <div className={styles.listItemHead}>
                  <p className={styles.listItemTitle}>{post.title}</p>
                  <form action={importFilesystemPostAction}>
                    <input type="hidden" name="slug" value={post.slug} />
                    <button type="submit" className={styles.secondaryButton}>
                      Import
                    </button>
                  </form>
                </div>
                <p className={styles.listItemMeta}>
                  {post.category} / {post.date} / {post.slug}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Whiteprint migration test</h2>
            <p className={styles.panelIntro}>
              Import legacy reference articles into Supabase and suppress the
              filesystem fallback.
            </p>
          </div>
          <form action={runLegacyMigrationTestAction}>
            <button type="submit" className={styles.secondaryButton}>
              Run migration
            </button>
          </form>
        </div>
        <div className={styles.referenceList}>
          <div className={styles.referenceItem}>
            <span>Oracle</span>
            <span className={styles.mono}>oracle-software-margins-infrastructure-capex</span>
          </div>
          <div className={styles.referenceItem}>
            <span>EOG Resources</span>
            <span className={styles.mono}>eog-resources-the-base-case-is-priced-in</span>
          </div>
          <div className={styles.referenceItem}>
            <span>Eight Body Problem</span>
            <span className={styles.mono}>the-eight-body-problem</span>
          </div>
        </div>
      </div>
    </div>
  )
}
