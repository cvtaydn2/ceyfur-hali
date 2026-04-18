import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().min(2),
  slogan: z.string(),
  logo: z.string().optional(),
});

export const SEOSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  ogImage: z.string().optional(),
});

export const HeroSchema = z.object({
  title: z.string(),
  highlight: z.string(),
  description: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  image: z.string(),
});

export const AboutSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  content: z.string(),
  features: z.array(z.string()),
  image: z.string().optional(),
});

// Full SiteContent Schema
export const SiteContentSchema = z.object({
  brand: BrandSchema,
  seo: SEOSchema,
  hero: HeroSchema,
  about: AboutSchema,
  services: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.any()),
  }),
  campaigns: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.any()),
  }),
  stats: z.array(z.any()),
  testimonials: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(z.any()),
  }),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string(),
    email: z.string(),
    address: z.string(),
    district: z.string(),
    city: z.string(),
    workingHours: z.string(),
    googleMapsUrl: z.string(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
  navigation: z.array(z.object({
    label: z.string(),
    href: z.string(),
  })),
  footer: z.object({
    about: z.string(),
    copyright: z.string(),
    links: z.array(z.any()),
  }),
});
