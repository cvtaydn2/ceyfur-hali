"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FallbackBannerProps {
  isVisible: boolean;
  reason?: string;
  updatedAt?: string;
  onRefresh: () => void;
}

/**
 * Admin panelinde fallback veri kullanıldığında gösterilen uyarı banner'ı.
 * Kullanıcıya canlı verinin okunamadığını açıkça bildirir.
 */
export const FallbackBanner = ({ isVisible, reason, updatedAt, onRefresh }: FallbackBannerProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="mx-4 mt-4 lg:mx-0 lg:mt-0 lg:mb-4"
      >
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm shadow-amber-100/50">
          <AlertTriangle
            size={18}
            className="text-amber-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">
              Canlı veri okunamadı — yedek veri gösteriliyor
            </p>
            <div className="mt-1 space-y-1">
              {reason && (
                <p className="text-[11px] text-amber-600 font-bold leading-tight">
                  <span className="opacity-60">Sebep:</span> {reason}
                </p>
              )}
              {updatedAt && (
                <p className="text-[11px] text-amber-600 font-bold leading-tight">
                  <span className="opacity-60">Son başarılı okuma:</span>{" "}
                  {new Date(updatedAt).toLocaleString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
            <p className="text-[11px] text-amber-500 mt-2 font-bold italic opacity-80">
              * Yaptığınız değişiklikler kaydedilirse canlı veriye geçilir.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-black transition-all hover:scale-105 active:scale-95 shrink-0"
            aria-label="Canlı veriyi yeniden yükle"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            Yenile
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
