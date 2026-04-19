"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FallbackBannerProps {
  isVisible: boolean;
  reason?: string;
  onRefresh: () => void;
}

/**
 * Admin panelinde fallback veri kullanıldığında gösterilen uyarı banner'ı.
 * Kullanıcıya canlı verinin okunamadığını açıkça bildirir.
 */
export const FallbackBanner = ({ isVisible, reason, onRefresh }: FallbackBannerProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="mx-4 mt-4 lg:mx-0 lg:mt-0 lg:mb-4"
      >
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
          <AlertTriangle
            size={18}
            className="text-amber-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">
              Canlı veri okunamadı — yedek veri gösteriliyor
            </p>
            {reason && (
              <p className="text-xs text-amber-600 mt-0.5 font-medium truncate">
                Sebep: {reason}
              </p>
            )}
            <p className="text-xs text-amber-600 mt-1">
              Yaptığınız değişiklikler kaydedilirse canlı veriye geçilir.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold transition-colors shrink-0"
            aria-label="Canlı veriyi yeniden yükle"
          >
            <RefreshCw size={12} />
            Yenile
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
