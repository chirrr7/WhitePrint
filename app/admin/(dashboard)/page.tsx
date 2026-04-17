import Link from 'next/link'
import { getDashboardData } from '@/lib/admin/data'
import { createClient } from '@/lib/supabase/server'
import styles from '@/app/admin/admin.module.css'

interface RecentPostRow {
  id: number
  title: string
  slug: string
  status: string
  updated_at: string
  body: string | null
}

interface ActiveStanceRow {
  id: number
  title: string | null
  name: string | null
  ticker: string | null
  slug: string
  conviction: string | null
  opinion: string | null
  coverage_status: string | null
}

const convictionToPercent = (c: string | null): number => {
  switch ((c ?? 'medium').toLowerCase()) {
    case 'high':
      return 90
    case 'medium':
      return 60
    case 'low':
      return 30
    default:
      return 50
  }
}

const wordCount = (text: string | null): number => {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

const formatDate = (iso: string | null): string => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardData()
  const supabase = await createClient()

  const [recentPostsResult, activeStancesResult, publishedBodiesResult] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, slug, status, updated_at, body')
      .order('updated_at', { ascending: false })
      .limit(6),
    supabase
      .from('stances')
      .select('id, title, name, ticker, slug, conviction, opinion, coverage_status')
      .eq('coverage_status', 'active')
      .order('updated_at', { ascending: false })
      .limit(6),
    supabase.from('posts').select('body').eq('status', 'published'),
  ])

  const recentPosts: RecentPostRow[] = (recentPostsResult.data as RecentPostRow[] | null) ?? []
  const activeStances: ActiveStanceRow[] =
    (activeStancesResult.data as ActiveStanceRow[] | null) ?? []

  const publishedBodies = (publishedBodiesResult.data ?? []) as { body: string | null }[]
  const avgWords =
    publishedBodies.length > 0
      ? Math.round(
          publishedBodies.reduce((sum, row) => sum + wordCount(row.body), 0) /
            publishedBodies.length,
        )
      : 0

  return (
    <div className={styles.pageStack}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>Dashboard</p>
          <h1 className={styles.h1}>Editorial control room</h1>
        </div>
        <div className={styles.quickLinks}>
          <Link href="/admin/posts/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            New post
          </Link>
          <Link href="/admin/stances/new" className={`${styles.btn} ${styles.btnGhost}`}>
            New stance
          </Link>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <p className={styles.statNum}>{dashboard.counts.published}</p>
          <p className={styles.statLabel}>Published</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statNum}>{activeStances.length}</p>
          <p className={styles.statLabel}>Active stances</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statNum}>{dashboard.counts.drafts}</p>
          <p className={styles.statLabel}>Drafts</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statNum}>{avgWords.toLocaleString()}</p>
          <p className={styles.statLabel}>Avg word count</p>
        </div>
      </div>

      <div className={styles.grid2}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.h2}>Recent posts</h2>
            <Link href="/admin/posts" className={styles.eyebrow} style={{ color: '#b83025' }}>
              View all →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className={styles.emptyState}>No posts yet</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className={styles.rowLink}
                        >
                          <p className={styles.tableTitle}>{post.title}</p>
                          <p className={styles.tableSubtitle}>{post.slug}</p>
                        </Link>
                      </td>
                      <td className={styles.tableCell}>
                        <span
                          className={`${styles.badge} ${
                            post.status === 'published' ? styles.badgePublished : styles.badgeDraft
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} ${styles.mono}`}>
                        {formatDate(post.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.h2}>Active stances</h2>
            <Link href="/admin/stances" className={styles.eyebrow} style={{ color: '#b83025' }}>
              View all →
            </Link>
          </div>
          {activeStances.length === 0 ? (
            <div className={styles.emptyState}>No active stances</div>
          ) : (
            <div className={styles.list}>
              {activeStances.map((stance) => {
                const ticker = stance.ticker || stance.slug.toUpperCase()
                const direction = (stance.opinion ?? 'neutral').toLowerCase()
                const isLong =
                  direction === 'long' || direction === 'bullish' || direction === 'positive'
                const isShort =
                  direction === 'short' || direction === 'bearish' || direction === 'negative'
                const pct = convictionToPercent(stance.conviction)
                return (
                  <Link
                    key={stance.id}
                    href={`/admin/stances/${stance.id}`}
                    className={`${styles.listItem} ${styles.rowLink}`}
                  >
                    <div className={styles.listItemHead}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className={styles.ticker}>{ticker}</span>
                        <span className={styles.listItemMeta}>
                          {stance.title ?? stance.name ?? ''}
                        </span>
                      </div>
                      <span
                        className={
                          isLong ? styles.badgeLong : isShort ? styles.badgeShort : styles.badge
                        }
                      >
                        {direction}
                      </span>
                    </div>
                    <div className={styles.convictionBar}>
                      <div className={styles.convictionFill} style={{ width: `${pct}%` }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
