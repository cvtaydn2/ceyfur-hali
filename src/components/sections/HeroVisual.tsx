"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface HeroVisualProps {
  image: string;
}

export const HeroVisual = ({ image }: HeroVisualProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative"
    >
      {/* Levitation — will-change ile GPU katmanına taşı */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 will-change-transform"
      >
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary-ocean/20 to-turquoise/20 blur-2xl rounded-[3rem] -z-10 opacity-50" />

        <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
          <Image
            src={image}
            alt="Premium Halı Yıkama"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) calc(100vw - 2rem), 600px"
            className="object-cover"
          />
        </div>

        {/* Floating review card */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-4 -left-2 sm:-bottom-10 sm:-left-10 glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border-white max-w-[160px] sm:max-w-[200px] scale-90 sm:scale-100 origin-bottom-left z-20 will-change-transform"
        >
          <div className="flex gap-1 mb-1 sm:mb-2" aria-label="5 yıldız">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-900 mb-1">
            &ldquo;Halılarım resmen yeni gibi oldu, teşekkürler!&rdquo;
          </p>
          <p className="text-[8px] text-slate-400 font-bold uppercase">Ayşe Y. • Üsküdar</p>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-2 -right-2 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center p-1.5 sm:p-2 shadow-2xl border border-slate-50 z-20 scale-90 sm:scale-100 origin-top-right will-change-transform"
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full border-2 border-dashed border-primary-ocean flex items-center justify-center text-[10px] font-black text-primary-ocean leading-none text-center">
            100%<br />HİJYEN
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl opacity-50" aria-hidden="true" />
    </motion.div>
  );
};
