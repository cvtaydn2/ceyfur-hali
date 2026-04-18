"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, CheckCircle2, ArrowRight } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Campaigns = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  if (!data?.campaigns) return null;

  return (
    <section id="campaigns" className="py-24 px-4 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquoise/10 text-turquoise text-sm font-bold mb-4">
              <Tag size={14} />
              <span>Sınırlı Süreli Teklifler</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{data.campaigns.title}</h2>
            <p className="text-slate-600">{data.campaigns.subtitle}</p>
          </div>
          <a href="#contact" className="text-primary-ocean font-bold flex items-center gap-2 hover:gap-3 transition-all shrink-0">
            Tüm Fırsatları Gör <ArrowRight size={20} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.campaigns.items.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.2,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              whileHover={{ y: -10 }}
              className="group relative glass p-10 rounded-[3rem] border-white shadow-xl hover:shadow-2xl hover:shadow-primary-ocean/5 transition-all duration-500 overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-ocean/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-ocean/10 transition-colors" />

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-ocean/10 text-primary-ocean text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-ocean" />
                {campaign.badge}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">{campaign.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                {campaign.description}
              </p>
              
              <ul className="space-y-4 mb-10">
                {campaign.features.map((feature: string, fIndex: number) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <span className="text-lg font-black text-primary-ocean tracking-tight">{campaign.priceNote}</span>
                <a
                  href={`https://wa.me/${data.contact.whatsapp}?text=${encodeURIComponent(campaign.title + " kampanyası için bilgi almak istiyorum.")}`}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-primary-ocean transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary-ocean/20"
                >
                  {campaign.ctaLabel}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
