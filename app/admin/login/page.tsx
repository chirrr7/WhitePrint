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
    <div className={styles.loginShell}>
      <div className={styles.loginCard}>
        <p className={styles.eyebrow}>Whiteprint admin</p>
        <h1 className={styles.loginTitle}>Sign in to the private editorial panel.</h1>
        <p className={styles.loginIntro}>
          Supabase Auth handles the session, and the admin allowlist in Postgres
          decides who gets through.
        </p>

        {message ? (
          <div className={styles.message} data-tone={message.tone}>
            {message.text}
          </div>
        ) : null}

        {user ? (
          <div className={styles.noteCard} style={{ marginTop: '1rem' }}>
            <h2 className={styles.noteTitle}>Current session detected</h2>
            <p className={styles.noteBody}>
              You are signed in as <strong>{user.email}</strong>, but that account
              is not on the admin allowlist yet.
            </p>
            <div className={styles.buttonRow}>
              <form action={claimAdminAccessAction}>
                <button type="submit" className={styles.primaryButton}>
                  Activate admin access
                </button>
              </form>
              <form action={logoutAction}>
                <button type="submit" className={styles.secondaryButton}>
                  Use a different account
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <form action={loginAction} className={styles.panel} style={{ marginTop: '1rem' }}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Sign in</h2>
              <p className={styles.panelIntro}>
                Use the admin email you want to control the site with.
              </p>
            </div>
          </div>
          <div className={styles.formGrid}>
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
                placeholder="Your Supabase password"
                required
              />
            </label>
          </div>

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton}>
              Sign in
            </button>
          </div>
        </form>

        {!user ? (
          <form action={signupAction} className={styles.panel} style={{ marginTop: '1rem' }}>
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Create admin account</h2>
                <p className={styles.panelIntro}>
                  If you do not have a Supabase login yet, create it here first.
                </p>
              </div>
            </div>
            <div className={styles.formGrid}>
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
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.secondaryButton}>
                Create account
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  )
}
