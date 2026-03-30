'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getAuthenticatedUser, requireAdminIdentity } from '@/lib/admin/auth'
import type { Json } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/server'

const postStatusSchema = z.enum(['draft', 'published', 'archived'])
const stanceStatusSchema = z.enum(['draft', 'published', 'archived'])
const inProgressStatusSchema = z.enum(['backlog', 'active', 'blocked', 'done'])
const uploadSchema = z.object({
  title: z.string().trim().min(1),
  version: z.string().trim().min(1),
})

function withMessage(path: string, kind: 'error' | 'success', message: string) {
  const params = new URLSearchParams({ [kind]: message })
  return `${path}?${params.toString()}`
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = readString(formData, key)

  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === 'true'
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function toIsoTimestamp(raw: string) {
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function readList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/\r?\n/)
        .map((entry) => slugify(entry))
        .filter(Boolean),
    ),
  )
}

function getFileExtension(fileName: string) {
  const segments = fileName.split('.')

  if (segments.length < 2) {
    return ''
  }

  return `.${segments.at(-1)!.toLowerCase().replace(/[^a-z0-9]/g, '')}`
}

async function ensureModelCanBeLinked(postId: number | null, linkedModelId: number | null) {
  if (!linkedModelId) {
    return null
  }

  const supabase = await createClient()
  const { data: model } = await supabase
    .from('models')
    .select('id, post_id')
    .eq('id', linkedModelId)
    .single()

  if (!model) {
    return 'The selected model could not be found.'
  }

  if (model.post_id && model.post_id !== postId) {
    return 'That model is already linked to another post. Unlink it first.'
  }

  return null
}

async function syncLinkedModel(postId: number, previousModelId: number | null, nextModelId: number | null) {
  const supabase = await createClient()

  if (previousModelId && previousModelId !== nextModelId) {
    await supabase
      .from('models')
      .update({ post_id: null })
      .eq('id', previousModelId)
      .eq('post_id', postId)
  }

  if (nextModelId) {
    await supabase.from('models').update({ post_id: postId }).eq('id', nextModelId)
  }
}

