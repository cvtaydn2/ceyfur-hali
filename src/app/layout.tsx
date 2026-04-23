import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content-repository";
import { Toaster } from "react-hot-toast";
import { APP_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  // Sadece kullanılan weightler — gereksiz font dosyalarını indirme
  weight: ["400", "700", "800", "900"],
  preload: true,
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
    title: {
      default: content.seo.title,
      template: `%s | ${content.brand.name}`,
    },
    description: content.seo.description,
    keywords: content.seo.keywords,
    metadataBase: new URL(BASE_URL),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
      languages: { "tr-TR": BASE_URL },
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
    "@id": `${BASE_URL}/#business`,
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
      postalCode: "34771",
      addressCountry: "TR",
    },
    ...(content.contact.googleMapsUrl
      ? { hasMap: content.contact.googleMapsUrl }
      : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens,
        closes,
      },
    ],
    image: [ogImageUrl],
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/icon-512.png`,
    },
    sameAs: [content.contact.instagram, content.contact.facebook].filter(Boolean),
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    paymentAccepted: "Nakit, Kredi Kartı",
    areaServed: (content.services.areas ?? []).map((a) => ({
      "@type": "City",
      name: a.name,
    })),
    serviceType: content.services.items.map((s) => s.title),
  };

  return (
    <html lang="tr" data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        {/* DNS prefetch & preconnect — harici kaynaklar için bağlantıyı erkenden aç */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* Hero görseli için preload — LCP'yi hızlandırır */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-carpet.png"
          // @ts-expect-error — fetchpriority henüz React types'a eklenmedi
          fetchpriority="high"
          imageSrcSet="/_next/image?url=%2Fimages%2Fhero-carpet.png&w=640&q=75 640w, /_next/image?url=%2Fimages%2Fhero-carpet.png&w=828&q=75 828w, /_next/image?url=%2Fimages%2Fhero-carpet.png&w=1080&q=75 1080w"
          imageSizes="(max-width: 1024px) calc(100vw - 2rem), 600px"
        />
      </head>
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