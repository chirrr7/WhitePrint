import { InProgressForm } from '@/components/admin/in-progress-form'
import { readPageMessage } from '@/lib/admin/messages'

interface AdminNewInProgressPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminNewInProgressPage({
  searchParams,
}: AdminNewInProgressPageProps) {
  const message = await readPageMessage(searchParams)

  return <InProgressForm item={null} message={message} mode="create" />
}
