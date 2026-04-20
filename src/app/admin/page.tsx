"use client";

import React from "react";
import { useSiteContent } from "@/hooks/use-site-content";
import { AdminDashboard } from "./AdminDashboard";
import { Loader2 } from "lucide-react";
import { SiteContent } from "@/types";
import { ContentSection } from "@/lib/constants";

/**
 * Admin Page Entry Point
 *
 * Veri yükleme, fallback durumu ve section-based save koordinasyonu burada yapılır.
 */
export default function AdminPage() {
  const {
    content,
    isLoading,
    error: fetchError,
    isFromFallback,
    fallbackReason,
    updatedAt,
    saveSection,
    refresh,
  } = useSiteContent();

  const isUnauthorized = fetchError?.includes("Oturum süresi dolmuş") || fetchError?.includes("Yetkisiz erişim");

  React.useEffect(() => {
    if (isUnauthorized) {
      const timer = setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isUnauthorized]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-6">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-[2rem] animate-pulse" />
          <Loader2
            className="w-full h-full text-slate-900 animate-spin"
            size={64}
            strokeWidth={1}
          />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">
            Ceyfur Admin
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
            Panel Verileri Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError || !content) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-6 border border-rose-100">
          <span className="text-3xl font-black">{isUnauthorized ? "?" : "!"}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">
          {isUnauthorized ? "Oturum Hatası" : "Bağlantı Hatası"}
        </h2>
        <p className="text-slate-400 font-medium max-w-sm mt-2 italic px-8">
          {fetchError ?? "Veritabanı ile bağlantı kurulamadı."}
          {isUnauthorized && (
            <span className="block mt-2 text-xs font-bold text-slate-300 uppercase tracking-widest not-italic">
              3 saniye içinde giriş sayfasına yönlendiriliyorsunuz...
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {isUnauthorized ? (
            <button
              onClick={() => window.location.href = "/auth/login"}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              Tekrar Giriş Yap
            </button>
          ) : (
            <>
              <button
                onClick={() => window.location.reload()}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-slate-200"
              >
                Paneli Yenile
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-10 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
              >
                Ana Sayfaya Dön
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const handleSaveSection = async (
    section: ContentSection,
    data: SiteContent[ContentSection]
  ) => {
    try {
      const result = await saveSection(section, data);
      if (!result.success && (result.message?.includes("Oturum süresi dolmuş") || result.message?.includes("Yetkisiz erişim"))) {
        window.location.href = "/auth/login";
      }
      return result;
    } catch {
      return { success: false, message: "Ağ hatası oluştu." };
    }
  };

  return (
    <AdminDashboard
      initialContent={content}
      isFromFallback={isFromFallback}
      fallbackReason={fallbackReason}
      updatedAt={updatedAt}
      onSaveSection={handleSaveSection}
      onRefresh={refresh}
    />
  );
}
