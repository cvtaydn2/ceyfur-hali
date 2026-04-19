import { z } from "zod";
import { 
  ServiceItemSchema, 
  CampaignItemSchema, 
  TestimonialItemSchema, 
  StatItemSchema,
  FooterLinkSchema,
  ServiceAreaSchema,
  PriceItemSchema,
  SiteContentSchema
} from "@/lib/content-schema";

// Infer types from Zod schemas for "Single Source of Truth"
export type ServiceItem = z.infer<typeof ServiceItemSchema>;
export type CampaignItem = z.infer<typeof CampaignItemSchema>;
export type TestimonialItem = z.infer<typeof TestimonialItemSchema>;
export type StatItem = z.infer<typeof StatItemSchema>;
export type NavItem = z.infer<typeof FooterLinkSchema>;
export type ServiceArea = z.infer<typeof ServiceAreaSchema>;
export type PriceItem = z.infer<typeof PriceItemSchema>;

export type ContactInfo = z.infer<typeof SiteContentSchema>["contact"];
export type SiteContent = z.infer<typeof SiteContentSchema>;
