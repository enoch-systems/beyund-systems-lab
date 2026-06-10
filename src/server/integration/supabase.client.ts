import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for use in Client Components (browser).
 * Uses the browser client from @supabase/ssr for proper cookie-based auth.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Supabase client for use in Server Components, Server Actions, and Route Handlers.
 * Uses the standard createClient (service role or anon key depending on env).
 */
export function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}