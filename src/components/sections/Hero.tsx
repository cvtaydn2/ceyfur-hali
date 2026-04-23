// Hero — server component olarak render edilir, LCP için kritik
// Animasyonlar sadece görsel kısımda (HeroVisual client component)
import Image from "next/image";
import { HeroVisual } from "./HeroVisual";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Hero = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  if (!data?.hero) return null;

  return (
    <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden min-h-[100svh] lg:min-h-[90vh] flex items-center">
      {/* Dekoratif arka plan — animasyonsuz, paint'i bloklamaz */}
      <div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-ocean/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-turquoise/5 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── Sol: Metin — server-rendered, LCP için hemen görünür ── */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary-ocean" />
              İstanbul Geneli Profesyonel Hizmet
            </div>

            {/* H1 — LCP öğesi, opacity:1 ile başlar, animasyon yok */}
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-6 md:mb-8">
              {data.hero.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-ocean to-turquoise">
                {data.hero.highlight}
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 max-w-sm md:max-w-lg mb-8 md:mb-10 leading-relaxed font-medium">
              {data.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <a
                href="#teklif-al"
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-slate-900 text-white rounded-3xl font-black text-base md:text-lg hover:bg-slate-800 transition-colors shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-2 group"
              >
                {data.hero.primaryCta}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href="#teklif-al"
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white border border-slate-100 text-slate-900 rounded-3xl font-black text-base md:text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Hemen Randevu Al
              </a>
            </div>
          </div>

          {/* ── Sağ: Görsel — client component (animasyonlar burada) ── */}
          <HeroVisual image={data.hero.image} whatsapp={data.contact.whatsapp} />
        </div>
      </div>
    </section>
  );
};
