import Link from 'next/link'
import { getStancesPageData } from '@/lib/admin/data'
import { formatAdminDate, readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'
import { sectionAccent } from '@/lib/tokens'

interface AdminStancesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type StatusFilter = 'active' | 'closed' | 'all'

const FILTER_TABS: Array<{ key: StatusFilter; label: string }> = [
  { key: 'active', label: 'Active' },
  { key: 'closed', label: 'Closed' },
  { key: 'all', label: 'All' },
]

function directionFor(opinion: string): 'long' | 'short' | 'neutral' {
  if (opinion === 'constructive') return 'long'
  if (opinion === 'cautious') return 'short'
  return 'neutral'
}

function directionLabel(direction: 'long' | 'short' | 'neutral'): string {
  return direction.charAt(0).toUpperCase() + direction.slice(1)
}

function convictionPercent(conviction: string): number {
  switch (conviction) {
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

function sectionAccentClass(category: string): string {
  switch (category) {
    case 'macro':
      return styles.sectionAccentMacro
    case 'market-notes':
      return styles.sectionAccentMarketNotes
    case 'quant':
      return styles.sectionAccentQuant
    default:
      return styles.sectionAccentEquity
  }
}

function readString(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key]
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function AdminStancesPage({ searchParams }: AdminStancesPageProps) {
  const [resolvedParams, message, { stances }] = await Promise.all([
    searchParams,
    readPageMessage(searchParams),
    getStancesPageData(),
  ])

  const filterRaw = readString(resolvedParams, 'filter').toLowerCase()
  const activeFilter: StatusFilter =
    (FILTER_TABS.find((t) => t.key === filterRaw)?.key ?? 'active') as StatusFilter

  const filtered = stances.filter((stance) => {
    if (activeFilter === 'all') return true
    const isActive = stance.coverageStatus === 'active' && stance.status === 'published'
    return activeFilter === 'active' ? isActive : !isActive
  })

  return (
    <div className={styles.pageStack}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>Coverage</p>
          <h1 className={styles.pageTitle}>Stances</h1>
          <p className={styles.pageIntro}>
            Public stance records. Each card drives the coverage page, ticker, and
            stance strip.
          </p>
        </div>
        <Link href="/admin/stances/new" className={styles.primaryButton}>
          + New Stance
        </Link>
      </div>

      {message ? (
        <div className={styles.message} data-tone={message.tone}>
          {message.text}
        </div>
      ) : null}

      <nav className={styles.filterTabs} aria-label="Filter stances">
        {FILTER_TABS.map((tab) => {
          const href = tab.key === 'active' ? '?' : `?filter=${tab.key}`
          const isActive = activeFilter === tab.key
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

      {filtered.length ? (
        <div className={styles.stanceGrid}>
          {filtered.map((stance) => {
            const direction = directionFor(stance.opinion)
            const convictionPct = convictionPercent(stance.conviction)
            const accent = sectionAccent[stance.coverageCategory] ?? '#b83025'

            return (
              <Link
                key={stance.id}
                href={`/admin/stances/${stance.id}`}
                className={styles.stanceCard}
              >
                <p className={styles.stanceTicker}>{stance.ticker || 'TBD'}</p>
                <h3 className={styles.stanceName}>{stance.name || stance.title}</h3>

                <div className={styles.stanceMetaRow}>
                  <span className={styles.directionBadge} data-direction={direction}>
                    {directionLabel(direction)}
                  </span>
                  <span
                    className={`${styles.typeTag} ${sectionAccentClass(stance.coverageCategory)}`}
                    style={{ color: accent }}
                  >
                    {stance.coverageCategory.replace('-', ' ')}
                  </span>
                </div>

                <div className={styles.convictionWrap}>
                  <div className={styles.convictionLabel}>
                    <span>Conviction</span>
                    <span>{stance.conviction} / {convictionPct}%</span>
                  </div>
                  <div className={styles.convictionBar}>
                    <div
                      className={styles.convictionFill}
                      style={{ width: `${convictionPct}%` }}
                    />
                  </div>
                </div>

                <p className={styles.listItemMeta}>
                  Filed {formatAdminDate(stance.updatedAt)}
                </p>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          {stances.length
            ? 'No stances match this filter.'
            : 'No coverage records saved yet.'}
        </div>
      )}
    </div>
  )
}