export async function loginAction(formData: FormData) {
  const email = readString(formData, 'email')
  const password = readString(formData, 'password')

  if (!email || !password) {
    redirect(withMessage('/admin/login', 'error', 'Enter both email and password.'))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    redirect(withMessage('/admin/login', 'error', error?.message || 'Login failed.'))
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (!adminUser) {
    redirect(
      withMessage(
        '/admin/login',
        'success',
        'Signed in. Finish the one-time admin activation below.',
      ),
    )
  }

  redirect('/admin')
}

export async function signupAction(formData: FormData) {
  const email = readString(formData, 'email')
  const password = readString(formData, 'password')

  if (!email || !password) {
    redirect(withMessage('/admin/login', 'error', 'Enter both email and password.'))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(withMessage('/admin/login', 'error', error.message || 'Sign up failed.'))
  }

  if (data.session) {
    const { error: claimError } = await supabase.rpc('claim_admin_access')

    if (!claimError) {
      redirect('/admin')
    }

    redirect(withMessage('/admin/login', 'error', claimError.message))
  }

  redirect(
    withMessage(
      '/admin/login',
      'success',
      'Account created. Check your email if Supabase asks for confirmation, then sign in here.',
    ),
  )
}

export async function claimAdminAccessAction() {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect(withMessage('/admin/login', 'error', 'Sign in first, then activate admin access.'))
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('claim_admin_access')

  if (error) {
    redirect(withMessage('/admin/login', 'error', error.message || 'Could not activate admin access.'))
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function savePostAction(formData: FormData) {
  await requireAdminIdentity()

  const id = readOptionalNumber(formData, 'id')
  const title = readString(formData, 'title')
  const inputSlug = readString(formData, 'slug')
  const slug = slugify(inputSlug || title)
  const status = postStatusSchema.safeParse(readString(formData, 'status'))
  const summary = readString(formData, 'summary')
  const body = readString(formData, 'body')
  const topicId = readOptionalNumber(formData, 'topic_id')
  const stanceId = readOptionalNumber(formData, 'stance_id')
  const linkedModelId = readOptionalNumber(formData, 'linked_model_id')
  const featured = readCheckbox(formData, 'featured')
  const homepage = readCheckbox(formData, 'homepage')
  const publishedAtInput = readString(formData, 'published_at')
  const returnPath = id ? `/admin/posts/${id}` : '/admin/posts/new'

  if (!title || !slug || !status.success) {
    redirect(withMessage(returnPath, 'error', 'Title, slug, and status are required.'))
  }

  const linkedModelError = await ensureModelCanBeLinked(id, linkedModelId)
  if (linkedModelError) {
    redirect(withMessage(returnPath, 'error', linkedModelError))
  }

  const publishedAt =
    publishedAtInput && toIsoTimestamp(publishedAtInput)
      ? toIsoTimestamp(publishedAtInput)
      : status.data === 'published'
        ? new Date().toISOString()
        : null

  const supabase = await createClient()
  let previousModelId: number | null = null

  if (id) {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('linked_model_id')
      .eq('id', id)
      .single()

    previousModelId = existingPost?.linked_model_id ?? null
  }

  const payload = {
    body,
    featured,
    homepage,
    linked_model_id: linkedModelId,
    published_at: publishedAt,
    slug,
    stance_id: stanceId,
    status: status.data,
    summary,
    title,
    topic_id: topicId,
  }

  const query = id
    ? supabase.from('posts').update(payload).eq('id', id).select('id').single()
    : supabase.from('posts').insert(payload).select('id').single()

  const { data: savedPost, error } = await query

  if (error || !savedPost) {
    redirect(withMessage(returnPath, 'error', error?.message || 'Unable to save this post.'))
  }

  await syncLinkedModel(savedPost.id, previousModelId, linkedModelId)

  revalidatePath('/admin')
  revalidatePath('/admin/posts')
  revalidatePath(`/admin/posts/${savedPost.id}`)
  redirect(withMessage('/admin/posts', 'success', 'Post saved.'))
}

export async function deletePostAction(formData: FormData) {
  await requireAdminIdentity()

  const id = readOptionalNumber(formData, 'id')
  if (!id) {
    redirect(withMessage('/admin/posts', 'error', 'Missing post id.'))
  }

  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    redirect(withMessage(`/admin/posts/${id}`, 'error', error.message || 'Unable to delete this post.'))
  }

  revalidatePath('/admin')
  revalidatePath('/admin/posts')
  redirect(withMessage('/admin/posts', 'success', 'Post deleted.'))
}

export async function createStanceAction(formData: FormData) {
  await requireAdminIdentity()

  const title = readString(formData, 'title')
  const slug = slugify(readString(formData, 'slug') || title)
  const summary = readString(formData, 'summary')
  const body = readString(formData, 'body')
  const topicId = readOptionalNumber(formData, 'topic_id')
  const status = stanceStatusSchema.safeParse(readString(formData, 'status'))
  const publishedAtInput = readString(formData, 'published_at')

  if (!title || !slug || !status.success) {
    redirect(withMessage('/admin/stances', 'error', 'Title, slug, and status are required.'))
  }

  const publishedAt =
    publishedAtInput && toIsoTimestamp(publishedAtInput)
      ? toIsoTimestamp(publishedAtInput)
      : status.data === 'published'
        ? new Date().toISOString()
        : null

  const supabase = await createClient()
  const { error } = await supabase.from('stances').insert({
    body,
    published_at: publishedAt,
    slug,
    status: status.data,
    summary,
    title,
    topic_id: topicId,
  })

  if (error) {
    redirect(withMessage('/admin/stances', 'error', error.message || 'Unable to save this stance.'))
  }

  revalidatePath('/admin')
  revalidatePath('/admin/stances')
  redirect(withMessage('/admin/stances', 'success', 'Stance saved.'))
}

export async function createInProgressItemAction(formData: FormData) {
  await requireAdminIdentity()

  const title = readString(formData, 'title')
  const slug = slugify(readString(formData, 'slug') || title)
  const summary = readString(formData, 'summary')
  const body = readString(formData, 'body')
  const status = inProgressStatusSchema.safeParse(readString(formData, 'status'))
  const priority = readOptionalNumber(formData, 'priority') ?? 0

  if (!title || !slug || !status.success) {
    redirect(
      withMessage('/admin/in-progress', 'error', 'Title, slug, and status are required.'),
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.from('in_progress_items').insert({
    body,
    priority,
    slug,
    status: status.data,
    summary,
    title,
  })

  if (error) {
    redirect(
      withMessage('/admin/in-progress', 'error', error.message || 'Unable to save this work item.'),
    )
  }

  revalidatePath('/admin')
  revalidatePath('/admin/in-progress')
  redirect(withMessage('/admin/in-progress', 'success', 'In-progress item saved.'))
}

export async function uploadModelAction(formData: FormData) {
  await requireAdminIdentity()

  const parsed = uploadSchema.safeParse({
    title: readString(formData, 'title'),
    version: readString(formData, 'version'),
  })
  const topicId = readOptionalNumber(formData, 'topic_id')
  const postId = readOptionalNumber(formData, 'post_id')
  const file = formData.get('file')

  if (!parsed.success || !(file instanceof File) || file.size === 0) {
    redirect(withMessage('/admin/models', 'error', 'Title, version, and a file are required.'))
  }

  const ext = getFileExtension(file.name)
  let topicSegment = 'general'

  if (topicId) {
    const lookupClient = await createClient()
    const { data: topic } = await lookupClient
      .from('topics')
      .select('slug')
      .eq('id', topicId)
      .maybeSingle()

    topicSegment = topic?.slug || topicSegment
  }

  const filePath = `${topicSegment}/${slugify(parsed.data.title)}-${slugify(parsed.data.version)}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`

  const supabase = await createClient()
  const { error: uploadError } = await supabase.storage.from('models').upload(filePath, file, {
    contentType: file.type || 'application/octet-stream',
  })

  if (uploadError) {
    redirect(withMessage('/admin/models', 'error', uploadError.message || 'Upload failed.'))
  }

  const { error: insertError } = await supabase.from('models').insert({
    file_path: filePath,
    post_id: postId,
    title: parsed.data.title,
    topic_id: topicId,
    version: parsed.data.version,
  })

  if (insertError) {
    await supabase.storage.from('models').remove([filePath])
    redirect(withMessage('/admin/models', 'error', insertError.message || 'Could not save this model.'))
  }

  revalidatePath('/admin')
  revalidatePath('/admin/models')
  redirect(withMessage('/admin/models', 'success', 'Model uploaded.'))
}

async function saveSiteSettingsRecord(
  key: 'homepage' | 'general',
  label: string,
  value: Json,
  path: string,
) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').upsert({
    is_public: true,
    key,
    label,
    value,
  })

  if (error) {
    redirect(withMessage(path, 'error', error.message || 'Could not save settings.'))
  }
}

export async function saveHomepageSettingsAction(formData: FormData) {
  await requireAdminIdentity()

  await saveSiteSettingsRecord(
    'homepage',
    'Homepage',
    {
      featuredPostSlug: readString(formData, 'featuredPostSlug'),
      heroLabel: readString(formData, 'heroLabel'),
      latestResearchLimit: readOptionalNumber(formData, 'latestResearchLimit') ?? 4,
      marketNotesLimit: readOptionalNumber(formData, 'marketNotesLimit') ?? 6,
      orderedPostSlugs: readList(readString(formData, 'orderedPostSlugs')),
      orderedStanceSlugs: readList(readString(formData, 'orderedStanceSlugs')),
      showDeskBriefs: readCheckbox(formData, 'showDeskBriefs'),
      showFeatured: readCheckbox(formData, 'showFeatured'),
      showLatestResearch: readCheckbox(formData, 'showLatestResearch'),
      showMarketNotes: readCheckbox(formData, 'showMarketNotes'),
      showStances: readCheckbox(formData, 'showStances'),
    },
    '/admin/homepage',
  )

  revalidatePath('/admin')
  revalidatePath('/admin/homepage')
  revalidatePath('/')
  redirect(withMessage('/admin/homepage', 'success', 'Homepage settings saved.'))
}

export async function saveGeneralSettingsAction(formData: FormData) {
  await requireAdminIdentity()

  await saveSiteSettingsRecord(
    'general',
    'General Settings',
    {
      brandTagline: readString(formData, 'brandTagline'),
      contactEmail: readString(formData, 'contactEmail'),
      navCtaLabel: readString(formData, 'navCtaLabel'),
      siteDescription: readString(formData, 'siteDescription'),
      siteTitle: readString(formData, 'siteTitle'),
    },
    '/admin/settings',
  )

  revalidatePath('/admin')
  revalidatePath('/admin/settings')
  redirect(withMessage('/admin/settings', 'success', 'General settings saved.'))
}

export async function createTopicAction(formData: FormData) {
  await requireAdminIdentity()

  const name = readString(formData, 'name')
  const slug = slugify(readString(formData, 'slug') || name)
  const description = readString(formData, 'description')
  const sortOrder = readOptionalNumber(formData, 'sort_order') ?? 0
  const isVisible = readCheckbox(formData, 'is_visible')

  if (!name || !slug) {
    redirect(withMessage('/admin/settings', 'error', 'Topic name and slug are required.'))
  }

  const supabase = await createClient()
  const { error } = await supabase.from('topics').insert({
    description: description || null,
    is_visible: isVisible,
    name,
    slug,
    sort_order: sortOrder,
  })

  if (error) {
    redirect(withMessage('/admin/settings', 'error', error.message || 'Unable to save this topic.'))
  }

  revalidatePath('/admin')
  revalidatePath('/admin/settings')
  redirect(withMessage('/admin/settings', 'success', 'Topic saved.'))
}
