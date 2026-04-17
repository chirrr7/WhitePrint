import Link from 'next/link'
import { logoutAction } from '@/lib/admin/actions'
import styles from '@/app/admin/admin.module.css'

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/stances', label: 'Coverage' },
  { href: '/admin/in-progress', label: 'Pipeline' },
  { href: '/admin/models', label: 'Models' },
  { href: '/admin/homepage', label: 'Homepage' },
  { href: '/admin/settings', label: 'Settings' },
]

interface AdminSidebarProps {
  email: string
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <p className={styles.eyebrow}>Whiteprint admin</p>
        <h1 className={styles.sidebarTitle}>Private editorial desk</h1>
        <p className={styles.sidebarIntro}>
          Publishing controls for research, coverage, site copy, and the homepage
          rollout.
        </p>
      </div>

      <nav className={styles.navList} aria-label="Admin navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarMeta}>Signed in as</p>
        <p className={styles.sidebarEmail}>{email}</p>
        <form action={logoutAction}>
          <button type="submit" className={styles.secondaryButton}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
