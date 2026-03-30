import { notFound } from 'next/navigation'
import { StanceForm } from '@/components/admin/stance-form'
import { getStanceEditorData } from '@/lib/admin/data'
import { readPageMessage } from '@/lib/admin/messages'

interface AdminStanceEditorPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminStanceEditorPage({
  params,
  searchParams,
}: AdminStanceEditorPageProps) {
  const { id } = await params
  const stanceId = Number(id)

  if (!Number.isFinite(stanceId)) {
    notFound()
  }

  const [message, editorData] = await Promise.all([
    readPageMessage(searchParams),
    getStanceEditorData(stanceId),
  ])

  if (!editorData.stance) {
    notFound()
  }

  return (
    <StanceForm
      linkedPosts={editorData.linkedPosts}
      message={message}
      mode="edit"
      stance={editorData.stance}
      topics={editorData.topics}
    />
  )
}
