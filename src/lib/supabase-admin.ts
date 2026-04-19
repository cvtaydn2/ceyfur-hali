/**
 * Admin Supabase client — YALNIZCA sunucu tarafında kullanılır.
 * Service Role Key ile RLS'yi bypass eder.
 * Bu dosyayı asla "use client" bileşenlerinden import etmeyin.
 */
import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-admin-key";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
