import { supabase } from "./supabase";
import { SiteContent } from "@/types";
import fallbackContent from "@/data/siteContent.json";

export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_configs")
    .select("content")
    .eq("id", "main")
    .single();

  if (error || !data) {
    console.error("Error fetching site content, using fallback:", error);
    return fallbackContent as SiteContent;
  }

  return data.content as SiteContent;
}

export async function updateSiteContent(content: SiteContent) {
  const { error } = await supabase
    .from("site_configs")
    .upsert({ id: "main", content, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`Failed to update content: ${error.message}`);
  }
  
  return true;
}
