import { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export const revalidate = 3600; // 1 saat

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = `Hizmetlerimiz | ${content.brand.name}`;
  const description = `${content.brand.name} profesyonel temizlik hizmetleri: halı yıkama, koltuk yıkama, perde yıkama ve yorgan yıkama. ${content.contact.district}, ${content.contact.city}.`;

  return {
    title,
    description,
    alternates: { canonical: `${APP_CONFIG.url}/hizmetler` },
    openGraph: {
      title,
      description,
      url: `${APP_CONFIG.url}/hizmetler`,
      type: "website",
      images: [
        {
          url: `${APP_CONFIG.url}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ServicesPage() {
  const content = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hizmetlerimiz",
    itemListElement: content.services.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${APP_CONFIG.url}/hizmetler/${item.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: APP_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${APP_CONFIG.url}/hizmetler` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main id="main-content" className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-white border-b border-slate-100 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <li>
                  <Link href="/" className="hover:text-primary-ocean transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700 font-medium">Hizmetler</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {content.services.title}
            </h1>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
              {content.services.subtitle}
            </p>
          </div>
        </section>

        {/* Service Cards */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.services.items.map((item) => (
              <Link
                key={item.id}
                href={`/hizmetler/${item.slug}`}
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-ocean transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-ocean shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-1.5 text-primary-ocean font-bold text-sm">
                    Detayları Gör
                    <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
