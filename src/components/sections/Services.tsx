"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brush, Armchair, Waves, Bed, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

const iconMap: Record<string, React.ElementType> = {
  Brush: Brush,
  Armchair: Armchair,
  Waves: Waves,
  Bed: Bed,
};

export const Services = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  if (!data?.services) return null;

  return (
    <section id="services" className="py-24 px-4 bg-white/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.services.items.map((service, index) => {
            const Icon = iconMap[service.icon] || Brush;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
              >
                {/* Image Header */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop&sig=${index}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary-ocean shadow-lg">
                    <Icon size={24} />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-primary-ocean transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    {service.features.slice(0, 3).map((feature: string, fIndex: number) => (
                      <div key={fIndex} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckCircle2 size={14} className="text-primary-ocean" />
                        {feature}
                      </div>
                    ))}
                    
                    <a
                      href={`https://wa.me/${data.contact.whatsapp}?text=${encodeURIComponent(service.title + " hakkında bilgi almak istiyorum.")}`}
                      className="inline-flex items-center gap-2 text-primary-ocean font-bold text-sm pt-4 hover:gap-3 transition-all"
                    >
                      Hemen Teklif Al <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
