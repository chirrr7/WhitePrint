const DEFAULT_SUPABASE_URL = 'https://phbgpwwrholkgseemhma.supabase.co'
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_p861OdS4SK76JNJJZka_9A_ehxn9gc8'

function resolveEnvValue(names: string[], fallbackValue?: string) {
  for (const name of names) {
    const value = process.env[name]

    if (value) {
      return value
    }
  }

  if (fallbackValue) {
    return fallbackValue
  }

  throw new Error(`Missing Supabase environment variable: ${names.join(' or ')}`)
}

// These values are safe to expose publicly and keep the app bootable if Vercel's
// public env vars lag behind the current Supabase project setup.
export const supabaseUrl = resolveEnvValue(
  ['NEXT_PUBLIC_SUPABASE_URL'],
  DEFAULT_SUPABASE_URL,
)

export const supabasePublishableKey = resolveEnvValue(
  ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'],
  DEFAULT_SUPABASE_PUBLISHABLE_KEY,
)
