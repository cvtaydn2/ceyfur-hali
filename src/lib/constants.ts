/**
 * Uygulama genelinde kullanılan sabitler.
 */

export const APP_CONFIG = {
  name: "Ceyfur Halı Yıkama",
  domain: "ceyfurhaliyikama.com",
  url: "https://ceyfurhaliyikama.com",
} as const;

export const API_ENDPOINTS = {
  content: "/api/content",
  contentGet: "/api/content/get",
  leads: "/api/leads",
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  admin: {
    leads: "/api/admin/leads",
    leadsById: (id: string) => `/api/admin/leads/${id}`,
    content: {
      section: (section: string) => `/api/admin/content/${section}`,
      auditLogs: "/api/admin/audit-logs",
    },
  },
} as const;

export const LEAD_STATUS = {
  new: "new",
  called: "called",
  quoted: "quoted",
  booked: "booked",
} as const;

export const ARCHIVE_STATUS = {
  completed: "completed",
  cancelled: "cancelled",
} as const;

export const SESSION_CONFIG = {
  cookieName: "admin_session",
  maxAge: 60 * 60 * 24, // 24 saat
} as const;

export const CACHE_DURATION = {
  short: 60 * 1000,
  medium: 5 * 60 * 1000,
  long: 30 * 60 * 1000,
} as const;

/** ISR revalidation süreleri (saniye) — sabit sayı olarak kullanın, nesne property olarak değil */
export const REVALIDATE_HOME = 3600;
export const REVALIDATE_SERVICE = 3600;
export const REVALIDATE_DISTRICT = 3600;

/** Brute force koruma */
export const AUTH_CONFIG = {
  maxLoginAttempts: 5,
  lockoutWindowMinutes: 15,
} as const;

/** Desteklenen içerik bölümleri */
export const CONTENT_SECTIONS = [
  "brand",
  "seo",
  "hero",
  "about",
  "services",
  "pricing",
  "campaigns",
  "stats",
  "testimonials",
  "contact",
  "navigation",
  "footer",
] as const;

export type ContentSection = (typeof CONTENT_SECTIONS)[number];
