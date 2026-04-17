'use client'

import React, { useState } from 'react'
import { TheBrief } from '@/components/TheBrief'
import type { BriefData } from '@/components/TheBrief'
import { tokens } from '@/lib/tokens'

interface BriefToggleProps {
  brief: BriefData
  postTitle: string
  postSlug: string
}

export function BriefToggle({ brief, postTitle, postSlug }: BriefToggleProps) {
  const [expanded, setExpanded] = useState(true)

  const verdictColors: Record<string, string> = {
    SHORT: '#b83025',
    LONG: '#2d7a4f',
    NEUTRAL: '#8a6c3a',
    WATCH: '#2d6ab8',
    'SHORT VOL': '#b83025',
    'LONG VOL': '#2d7a4f',
  }
  const vColor = verdictColors[brief.verdict?.toUpperCase() ?? ''] ?? tokens.accent

  function scrollToArticle() {
    const el = document.getElementById('article-body')
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div>
      {/* Collapsed strip */}
      {!expanded && (
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: tokens.fontMono,
              fontSize: 8,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: tokens.muted,
            }}
          >
            The Brief
          </span>
          {brief.verdict && (
            <span
              style={{
                fontFamily: tokens.fontMono,
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: vColor,
                color: '#fff',
                padding: '2px 7px',
              }}
            >
              {brief.verdict}
            </span>
          )}
          <span
            style={{
              fontFamily: tokens.fontMono,
              fontSize: 10,
              color: tokens.ink,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {brief.counts.length} count{brief.counts.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            style={{
              background: 'none',
              border: `1px solid ${tokens.border}`,
              color: tokens.muted,
              fontFamily: tokens.fontMono,
              fontSize: 9,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Read the Brief ↓
          </button>
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div style={{ position: 'relative' }}>
          <TheBrief brief={brief} postTitle={postTitle} postSlug={postSlug} variant="article" />
          <div style={{ background: tokens.bg, paddingBottom: 16 }}>
            <button
              onClick={scrollToArticle}
              type="button"
              style={{
                width: '100%',
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                color: tokens.ink,
                fontFamily: tokens.fontMono,
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '18px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = tokens.surface)}
            >
              Read Full Article ↓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
