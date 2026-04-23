import { z } from "zod";

// Helper for trimmed required strings
const requiredString = z.string().trim().min(1);

export const BrandSchema = z.object({
  name: requiredString,
  slogan: requiredString,
  logo: z.string().optional(),
});

export const SeoSchema = z.object({
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
  slug: requiredString,
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

// Hizmet bölgesi şeması
export const ServiceAreaSchema = z.object({
  name: requiredString,
  slug: requiredString,
});

// Fiyat kalemi şeması
export const PriceItemSchema = z.object({
  id: requiredString,
  type: requiredString,       // Halı tipi / ürün adı
  price: z.number().min(0),   // Fiyat (TL)
  unit: z.string().optional(), // Birim (m², adet, vb.)
  note: z.string().optional(), // Ek not
});

export const ServicesSchema = z.object({
  title: requiredString,
  subtitle: requiredString,
  items: z.array(ServiceItemSchema),
  areas: z.array(ServiceAreaSchema).optional().default([]),
});

export const PricingSchema = z.object({
  title: requiredString,
  subtitle: requiredString,
  note: z.string().optional(),
  items: z.array(PriceItemSchema),
});

export const CampaignsSchema = z.object({
  title: requiredString,
  subtitle: requiredString,
  items: z.array(CampaignItemSchema),
});

export const TestimonialsSchema = z.object({
  title: requiredString,
  subtitle: requiredString,
  items: z.array(TestimonialItemSchema),
});

export const ContactSchema = z.object({
  phone: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.string().trim().min(1)).min(1)
  ),
  whatsapp: requiredString,
  email: z.string().email().trim(),
  address: requiredString,
  district: requiredString,
  city: requiredString,
  workingHours: requiredString,
  googleMapsUrl: z.string().trim().optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});

export const FooterSchema = z.object({
  about: requiredString,
  copyright: requiredString,
  links: z.array(FooterLinkSchema),
});

// Full SiteContent Schema
export const SiteContentSchema = z.object({
  brand: BrandSchema,
  seo: SeoSchema,
  hero: HeroSchema,
  about: AboutSchema,
  services: ServicesSchema,
  pricing: PricingSchema,
  campaigns: CampaignsSchema,
  stats: z.array(StatItemSchema),
  testimonials: TestimonialsSchema,
  contact: ContactSchema,
  navigation: z.array(
    z.object({
      label: requiredString,
      href: requiredString,
    })
  ),
  footer: FooterSchema,
});
