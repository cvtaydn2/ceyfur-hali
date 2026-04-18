"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, Check, ArrowRight } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Campaigns = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

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
          {data.campaigns.items.map((campaign : any, index : number) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group p-1 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-100 border border-slate-200 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute -top-4 -right-4 bg-primary-ocean text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-xl z-10 rotate-12">
                {campaign.badge}
              </div>

              <div className="p-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{campaign.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">{campaign.description}</p>
                
                <div className="bg-primary-ocean/5 p-6 rounded-3xl mb-8">
                  <p className="text-primary-ocean text-2xl font-black mb-6">{campaign.priceNote}</p>
                  <ul className="space-y-4">
                    {campaign.features.map((feature : string, i : number) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Check size={14} className="text-turquoise" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/${data.contact.whatsapp}?text=${encodeURIComponent(campaign.title + " kampanyası hakkında bilgi almak istiyorum.")}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                >
                  {campaign.ctaLabel}
                  <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
