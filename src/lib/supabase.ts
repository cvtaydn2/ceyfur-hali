import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Build sırasında uyarı ver, runtime'da hata fırlat
  if (typeof window !== "undefined" || process.env.NODE_ENV === "production") {
    console.error(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı olmalıdır."
    );
  }
}

/**
 * Public client — tarayıcı ve sunucu tarafında kullanılabilir.
 * RLS kuralları geçerlidir (read-only).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
