import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Public client for browser/client-side operations (Read-only by RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin client for server-side operations ONLY.
 * Uses the Service Role Key which bypasses RLS.
 * NEVER use this in client-side code (it will be undefined anyway).
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-admin-key"
);
