import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { LeadForm } from "@/components/sections/LeadForm";
import { getSiteContent } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    // title template'i override et — ana sayfada sadece tam başlık
    title: content.seo.title,
    alternates: { canonical: APP_CONFIG.url },
  };
}

// Fold altı bileşenler — lazy load ile JS bundle'ı böl
const Pricing = dynamic(() => import("@/components/sections/Pricing").then(mod => mod.Pricing), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50 rounded-3xl m-8" />
});
const Campaigns = dynamic(() => import("@/components/sections/Campaigns").then(mod => mod.Campaigns));
const About = dynamic(() => import("@/components/sections/About").then(mod => mod.About));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(mod => mod.Testimonials));

export default async function Home() {
  const content = await getSiteContent();

  // WebSite schema — sitelink searchbox için
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${APP_CONFIG.url}/#website`,
    url: APP_CONFIG.url,
    name: content.brand.name,
    description: content.seo.description,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${APP_CONFIG.url}/hizmetler?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main id="main-content" className="flex min-h-screen flex-col">
        <Hero content={content} />
        <Stats content={content} />
        <Services content={content} />
        <Pricing content={content} />
        <Campaigns content={content} />
        <LeadForm content={content} />
        <About content={content} />
        <Testimonials content={content} />
      </main>
    </>
  );
}
