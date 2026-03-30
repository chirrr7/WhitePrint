import 'server-only'

import type { Json } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/server'

export interface SelectOption {
  id: number
  label: string
  slug: string
}

export interface DashboardData {
  counts: {
    archived: number
    drafts: number
    inProgress: number
    published: number
    stances: number
  }
  latestModels: Array<{
    id: number
    title: string
    uploadedAt: string
    version: string
  }>
}

export interface PostListItem {
  featured: boolean
  homepage: boolean
  id: number
  linkedModelLabel: string | null
  publishedAt: string | null
  slug: string
  stanceLabel: string | null
  status: string
  title: string
  topicLabel: string | null
  updatedAt: string
}

export interface PostEditorData {
  models: SelectOption[]
  post: {
    body: string
    body_mdx: string
    featured: boolean
    homepage: boolean
    id: number
    linked_model_id: number | null
    published_at: string | null
    slug: string
    stance_id: number | null
    status: string
    summary: string
    title: string
    topic_id: number | null
  } | null
  stances: SelectOption[]
  topics: SelectOption[]
}

export interface StanceListItem {
  id: number
  publishedAt: string | null
  slug: string
  status: string
  summary: string
  title: string
  topicLabel: string | null
  updatedAt: string
}

export interface InProgressListItem {
  id: number
  priority: number
  slug: string
  status: string
  summary: string
  title: string
  updatedAt: string
}

export interface ModelListItem {
  filePath: string
  id: number
  postLabel: string | null
  title: string
  topicLabel: string | null
  uploadedAt: string
  version: string
}

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

const homepageDefaults: HomepageSettings = {
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

const generalDefaults: GeneralSettings = {
  brandTagline: 'Clarity over consensus.',
  contactEmail: '',
  navCtaLabel: 'Get in touch',
  siteDescription: 'Independent macro and equity research',
  siteTitle: 'Whiteprint Research',
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

function asStringArray(value: Json | undefined) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

function isMissingBodyMdxColumn(error: { code?: string; message?: string } | null | undefined) {
  return error?.code === '42703' && error.message?.includes('body_mdx')
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

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient()

  const [
    draftPosts,
    publishedPosts,
    archivedPosts,
    stances,
    inProgress,
    latestModels,
  ] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'archived'),
    supabase.from('stances').select('id', { count: 'exact', head: true }),
    supabase.from('in_progress_items').select('id', { count: 'exact', head: true }),
    supabase
      .from('models')
      .select('id, title, version, uploaded_at')
      .order('uploaded_at', { ascending: false })
      .limit(5),
  ])

  return {
    counts: {
      archived: archivedPosts.count ?? 0,
      drafts: draftPosts.count ?? 0,
      inProgress: inProgress.count ?? 0,
      published: publishedPosts.count ?? 0,
      stances: stances.count ?? 0,
    },
    latestModels: (latestModels.data ?? []).map((model) => ({
      id: model.id,
      title: model.title,
      uploadedAt: model.uploaded_at,
      version: model.version,
    })),
  }
}

async function getSelectOptions(table: 'topics' | 'stances' | 'models') {
  const supabase = await createClient()

  if (table === 'topics') {
    const { data } = await supabase
      .from('topics')
      .select('id, name, slug')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    return (data ?? []).map((topic) => ({
      id: topic.id,
      label: topic.name,
      slug: topic.slug,
    }))
  }

  if (table === 'stances') {
    const { data } = await supabase
      .from('stances')
      .select('id, title, slug')
      .order('updated_at', { ascending: false })

    return (data ?? []).map((stance) => ({
      id: stance.id,
      label: stance.title,
      slug: stance.slug,
    }))
  }

  const { data } = await supabase
    .from('models')
    .select('id, title, version, file_path')
    .order('uploaded_at', { ascending: false })

  return (data ?? []).map((model) => ({
    id: model.id,
    label: `${model.title} (${model.version})`,
    slug: model.file_path,
  }))
}

export async function getPostsPageData() {
  const supabase = await createClient()
  const [postsResult, topics, stances, models] = await Promise.all([
    supabase
      .from('posts')
      .select(
        'id, title, slug, status, featured, homepage, topic_id, stance_id, linked_model_id, published_at, updated_at',
      )
      .order('updated_at', { ascending: false }),
    getSelectOptions('topics'),
    getSelectOptions('stances'),
    getSelectOptions('models'),
  ])

  const topicMap = new Map(topics.map((item) => [item.id, item.label]))
  const stanceMap = new Map(stances.map((item) => [item.id, item.label]))
  const modelMap = new Map(models.map((item) => [item.id, item.label]))

  const posts: PostListItem[] = (postsResult.data ?? []).map((post) => ({
    featured: post.featured,
    homepage: post.homepage,
    id: post.id,
    linkedModelLabel: post.linked_model_id ? modelMap.get(post.linked_model_id) ?? null : null,
    publishedAt: post.published_at,
    slug: post.slug,
    stanceLabel: post.stance_id ? stanceMap.get(post.stance_id) ?? null : null,
    status: post.status,
    title: post.title,
    topicLabel: post.topic_id ? topicMap.get(post.topic_id) ?? null : null,
    updatedAt: post.updated_at,
  }))

  return { posts }
}

