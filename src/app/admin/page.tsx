"use client";

import React from "react";
import { useSiteContent } from "@/hooks/use-site-content";
import { AdminDashboard } from "./AdminDashboard";
import { Loader2 } from "lucide-react";

/**
 * Admin Page Entry Point
 * 
 * This page serves as the high-level coordinator for the Admin Dashboard.
 * It handles the initial data fetching and provides the central save logic.
 */
export default function AdminPage() {
  const { 
    content, 
    isLoading, 
    save, 
    error: fetchError 
  } = useSiteContent();

  // Show a premium loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-6">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-[2rem] animate-pulse" />
          <Loader2 className="w-full h-full text-slate-900 animate-spin transition-all" size={64} strokeWidth={1} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">Ceyfur Admin</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Panel Verileri Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Handle configuration error
  if (fetchError || !content) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-6 border border-rose-100">
           <span className="text-3xl font-black">!</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">Bağlantı Hatası</h2>
        <p className="text-slate-400 font-medium max-w-sm mt-2 italic px-8">
          Veritabanı ile bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-slate-200"
        >
          Paneli Yenile
        </button>
      </div>
    );
  }

  /**
   * Safe Save Action
   * Wraps the save logic to match the Dashboard's expected signature
   */
  const handleSaveContent = async (updatedData: any) => {
    try {
      const result = await save(updatedData);
      return { 
        success: (result as any).success, 
        message: (result as any).message 
      };
    } catch (err) {
      return { success: false, message: "Ağ hatası oluştu." };
    }
  };

  return (
    <AdminDashboard 
      initialContent={content} 
      onSaveContent={handleSaveContent} 
    />
  );
}
