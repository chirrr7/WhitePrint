import { PostForm } from '@/components/admin/post-form'
import { getPostEditorData } from '@/lib/admin/data'
import { readPageMessage } from '@/lib/admin/messages'

interface NewPostPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const [message, editorData] = await Promise.all([
    readPageMessage(searchParams),
    getPostEditorData(),
  ])

  return (
    <PostForm
      message={message}
      mode="create"
      post={editorData.post}
      topics={editorData.topics}
      stances={editorData.stances}
      models={editorData.models}
    />
  )
}
