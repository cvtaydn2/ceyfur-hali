import { z } from "zod";

// Helper for trimmed required strings
const requiredString = z.string().trim().min(1);

export const BrandSchema = z.object({
  name: requiredString,
  slogan: requiredString,
  logo: z.string().optional(),
});

export const SEOSchema = z.object({
  title: requiredString,
  description: requiredString,
  keywords: z.array(z.string().trim()).min(1),
  ogImage: z.string().optional(),
});

export const HeroSchema = z.object({
  title: requiredString,
  highlight: requiredString,
  description: requiredString,
  primaryCta: requiredString,
  secondaryCta: requiredString,
  image: requiredString,
});

export const AboutSchema = z.object({
  title: requiredString,
  subtitle: requiredString,
  content: requiredString,
  features: z.array(z.string().trim()),
  image: z.string().optional(),
});

export const ServiceItemSchema = z.object({
  id: requiredString,
  title: requiredString,
  description: requiredString,
  icon: requiredString,
  features: z.array(z.string().trim()).min(1),
  image: requiredString,
});

export const CampaignItemSchema = z.object({
  id: requiredString,
  title: requiredString,
  description: requiredString,
  badge: requiredString,
  priceNote: z.string().optional(),
  features: z.array(z.string().trim()),
  ctaLabel: requiredString,
});

export const StatItemSchema = z.object({
  label: requiredString,
  value: requiredString,
  suffix: z.string().optional(),
});

export const TestimonialItemSchema = z.object({
  id: requiredString,
  name: requiredString,
  comment: requiredString,
  rating: z.number().min(1).max(5),
  date: z.string().optional(),
});

export const FooterLinkSchema = z.object({
  label: requiredString,
  href: requiredString,
});

// Full SiteContent Schema
export const SiteContentSchema = z.object({
  brand: BrandSchema,
  seo: SEOSchema,
  hero: HeroSchema,
  about: AboutSchema,
  services: z.object({
    title: requiredString,
    subtitle: requiredString,
    items: z.array(ServiceItemSchema),
  }),
  campaigns: z.object({
    title: requiredString,
    subtitle: requiredString,
    items: z.array(CampaignItemSchema),
  }),
  stats: z.array(StatItemSchema),
  testimonials: z.object({
    title: requiredString,
    subtitle: requiredString,
    items: z.array(TestimonialItemSchema),
  }),
  contact: z.object({
    phone: z.array(z.string().trim().min(1)).min(1),
    whatsapp: requiredString,
    email: z.string().email().trim(),
    address: requiredString,
    district: requiredString,
    city: requiredString,
    workingHours: requiredString,
    googleMapsUrl: z.string().url().trim(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
  navigation: z.array(z.object({
    label: requiredString,
    href: requiredString,
  })),
  footer: z.object({
    about: requiredString,
    copyright: requiredString,
    links: z.array(FooterLinkSchema),
  }),
});
