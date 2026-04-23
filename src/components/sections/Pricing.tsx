"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Phone, Search, ChevronDown } from "lucide-react";
import { SiteContent, PriceItem } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

function formatPrice(price: number): string {
  return price.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const Pricing = ({ content }: { content?: SiteContent }) => {
  const data = content ?? fallbackContent;
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  if (!data?.pricing) return null;

  const { pricing } = data;

  const filtered = pricing.items.filter((item) =>
    item.type.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))
  );

  const INITIAL_VISIBLE = 10;
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hasMore = filtered.length > INITIAL_VISIBLE && !showAll;

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Dekoratif arka plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-ocean/3 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-turquoise/3 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">

        {/* Başlık */}
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-ocean/5 text-primary-ocean text-sm font-bold mb-4"
          >
            <Tag size={14} />
            Şeffaf Fiyatlandırma
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            {pricing.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-xl mx-auto"
          >
            {pricing.subtitle}
          </motion.p>
        </div>

        {/* Arama */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="relative mb-6 max-w-sm mx-auto"
        >
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Halı tipi ara..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowAll(true); // Arama yapılınca tümünü göster
            }}
            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-700 text-sm shadow-sm"
          />
        </motion.div>

        {/* Fiyat Tablosu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/30 bg-white"
        >
          {/* Tablo başlığı */}
          <div className="grid grid-cols-3 bg-slate-900 px-6 py-4 md:px-10 md:py-5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Halı / Ürün Tipi
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
              Birim
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
              Fiyat (₺)
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-50">
            {visible.map((item: PriceItem) => (
              <div
                key={item.id}
                className="grid grid-cols-3 items-center px-6 py-4 md:px-10 md:py-5 hover:bg-primary-ocean/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-ocean/30 group-hover:bg-primary-ocean transition-colors shrink-0" />
                  <span className="font-bold text-slate-800 text-sm md:text-base">
                    {item.type}
                  </span>
                </div>
                <span className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {item.unit ?? "—"}
                </span>
                <div className="text-right">
                  <span className="font-black text-primary-ocean text-base md:text-lg tabular-nums">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-slate-400 text-xs font-bold ml-1">₺</span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-slate-300 font-bold italic">
                &ldquo;{search}&rdquo; için sonuç bulunamadı.
              </div>
            )}
          </div>

          {/* Daha fazla göster */}
          {hasMore && (
            <div className="px-6 py-5 md:px-10 border-t border-slate-50 flex justify-center">
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center gap-2 text-sm font-bold text-primary-ocean hover:text-slate-900 transition-colors"
              >
                Tüm {filtered.length} fiyatı göster
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Not */}
        {pricing.note && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-5 text-center text-xs text-slate-400 font-medium italic px-4"
          >
            * {pricing.note}
          </motion.p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#teklif-al"
            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-primary-ocean transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary-ocean/20 text-center"
          >
            Ücretsiz Teklif Al
          </a>
          <a
            href={`tel:${data.contact.phone[0]?.replace(/\s/g, "")}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Phone size={16} className="text-primary-ocean" />
            {data.contact.phone[0]}
          </a>
        </motion.div>
      </div>
    </section>
  );
};
