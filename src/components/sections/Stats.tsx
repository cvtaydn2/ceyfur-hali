"use client";

import React from "react";
import { motion } from "framer-motion";
import { SiteContent, StatItem } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Stats = ({ content }: { content?: SiteContent }) => {
  const data = content ?? fallbackContent;

  return (
    <section className="py-20 px-4 bg-primary-ocean text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {data.stats.map((stat: StatItem, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-black mb-2 tabular-nums">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-blue-100/70 font-semibold uppercase tracking-widest text-[10px] md:text-xs">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
