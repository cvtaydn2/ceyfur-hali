import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

/**
 * Public client — tarayıcı ve sunucu tarafında kullanılabilir.
 * RLS kuralları geçerlidir (read-only).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
