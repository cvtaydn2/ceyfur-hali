import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content-repository";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const baseUrl = "https://ceyfurhaliyikama.com";
  const ogImageUrl = content.seo.ogImage?.startsWith('http') 
    ? content.seo.ogImage 
    : `${baseUrl}${content.seo.ogImage || '/images/og-image.png'}`;
  
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      type: "website",
      locale: "tr_TR",
      url: baseUrl,
      siteName: content.brand.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: content.brand.name,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [ogImageUrl],
    },
    robots: "index, follow",
    metadataBase: new URL(baseUrl),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();
  const baseUrl = "https://ceyfurhaliyikama.com";

  // Parse working hours string to JSON-LD format
  // Example: "Pazartesi - Cumartesi: 09:00 - 19:00"
  const timeMatch = content.contact.workingHours.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  const opens = timeMatch ? timeMatch[1] : "09:00";
  const closes = timeMatch ? timeMatch[2] : "19:00";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": content.brand.name,
    "description": content.seo.description,
    "url": baseUrl,
    "telephone": content.contact.phone[0] || "",
    "email": content.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": content.contact.address,
      "addressLocality": content.contact.district,
      "addressRegion": content.contact.city,
      "addressCountry": "TR"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": opens,
        "closes": closes
      }
    ],
    "image": content.seo.ogImage?.startsWith('http') ? content.seo.ogImage : `${baseUrl}${content.seo.ogImage || '/images/og-image.png'}`,
    "sameAs": [
      content.contact.instagram,
      content.contact.facebook,
    ].filter(Boolean)
  };

  return (
    <html lang="tr" className="scroll-smooth" data-scroll-behavior="smooth">
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
        <Navbar content={content} />
        {children}
        <Footer content={content} />
        <WhatsAppButton content={content} />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
