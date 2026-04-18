"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Hero = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  if (!data?.hero) return null;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background blobs for Antigravity feeling */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-ocean/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-turquoise/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary-ocean animate-ping" />
              İstanbul Geneli Profesyonel Hizmet
            </motion.div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8">
              {data.hero.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-ocean to-turquoise">
                {data.hero.highlight}
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
              {data.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${data.contact.whatsapp}?text=${encodeURIComponent(data.hero.primaryCta + " için bilgi almak istiyorum.")}`}
                className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 hover:-translate-y-1 hover:shadow-slate-900/30 flex items-center justify-center gap-2 group"
              >
                {data.hero.primaryCta}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="px-10 py-5 bg-white border border-slate-100 text-slate-900 rounded-3xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                {data.hero.secondaryCta}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Levitation Motion wrapper */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary-ocean/20 to-turquoise/20 blur-2xl rounded-[3rem] -z-10 opacity-50 transition-opacity" />
              <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={data.hero.image}
                  alt="Premium Halı Yıkama"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating review card */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-2xl border-white max-w-[200px]"
              >
                <div className="flex gap-1 mb-2">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-900 mb-1">"Halılarım resmen yeni gibi oldu, teşekkürler!"</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase">Ayşe Y. • Beylikdüzü</p>
              </motion.div>

              {/* Trust badge */}
              <motion.div 
                 animate={{ y: [0, -8, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-2xl border border-slate-50"
              >
                <div className="w-full h-full rounded-full border-2 border-dashed border-primary-ocean flex items-center justify-center text-[10px] font-black text-primary-ocean leading-none text-center">
                  100%<br/>HİJYEN
                </div>
              </motion.div>
            </motion.div>

            {/* Background geometric shapes */}
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
