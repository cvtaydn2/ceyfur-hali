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
            Hizmetlerimiz
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[600px]">
          {data.services.items.map((service : any, index : number) => {
            const Icon = iconMap[service.icon] || Brush;
            
            // Bento logic: 1st and 4th are larger
            const gridClass = index === 0 
              ? "md:col-span-4 md:row-span-1" 
              : index === 1 
                ? "md:col-span-2 md:row-span-1" 
                : index === 2 
                  ? "md:col-span-3 md:row-span-1" 
                  : "md:col-span-3 md:row-span-1";

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-primary-ocean/5 transition-all",
                  gridClass
                )}
              >
                <div className="absolute top-0 right-0 -z-0 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Icon size={200} />
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-ocean/5 flex items-center justify-center text-primary-ocean group-hover:bg-primary-ocean group-hover:text-white transition-colors duration-300">
                      <Icon size={28} />
                    </div>
                    <button className="p-3 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary-ocean group-hover:text-white transition-all transform group-hover:rotate-45">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-500 mb-6 max-w-sm line-clamp-2 md:line-clamp-none">
                    {service.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3">
                    {service.features.map((feature : string, fIndex : number) => (
                      <div key={fIndex} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                        <CheckCircle2 size={12} className="text-turquoise" />
                        {feature}
                      </div>
                    ))}
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
