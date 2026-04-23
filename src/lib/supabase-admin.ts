/**
 * Admin Supabase client — YALNIZCA sunucu tarafında kullanılır.
 * Service Role Key ile RLS'yi bypass eder.
 * Bu dosyayı asla "use client" bileşenlerinden import etmeyin.
 */
import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "[supabase-admin] NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY env değişkenleri tanımlı olmalıdır."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