export async function getPostEditorData(id?: number): Promise<PostEditorData> {
  const supabase = await createClient()

  const [topics, stances, models, initialPostResult] = await Promise.all([
    getSelectOptions('topics'),
    getSelectOptions('stances'),
    getSelectOptions('models'),
    id
      ? supabase
          .from('posts')
          .select(
            'id, title, slug, summary, body, body_mdx, status, topic_id, featured, homepage, stance_id, linked_model_id, published_at',
          )
          .eq('id', id)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ])

  let postResult = initialPostResult

  if (id && isMissingBodyMdxColumn(initialPostResult.error)) {
    const fallback = await supabase
      .from('posts')
      .select(
        'id, title, slug, summary, body, status, topic_id, featured, homepage, stance_id, linked_model_id, published_at',
      )
      .eq('id', id)
      .single()

    postResult = {
      ...fallback,
      data: fallback.data ? { ...fallback.data, body_mdx: '' } : null,
    }
  }

  const post =
    postResult.data
      ? {
          ...postResult.data,
          body_mdx: postResult.data.body_mdx || postResult.data.body || '',
        }
      : null

  return {
    models,
    post,
    stances,
    topics,
  }
}

export async function getStancesPageData() {
  const supabase = await createClient()
  const [stancesResult, topics] = await Promise.all([
    supabase
      .from('stances')
      .select('id, title, slug, summary, status, topic_id, published_at, updated_at')
      .order('updated_at', { ascending: false }),
    getSelectOptions('topics'),
  ])

  const topicMap = new Map(topics.map((item) => [item.id, item.label]))
  const stances: StanceListItem[] = (stancesResult.data ?? []).map((stance) => ({
    id: stance.id,
    publishedAt: stance.published_at,
    slug: stance.slug,
    status: stance.status,
    summary: stance.summary,
    title: stance.title,
    topicLabel: stance.topic_id ? topicMap.get(stance.topic_id) ?? null : null,
    updatedAt: stance.updated_at,
  }))

  return {
    stances,
    topics,
  }
}

export async function getInProgressPageData() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('in_progress_items')
    .select('id, title, slug, summary, status, priority, updated_at')
    .order('priority', { ascending: false })
    .order('updated_at', { ascending: false })

  const items: InProgressListItem[] = (data ?? []).map((item) => ({
    id: item.id,
    priority: item.priority,
    slug: item.slug,
    status: item.status,
    summary: item.summary,
    title: item.title,
    updatedAt: item.updated_at,
  }))

  return { items }
}

export async function getModelsPageData() {
  const supabase = await createClient()
  const [modelsResult, posts, topics] = await Promise.all([
    supabase
      .from('models')
      .select('id, title, version, file_path, post_id, topic_id, uploaded_at')
      .order('uploaded_at', { ascending: false }),
    supabase
      .from('posts')
      .select('id, title, slug')
      .order('updated_at', { ascending: false }),
    getSelectOptions('topics'),
  ])

  const postMap = new Map((posts.data ?? []).map((post) => [post.id, `${post.title} (${post.slug})`]))
  const topicMap = new Map(topics.map((topic) => [topic.id, topic.label]))

  const models: ModelListItem[] = (modelsResult.data ?? []).map((model) => ({
    filePath: model.file_path,
    id: model.id,
    postLabel: model.post_id ? postMap.get(model.post_id) ?? null : null,
    title: model.title,
    topicLabel: model.topic_id ? topicMap.get(model.topic_id) ?? null : null,
    uploadedAt: model.uploaded_at,
    version: model.version,
  }))

  const postOptions: SelectOption[] = (posts.data ?? []).map((post) => ({
    id: post.id,
    label: post.title,
    slug: post.slug,
  }))

  return {
    models,
    posts: postOptions,
    topics,
  }
}

export async function getHomepagePageData() {
  const supabase = await createClient()
  const [settingsResult, postsResult, stancesResult] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'homepage').maybeSingle(),
    supabase
      .from('posts')
      .select('id, title, slug, status')
      .order('updated_at', { ascending: false }),
    supabase
      .from('stances')
      .select('id, title, slug, status')
      .order('updated_at', { ascending: false }),
  ])

  return {
    posts: postsResult.data ?? [],
    settings: normalizeHomepageSettings(settingsResult.data?.value),
    stances: stancesResult.data ?? [],
  }
}

export async function getSettingsPageData() {
  const supabase = await createClient()
  const [settingsResult, topicsResult] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'general').maybeSingle(),
    supabase
      .from('topics')
      .select('id, name, slug, description, is_visible, sort_order, updated_at')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  return {
    general: normalizeGeneralSettings(settingsResult.data?.value),
    topics: topicsResult.data ?? [],
  }
}
