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
  const [expanded, setExpanded] = useState(false)

  const verdictColors: Record<string, string> = {
    SHORT: '#b83025',
    LONG: '#2d7a4f',
    NEUTRAL: '#8a6c3a',
    WATCH: '#2d6ab8',
    'SHORT VOL': '#b83025',
    'LONG VOL': '#2d7a4f',
  }
  const vColor = verdictColors[brief.verdict?.toUpperCase() ?? ''] ?? tokens.accent

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
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 6,
            }}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                color: tokens.muted,
                fontFamily: tokens.fontMono,
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Collapse ↑
            </button>
          </div>
          <TheBrief brief={brief} postTitle={postTitle} postSlug={postSlug} variant="article" />
        </div>
      )}
    </div>
  )
}
