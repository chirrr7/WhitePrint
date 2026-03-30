import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AdminIdentity {
  email: string
  userId: string
}

export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return null
  }

  const supabase = await createClient()
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('user_id, email')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminUser) {
    return null
  }

  return {
    email: adminUser.email || user.email || '',
    userId: adminUser.user_id,
  }
}

export async function requireAdminIdentity() {
  const admin = await getAdminIdentity()

  if (!admin) {
    redirect('/admin/login')
  }

  return admin
}
