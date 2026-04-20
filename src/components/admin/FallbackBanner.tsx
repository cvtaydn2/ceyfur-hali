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

export const FallbackBanner = ({ isVisible, reason, updatedAt, onRefresh }: FallbackBannerProps) => {
  const [showDetails, setShowDetails] = React.useState(false);

  // Teknik hatayı kullanıcı dostu mesajlara çevir
  const getFriendlyMessage = (raw?: string) => {
    if (!raw) return "Bağlantı sırasında beklenmedik bir durum oluştu.";
    if (raw.includes("slug")) return "Veri yapısı güncellendiği için eski kayıtlar otomatik modernize ediliyor.";
    if (raw.includes("JSON")) return "Veritabanındaki kayıt formatı uyumsuz görünüyor.";
    return "Sunucu ile iletişim kurulurken bir sorun yaşandı.";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mx-4 mt-4 lg:mx-0 lg:mt-0 lg:mb-6"
        >
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50/50" />
            <div className="relative flex flex-col gap-4 px-6 py-5 rounded-[2rem] border border-amber-100 shadow-xl shadow-amber-900/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-amber-100 shrink-0">
                    <AlertTriangle size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-amber-900 tracking-tight">
                      Güvenli Mod Aktif
                    </h5>
                    <p className="text-[11px] font-bold text-amber-700/70 mt-0.5 leading-relaxed">
                      {getFriendlyMessage(reason)} <br />
                      Sistem geçici olarak yedek verileri kullanıyor.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-sm hover:shadow-md"
                >
                  <RefreshCw size={12} />
                  Yenile
                </button>
              </div>

              <div className="pt-4 border-t border-amber-200/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {updatedAt && (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Son Güncelleme</span>
                      <span className="text-[10px] font-bold text-amber-600">
                        {new Date(updatedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[10px] font-black text-amber-400 hover:text-amber-600 uppercase tracking-widest underline underline-offset-4 decoration-amber-200"
                >
                  {showDetails ? "Kapat" : "Hata Detayı"}
                </button>
              </div>

              <AnimatePresence>
                {showDetails && reason && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-4 rounded-xl bg-amber-900/5 font-mono text-[10px] text-amber-900/60 break-all border border-amber-900/5">
                      {reason}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
