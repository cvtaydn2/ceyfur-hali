"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Testimonials = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  if (!data?.testimonials) return null;

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{data.testimonials.title}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">{data.testimonials.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.testimonials.items.map((item : any, i : number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2rem] border-slate-100 flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, starI) => (
                  <Star key={starI} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="relative">
                <Quote size={40} className="absolute -top-4 -left-2 text-primary-ocean/5 -z-10" />
                <p className="text-slate-700 leading-relaxed mb-8 italic">&quot;{item.comment}&quot;</p>
              </div>

              <div className="mt-auto flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-ocean/10 flex items-center justify-center font-bold text-primary-ocean">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
