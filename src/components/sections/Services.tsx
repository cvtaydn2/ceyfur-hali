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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
          {data.services.items.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Brush;
            const spanClass =
              index === 0
                ? "lg:col-span-2 lg:row-span-2 h-[500px] lg:h-auto"
                : index === 1
                ? "lg:col-span-2 lg:row-span-1"
                : "col-span-1";

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
                className={cn(
                  "group relative flex flex-col rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-xl transition-shadow duration-500",
                  spanClass
                )}
              >
                {/* Görsel */}
                <div
                  className={cn(
                    "relative overflow-hidden",
                    index === 0 ? "flex-grow min-h-[250px] md:min-h-[300px]" : "h-48"
                  )}
                >
                  <OptimizedImage
                    src={service.image}
                    alt={service.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-primary-ocean shadow-xl transform group-hover:rotate-6 transition-transform">
                    <Icon size={28} />
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-6 md:p-8 flex flex-col justify-end relative z-10 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className={cn(
                        "font-bold text-slate-900 tracking-tight group-hover:text-primary-ocean transition-colors",
                        index === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                      )}
                    >
                      {service.title}
                    </h3>
                    <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-primary-ocean/10 group-hover:text-primary-ocean transition-all">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((feature, fIndex) => (
                        <div
                          key={fIndex}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tight"
                        >
                          <CheckCircle2 size={12} className="text-primary-ocean" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, "")}?text=${encodeURIComponent(
                        service.title + " hakkında bilgi almak istiyorum."
                      )}`}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-primary-ocean transition-all shadow-lg shadow-slate-900/10 hover:shadow-primary-ocean/20"
                    >
                      Hemen Teklif Al
                    </a>
                  </div>
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
                <motion.a
                  key={area.slug}
                  href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, "")}?text=${encodeURIComponent(
                    area.name + " bölgesinde halı yıkama hizmeti almak istiyorum."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-primary-ocean hover:border-primary-ocean transition-all"
                >
                  <MapPin size={14} className="text-primary-ocean group-hover:text-white" />
                  {area.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
