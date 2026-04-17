import { redirect } from 'next/navigation'
import { claimAdminAccessAction, loginAction, logoutAction, signupAction } from '@/lib/admin/actions'
import { getAdminIdentity, getAuthenticatedUser } from '@/lib/admin/auth'
import { readPageMessage } from '@/lib/admin/messages'
import styles from '@/app/admin/admin.module.css'

interface AdminLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [message, admin, user] = await Promise.all([
    readPageMessage(searchParams),
    getAdminIdentity(),
    getAuthenticatedUser(),
  ])

  if (admin) {
    redirect('/admin')
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginGrain} aria-hidden="true" />
      <div className={styles.loginCard}>
        <h1 className={styles.loginLogo}>
          Whiteprint <em>Research</em>
        </h1>
        <p className={styles.loginIntro}>Private editorial panel</p>

        {message ? (
          <div className={styles.message} data-tone={message.tone}>
            {message.text}
          </div>
        ) : null}

        {user ? (
          <div className={styles.noteCard}>
            <h2 className={styles.noteTitle}>Session detected</h2>
            <p className={styles.noteBody}>
              Signed in as <strong>{user.email}</strong>, but not on the admin allowlist.
            </p>
            <div className={styles.buttonRow}>
              <form action={claimAdminAccessAction}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Activate access
                </button>
              </form>
              <form action={logoutAction}>
                <button type="submit" className={`${styles.btn} ${styles.btnGhost}`}>
                  Use different account
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <form action={loginAction} className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="admin@whiteprintresearch.com"
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </label>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`}>
            Sign in
          </button>
        </form>

        {!user ? (
          <>
            <div className={styles.loginDivider} />
            <form action={signupAction} className={styles.formGrid}>
              <p className={styles.label} style={{ textAlign: 'center' }}>
                Or create admin account
              </p>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  defaultValue="chirayuparikh7@gmail.com"
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Password</span>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Choose a strong password"
                  required
                />
              </label>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnFull}`}
              >
                Create account
              </button>
            </form>
          </>
        ) : null}
      </div>
    </div>
  )
}
