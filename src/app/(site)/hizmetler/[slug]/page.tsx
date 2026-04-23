import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteContent } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export const revalidate = 3600; // 1 saat

type Props = { params: Promise<{ slug: string }> };

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.services.items.map((item) => ({ slug: item.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.items.find((s) => s.slug === slug);

  if (!service) return { title: "Hizmet Bulunamadı" };

  const title = `${service.title} | ${content.brand.name}`;
  const description = `${content.brand.name} profesyonel ${service.title.toLowerCase()} hizmeti. ${service.features.join(", ")}. ${content.contact.district}, ${content.contact.city}.`;

  return {
    title,
    description,
    alternates: { canonical: `${APP_CONFIG.url}/hizmetler/${slug}` },
    openGraph: {
      title,
      description,
      url: `${APP_CONFIG.url}/hizmetler/${slug}`,
      // Mutlak URL: göreceli path'i base URL ile birleştir
      images: [
        {
          url: service.image.startsWith("http")
            ? service.image
            : `${APP_CONFIG.url}${service.image}`,
          alt: service.title,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.items.find((s) => s.slug === slug);

  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${APP_CONFIG.url}/hizmetler/${slug}#service`,
    name: service.title,
    description: service.description,
    image: service.image.startsWith("http")
      ? service.image
      : `${APP_CONFIG.url}${service.image}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${APP_CONFIG.url}/#business`,
      name: content.brand.name,
      telephone: content.contact.phone[0],
      address: {
        "@type": "PostalAddress",
        streetAddress: content.contact.address,
        addressLocality: content.contact.district,
        addressRegion: content.contact.city,
        addressCountry: "TR",
      },
    },
    areaServed: (content.services.areas ?? []).map((a) => ({
      "@type": "City",
      name: a.name,
    })),
    url: `${APP_CONFIG.url}/hizmetler/${slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${APP_CONFIG.url}/hizmetler/${slug}`,
    },
  };

  // Gerçek ve anlamlı FAQ soruları
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${service.title} hizmeti nasıl çalışır?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${content.brand.name} ${service.title.toLowerCase()} hizmetinde kapıdan kapıya ücretsiz servis sunuyoruz. ${service.description}`,
        },
      },
      {
        "@type": "Question",
        name: `${service.title} fiyatları nedir?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${service.title} fiyatlarımız ürünün cinsine ve boyutuna göre değişmektedir. Ücretsiz fiyat teklifi için ${content.contact.phone[0]} numaralı hattımızı arayabilir veya WhatsApp üzerinden ulaşabilirsiniz.`,
        },
      },
      {
        "@type": "Question",
        name: `${service.title} ne kadar sürer?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${service.title} hizmetimizde genellikle 1-2 iş günü içinde teslim yapılmaktadır. Çalışma saatlerimiz: ${content.contact.workingHours}.`,
        },
      },
      {
        "@type": "Question",
        name: `${service.title} için hangi bölgelere hizmet veriyorsunuz?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${content.contact.city} genelinde ${(content.services.areas ?? []).map((a) => a.name).join(", ")} bölgelerine kapıdan kapıya ${service.title.toLowerCase()} hizmeti sunuyoruz.`,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: APP_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${APP_CONFIG.url}/hizmetler` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${APP_CONFIG.url}/hizmetler/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main id="main-content" className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-primary-ocean transition-colors">Ana Sayfa</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/hizmetler" className="hover:text-primary-ocean transition-colors">Hizmetler</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700 font-medium">{service.title}</li>
              </ol>
            </nav>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {service.title}
                </h1>
                <p className="text-lg text-slate-500 mt-4 leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-700 font-medium">
                      <span className="w-6 h-6 rounded-full bg-primary-ocean/10 text-primary-ocean flex items-center justify-center text-xs font-black shrink-0">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/#teklif-al"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-primary-ocean text-white font-black text-sm hover:bg-primary-ocean/90 transition-colors shadow-lg shadow-primary-ocean/20"
                  >
                    Hemen Randevu Al
                  </Link>
                  <a
                    href={`https://wa.me/${content.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-colors"
                  >
                    WhatsApp ile Yaz
                  </a>
                </div>
              </div>

              <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden">
                <OptimizedImage
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hizmet Bölgeleri */}
        {(content.services.areas ?? []).length > 0 && (
          <section className="py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
                Hizmet Verdiğimiz Bölgeler
              </h2>
              <div className="flex flex-wrap gap-3">
                {content.services.areas!.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/bolgeler/${area.slug}`}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-sm font-bold text-slate-600 hover:border-primary-ocean/30 hover:text-primary-ocean transition-colors"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* İletişim CTA */}
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto bg-primary-ocean rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {service.title} için Hemen Teklif Alın
            </h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              {content.contact.workingHours} saatleri arasında hizmetinizdeyiz.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${content.contact.phone[0]}`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-primary-ocean font-black text-sm hover:bg-slate-50 transition-colors"
              >
                📞 {content.contact.phone[0]}
              </a>
              <a
                href={`https://wa.me/${content.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-sm hover:bg-white/20 transition-colors border border-white/20"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
