"use client";

import { OptimizedImage } from "@/components/ui";
import { motion } from "framer-motion";
import { Brush, Armchair, Waves, Bed, ArrowUpRight, CheckCircle2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

const iconMap: Record<string, React.ElementType> = {
  Brush,
  Armchair,
  Waves,
  Bed,
};

export const Services = ({ content }: { content?: SiteContent }) => {
  const data = content ?? fallbackContent;

  if (!data?.services) return null;

  const areas = data.services.areas ?? [];

  return (
    <section id="services" className="py-16 md:py-24 px-4 bg-white/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary-ocean/5 text-primary-ocean text-sm font-bold mb-4"
          >
            Neler Yapıyoruz?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            {data.services.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            {data.services.subtitle}
          </motion.p>
        </div>

        {/* Hizmet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {data.services.items.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Brush;
            const spanClass =
              index === 0
                ? "lg:col-span-2 lg:row-span-2"
                : index === 1
                ? "lg:col-span-2"
                : "col-span-1";

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={cn(
                  "group relative flex flex-col rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-[transform,box-shadow] duration-300 will-change-transform",
                  spanClass
                )}
              >
                {/* Görsel */}
                <div
                  className={cn(
                    "relative overflow-hidden shrink-0",
                    index === 0 ? "h-56 md:h-72 lg:h-80" : "h-44 md:h-48"
                  )}
                >
                  <OptimizedImage
                    src={service.image}
                    alt={service.title}
                    fill
                    priority={index === 0}
                    sizes={
                      index === 0
                        ? "(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), 560px"
                        : "(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), 280px"
                    }
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-primary-ocean shadow-xl transform group-hover:rotate-6 transition-transform">
                    <Icon size={24} />
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-5 md:p-6 flex flex-col flex-1 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className={cn(
                        "font-bold text-slate-900 tracking-tight group-hover:text-primary-ocean transition-colors leading-tight",
                        index === 0 ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                      )}
                    >
                      {service.title}
                    </h3>
                    <div className="p-1.5 rounded-full bg-slate-50 text-slate-300 group-hover:bg-primary-ocean/10 group-hover:text-primary-ocean transition-all shrink-0 ml-2">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <p className="text-slate-500 mb-4 text-sm leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.features.slice(0, 3).map((feature, fIndex) => (
                      <div
                        key={fIndex}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tight"
                      >
                        <CheckCircle2 size={10} className="text-primary-ocean shrink-0" />
                        <span className="truncate max-w-[120px]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buton — mt-auto ile her zaman alta yapışır */}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, "")}?text=${encodeURIComponent(
                      service.title + " hakkında bilgi almak istiyorum."
                    )}`}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-primary-ocean transition-all shadow-lg shadow-slate-900/10 hover:shadow-primary-ocean/20"
                  >
                    Hemen Teklif Al
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hizmet Bölgeleri */}
        {areas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 md:mt-20 rounded-[2.5rem] bg-slate-900 px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row md:items-center gap-8"
          >
            <div className="shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-primary-ocean/20 flex items-center justify-center text-primary-ocean">
                  <MapPin size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Hizmet Bölgelerimiz
                </span>
              </div>
              <p className="text-white font-black text-xl md:text-2xl tracking-tight leading-snug max-w-xs">
                İstanbul&apos;un Anadolu Yakasına Kapıdan Kapıya Hizmet
              </p>
            </div>

            <div className="flex-1 flex flex-wrap gap-3">
              {areas.map((area, i) => (
                <a
                  key={area.slug}
                  href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, "")}?text=${encodeURIComponent(
                    area.name + " bölgesinde halı yıkama hizmeti almak istiyorum."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-primary-ocean hover:border-primary-ocean transition-colors"
                >
                  <MapPin size={14} aria-hidden="true" />
                  {area.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
