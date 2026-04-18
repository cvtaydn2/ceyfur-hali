export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  priceNote?: string;
  features: string[];
  ctaLabel: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  district: string;
  city: string;
  workingHours: string;
  googleMapsUrl: string;
}

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    name: string;
    logo?: string;
    slogan: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  hero: {
    title: string;
    highlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  campaigns: {
    title: string;
    subtitle: string;
    items: CampaignItem[];
  };
  stats: StatItem[];
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  contact: ContactInfo;
  navigation: NavItem[];
  footer: {
    about: string;
    copyright: string;
    links: NavItem[];
  };
}
