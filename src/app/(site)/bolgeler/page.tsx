import { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";

export const revalidate = 3600; // 1 saat

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = `Hizmet Bölgelerimiz | ${content.brand.name}`;
  const description = `${content.brand.name} halı yıkama, koltuk yıkama ve perde yıkama hizmetleri verdiği bölgeler: ${(content.services.areas ?? []).map((a) => a.name).join(", ")}.`;

  return {
    title,
    description,
    alternates: { canonical: `${APP_CONFIG.url}/bolgeler` },
    openGraph: {
      title,
      description,
      url: `${APP_CONFIG.url}/bolgeler`,
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

export default async function DistrictsPage() {
  const content = await getSiteContent();
  const areas = content.services.areas ?? [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: APP_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Hizmet Bölgeleri", item: `${APP_CONFIG.url}/bolgeler` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main id="main-content" className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-primary-ocean transition-colors">Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-700 font-medium">Hizmet Bölgeleri</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Hizmet Verdiğimiz Bölgeler
          </h1>
          <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
            {content.contact.city} genelinde kapıdan kapıya profesyonel temizlik hizmeti sunuyoruz.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {areas.length === 0 ? (
            <p className="text-center text-slate-400 py-16">Henüz bölge eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/bolgeler/${area.slug}`}
                  className="group flex items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-primary-ocean/30 hover:shadow-lg hover:shadow-primary-ocean/5 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-8 h-8 rounded-xl bg-primary-ocean/10 text-primary-ocean flex items-center justify-center text-sm shrink-0">
                    📍
                  </span>
                  <div>
                    <p className="font-black text-slate-900 group-hover:text-primary-ocean transition-colors">
                      {area.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Halı Yıkama</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
    </>
  );
}
