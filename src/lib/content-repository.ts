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

  // Runtime validation with deep merging for resilience
  // We merge the fetched data over the fallback content to ensure all required keys exist
  const mergedContent = {
    ...(fallbackContent as any),
    ...(data.content || {})
  };

  const result = SiteContentSchema.safeParse(mergedContent);
  
  if (!result.success) {
    console.error("Content partially invalid, using safe merged values. Issues:", 
      result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
    );
    // If even basic merging fails validation, return full fallback
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
