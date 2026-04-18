"use client";

import React, { useState } from "react";
import { siteContent as initialContent } from "@/data/siteContent";
import { Save, RefreshCcw, LayoutDashboard, Settings, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (e) {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="glass p-4 rounded-3xl mb-6">
              <div className="flex items-center gap-3 text-primary-ocean">
                <LayoutDashboard size={20} />
                <span className="font-bold">Panel</span>
              </div>
            </div>
            
            <button className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary-ocean text-white font-bold shadow-lg shadow-primary-ocean/20">
              <Settings size={18} />
              Genel Ayarlar
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-slate-600 font-bold hover:bg-slate-100 transition-colors">
              <FileText size={18} />
              İçerik Editörü
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="glass p-8 rounded-[2.5rem] border-white shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">İçerik Yönetimi</h1>
                  <p className="text-slate-500">Tüm site içeriklerini buradan güncelleyebilirsiniz.</p>
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>

              {status === "success" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 text-green-700 rounded-2xl font-medium mb-6 border border-green-100">
                  İçerik başarıyla güncellendi! Lütfen sayfayı yenileyiniz.
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Site Başlığı</label>
                    <input
                      type="text"
                      value={content.brand.name}
                      onChange={(e) => setContent({...content, brand: {...content.brand, name: e.target.value}})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Slogan</label>
                    <input
                      type="text"
                      value={content.brand.slogan}
                      onChange={(e) => setContent({...content, brand: {...content.brand, slogan: e.target.value}})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Hero Açıklama</label>
                  <textarea
                    rows={4}
                    value={content.hero.description}
                    onChange={(e) => setContent({...content, hero: {...content.hero, description: e.target.value}})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium resize-none"
                  />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">JSON Ham Veri (Gelişmiş)</h3>
                  <textarea
                    rows={12}
                    value={JSON.stringify(content, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setContent(parsed);
                      } catch (err) {
                        // Ignore invalid JSON while typing
                      }
                    }}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900 text-turquoise font-mono text-sm border border-slate-800 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
