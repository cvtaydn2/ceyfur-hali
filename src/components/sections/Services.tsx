"use client";

import Image from "next/image";
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
          {data.services.items.map((service, index) => {
            const Icon = iconMap[service.icon] || Brush;
            
            // Dynamic span logic: 
            // First item spans 2 columns on large screens
            // Second item spans 2 columns on large screens
            // Others are normal
            // This creates a nice bento rhythm regardless of item count
            const spanClass = index === 0 
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
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1 
                }}
                whileHover={{ 
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)"
                }}
                className={cn(
                  "group relative flex flex-col rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-xl transition-shadow duration-500",
                  spanClass
                )}
              >
                {/* Image Header */}
                <div className={cn(
                  "relative overflow-hidden",
                  index === 0 ? "flex-grow min-h-[300px]" : "h-48"
                )}>
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-primary-ocean shadow-xl transform group-hover:rotate-6 transition-transform">
                    <Icon size={28} />
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-end relative z-10 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={cn(
                      "font-bold text-slate-900 tracking-tight group-hover:text-primary-ocean transition-colors",
                      index === 0 ? "text-3xl" : "text-2xl"
                    )}>
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
                       {service.features.slice(0, 3).map((feature: string, fIndex: number) => (
                        <div key={fIndex} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                          <CheckCircle2 size={12} className="text-primary-ocean" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <a
                      href={`https://wa.me/${data.contact.whatsapp}?text=${encodeURIComponent(service.title + " hakkında bilgi almak istiyorum.")}`}
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
      </div>
    </section>
  );
};
