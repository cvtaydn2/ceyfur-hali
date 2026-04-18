"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, RefreshCcw, LayoutDashboard, Settings, FileText, 
  LogOut, Info, Share2, PhoneCall, Plus, Trash2, 
  Tag, Briefcase, ChevronRight, AlertCircle, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "services" | "campaigns" | "about" | "contact" | "raw">("general");
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
    setErrorMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Doğrulama hatası oluştu.");
      }
    } catch (e) {
      setStatus("error");
      setErrorMessage("Sunucu ile iletişim kurulamadı.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/auth/login");
  };

  const addPhone = () => {
    const phones = [...content.contact.phone, ""];
    setContent({...content, contact: {...content.contact, phone: phones}});
  };

  const removePhone = (index: number) => {
    if (content.contact.phone.length <= 1) return;
    const phones = content.contact.phone.filter((_: any, i: number) => i !== index);
    setContent({...content, contact: {...content.contact, phone: phones}});
  };

  const updatePhone = (index: number, value: string) => {
    const phones = [...content.contact.phone];
    phones[index] = value;
    setContent({...content, contact: {...content.contact, phone: phones}});
  };

  const addCampaign = () => {
    const newItem = {
      id: `c${Date.now()}`,
      badge: "Yeni",
      title: "Yeni Kampanya",
      ctaLabel: "Teklif Al",
      features: ["Özellik 1"],
      priceNote: "İndirim Oranı",
      description: "Kampanya açıklaması"
    };
    setContent({
      ...content, 
      campaigns: {
        ...content.campaigns, 
        items: [...content.campaigns.items, newItem]
      }
    });
  };

  const removeCampaign = (id: string) => {
    setContent({
      ...content, 
      campaigns: {
        ...content.campaigns, 
        items: content.campaigns.items.filter((item: any) => item.id !== id)
      }
    });
  };

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <RefreshCcw className="animate-spin text-primary-ocean mx-auto mb-4" size={48} />
        <p className="text-slate-500 font-medium">İçerik Yükleniyor...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Enhanced Sidebar */}
          <aside className="w-full lg:w-72 space-y-3">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center gap-4 text-slate-900 mb-2">
                <div className="w-10 h-10 bg-primary-ocean/10 rounded-xl flex items-center justify-center text-primary-ocean">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <span className="font-black block leading-none">Ceyfur Admin</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Panel v2.0</span>
                </div>
              </div>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: "general", label: "Genel Ayarlar", icon: Settings },
                { id: "services", label: "Hizmetler", icon: Briefcase },
                { id: "campaigns", label: "Kampanyalar", icon: Tag },
                { id: "about", label: "Hakkımızda", icon: Info },
                { id: "contact", label: "İletişim & Sosyal", icon: Share2 },
                { id: "raw", label: "Gelişmiş JSON", icon: FileText },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon size={18} />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors border border-rose-100"
              >
                <LogOut size={18} />
                Güvenli Çıkış
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[700px] flex flex-col">
              
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {activeTab === "general" && "Dashboard"}
                    {activeTab === "services" && "Hizmet Yönetimi"}
                    {activeTab === "campaigns" && "Kampanya Yönetimi"}
                    {activeTab === "about" && "Hakkımızda"}
                    {activeTab === "contact" && "İletişim Bilgileri"}
                    {activeTab === "raw" && "Ham Veri Editörü"}
                  </h1>
                  <p className="text-slate-500 mt-1 font-medium italic">
                    {activeTab === "general" && "Sitenin kimlik ve SEO ayarlarını buradan yönetin."}
                    {activeTab === "services" && "Hizmet kartlarını ekleyin, silin veya düzenleyin."}
                    {activeTab === "campaigns" && "Aktif fırsatları ve kampanya paketlerini yönetin."}
                    {activeTab === "about" && "Şirket hikayenizi ve temel özelliklerinizi düzenleyin."}
                    {activeTab === "contact" && "Telefon, adres ve sosyal medya linklerini güncelleyin."}
                    {activeTab === "raw" && "Tüm site verisine JSON formatında doğrudan müdahale edin."}
                  </p>
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-primary-ocean text-white rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-primary-ocean/25"
                >
                  {isSaving ? <RefreshCcw size={20} className="animate-spin" /> : <Save size={20} />}
                  {isSaving ? "Kaydediliyor..." : "Yayına Al"}
                </button>
              </div>

              {/* Status Messages */}
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 bg-emerald-50 text-emerald-700 rounded-3xl font-bold mb-8 border border-emerald-100 flex items-center gap-3"
                  >
                    <CheckCircle2 size={20} />
                    Değişiklikler başarıyla kaydedildi ve yayına alındı!
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 bg-rose-50 text-rose-700 rounded-3xl font-bold mb-8 border border-rose-100 flex items-center gap-3"
                  >
                    <AlertCircle size={20} />
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="grid gap-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800 ml-1">Marka Adı</label>
                        <input
                          type="text"
                          value={content.brand.name}
                          onChange={(e) => setContent({...content, brand: {...content.brand, name: e.target.value}})}
                          className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 outline-none transition-all font-bold text-slate-900"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800 ml-1">Slogan</label>
                        <input
                          type="text"
                          value={content.brand.slogan}
                          onChange={(e) => setContent({...content, brand: {...content.brand, slogan: e.target.value}})}
                          className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 outline-none transition-all font-bold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-800 ml-1">SEO Başlığı (Pencere Başlığı)</label>
                      <input
                        type="text"
                        value={content.seo.title}
                        onChange={(e) => setContent({...content, seo: {...content.seo, title: e.target.value}})}
                        className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-800 ml-1">Anahtar Kelimeler (Virgül ile ayırın)</label>
                      <input
                        type="text"
                        value={content.seo.keywords.join(", ")}
                        onChange={(e) => setContent({...content, seo: {...content.seo, keywords: e.target.value.split(",").map(k => k.trim())}})}
                        className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-800 ml-1">Hero Başlık</label>
                      <input
                        type="text"
                        value={content.hero.title}
                        onChange={(e) => setContent({...content, hero: {...content.hero, title: e.target.value}})}
                        className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* Services Management */}
                {activeTab === "services" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {content.services.items.map((service: any, index: number) => (
                        <div key={service.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-primary-ocean uppercase tracking-tighter bg-primary-ocean/10 px-3 py-1 rounded-full">Hizmet #{index + 1}</span>
                          </div>
                          <input 
                            value={service.title} 
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[index].title = e.target.value;
                              setContent({...content, services: {...content.services, items: newItems}});
                            }}
                            placeholder="Hizmet Adı"
                            className="w-full p-2 bg-transparent border-b border-slate-200 focus:border-primary-ocean outline-none font-bold"
                          />
                          <textarea 
                            value={service.description} 
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[index].description = e.target.value;
                              setContent({...content, services: {...content.services, items: newItems}});
                            }}
                            placeholder="Açıklama"
                            className="w-full p-2 bg-transparent border-b border-slate-200 focus:border-primary-ocean outline-none text-sm resize-none"
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 italic font-medium">* Hizmet ekleme/çıkarma için lütfen Ham Veri editörünü kullanın veya bu bölümü genişletmemi isteyin.</p>
                  </div>
                )}

                {/* Campaigns Management */}
                {activeTab === "campaigns" && (
                  <div className="space-y-8">
                    <div className="flex justify-end mb-4">
                      <button 
                        onClick={addCampaign}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all"
                      >
                        <Plus size={18} />
                        Yeni Kampanya Ekle
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {content.campaigns.items.map((campaign: any, index: number) => (
                        <div key={campaign.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 relative group">
                          <button 
                            onClick={() => removeCampaign(campaign.id)}
                            className="absolute top-6 right-6 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                          
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Kampanya Bilgileri</label>
                              <div className="grid grid-cols-2 gap-4">
                                <input 
                                  value={campaign.badge} 
                                  onChange={(e) => {
                                    const newItems = [...content.campaigns.items];
                                    newItems[index].badge = e.target.value;
                                    setContent({...content, campaigns: {...content.campaigns, items: newItems}});
                                  }}
                                  placeholder="Etiket (örn: Popüler)"
                                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold"
                                />
                                <input 
                                  value={campaign.ctaLabel} 
                                  onChange={(e) => {
                                    const newItems = [...content.campaigns.items];
                                    newItems[index].ctaLabel = e.target.value;
                                    setContent({...content, campaigns: {...content.campaigns, items: newItems}});
                                  }}
                                  placeholder="Buton Yazısı"
                                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold"
                                />
                              </div>
                              <input 
                                value={campaign.title} 
                                onChange={(e) => {
                                  const newItems = [...content.campaigns.items];
                                  newItems[index].title = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items: newItems}});
                                }}
                                placeholder="Kampanya Başlığı"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none text-lg font-black"
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Detaylar & Notlar</label>
                              <input 
                                value={campaign.priceNote} 
                                onChange={(e) => {
                                  const newItems = [...content.campaigns.items];
                                  newItems[index].priceNote = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items: newItems}});
                                }}
                                placeholder="İndirim/Fiyat Notu"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold text-primary-ocean"
                              />
                              <textarea 
                                value={campaign.description} 
                                onChange={(e) => {
                                  const newItems = [...content.campaigns.items];
                                  newItems[index].description = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items: newItems}});
                                }}
                                placeholder="Kampanya Açıklaması"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none text-sm font-medium resize-none"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Management */}
                {activeTab === "about" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800 ml-1">Bölüm Başlığı</label>
                        <input
                          type="text"
                          value={content.about.title}
                          onChange={(e) => setContent({...content, about: {...content.about, title: e.target.value}})}
                          className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean outline-none transition-all font-bold text-slate-900"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800 ml-1">Alt Başlık</label>
                        <input
                          type="text"
                          value={content.about.subtitle}
                          onChange={(e) => setContent({...content, about: {...content.about, subtitle: e.target.value}})}
                          className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean outline-none transition-all font-bold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-800 ml-1">Hikayemiz / İçerik</label>
                      <textarea
                        rows={10}
                        value={content.about.content}
                        onChange={(e) => setContent({...content, about: {...content.about, content: e.target.value}})}
                        className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean outline-none transition-all font-medium text-slate-600 leading-relaxed resize-none shadow-inner"
                      />
                    </div>
                  </div>
                )}

                {/* Contact & Social Management */}
                {activeTab === "contact" && (
                  <div className="grid gap-10">
                    <div className="grid md:grid-cols-2 gap-10">
                      {/* Phone Numbers */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-black text-slate-800">Sabit Telefonlar</label>
                          <button onClick={addPhone} className="text-primary-ocean hover:underline text-xs font-black flex items-center gap-1">
                            <Plus size={14} /> Ekle
                          </button>
                        </div>
                        <div className="space-y-3">
                          {content.contact.phone.map((num: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <div className="relative flex-1">
                                <PhoneCall size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                  type="text"
                                  value={num}
                                  onChange={(e) => updatePhone(idx, e.target.value)}
                                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean outline-none transition-all font-bold"
                                />
                              </div>
                              {content.contact.phone.length > 1 && (
                                <button onClick={() => removePhone(idx)} className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                  <Trash2 size={20} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-800">WhatsApp Hattı</label>
                        <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">W</div>
                          <input
                            type="text"
                            value={content.contact.whatsapp}
                            onChange={(e) => setContent({...content, contact: {...content.contact, whatsapp: e.target.value}})}
                            placeholder="905XXXXXXXXX"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary-ocean outline-none transition-all font-bold text-emerald-600"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold px-1 italic uppercase">Format: Ülke kodu ile (örn: 905321234567)</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800">Instagram URL</label>
                        <input
                          type="text"
                          value={content.contact.instagram || ""}
                          onChange={(e) => setContent({...content, contact: {...content.contact, instagram: e.target.value}})}
                          className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 outline-none font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-800">Facebook URL</label>
                        <input
                          type="text"
                          value={content.contact.facebook || ""}
                          onChange={(e) => setContent({...content, contact: {...content.contact, facebook: e.target.value}})}
                          className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw JSON Editor */}
                {activeTab === "raw" && (
                  <div className="h-full flex flex-col space-y-4">
                    <div className="flex-1 min-h-[500px] relative">
                      <textarea
                        value={JSON.stringify(content, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setContent(parsed);
                            setErrorMessage("");
                          } catch (err: any) {
                            setErrorMessage("JSON Formatı Geçersiz: " + err.message);
                          }
                        }}
                        className="w-full h-full px-6 py-6 rounded-[2.5rem] bg-slate-900 text-turquoise font-mono text-sm border border-slate-800 outline-none transition-all resize-none shadow-2xl leading-relaxed"
                      />
                      <div className="absolute top-4 right-6 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Developer Mode</div>
                    </div>
                    {errorMessage && (
                      <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-xs font-bold border border-rose-500/20">
                        {errorMessage}
                      </div>
                    )}
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
