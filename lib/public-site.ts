import "server-only"

import type { PostMeta } from "@/lib/post-meta"
import { getAllPosts } from "@/lib/posts"
import { type Stance, getCoverageStances } from "@/lib/stances"
import { createClient } from "@/lib/supabase/server"
import type { Database, Json } from "@/lib/supabase/database.types"

type DeskBriefRow = Database["public"]["Tables"]["desk_brief"]["Row"]
type InProgressRow = Database["public"]["Tables"]["in_progress_items"]["Row"]
type LegacyPipelineRow = Database["public"]["Tables"]["pipeline"]["Row"]

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

export interface PublicDeskBrief {
  badge: string
  body: string
  id: string
  label: string
}

export interface HomepageContentData {
  deskBriefItems: PublicDeskBrief[]
  featuredPost: PostMeta | null
  latestPosts: PostMeta[]
  leadPost: PostMeta | null
  mobileBriefPosts: PostMeta[]
  settings: HomepageSettings
  stances: Stance[]
}

export interface PublicDocketItem {
  categoryLabels: string[]
  codename: string
  format: string | null
  hook: string | null
  id: string
  statusLabel: string | null
  statusTone: "active" | "drafting" | "research"
  subtitle: string | null
  title: string
  updatedLabel: string | null
}

const homepageDefaults: HomepageSettings = {
  featuredPostSlug: "",
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

const generalDefaults: GeneralSettings = {
  brandTagline: "Clarity over consensus.",
  contactEmail: "",
  navCtaLabel: "Get in touch",
  siteDescription: "Independent macro and equity research",
  siteTitle: "Whiteprint Research",
}

function asRecord(value: Json | null | undefined): Record<string, Json | undefined> {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return {}
  }

  return value as Record<string, Json | undefined>
}

function asString(value: Json | undefined, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function asBoolean(value: Json | undefined, fallback = false) {
  return typeof value === "boolean" ? value : fallback
}

function asNumber(value: Json | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function asStringArray(value: Json | undefined) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === "string")
}

async function getSiteSettingValue(key: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle()

  if (error) {
    console.error(`Failed to load site setting "${key}".`, error)
    return null
  }

  return data?.value ?? null
}

