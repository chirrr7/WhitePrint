import { tokens } from '@/lib/tokens'

const shimmerBg = `linear-gradient(90deg, ${tokens.surfaceB} 25%, rgba(245,242,235,0.06) 50%, ${tokens.surfaceB} 75%)`

const shimmerStyle: React.CSSProperties = {
  background: shimmerBg,
  backgroundSize: '200% 100%',
  animation: 'wp-shimmer 1.5s infinite',
  borderRadius: tokens.radiusNone,
  height: 14,
}

// Two paragraph blocks, each with the pattern: 100%, 95%, 88%, 100%, 75%
const lineWidths = ['100%', '95%', '88%', '100%', '75%']

export function ArticleBodySkeleton() {
  return (
    <>
      <style>{`
        @keyframes wp-shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {[0, 1, 2].map(para => (
          <div key={para} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lineWidths.map((w, i) => (
              <div key={i} style={{ ...shimmerStyle, width: w }} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
