import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Cookie-free Supabase client for public read-only data.
 * Using this instead of the SSR client removes `cookies()` from the render path,
 * which allows Next.js to statically cache pages that only read public data.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey)
}
