import { tokens } from '@/lib/tokens'

const shimmerBg = `linear-gradient(90deg, ${tokens.surfaceB} 25%, rgba(245,242,235,0.06) 50%, ${tokens.surfaceB} 75%)`

const shimmerStyle: React.CSSProperties = {
  background: shimmerBg,
  backgroundSize: '200% 100%',
  animation: 'wp-shimmer 1.5s infinite',
  borderRadius: tokens.radiusNone,
}

export function StanceCardSkeleton() {
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
        padding: 20,
        borderRadius: tokens.radiusNone,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Ticker */}
        <div style={{ ...shimmerStyle, width: 60, height: 16 }} />
        {/* Company name */}
        <div style={{ ...shimmerStyle, width: 120, height: 10 }} />
        {/* Conviction bar */}
        <div style={{ ...shimmerStyle, width: '100%', height: 2 }} />
        {/* Badge / date */}
        <div style={{ ...shimmerStyle, width: 80, height: 10 }} />
      </div>
    </>
  )
}
