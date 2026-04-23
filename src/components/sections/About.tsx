"use client";

import { OptimizedImage } from "@/components/ui";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Clock, Award } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

const iconMap = [ShieldCheck, Clock, Award, CheckCircle2];

export const About = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;
  const aboutData = data?.about;

  if (!aboutData) return null;

  return (
    <section id="about" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary-ocean/5 text-primary-ocean text-sm font-bold mb-6">
              Hakkımızda
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {aboutData.title}
            </h2>
            <p className="text-lg font-semibold text-primary-ocean mb-8">
              {aboutData.subtitle}
            </p>
            <div className="prose prose-slate max-w-none text-slate-600 mb-10 leading-relaxed">
              {aboutData.content}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {aboutData.features.map((feature, index) => {
                const Icon = iconMap[index % iconMap.length];
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-ocean/5 flex items-center justify-center text-primary-ocean shrink-0">
                      <Icon size={20} />
                    </div>
                    <span className="text-slate-700 font-medium pt-2">{feature}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, '')}?text=Hizmetleriniz hakkında görüşmek istiyorum.`}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-primary-ocean transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary-ocean/20 flex items-center justify-center gap-2"
              >
                Hemen İletişime Geçin
              </a>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5] lg:aspect-auto lg:min-h-[480px] max-h-[600px]">
              <OptimizedImage
                src={aboutData.image || "/images/about-image.png"}
                alt="Ceyfur Halı Yıkama Tesisleri"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              {/* Experience Badge */}
              <div className="absolute bottom-10 left-10 glass p-6 rounded-3xl shadow-xl">
                <div className="text-4xl font-black text-primary-ocean mb-1">25+</div>
                <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Yıllık Tecrübe</div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-ocean/5 rounded-full -z-0 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-turquoise/5 rounded-full -z-0 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
