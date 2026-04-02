import type { Json } from '@/lib/supabase/database.types'

export interface HomepageSettings {
  featuredPostSlug: string
  heroLabel: string
  latestResearchLimit: number
  marketNotesLimit: number
  orderedPostSlugs: string[]
  orderedStanceSlugs: string[]
  showDeskBriefs: boolean
  showFeatured: boolean
  showLatestResearch: boolean
  showMarketNotes: boolean
  showStances: boolean
}

export interface GeneralSettings {
  brandTagline: string
  contactEmail: string
  navCtaLabel: string
  siteDescription: string
  siteTitle: string
}

export interface AboutScheduleItem {
  day: string
  topic: string
}

export interface AboutSettings {
  contactIntro: string
  copyrightLine: string
  disclaimer: string
  heroTitle: string
  howWeWork: string[]
  instagramLabel: string
  instagramUrl: string
  introParagraphs: string[]
  linkedinLabel: string
  linkedinUrl: string
  researchAvailabilityNote: string
  responseNote: string
  scheduleIntro: string
  scheduleItems: AboutScheduleItem[]
  whatWeBelieve: string[]
  whereWeAre: string[]
}

export const homepageDefaults: HomepageSettings = {
  featuredPostSlug: '',
  heroLabel: "Today's Desk",
  latestResearchLimit: 4,
  marketNotesLimit: 6,
  orderedPostSlugs: [],
  orderedStanceSlugs: [],
  showDeskBriefs: true,
  showFeatured: true,
  showLatestResearch: true,
  showMarketNotes: true,
  showStances: true,
}

export const generalDefaults: GeneralSettings = {
  brandTagline: 'Clarity over consensus.',
  contactEmail: '',
  navCtaLabel: 'Get in touch',
  siteDescription: 'Independent macro and equity research',
  siteTitle: 'Whiteprint Research',
}

export const aboutDefaults: AboutSettings = {
  contactIntro: 'For research inquiries, collaboration, or press:',
  copyrightLine: '© 2026 Whiteprint Research. All rights reserved.',
  disclaimer:
    'Whiteprint Research is an independent publication. All content is for informational and educational purposes only and does not constitute investment advice, a recommendation, or a solicitation to buy or sell any security. The views expressed represent Whiteprint Research analysis as of the date of publication and are subject to change without notice. Whiteprint Research is not a registered investment adviser, broker-dealer, or financial institution. Readers should conduct their own due diligence and consult a qualified financial adviser before making investment decisions.',
  heroTitle: 'What we do',
  howWeWork: [
    'Whiteprint operates at the intersection of traditional financial analysis and modern research infrastructure. Our analytical process is human-led and augmented by AI tooling, used for data extraction, model stress-testing, and accelerating the research workflow. The judgment, editorial decisions, and conclusions are ours.',
    'Every published figure is traceable to a primary source. We do not fabricate data, invent precision, or publish unverifiable claims. Where uncertainty exists, we say so.',
  ],
  instagramLabel: '@whiteprintresearch',
  instagramUrl: 'https://www.instagram.com/whiteprintresearch',
  introParagraphs: [
    'Whiteprint Research is an independent publication producing macro, equity, and sector research at institutional quality.',
    'We cover public equities, macroeconomic policy, credit markets, and geopolitical risk with a focus on primary-source analysis grounded in regulatory filings, central bank data, and verifiable financial disclosures. Our equity research includes forensic quality-of-earnings work, scenario-based valuation, and downloadable financial models built for transparency.',
  ],
  linkedinLabel: 'Whiteprint Research',
  linkedinUrl: 'https://www.linkedin.com/company/whiteprint-research/',
  researchAvailabilityNote:
    'All research is publicly available. All financial models are downloadable.',
  responseNote:
    'We read everything. Response times vary with the publishing schedule.',
  scheduleIntro: 'We publish on a structured weekly schedule:',
  scheduleItems: [
    { day: 'Monday', topic: 'Market Commentary' },
    { day: 'Tuesday', topic: 'Credit Analysis' },
    { day: 'Wednesday', topic: 'Sector Research' },
    { day: 'Friday', topic: 'Equity Commentary' },
    { day: 'Weekend', topic: 'Geopolitical and Macro Deep Dives' },
  ],
  whatWeBelieve: [
    'Good research should be accessible, not gated. The quality of analysis should not depend on the size of the institution producing it. And the most valuable insight often comes from reading the footnotes everyone else skips.',
  ],
  whereWeAre: [
    'Based in the UAE with a global research focus. Our coverage spans US and European equities, Federal Reserve and ECB policy, energy and commodity markets, and cross-border geopolitical risk.',
  ],
}

