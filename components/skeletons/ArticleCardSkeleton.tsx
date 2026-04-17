import { tokens } from '@/lib/tokens'

const shimmerBg = `linear-gradient(90deg, ${tokens.surfaceB} 25%, rgba(245,242,235,0.06) 50%, ${tokens.surfaceB} 75%)`

const shimmerStyle: React.CSSProperties = {
  background: shimmerBg,
  backgroundSize: '200% 100%',
  animation: 'wp-shimmer 1.5s infinite',
  borderRadius: tokens.radiusNone,
}

export function ArticleCardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes wp-shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>
      <div style={{
        background: tokens.surfaceB,
        border: `1px solid ${tokens.border}`,
        padding: 24,
        borderRadius: tokens.radiusNone,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Date */}
        <div style={{ ...shimmerStyle, width: 80, height: 10 }} />
        {/* Title line 1 */}
        <div style={{ ...shimmerStyle, width: '100%', height: 18 }} />
        {/* Title line 2 */}
        <div style={{ ...shimmerStyle, width: '70%', height: 18 }} />
        {/* Excerpt */}
        <div style={{ ...shimmerStyle, width: 200, height: 10 }} />
      </div>
    </>
  )
}
