"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, CheckCircle2 } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";
import { toGoogleDriveEmbedUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const ProcessSection = ({ content }: { content?: SiteContent }) => {
  const data = content ?? fallbackContent;
  const process = data.process;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!process || !process.steps || process.steps.length === 0) {
    return null;
  }

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="process" className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary-ocean/5 text-primary-ocean text-sm font-bold mb-4"
          >
            Süreç
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            {process.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-xl mx-auto"
          >
            {process.subtitle}
          </motion.p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 md:space-y-4">
          {process.steps.map((step, index) => {
            const isOpen = openIndex === index;
            const embedUrl = toGoogleDriveEmbedUrl(step.videoUrl || "");
            const hasVideo = !!embedUrl;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-300",
                  isOpen
                    ? "border-primary-ocean/30 bg-primary-ocean/5"
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                {/* Header - tıklanabilir */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left group"
                  aria-expanded={isOpen}
                >
                  {/* Step Number */}
                  <div
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-sm md:text-base font-black shrink-0 transition-colors",
                      isOpen
                        ? "bg-primary-ocean text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-primary-ocean/10 group-hover:text-primary-ocean"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "font-bold text-base md:text-lg transition-colors",
                        isOpen ? "text-primary-ocean" : "text-slate-900"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                      {step.description}
                    </p>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "p-2 rounded-xl shrink-0 transition-all duration-300",
                      isOpen
                        ? "bg-primary-ocean text-white rotate-180"
                        : "bg-slate-50 text-slate-300 group-hover:text-primary-ocean"
                    )}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Content - açık olduğunda göster */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
                        {/* Description */}
                        <div className="mb-4 pl-14 md:pl-16">
                          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Video */}
                        {hasVideo && (
                          <div className="pl-14 md:pl-16">
                            <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                              <iframe
                                src={embedUrl}
                                className="w-full aspect-video md:aspect-[16/9]"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                title={`${step.title} videosu`}
                              />
                            </div>
                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                              <Play size={10} />
                              Video izlemek için tıklayın
                            </p>
                          </div>
                        )}

                        {!hasVideo && (
                          <div className="pl-14 md:pl-16">
                            <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3 text-slate-400">
                              <Play size={16} />
                              <span className="text-sm">Video eklenmemiş</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Progress indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          {process.steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                openIndex === index
                  ? "w-8 bg-primary-ocean"
                  : openIndex === null
                  ? "w-4 bg-slate-200"
                  : index < (openIndex || 0)
                  ? "w-4 bg-primary-ocean/50"
                  : "w-4 bg-slate-200"
              )}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};