function asRecord(value: Json | null | undefined): Record<string, Json | undefined> {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return {}
  }

  return value as Record<string, Json | undefined>
}

function asString(value: Json | undefined, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: Json | undefined, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function asNumber(value: Json | undefined, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asStringArray(value: Json | undefined, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const items = value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  return items.length ? items : fallback
}

function asScheduleItems(value: Json | undefined, fallback: AboutScheduleItem[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const items = value
    .map((item) => {
      if (!item || Array.isArray(item) || typeof item !== 'object') {
        return null
      }

      const record = item as Record<string, Json | undefined>
      const day = asString(record.day).trim()
      const topic = asString(record.topic).trim()

      if (!day || !topic) {
        return null
      }

      return { day, topic }
    })
    .filter((item): item is AboutScheduleItem => Boolean(item))

  return items.length ? items : fallback
}

export function normalizeHomepageSettings(value: Json | null | undefined): HomepageSettings {
  const record = asRecord(value)

  return {
    featuredPostSlug: asString(record.featuredPostSlug, homepageDefaults.featuredPostSlug),
    heroLabel: asString(record.heroLabel, homepageDefaults.heroLabel),
    latestResearchLimit: asNumber(record.latestResearchLimit, homepageDefaults.latestResearchLimit),
    marketNotesLimit: asNumber(record.marketNotesLimit, homepageDefaults.marketNotesLimit),
    orderedPostSlugs: asStringArray(record.orderedPostSlugs),
    orderedStanceSlugs: asStringArray(record.orderedStanceSlugs),
    showDeskBriefs: asBoolean(record.showDeskBriefs, homepageDefaults.showDeskBriefs),
    showFeatured: asBoolean(record.showFeatured, homepageDefaults.showFeatured),
    showLatestResearch: asBoolean(record.showLatestResearch, homepageDefaults.showLatestResearch),
    showMarketNotes: asBoolean(record.showMarketNotes, homepageDefaults.showMarketNotes),
    showStances: asBoolean(record.showStances, homepageDefaults.showStances),
  }
}

export function normalizeGeneralSettings(value: Json | null | undefined): GeneralSettings {
  const record = asRecord(value)

  return {
    brandTagline: asString(record.brandTagline, generalDefaults.brandTagline),
    contactEmail: asString(record.contactEmail, generalDefaults.contactEmail),
    navCtaLabel: asString(record.navCtaLabel, generalDefaults.navCtaLabel),
    siteDescription: asString(record.siteDescription, generalDefaults.siteDescription),
    siteTitle: asString(record.siteTitle, generalDefaults.siteTitle),
  }
}

export function normalizeAboutSettings(value: Json | null | undefined): AboutSettings {
  const record = asRecord(value)

  return {
    contactIntro: asString(record.contactIntro, aboutDefaults.contactIntro),
    copyrightLine: asString(record.copyrightLine, aboutDefaults.copyrightLine),
    disclaimer: asString(record.disclaimer, aboutDefaults.disclaimer),
    heroTitle: asString(record.heroTitle, aboutDefaults.heroTitle),
    howWeWork: asStringArray(record.howWeWork, aboutDefaults.howWeWork),
    instagramLabel: asString(record.instagramLabel, aboutDefaults.instagramLabel),
    instagramUrl: asString(record.instagramUrl, aboutDefaults.instagramUrl),
    introParagraphs: asStringArray(record.introParagraphs, aboutDefaults.introParagraphs),
    linkedinLabel: asString(record.linkedinLabel, aboutDefaults.linkedinLabel),
    linkedinUrl: asString(record.linkedinUrl, aboutDefaults.linkedinUrl),
    researchAvailabilityNote: asString(
      record.researchAvailabilityNote,
      aboutDefaults.researchAvailabilityNote,
    ),
    responseNote: asString(record.responseNote, aboutDefaults.responseNote),
    scheduleIntro: asString(record.scheduleIntro, aboutDefaults.scheduleIntro),
    scheduleItems: asScheduleItems(record.scheduleItems, aboutDefaults.scheduleItems),
    whatWeBelieve: asStringArray(record.whatWeBelieve, aboutDefaults.whatWeBelieve),
    whereWeAre: asStringArray(record.whereWeAre, aboutDefaults.whereWeAre),
  }
}
