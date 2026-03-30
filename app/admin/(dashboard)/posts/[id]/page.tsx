import { notFound } from 'next/navigation'
import { PostForm } from '@/components/admin/post-form'
import { getPostEditorData } from '@/lib/admin/data'
import { readPageMessage } from '@/lib/admin/messages'

interface EditPostPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const [{ id }, message] = await Promise.all([params, readPageMessage(searchParams)])
  const postId = Number(id)

  if (!Number.isFinite(postId)) {
    notFound()
  }

  const editorData = await getPostEditorData(postId)

  if (!editorData.post) {
    notFound()
  }

  return (
    <PostForm
      message={message}
      mode="edit"
      post={editorData.post}
      topics={editorData.topics}
      stances={editorData.stances}
      models={editorData.models}
    />
  )
}