function normalizeHomepageSettings(value: Json | null | undefined): HomepageSettings {
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

function normalizeGeneralSettings(value: Json | null | undefined): GeneralSettings {
  const record = asRecord(value)

  return {
    brandTagline: asString(record.brandTagline, generalDefaults.brandTagline),
    contactEmail: asString(record.contactEmail, generalDefaults.contactEmail),
    navCtaLabel: asString(record.navCtaLabel, generalDefaults.navCtaLabel),
    siteDescription: asString(record.siteDescription, generalDefaults.siteDescription),
    siteTitle: asString(record.siteTitle, generalDefaults.siteTitle),
  }
}

function orderBySlugPreference<T extends { slug: string }>(items: T[], orderedSlugs: string[]) {
  const seen = new Set<string>()
  const bySlug = new Map(items.map((item) => [item.slug, item]))
  const ordered: T[] = []

  orderedSlugs.forEach((slug) => {
    const item = bySlug.get(slug)

    if (item && !seen.has(slug)) {
      ordered.push(item)
      seen.add(slug)
    }
  })

  items.forEach((item) => {
    if (!seen.has(item.slug)) {
      ordered.push(item)
      seen.add(item.slug)
    }
  })

  return ordered
}

function applyMarketNoteRules(posts: PostMeta[], settings: HomepageSettings) {
  if (!settings.showMarketNotes) {
    return posts.filter((post) => post.category !== "market-notes")
  }

  let marketNoteCount = 0

  return posts.filter((post) => {
    if (post.category !== "market-notes") {
      return true
    }

    marketNoteCount += 1
    return marketNoteCount <= Math.max(0, settings.marketNotesLimit)
  })
}

function chooseLeadPost(posts: PostMeta[], settings: HomepageSettings) {
  if (settings.featuredPostSlug) {
    const configuredPost = posts.find((post) => post.slug === settings.featuredPostSlug)

    if (configuredPost) {
      return configuredPost
    }
  }

  return (
    posts.find((post) => post.featured) ??
    posts.find((post) => post.category !== "market-notes") ??
    posts[0] ??
    null
  )
}

async function getDeskBriefItems(): Promise<PublicDeskBrief[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("desk_brief")
    .select("id, label, badge, body, sort_order, visible")
    .eq("visible", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .limit(3)

  if (error) {
    console.error("Failed to load desk brief items.", error)
    return []
  }

  return ((data ?? []) as DeskBriefRow[]).map((item) => ({
    badge: item.badge,
    body: item.body,
    id: item.id,
    label: item.label,
  }))
}

function formatMonthLabel(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

function mapInProgressItem(item: InProgressRow): PublicDocketItem {
  const normalizedStatus = item.status.trim().toLowerCase()

  return {
    categoryLabels: [],
    codename: item.slug.replace(/-/g, " ").toUpperCase(),
    format: null,
    hook: item.summary || null,
    id: `in-progress-${item.id}`,
    statusLabel:
      normalizedStatus === "done"
        ? "Ready"
        : normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1),
    statusTone:
      normalizedStatus === "active"
        ? "active"
        : normalizedStatus === "done"
          ? "drafting"
          : "research",
    subtitle: item.summary || null,
    title: item.title,
    updatedLabel: formatMonthLabel(item.updated_at),
  }
}

function mapLegacyPipelineItem(item: LegacyPipelineRow): PublicDocketItem {
  return {
    categoryLabels: (item.category ?? []) as string[],
    codename: item.codename,
    format: item.format,
    hook: item.hook,
    id: `pipeline-${item.id}`,
    statusLabel: item.status,
    statusTone:
      item.status_type === "active"
        ? "active"
        : item.status_type === "drafting"
          ? "drafting"
          : "research",
    subtitle: item.subtitle,
    title: item.codename,
    updatedLabel: item.last_updated,
  }
}

export async function getPublicHomepageSettings() {
  return normalizeHomepageSettings(await getSiteSettingValue("homepage"))
}

export async function getPublicGeneralSettings() {
  return normalizeGeneralSettings(await getSiteSettingValue("general"))
}

export async function getHomepageContentData(): Promise<HomepageContentData> {
  const [settings, posts, stances, deskBriefItems] = await Promise.all([
    getPublicHomepageSettings(),
    getAllPosts(),
    getCoverageStances(),
    getDeskBriefItems(),
  ])

  const eligiblePosts = applyMarketNoteRules(posts, settings)
  const orderedPosts = orderBySlugPreference(eligiblePosts, settings.orderedPostSlugs)
  const leadPost = chooseLeadPost(orderedPosts, settings)
  const featuredPost = settings.showFeatured ? leadPost : null
  const remainingPosts = orderedPosts.filter((post) => post.slug !== featuredPost?.slug)
  const latestPosts = settings.showLatestResearch
    ? remainingPosts.slice(0, Math.max(0, settings.latestResearchLimit))
    : []
  const mobileBriefPosts = settings.showDeskBriefs
    ? remainingPosts.filter((post) => post.slug !== leadPost?.slug).slice(0, 3)
    : []
  const orderedStances = settings.showStances
    ? orderBySlugPreference(stances, settings.orderedStanceSlugs)
    : []

  return {
    deskBriefItems: settings.showDeskBriefs ? deskBriefItems : [],
    featuredPost,
    latestPosts,
    leadPost,
    mobileBriefPosts,
    settings,
    stances: orderedStances,
  }
}

export async function getPublicDocketItems(): Promise<PublicDocketItem[]> {
  const supabase = await createClient()
  const { data: inProgressItems, error: inProgressError } = await supabase
    .from("in_progress_items")
    .select("id, title, slug, summary, body, status, priority, updated_at")
    .order("priority", { ascending: false })
    .order("updated_at", { ascending: false })

  if (!inProgressError && (inProgressItems?.length ?? 0) > 0) {
    return (inProgressItems as InProgressRow[]).map(mapInProgressItem)
  }

  if (inProgressError) {
    console.error("Failed to load in-progress items.", inProgressError)
  }

  const { data: legacyItems, error: legacyError } = await supabase
    .from("pipeline")
    .select("id, codename, subtitle, redacted, category, hook, format, status, status_type, last_updated, sort_order, visible")
    .eq("visible", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("codename", { ascending: true })

  if (legacyError) {
    console.error("Failed to load legacy pipeline items.", legacyError)
    return []
  }

  return ((legacyItems ?? []) as LegacyPipelineRow[]).map(mapLegacyPipelineItem)
}
