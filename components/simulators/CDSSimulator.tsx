'use client'

import { useState, useMemo } from 'react'
import { tokens } from '@/lib/tokens'

const QUANT_BLUE = tokens.quantAccent // '#2d6ab8'

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, step = 1, unit = '', onChange }: SliderRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: tokens.fontMono,
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: tokens.muted,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: tokens.fontMono,
          fontSize: 12,
          color: tokens.ink,
        }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ accentColor: QUANT_BLUE, width: '100%', cursor: 'pointer' }}
      />
    </div>
  )
}

interface OutputRowProps {
  label: string
  value: string
}

function OutputRow({ label, value }: OutputRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{
        fontFamily: tokens.fontMono,
        fontSize: 9,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: tokens.muted,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: tokens.fontDisplay,
        fontSize: 24,
        color: tokens.ink,
        lineHeight: 1.1,
      }}>
        {value}
      </span>
    </div>
  )
}

export default function CDSSimulator() {
  const [notional, setNotional] = useState(10)
  const [spread, setSpread] = useState(150)
  const [maturity, setMaturity] = useState(5)
  const [recovery, setRecovery] = useState(40)
  const [defaultTrigger, setDefaultTrigger] = useState(false)
  const [defaultYear, setDefaultYear] = useState(3)
  const [perspective, setPerspective] = useState<'buyer' | 'seller'>('buyer')

  const derived = useMemo(() => {
    const annualPremium = notional * spread / 10000
    const payout = notional * (1 - recovery / 100)
    const breakEvenProb = spread / ((1 - recovery / 100) * 100)

    const sign = perspective === 'buyer' ? 1 : -1

    // Net P&L
    let netPnl: number
    if (defaultTrigger) {
      const clampedYear = Math.min(defaultYear, maturity)
      const premiumsPaid = annualPremium * clampedYear
      // Buyer: receives payout, loses premiums paid
      netPnl = sign * (payout - premiumsPaid)
    } else {
      // No default: buyer loses all premiums, seller gains all premiums
      netPnl = -sign * annualPremium * maturity
    }

    return { annualPremium, payout, breakEvenProb, netPnl }
  }, [notional, spread, maturity, recovery, defaultTrigger, defaultYear, perspective])

  // SVG chart data
  const chartData = useMemo(() => {
    const annualPremium = notional * spread / 10000
    const payout = notional * (1 - recovery / 100)
    const sign = perspective === 'buyer' ? 1 : -1
    const clampedDefaultYear = Math.min(defaultYear, maturity)

    const bars: { year: number; value: number; isDefault: boolean }[] = []
    for (let y = 1; y <= maturity; y++) {
      if (defaultTrigger && y === clampedDefaultYear) {
        const premiumsSoFar = annualPremium * y
        // Net at default year: payout - premiums paid (buyer POV), flip for seller
        const netAtDefault = sign * (payout - premiumsSoFar)
        bars.push({ year: y, value: netAtDefault, isDefault: true })
      } else {
        // Regular premium bar: buyer pays (negative), seller receives (positive)
        bars.push({ year: y, value: -sign * annualPremium, isDefault: false })
      }
    }
    return bars
  }, [notional, spread, maturity, recovery, defaultTrigger, defaultYear, perspective])

  // SVG sizing
  const svgWidth = 600
  const svgHeight = 200
  const padLeft = 48
  const padRight = 16
  const padTop = 16
  const padBottom = 36
  const chartW = svgWidth - padLeft - padRight
  const chartH = svgHeight - padTop - padBottom

  const allValues = chartData.map(d => d.value)
  const maxAbs = Math.max(...allValues.map(Math.abs), 0.01)
  const dataMin = Math.min(0, ...allValues)
  const dataMax = Math.max(0, ...allValues)
  const range = dataMax - dataMin || 1

  const toY = (v: number) => padTop + ((dataMax - v) / range) * chartH
  const zeroY = toY(0)

  const barW = chartW / (maturity + 1) * 0.6
  const barStep = chartW / (maturity + 1)

  const formatM = (v: number) => {
    const abs = Math.abs(v)
    const sign = v < 0 ? '-' : '+'
    if (abs >= 1) return `${sign}$${abs.toFixed(1)}M`
    return `${sign}$${(abs * 1000).toFixed(0)}K`
  }

  return (
    <div style={{
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      padding: 32,
      borderRadius: tokens.radiusNone,
      backgroundImage: `linear-gradient(${QUANT_BLUE}0d 1px, transparent 1px), linear-gradient(90deg, ${QUANT_BLUE}0d 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
      color: tokens.ink,
      maxWidth: 700,
      width: '100%',
    }}>
      {/* Header */}
      <div style={{
        fontFamily: tokens.fontMono,
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: QUANT_BLUE,
        marginBottom: 28,
      }}>
        CDS Simulator
      </div>

      {/* Perspective toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, border: `1px solid ${tokens.border}` }}>
        {(['buyer', 'seller'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPerspective(p)}
            style={{
              flex: 1,
              padding: '8px 0',
              background: perspective === p ? QUANT_BLUE : 'transparent',
              color: perspective === p ? '#fff' : tokens.muted,
              border: 'none',
              borderRadius: 0,
              cursor: 'pointer',
              fontFamily: tokens.fontMono,
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Protection {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Role description */}
      <div style={{
        fontFamily: tokens.fontMono,
        fontSize: 10,
        color: tokens.muted,
        marginBottom: 24,
        padding: '10px 14px',
        border: `1px solid ${tokens.border}`,
        background: 'rgba(45,106,184,0.04)',
      }}>
        {perspective === 'buyer'
          ? 'Pays annual premium. Receives loss-given-default if credit event occurs.'
          : 'Receives annual premium. Pays loss-given-default if credit event occurs.'}
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
        <SliderRow label="Notional ($M)" value={notional} min={1} max={100} onChange={setNotional} unit="M" />
        <SliderRow label="CDS Spread (bps)" value={spread} min={25} max={1000} onChange={setSpread} unit=" bps" />
        <SliderRow label="Maturity (years)" value={maturity} min={1} max={10} onChange={setMaturity} unit=" yr" />
        <SliderRow label="Recovery Rate (%)" value={recovery} min={0} max={80} onChange={setRecovery} unit="%" />

        {/* Default trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              role="switch"
              aria-checked={defaultTrigger}
              onClick={() => setDefaultTrigger(v => !v)}
              style={{
                width: 36,
                height: 18,
                background: defaultTrigger ? QUANT_BLUE : tokens.border,
                border: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: 2,
                left: defaultTrigger ? 20 : 2,
                width: 14,
                height: 14,
                background: '#fff',
                transition: 'left 0.15s',
              }} />
            </button>
            <span style={{
              fontFamily: tokens.fontMono,
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: defaultTrigger ? tokens.ink : tokens.muted,
            }}>
              Default Trigger
            </span>
          </div>
          {defaultTrigger && (
            <SliderRow
              label="Default Year"
              value={Math.min(defaultYear, maturity)}
              min={1}
              max={maturity}
              onChange={setDefaultYear}
              unit={` yr`}
            />
          )}
        </div>
      </div>

      {/* Derived outputs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        marginBottom: 32,
        padding: '20px',
        border: `1px solid ${tokens.border}`,
        background: 'rgba(0,0,0,0.2)',
      }}>
        <OutputRow label="Annual Premium" value={`$${derived.annualPremium.toFixed(2)}M`} />
        <OutputRow label="Payout on Default" value={`$${derived.payout.toFixed(2)}M`} />
        <OutputRow label="Break-even Prob" value={`${derived.breakEvenProb.toFixed(2)}%`} />
      </div>

      {/* SVG Bar Chart */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: tokens.fontMono,
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: tokens.muted,
          marginBottom: 10,
        }}>
          {perspective === 'buyer' ? 'Cash Flows — Buyer POV' : 'Cash Flows — Seller POV'}
        </div>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height={200}
          style={{ overflow: 'visible' }}
        >
          {/* Zero axis */}
          <line
            x1={padLeft}
            y1={zeroY}
            x2={svgWidth - padRight}
            y2={zeroY}
            stroke={tokens.subtle}
            strokeWidth={1}
          />
          {/* Y-axis labels */}
          {[dataMax, 0, dataMin].filter((v, i, a) => a.indexOf(v) === i).map(v => (
            <text
              key={v}
              x={padLeft - 4}
              y={toY(v) + 4}
              textAnchor="end"
              fill={tokens.muted}
              fontSize={8}
              fontFamily="JetBrains Mono, monospace"
            >
              {formatM(v)}
            </text>
          ))}
          {/* Bars */}
          {chartData.map(({ year, value, isDefault }) => {
            const x = padLeft + year * barStep - barW / 2
            const y0 = zeroY
            const y1 = toY(value)
            const barTop = Math.min(y0, y1)
            const barHeight = Math.abs(y0 - y1)
            const fill = isDefault
              ? QUANT_BLUE
              : value >= 0
                ? `rgba(45,106,184,0.6)`
                : `rgba(45,106,184,0.35)`
            return (
              <g key={year}>
                <rect
                  x={x}
                  y={barTop}
                  width={barW}
                  height={Math.max(barHeight, 1)}
                  fill={fill}
                />
                {/* X-axis label */}
                <text
                  x={x + barW / 2}
                  y={svgHeight - padBottom + 14}
                  textAnchor="middle"
                  fill={tokens.muted}
                  fontSize={8}
                  fontFamily="JetBrains Mono, monospace"
                >
                  Y{year}
                </text>
                {isDefault && (
                  <text
                    x={x + barW / 2}
                    y={barTop - 4}
                    textAnchor="middle"
                    fill={QUANT_BLUE}
                    fontSize={7}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    DEFAULT
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Net P&L */}
      <div style={{
        padding: '16px 20px',
        border: `1px solid ${QUANT_BLUE}33`,
        background: `${QUANT_BLUE}0a`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: tokens.fontMono,
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: tokens.muted,
        }}>
          Net P&amp;L ({perspective === 'buyer' ? 'Buyer' : 'Seller'})
          {defaultTrigger ? ` — Default @ Y${Math.min(defaultYear, maturity)}` : ' — No Default'}
        </span>
        <span style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 28,
          color: derived.netPnl >= 0 ? '#4caf82' : '#e05c4b',
        }}>
          {derived.netPnl >= 0 ? '+' : ''}{derived.netPnl.toFixed(2)}M
        </span>
      </div>
    </div>
  )
}
