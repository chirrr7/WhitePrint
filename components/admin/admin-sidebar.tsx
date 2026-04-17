'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/admin/actions'
import styles from '@/app/admin/admin.module.css'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/stances', label: 'Stances' },
  { href: '/admin/models', label: 'Models' },
  { href: '/admin/homepage', label: 'Homepage' },
  { href: '/admin/in-progress', label: 'In Progress' },
  { href: '/admin/settings', label: 'Settings' },
]

interface AdminSidebarProps {
  email: string
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname() ?? '/admin'

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.sidebarLogo}>
        Whiteprint <em>Research</em>
      </Link>

      <nav className={styles.nav} aria-label="Admin navigation">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarMeta}>Signed in</p>
        <p className={styles.sidebarEmail}>{email}</p>
        <form action={logoutAction}>
          <button type="submit" className={`${styles.btn} ${styles.btnGhost} ${styles.btnFull}`}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
