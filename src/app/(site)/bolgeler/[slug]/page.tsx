import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteContent } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";

export const revalidate = 3600; // 1 saat

type Props = { params: Promise<{ slug: string }> };

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const content = await getSiteContent();
  return (content.services.areas ?? []).map((area) => ({ slug: area.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const area = (content.services.areas ?? []).find((a) => a.slug === slug);

  if (!area) return { title: "Bölge Bulunamadı" };

  const title = `${area.name} Halı Yıkama | ${content.brand.name}`;
  const description = `${area.name} bölgesinde profesyonel halı yıkama, koltuk yıkama ve perde yıkama hizmeti. ${content.brand.name} ile kapıdan kapıya ücretsiz servis.`;

  return {
    title,
    description,
    alternates: { canonical: `${APP_CONFIG.url}/bolgeler/${slug}` },
    openGraph: {
      title,
      description,
      url: `${APP_CONFIG.url}/bolgeler/${slug}`,
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DistrictPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const area = (content.services.areas ?? []).find((a) => a.slug === slug);

  if (!area) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${APP_CONFIG.url}/bolgeler/${slug}#business`,
    name: `${content.brand.name} - ${area.name}`,
    description: `${area.name} bölgesinde profesyonel halı yıkama, koltuk yıkama ve perde yıkama hizmeti`,
    url: `${APP_CONFIG.url}/bolgeler/${slug}`,
    telephone: content.contact.phone[0],
    image: `${APP_CONFIG.url}/images/og-image.png`,
    areaServed: {
      "@type": "City",
      name: area.name,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: content.contact.district,
      addressRegion: content.contact.city,
      addressCountry: "TR",
    },
    parentOrganization: {
      "@type": "LocalBusiness",
      "@id": `${APP_CONFIG.url}/#business`,
      name: content.brand.name,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${area.name} bölgesinde halı yıkama hizmeti veriyor musunuz?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Evet, ${content.brand.name} olarak ${area.name} bölgesinde kapıdan kapıya ücretsiz servis ile profesyonel halı yıkama hizmeti sunuyoruz.`,
        },
      },
      {
        "@type": "Question",
        name: `${area.name} halı yıkama fiyatları nedir?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${area.name} bölgesindeki halı yıkama fiyatlarımız halının cinsine ve boyutuna göre değişmektedir. Ücretsiz fiyat teklifi için bizi arayabilirsiniz.`,
        },
      },
      {
        "@type": "Question",
        name: `${area.name} bölgesinde halı teslim süresi ne kadar?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${area.name} bölgesinde genellikle 1-2 iş günü içinde halılarınızı teslim ediyoruz. Çalışma saatlerimiz: ${content.contact.workingHours}.`,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: APP_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Bölgeler", item: `${APP_CONFIG.url}/bolgeler` },
      { "@type": "ListItem", position: 3, name: area.name, item: `${APP_CONFIG.url}/bolgeler/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main id="main-content" className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-white border-b border-slate-100 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-primary-ocean transition-colors">Ana Sayfa</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/bolgeler" className="hover:text-primary-ocean transition-colors">Bölgeler</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700 font-medium">{area.name}</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {area.name} Halı Yıkama
            </h1>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl leading-relaxed">
              {content.brand.name} olarak {area.name} bölgesinde <strong>kapıdan kapıya ücretsiz servis</strong> ile
              profesyonel <strong>halı yıkama</strong>, <strong>koltuk yıkama</strong>, <strong>perde yıkama</strong> ve yorgan yıkama hizmetleri sunuyoruz.
              Hijyenik ve tam otomatik makinelerimizle %100 temizlik garantisi sağlıyoruz.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#teklif-al"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-primary-ocean text-white font-black text-sm hover:bg-primary-ocean/90 transition-colors shadow-lg shadow-primary-ocean/20"
              >
                Hemen Randevu Al
              </Link>
              <a
                href={`tel:${content.contact.phone[0]}`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white border border-primary-ocean/20 text-primary-ocean font-black text-sm hover:bg-primary-ocean hover:text-white transition-all shadow-sm"
              >
                📞 {content.contact.phone[0]}
              </a>
            </div>
          </div>
        </section>

        {/* Hizmetler */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
              {area.name} Bölgesinde Sunduğumuz Hizmetler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.services.items.map((service) => (
                <Link
                  key={service.id}
                  href={`/hizmetler/${service.slug}`}
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-primary-ocean/30 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-ocean/10 text-primary-ocean flex items-center justify-center shrink-0 font-black text-lg">
                    ✓
                  </div>
                  <div>
                    <p className="font-black text-slate-900 group-hover:text-primary-ocean transition-colors">
                      {area.name} {service.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{service.features[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Neden Biz? - SEO İçerik Bloğu */}
        <section className="py-16 px-4 bg-white border-y border-slate-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">
              Neden {area.name} Profesyonel Halı Yıkama?
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
              <p>
                <strong>{area.name} halı yıkama</strong> ihtiyaçlarınızda Ceyfur Halı Yıkama olarak bölgedeki en modern tesislere sahibiz. 
                Halılarınızın dokusuna zarar vermeyen özel şampuanlar ve tam otomatik yıkama sistemlerimizle derinlemesine hijyen sağlıyoruz.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 not-prose mt-8">
                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="text-primary-ocean">★</span> Ücretsiz Servis Ağı
                  </h3>
                  <p className="text-sm">
                    {area.name} bölgesinin her mahallesine haftanın 6 günü ücretsiz servis aracımızla hizmet veriyoruz. 
                    Halılarınızı kapınızdan alıp, tertemiz şekilde kapınıza teslim ediyoruz.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="text-primary-ocean">★</span> Antibakteriyel Temizlik
                  </h3>
                  <p className="text-sm">
                    Halılarınızda biriken toz, mite ve bakterilere karşı %100 etkili antibakteriyel şampuanlar kullanıyoruz. 
                    Özellikle astım ve alerjisi olanlar için tam hijyen sağlıyoruz.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="text-primary-ocean">★</span> Leke Çıkarma Garantisi
                  </h3>
                  <p className="text-sm">
                    Zorlu lekeler (kahve, çay, meyve suyu vb.) için kumaş yapısına uygun özel leke çıkarıcılar kullanarak 
                    halınızın ilk günkü görünümüne kavuşmasını sağlıyoruz.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="text-primary-ocean">★</span> Modern Kurutma Odası
                  </h3>
                  <p className="text-sm">
                    Halılarınızı dış ortamın tozundan uzak, nem alma makineli özel kurutma odalarımızda kurutuyoruz. 
                    Böylece halılarda koku oluşumunu engelliyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `${area.name} bölgesinde halı yıkama hizmeti veriyor musunuz?`,
                  a: `Evet, ${content.brand.name} olarak ${area.name} bölgesinde kapıdan kapıya ücretsiz servis ile profesyonel halı yıkama hizmeti sunuyoruz.`,
                },
                {
                  q: `${area.name} halı yıkama fiyatları nedir?`,
                  a: `Fiyatlarımız halının cinsine ve boyutuna göre değişmektedir. Ücretsiz fiyat teklifi için bizi arayabilirsiniz.`,
                },
                {
                  q: `${area.name} bölgesinde halı teslim süresi ne kadar?`,
                  a: `Genellikle 1-2 iş günü içinde halılarınızı teslim ediyoruz. Çalışma saatlerimiz: ${content.contact.workingHours}.`,
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-bold text-slate-900 hover:text-primary-ocean transition-colors list-none">
                    {item.q}
                    <span className="text-slate-300 group-open:rotate-180 transition-transform shrink-0 ml-4">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Diğer Bölgeler */}
        {(content.services.areas ?? []).length > 1 && (
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">
                Diğer Hizmet Bölgelerimiz
              </h2>
              <div className="flex flex-wrap gap-2">
                {content.services.areas!
                  .filter((a) => a.slug !== slug)
                  .map((a) => (
                    <Link
                      key={a.slug}
                      href={`/bolgeler/${a.slug}`}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-sm font-bold text-slate-600 hover:border-primary-ocean/30 hover:text-primary-ocean transition-colors"
                    >
                      {a.name}
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
