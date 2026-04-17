import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { requireAdminIdentity } from '@/lib/admin/auth'
import styles from '@/app/admin/admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const admin = await requireAdminIdentity()

  return (
    <div className={styles.shell}>
      <AdminSidebar email={admin.email} />
      <main className={styles.main}>
        <div className={styles.page}>{children}</div>
      </main>
    </div>
  )
}
