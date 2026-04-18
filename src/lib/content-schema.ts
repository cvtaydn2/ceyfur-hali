import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().min(2),
  slogan: z.string(),
});

export const SEOSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
});

export const HeroSchema = z.object({
  title: z.string(),
  highlight: z.string(),
  description: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  image: z.string(),
});

// Since the whole SiteContent is complex, we'll validate the core structure
export const SiteContentSchema = z.object({
  brand: BrandSchema,
  seo: SEOSchema,
  hero: HeroSchema,
  services: z.any(),
  campaigns: z.any(),
  stats: z.any(),
  testimonials: z.any(),
  contact: z.any(),
  navigation: z.any(),
  footer: z.any(),
});
