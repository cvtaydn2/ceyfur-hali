import { supabase, supabaseAdmin } from "./supabase";
import { SiteContent } from "@/types";
import fallbackContent from "@/data/siteContent.json";
import { SiteContentSchema } from "./content-schema";

export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_configs")
    .select("content")
    .eq("id", "main")
    .single();

  if (error || !data) {
    console.error("Error fetching site content, using fallback:", error);
    return fallbackContent as unknown as SiteContent;
  }

  // Runtime validation with Zod
  const result = SiteContentSchema.safeParse(data.content);
  
  if (!result.success) {
    console.error("Content validation failed, using fallback. Errors:", result.error.format());
    return fallbackContent as unknown as SiteContent;
  }

  return result.data;
}

export async function updateSiteContent(content: SiteContent) {
  const { error } = await supabaseAdmin
    .from("site_configs")
    .upsert({ id: "main", content, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`Failed to update content: ${error.message}`);
  }
  
  return true;
}
