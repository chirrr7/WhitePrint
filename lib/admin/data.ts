import 'server-only'

import { getFilesystemPosts } from '@/lib/posts'
import {
  normalizeAboutSettings,
  normalizeGeneralSettings,
  normalizeHomepageSettings,
  type AboutSettings,
  type GeneralSettings,
  type HomepageSettings,
} from '@/lib/site-settings'
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
  editorialHealth: {
    unmanagedFilesystemPosts: FilesystemBacklogPost[]
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

export interface FilesystemBacklogPost {
  category: string
  date: string
  excerpt: string
  slug: string
  title: string
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
  conviction: string
  coverageCategory: string
  coverageStatus: string
  id: number
  linkedPostLabels: string[]
  name: string
  opinion: string
  publishedAt: string | null
  slug: string
  status: string
  summary: string
  tags: string[]
  thesis: string
  ticker: string
  title: string
  topicLabel: string | null
  updatedAt: string
}

export interface StanceEditorData {
  linkedPosts: Array<{
    id: number
    slug: string
    title: string
  }>
  stance: {
    base: number | null
    bear: number | null
    body: string
    bull: number | null
    conviction: string
    coverage_category: string
    coverage_status: string
    id: number
    name: string
    opinion: string
    published_at: string | null
    scenario_type: string
    slug: string
    status: string
    summary: string
    tags: string[]
    thesis: string
    ticker: string
    title: string
    topic_id: number | null
  } | null
  topics: SelectOption[]
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

export interface InProgressEditorData {
  item: {
    body: string
    id: number
    priority: number
    slug: string
    status: string
    summary: string
    title: string
  } | null
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

function isMissingBodyMdxColumn(error: { code?: string; message?: string } | null | undefined) {
  return error?.code === '42703' && error.message?.includes('body_mdx')
}

function getFilesystemBacklogPosts(databasePostSlugs: string[]): FilesystemBacklogPost[] {
  const databaseSlugSet = new Set(databasePostSlugs)

  return getFilesystemPosts()
    .filter((post) => !databaseSlugSet.has(post.slug))
    .map((post) => ({
      category: post.category,
      date: post.date,
      excerpt: post.excerpt,
      slug: post.slug,
      title: post.title,
    }))
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient()

  const [
    draftPosts,
    publishedPosts,
    archivedPosts,
    allPosts,
    stances,
    inProgress,
    latestModels,
  ] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'archived'),
    supabase.from('posts').select('slug'),
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
    editorialHealth: {
      unmanagedFilesystemPosts: getFilesystemBacklogPosts(
        (allPosts.data ?? []).map((post) => post.slug),
      ),
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

  return {
    filesystemBacklog: getFilesystemBacklogPosts(posts.map((post) => post.slug)),
    posts,
  }
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
    } as typeof initialPostResult
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
  const [stancesResult, topics, linkedPostsResult] = await Promise.all([
    supabase
      .from('stances')
      .select('*')
      .order('updated_at', { ascending: false }),
    getSelectOptions('topics'),
    supabase
      .from('posts')
      .select('id, title, slug, stance_id, updated_at')
      .not('stance_id', 'is', null)
      .order('updated_at', { ascending: false }),
  ])

  const topicMap = new Map(topics.map((item) => [item.id, item.label]))
  const linkedPostsByStance = new Map<number, string[]>()

  for (const post of linkedPostsResult.data ?? []) {
    if (!post.stance_id) {
      continue
    }

    const current = linkedPostsByStance.get(post.stance_id) ?? []
    current.push(`${post.title} (${post.slug})`)
    linkedPostsByStance.set(post.stance_id, current)
  }

  const stances: StanceListItem[] = (stancesResult.data ?? []).map((stance) => ({
    conviction: stance.conviction ?? 'medium',
    coverageCategory: stance.coverage_category ?? 'equity',
    coverageStatus: stance.coverage_status ?? 'active',
    id: stance.id,
    linkedPostLabels: linkedPostsByStance.get(stance.id) ?? [],
    name: stance.name ?? stance.title,
    opinion: stance.opinion ?? 'neutral',
    publishedAt: stance.published_at,
    slug: stance.slug,
    status: stance.status,
    summary: stance.summary,
    tags: Array.isArray(stance.tags) ? stance.tags : [],
    thesis: stance.thesis ?? stance.summary,
    ticker: stance.ticker ?? '',
    title: stance.title,
    topicLabel: stance.topic_id ? topicMap.get(stance.topic_id) ?? null : null,
    updatedAt: stance.updated_at,
  }))

  return {
    stances,
    topics,
  }
}

export async function getStanceEditorData(id?: number): Promise<StanceEditorData> {
  const supabase = await createClient()
  const [topics, initialStanceResult, linkedPostsResult] = await Promise.all([
    getSelectOptions('topics'),
    id
      ? supabase.from('stances').select('*').eq('id', id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    id
      ? supabase
          .from('posts')
          .select('id, title, slug, updated_at')
          .eq('stance_id', id)
          .order('updated_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ])

  const stance = initialStanceResult.data
    ? {
        base: initialStanceResult.data.base ?? null,
        bear: initialStanceResult.data.bear ?? null,
        body: initialStanceResult.data.body ?? '',
        bull: initialStanceResult.data.bull ?? null,
        conviction: initialStanceResult.data.conviction ?? 'medium',
        coverage_category: initialStanceResult.data.coverage_category ?? 'equity',
        coverage_status: initialStanceResult.data.coverage_status ?? 'active',
        id: initialStanceResult.data.id,
        name: initialStanceResult.data.name ?? initialStanceResult.data.title,
        opinion: initialStanceResult.data.opinion ?? 'neutral',
        published_at: initialStanceResult.data.published_at,
        scenario_type: initialStanceResult.data.scenario_type ?? 'price',
        slug: initialStanceResult.data.slug,
        status: initialStanceResult.data.status,
        summary: initialStanceResult.data.summary,
        tags: Array.isArray(initialStanceResult.data.tags) ? initialStanceResult.data.tags : [],
        thesis: initialStanceResult.data.thesis ?? initialStanceResult.data.summary,
        ticker: initialStanceResult.data.ticker ?? '',
        title: initialStanceResult.data.title,
        topic_id: initialStanceResult.data.topic_id,
      }
    : null

  return {
    linkedPosts: (linkedPostsResult.data ?? []).map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
    })),
    stance,
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

export async function getInProgressEditorData(id?: number): Promise<InProgressEditorData> {
  const supabase = await createClient()
  const itemResult = id
    ? await supabase
        .from('in_progress_items')
        .select('id, title, slug, summary, body, status, priority')
        .eq('id', id)
        .maybeSingle()
    : { data: null }

  return {
    item: itemResult.data
      ? {
          body: itemResult.data.body ?? '',
          id: itemResult.data.id,
          priority: itemResult.data.priority ?? 0,
          slug: itemResult.data.slug,
          status: itemResult.data.status,
          summary: itemResult.data.summary,
          title: itemResult.data.title,
        }
      : null,
  }
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
  const [generalSettingsResult, aboutSettingsResult, topicsResult] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'general').maybeSingle(),
    supabase.from('site_settings').select('value').eq('key', 'about').maybeSingle(),
    supabase
      .from('topics')
      .select('id, name, slug, description, is_visible, sort_order, updated_at')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  return {
    about: normalizeAboutSettings(aboutSettingsResult.data?.value),
    general: normalizeGeneralSettings(generalSettingsResult.data?.value),
    topics: topicsResult.data ?? [],
  }
}
