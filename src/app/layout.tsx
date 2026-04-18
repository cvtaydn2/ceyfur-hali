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
  const baseUrl = "https://ceyfurhaliyikama.com";
  
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
          url: `${baseUrl}/images/og-image.png`,
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
      images: [`${baseUrl}/images/og-image.png`],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": content.brand.name,
    "description": content.seo.description,
    "url": baseUrl,
    "telephone": content.contact.phone,
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
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "image": `${baseUrl}/images/og-image.png`,
    "sameAs": [
      content.contact.instagram,
      content.contact.facebook,
    ].filter(Boolean)
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
