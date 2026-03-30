import 'server-only'

export interface PageMessage {
  text: string
  tone: 'error' | 'success'
}

const adminDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  year: 'numeric',
})

export async function readPageMessage(
  searchParams?: Promise<Record<string, string | string[] | undefined>>,
): Promise<PageMessage | null> {
  if (!searchParams) {
    return null
  }

  const resolved = await searchParams
  const success = typeof resolved.success === 'string' ? resolved.success : null
  const error = typeof resolved.error === 'string' ? resolved.error : null

  if (error) {
    return {
      text: error,
      tone: 'error',
    }
  }

  if (success) {
    return {
      text: success,
      tone: 'success',
    }
  }

  return null
}

export function formatAdminDate(value: string | null | undefined) {
  if (!value) {
    return 'Not set'
  }

  return adminDateFormatter.format(new Date(value))
}
