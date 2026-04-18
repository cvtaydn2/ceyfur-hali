"use client";

import React, { useState, useEffect } from "react";
import { Save, RefreshCcw, LayoutDashboard, Settings, FileText, LogOut, Info, Share2, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"general" | "about" | "contact" | "raw">("general");
  const router = useRouter();

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/content/get");
        const data = await res.json();
        if (data.success) setContent(data.content);
      } catch (e) {
        console.error("Failed to fetch content");
      }
    }
    fetchContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
      else setStatus("error");
    } catch (e) {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/auth/login");
  };

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <RefreshCcw className="animate-spin text-primary-ocean" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="glass p-4 rounded-3xl mb-6">
              <div className="flex items-center gap-3 text-primary-ocean">
                <LayoutDashboard size={20} />
                <span className="font-bold">Admin Panel</span>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === "general" ? "bg-primary-ocean text-white shadow-lg shadow-primary-ocean/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              <Settings size={18} />
              Genel Ayarlar
            </button>
            <button 
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === "about" ? "bg-primary-ocean text-white shadow-lg shadow-primary-ocean/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              <Info size={18} />
              Hakkımızda
            </button>
            <button 
              onClick={() => setActiveTab("contact")}
              className={`w-full flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === "contact" ? "bg-primary-ocean text-white shadow-lg shadow-primary-ocean/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              <Share2 size={18} />
              İletişim & Sosyal
            </button>
            <button 
              onClick={() => setActiveTab("raw")}
              className={`w-full flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === "raw" ? "bg-primary-ocean text-white shadow-lg shadow-primary-ocean/20" : "bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              <FileText size={18} />
              Ham Veri
            </button>

            <div className="pt-4 mt-4 border-t border-slate-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors"
              >
                <LogOut size={18} />
                Güvenli Çıkış
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="glass p-8 rounded-[2.5rem] border-white shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">
                    {activeTab === "general" && "Genel Ayarlar"}
                    {activeTab === "about" && "Hakkımızda Bölümü"}
                    {activeTab === "contact" && "İletişim Bilgileri"}
                    {activeTab === "raw" && "Gelişmiş Düzenleme"}
                  </h1>
                  <p className="text-slate-500">Site içeriğini güncelleyince tüm sayfalara yansır.</p>
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
                  İçerik başarıyla güncellendi!
                </motion.div>
              )}

              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Marka Adı</label>
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
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Açıklama (SEO)</label>
                      <textarea
                        rows={3}
                        value={content.seo.description}
                        onChange={(e) => setContent({...content, seo: {...content.seo, description: e.target.value}})}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Bölüm Başlığı</label>
                        <input
                          type="text"
                          value={content.about.title}
                          onChange={(e) => setContent({...content, about: {...content.about, title: e.target.value}})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Alt Başlık</label>
                        <input
                          type="text"
                          value={content.about.subtitle}
                          onChange={(e) => setContent({...content, about: {...content.about, subtitle: e.target.value}})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Hakkımızda İçeriği</label>
                      <textarea
                        rows={6}
                        value={content.about.content}
                        onChange={(e) => setContent({...content, about: {...content.about, content: e.target.value}})}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                        <input
                          type="text"
                          value={content.contact.phone}
                          onChange={(e) => setContent({...content, contact: {...content.contact, phone: e.target.value}})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp (Format: 905XXX...)</label>
                        <input
                          type="text"
                          value={content.contact.whatsapp}
                          onChange={(e) => setContent({...content, contact: {...content.contact, whatsapp: e.target.value}})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Instagram URL</label>
                        <input
                          type="text"
                          value={content.contact.instagram || ""}
                          onChange={(e) => setContent({...content, contact: {...content.contact, instagram: e.target.value}})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Facebook URL</label>
                        <input
                          type="text"
                          value={content.contact.facebook || ""}
                          onChange={(e) => setContent({...content, contact: {...content.contact, facebook: e.target.value}})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary-ocean outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "raw" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">JSON Ham Veri (Tam Kontrol)</label>
                    <textarea
                      rows={16}
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setContent(parsed);
                        } catch (err) {
                          // Ignore invalid JSON while typing
                        }
                      }}
                      className="w-full px-5 py-4 rounded-3xl bg-slate-900 text-turquoise font-mono text-sm border border-slate-800 outline-none transition-all resize-none shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
