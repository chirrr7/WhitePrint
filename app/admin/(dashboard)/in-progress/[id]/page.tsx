import { notFound } from 'next/navigation'
import { InProgressForm } from '@/components/admin/in-progress-form'
import { getInProgressEditorData } from '@/lib/admin/data'
import { readPageMessage } from '@/lib/admin/messages'

interface AdminInProgressEditorPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminInProgressEditorPage({
  params,
  searchParams,
}: AdminInProgressEditorPageProps) {
  const { id } = await params
  const itemId = Number(id)

  if (!Number.isFinite(itemId)) {
    notFound()
  }

  const [message, { item }] = await Promise.all([
    readPageMessage(searchParams),
    getInProgressEditorData(itemId),
  ])

  if (!item) {
    notFound()
  }

  return <InProgressForm item={item} message={message} mode="edit" />
}
