import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content-repository";
import { Toaster } from "react-hot-toast";
import { APP_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const BASE_URL = APP_CONFIG.url;

function resolveOgImage(ogImage: string | undefined): string {
  if (!ogImage) return `${BASE_URL}/images/og-image.png`;
  return ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const ogImageUrl = resolveOgImage(content.seo.ogImage);

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    metadataBase: new URL(BASE_URL),
    robots: "index, follow",
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      type: "website",
      locale: "tr_TR",
      url: BASE_URL,
      siteName: content.brand.name,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: content.brand.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [ogImageUrl],
    },
    verification: {
      google: "qky3rdxrhkalrguRVhZGQTg4p4B_v3e6n9yP_Q",
    },
    alternates: {
      canonical: BASE_URL,
    },
    manifest: "/manifest.json",
    icons: {
      apple: [
        { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();
  const ogImageUrl = resolveOgImage(content.seo.ogImage);

  const timeMatch = content.contact.workingHours.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  const opens = timeMatch?.[1] ?? "09:00";
  const closes = timeMatch?.[2] ?? "19:00";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: content.brand.name,
    description: content.seo.description,
    url: BASE_URL,
    telephone: content.contact.phone[0] ?? "",
    email: content.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.contact.address,
      addressLocality: content.contact.district,
      addressRegion: content.contact.city,
      addressCountry: "TR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens,
        closes,
      },
    ],
    image: ogImageUrl,
    sameAs: [content.contact.instagram, content.contact.facebook].filter(Boolean),
    priceRange: "₺₺",
    areaServed: (content.services.areas ?? []).map((a) => a.name),
  };

  return (
    <html lang="tr" data-scroll-behavior="smooth" className="scroll-smooth">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-ocean focus:text-white focus:rounded-lg"
        >
          Ana içeriğe git
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
