"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, ShieldCheck, Sparkles, Clock } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Hero = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary-ocean/5 rounded-full blur-[120px] transition-all" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-turquoise/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-ocean/10 text-primary-ocean text-sm font-bold mb-6">
              <Sparkles size={14} />
              <span>{data.brand.slogan}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              {data.hero.title} <br />
              <span className="text-primary-ocean relative">
                {data.hero.highlight}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.5 2.5 239.5 2.5 355 9" stroke="#0077b6" strokeWidth="6" strokeLinecap="round" opacity="0.2"/>
                </svg>
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              {data.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href={`https://wa.me/${data.contact.whatsapp}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-ocean text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-ocean/30 hover:scale-105 active:scale-95 transition-all group"
              >
                <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                {data.hero.primaryCta}
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                {data.hero.secondaryCta}
                <ArrowRight size={20} />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-8">
              {[
                { icon: ShieldCheck, text: "Garantili Temizlik" },
                { icon: Clock, text: "Hızlı Teslimat" },
                { icon: Sparkles, text: "Bitkisel Şampuanlar" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <item.icon size={18} className="text-turquoise" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:block hidden"
          >
            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl floating border-8 border-white">
               <Image 
                 src={data.hero.image} 
                 alt="Premium Halı Yıkama" 
                 fill 
                 sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                 className="object-cover"
                 priority
               />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 glass rounded-3xl z-20 flex flex-col items-center justify-center shadow-2xl border-white/50">
               <span className="text-3xl font-bold text-primary-ocean">4.9</span>
               <div className="flex text-yellow-400 gap-0.5 mt-1">
                 {[...Array(5)].map((_, i) => <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
               </div>
               <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Puan</span>
            </div>

            <div className="absolute -bottom-10 -left-10 w-48 glass p-4 rounded-3xl z-20 shadow-2xl flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                 <Clock size={24} />
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase">Aynı Gün</p>
                 <p className="text-sm font-bold text-slate-800">Ücretsiz Servis</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
