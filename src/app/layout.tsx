import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteContent } from "@/data/siteContent";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: siteContent.seo.title,
  description: siteContent.seo.description,
  keywords: siteContent.seo.keywords,
  openGraph: {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    type: "website",
    locale: "tr_TR",
    url: "https://ceyfurhaliyikama.com",
    siteName: siteContent.brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.title,
    description: siteContent.seo.description,
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteContent.brand.name,
    "description": siteContent.seo.description,
    "url": "https://ceyfurhaliyikama.com",
    "telephone": siteContent.contact.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteContent.contact.address,
      "addressLocality": siteContent.contact.district,
      "addressRegion": siteContent.contact.city,
      "addressCountry": "TR"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "image": "https://ceyfurhaliyikama.com/og-image.jpg"
  };

  return (
    <html lang="tr" className="scroll-smooth">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
