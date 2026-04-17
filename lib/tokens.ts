export const tokens = {
  bg: '#0a0a0a',
  surface: '#111110',
  surfaceB: '#161514',
  ink: '#f5f2eb',
  muted: 'rgba(245,242,235,0.45)',
  subtle: 'rgba(245,242,235,0.2)',
  faint: 'rgba(245,242,235,0.06)',
  border: 'rgba(245,242,235,0.08)',
  accent: '#b83025',

  equityAccent: '#b83025',
  macroAccent: '#8a6c3a',
  quantAccent: '#2d6ab8',
  marketNotesAccent: '#2d7a4f',

  fontDisplay: "'Playfair Display', Georgia, serif",
  fontMono: "'JetBrains Mono', monospace",
  fontSans: "-apple-system, system-ui, sans-serif",

  radiusNone: '0px',
} as const;

export const sectionAccent: Record<string, string> = {
  equity: tokens.equityAccent,
  macro: tokens.macroAccent,
  quant: tokens.quantAccent,
  'market-notes': tokens.marketNotesAccent,
};

export type SectionKey = keyof typeof sectionAccent;
