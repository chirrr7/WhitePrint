'use client'

import React, { useState } from 'react'
import { tokens } from '@/lib/tokens'

export interface BriefCount {
  num: string
  title: string
  signal: string
  claim: string
  src: string
  value: string
  note: string
}

export interface BriefData {
  verdict: string
  counts: BriefCount[]
  conclusion: string
}

export interface TheBriefProps {
  brief: BriefData
  postTitle: string
  postSlug?: string
  variant?: 'article' | 'mobile' | 'preview'
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

const VERDICT_COLORS: Record<string, string> = {
  SHORT: '#b83025',
  LONG: '#2d7a4f',
  NEUTRAL: '#8a6c3a',
  WATCH: '#2d6ab8',
  'SHORT VOL': '#b83025',
  'LONG VOL': '#2d7a4f',
}

const SIGNAL_COLORS: Record<string, string> = {
  'High Signal': '#b83025',
  Critical: '#b83025',
  Moderate: '#8a6c3a',
  Watch: '#2d6ab8',
}

function verdictColor(verdict: string) {
  return VERDICT_COLORS[verdict?.toUpperCase()] ?? tokens.accent
}

function signalColor(signal: string) {
  return SIGNAL_COLORS[signal] ?? tokens.muted
}

export function TheBrief({ brief, postTitle, postSlug, variant = 'article' }: TheBriefProps) {
  const [openCounts, setOpenCounts] = useState<Set<number>>(
    variant === 'mobile' ? new Set(brief.counts.map((_, i) => i)) : new Set(),
  )

  function toggleCount(idx: number) {
    setOpenCounts((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  const isPreview = variant === 'preview'
  const caseNo = postSlug
    ? `WPR-${postSlug.toUpperCase().slice(0, 12)}`
    : 'WPR-DRAFT'

  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        fontFamily: tokens.fontDisplay,
        color: tokens.ink,
        marginBottom: isPreview ? 0 : 40,
        position: 'relative',
      }}
    >
      {/* Hero header */}
      <div
        style={{
          background: '#0d0c0b',
          borderBottom: `2px solid ${tokens.accent}`,
          padding: isPreview ? '20px 20px 16px' : '32px 40px 24px',
        }}
      >
        <div
          style={{
            fontFamily: tokens.fontMono,
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: tokens.muted,
            marginBottom: 10,
          }}
        >
          THE BRIEF — CASE NO. {caseNo}
        </div>
        <h2
          style={{
            fontFamily: tokens.fontDisplay,
            fontSize: isPreview ? 18 : 24,
            fontWeight: 700,
            lineHeight: 1.25,
            margin: '0 0 14px',
            color: tokens.ink,
          }}
        >
          {postTitle}
        </h2>
        {brief.verdict && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontFamily: tokens.fontMono,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: verdictColor(brief.verdict),
                color: '#fff',
                padding: '3px 8px',
                display: 'inline-block',
              }}
            >
              {brief.verdict}
            </span>
            <span
              style={{
                fontFamily: tokens.fontMono,
                fontSize: 9,
                color: tokens.muted,
                letterSpacing: '0.1em',
              }}
            >
              VERDICT
            </span>
          </div>
        )}
      </div>

      {/* Counts */}
      {brief.counts.length > 0 && (
        <div style={{ padding: isPreview ? '0' : '0' }}>
          {brief.counts.map((count, idx) => {
            const isOpen = openCounts.has(idx)
            const roman = count.num || ROMAN[idx] || String(idx + 1)
            return (
              <div
                key={idx}
                style={{
                  borderBottom: `1px solid ${tokens.border}`,
                }}
              >
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => toggleCount(idx)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: isPreview ? '12px 20px' : '16px 40px',
                    textAlign: 'left',
                    color: tokens.ink,
                  }}
                >
                  <span
                    style={{
                      fontFamily: tokens.fontMono,
                      fontSize: 11,
                      color: tokens.accent,
                      minWidth: 24,
                      flexShrink: 0,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {roman}.
                  </span>
                  <span
                    style={{
                      fontFamily: tokens.fontDisplay,
                      fontSize: isPreview ? 13 : 15,
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    {count.title || 'Untitled count'}
                  </span>
                  {count.signal && (
                    <span
                      style={{
                        fontFamily: tokens.fontMono,
                        fontSize: 8,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: signalColor(count.signal),
                        border: `1px solid ${signalColor(count.signal)}`,
                        padding: '2px 6px',
                        flexShrink: 0,
                      }}
                    >
                      {count.signal}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: tokens.fontMono,
                      fontSize: 9,
                      color: tokens.muted,
                      marginLeft: 4,
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.15s',
                    }}
                  >
                    ▾
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div
                    style={{
                      padding: isPreview ? '0 20px 16px 58px' : '0 40px 24px 78px',
                    }}
                  >
                    {count.claim && (
                      <p
                        style={{
                          fontFamily: tokens.fontDisplay,
                          fontSize: isPreview ? 13 : 14,
                          lineHeight: 1.75,
                          color: tokens.ink,
                          margin: '0 0 16px',
                        }}
                      >
                        {count.claim}
                      </p>
                    )}

                    {(count.src || count.value) && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: count.src && count.value ? '1fr 1fr' : '1fr',
                          gap: 12,
                          marginBottom: 16,
                          background: tokens.faint,
                          padding: '12px 14px',
                          border: `1px solid ${tokens.border}`,
                        }}
                      >
                        {count.src && (
                          <div>
                            <div
                              style={{
                                fontFamily: tokens.fontMono,
                                fontSize: 8,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: tokens.muted,
                                marginBottom: 4,
                              }}
                            >
                              Source
                            </div>
                            <div
                              style={{
                                fontFamily: tokens.fontMono,
                                fontSize: 11,
                                color: tokens.ink,
                              }}
                            >
                              {count.src}
                            </div>
                          </div>
                        )}
                        {count.value && (
                          <div>
                            <div
                              style={{
                                fontFamily: tokens.fontMono,
                                fontSize: 8,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: tokens.muted,
                                marginBottom: 4,
                              }}
                            >
                              Key Figure
                            </div>
                            <div
                              style={{
                                fontFamily: tokens.fontMono,
                                fontSize: 13,
                                color: tokens.accent,
                                fontWeight: 700,
                              }}
                            >
                              {count.value}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {count.note && (
                      <div
                        style={{
                          borderLeft: `2px solid ${tokens.accent}`,
                          paddingLeft: 14,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: tokens.fontMono,
                            fontSize: 8,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: tokens.muted,
                            marginBottom: 6,
                          }}
                        >
                          Interpretation
                        </div>
                        <p
                          style={{
                            fontFamily: tokens.fontDisplay,
                            fontSize: isPreview ? 12 : 13,
                            lineHeight: 1.7,
                            color: `rgba(245,242,235,0.8)`,
                            margin: 0,
                            fontStyle: 'italic',
                          }}
                        >
                          {count.note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Conclusion */}
      {brief.conclusion && (
        <div
          style={{
            padding: isPreview ? '16px 20px' : '24px 40px',
            borderTop: `1px solid ${tokens.border}`,
            background: '#0d0c0b',
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontMono,
              fontSize: 8,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: tokens.muted,
              marginBottom: 10,
            }}
          >
            Conclusion
          </div>
          <p
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: isPreview ? 13 : 14,
              lineHeight: 1.8,
              color: tokens.ink,
              margin: 0,
            }}
          >
            {brief.conclusion}
          </p>
        </div>
      )}

    </div>
  )
}
