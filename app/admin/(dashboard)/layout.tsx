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
    <div className={styles.adminShell}>
      <AdminSidebar email={admin.email} />
      <div className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  )
}
