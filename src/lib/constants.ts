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
  },
} as const;

export const LEAD_STATUS = {
  new: "new",
  contacted: "contacted",
  scheduled: "scheduled",
  completed: "completed",
  cancelled: "cancelled",
} as const;

export const SESSION_CONFIG = {
  cookieName: "admin_session",
  maxAge: 60 * 60 * 24,
} as const;

export const CACHE_DURATION = {
  short: 60 * 1000,
  medium: 5 * 60 * 1000,
  long: 30 * 60 * 1000,
} as const;