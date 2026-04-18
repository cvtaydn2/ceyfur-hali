import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content-repository";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      type: "website",
      locale: "tr_TR",
      url: "https://ceyfurhaliyikama.com",
      siteName: content.brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
    },
    robots: "index, follow",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": content.brand.name,
    "description": content.seo.description,
    "url": "https://ceyfurhaliyikama.com",
    "telephone": content.contact.phone,
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
        <Navbar content={content} />
        {children}
        <Footer content={content} />
        <WhatsAppButton content={content} />
      </body>
    </html>
  );
}
