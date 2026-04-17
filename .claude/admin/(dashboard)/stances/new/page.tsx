import { StanceForm } from '@/components/admin/stance-form'
import { getStanceEditorData } from '@/lib/admin/data'
import { readPageMessage } from '@/lib/admin/messages'

interface NewAdminStancePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewAdminStancePage({ searchParams }: NewAdminStancePageProps) {
  const [message, editorData] = await Promise.all([
    readPageMessage(searchParams),
    getStanceEditorData(),
  ])

  return (
    <StanceForm
      linkedPosts={editorData.linkedPosts}
      message={message}
      mode="create"
      stance={editorData.stance}
      topics={editorData.topics}
    />
  )
}
