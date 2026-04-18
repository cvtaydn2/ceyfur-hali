"use client";

import React, { useState } from "react";
import { 
  Save, LayoutDashboard, Settings, FileText, LogOut, Info, Share2, 
  Tag, Briefcase, ChevronRight, AlertCircle, CheckCircle2, 
  Plus, Trash2, PhoneCall, TrendingUp, Users, ShoppingBag, DollarSign,
  Clock as ClockIcon, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Global Best Practices: Modular UI Components
import { Button, Input, Toast } from "@/components/ui";
// Global Best Practices: Custom Hooks for Data Logic
import { useSiteContent } from "@/hooks/use-site-content";

export default function AdminPage() {
  const { content, setContent, isLoading, isSaving, save, error: fetchError } = useSiteContent();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ show: boolean, message: string, type?: "success" | "error" }>({ 
    show: false, message: "" 
  });
  const [activeTab, setActiveTab] = useState<"dashboard" | "general" | "services" | "campaigns" | "about" | "contact" | "raw">("dashboard");
  const router = useRouter();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSave = async () => {
    const result: any = await save(content!);
    if (result.success) {
      showToast("Tüm değişiklikler başarıyla buluta işlendi.");
    } else {
      showToast(result.message || "Bir hata oluştu.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      router.push("/auth/login");
    }
  };

  // List Management Helpers
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
      ...content!, 
      campaigns: {
        ...content!.campaigns, 
        items: [...content!.campaigns.items, newItem]
      }
    });
  };

  const removeCampaign = (id: string) => {
    setContent({
      ...content!, 
      campaigns: {
        ...content!.campaigns, 
        items: content!.campaigns.items.filter((item: any) => item.id !== id)
      }
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-bold tracking-tight">Sistem Yükleniyor...</p>
      </div>
    </div>
  );

  if (!content) return <div>Hata oluştu: {fetchError}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-3">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-ocean/10 rounded-xl flex items-center justify-center text-primary-ocean">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <span className="font-black block leading-none">Ceyfur Admin</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Panel v2.1</span>
              </div>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black transition-all duration-300 ${
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
              <Button variant="danger" className="w-full" onClick={handleLogout} leftIcon={<LogOut size={18} />}>
                Güvenli Çıkış
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[700px] flex flex-col">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">{activeTab}</h1>
                  <p className="text-slate-500 mt-1 font-medium italic">Seçili bölümün ayarlarını buradan yönetin.</p>
                </div>
                
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={handleSave} 
                  isLoading={isSaving}
                  leftIcon={<Save size={20} />}
                >
                  Değişiklikleri Kaydet
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-emerald-50 text-emerald-700 rounded-3xl font-bold mb-8 border border-emerald-100 flex items-center gap-3">
                    <CheckCircle2 size={20} /> İçerik başarıyla güncellendi!
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-50 text-rose-700 rounded-3xl font-bold mb-8 border border-rose-100 flex items-center gap-3">
                    <AlertCircle size={20} /> {toast.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1">
                {activeTab === "dashboard" && (
                  <div className="space-y-10">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: "Toplam Randevu", value: "124", trend: "+12%", icon: ShoppingBag, color: "text-primary-ocean" },
                        { label: "Aylık Gelir", value: "₺42.500", trend: "+8.5%", icon: DollarSign, color: "text-emerald-500" },
                        { label: "Yeni Müşteriler", value: "32", trend: "+24%", icon: Users, color: "text-turquoise" },
                        { label: "Kampanya Etkisi", value: "%18", trend: "+2.1%", icon: TrendingUp, color: "text-amber-500" },
                      ].map((stat, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white transition-all group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform", stat.color)}>
                              <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                          <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart & Recent Activity */}
                    <div className="grid lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-slate-900">Haftalık Performans</h3>
                          <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-ocean"/> Tamamlanan</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200"/> Bekleyen</span>
                          </div>
                        </div>
                        <div className="h-64 w-full bg-slate-50/30 rounded-[2.5rem] border border-slate-100 flex items-end gap-3 p-8">
                          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <motion.div 
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="flex-1 bg-gradient-to-t from-primary-ocean to-turquoise rounded-t-xl group relative"
                            >
                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                ₺{(h * 100).toLocaleString('tr-TR')}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-900">Son Aktiviteler</h3>
                        <div className="space-y-4">
                          {[
                            { title: "Yeni Randevu", time: "2 dk önce", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
                            { title: "Kampanya Güncellendi", time: "1 saat önce", icon: Activity, color: "bg-blue-50 text-blue-600" },
                            { title: "Stok Uyarısı", time: "3 saat önce", icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
                          ].map((activity, i) => (
                            <div key={i} className="flex gap-4 items-center">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activity.color)}>
                                <activity.icon size={18} />
                              </div>
                              <div className="flex-1 border-b border-slate-50 pb-2">
                                <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">Tümünü Gör</Button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "general" && (
                  <div className="grid gap-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <Input 
                        label="Marka Adı" 
                        value={content.brand.name} 
                        onChange={(e) => setContent({...content, brand: {...content.brand, name: e.target.value}})} 
                      />
                      <Input 
                        label="Slogan" 
                        value={content.brand.slogan} 
                        onChange={(e) => setContent({...content, brand: {...content.brand, slogan: e.target.value}})} 
                      />
                    </div>
                    <Input 
                      label="SEO Başlığı" 
                      value={content.seo.title} 
                      onChange={(e) => setContent({...content, seo: {...content.seo, title: e.target.value}})} 
                    />
                  </div>
                )}
                {activeTab === "services" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {content.services.items.map((service, index) => (
                        <div key={service.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 space-y-4">
                          <label className="text-[10px] font-black text-primary-ocean uppercase tracking-tighter bg-primary-ocean/10 px-3 py-1 rounded-full w-fit">Hizmet #{index + 1}</label>
                          <Input 
                            value={service.title} 
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[index].title = e.target.value;
                              setContent({...content, services: {...content.services, items: newItems}});
                            }}
                            label="Hizmet Adı"
                          />
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama</label>
                            <textarea 
                              value={service.description} 
                              onChange={(e) => {
                                const newItems = [...content.services.items];
                                newItems[index].description = e.target.value;
                                setContent({...content, services: {...content.services, items: newItems}});
                              }}
                              className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none text-sm font-medium resize-none focus:border-primary-ocean transition-all"
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <Input 
                        label="Bölüm Başlığı" 
                        value={content.about.title} 
                        onChange={(e) => setContent({...content, about: {...content.about, title: e.target.value}})} 
                      />
                      <Input 
                        label="Alt Başlık" 
                        value={content.about.subtitle} 
                        onChange={(e) => setContent({...content, about: {...content.about, subtitle: e.target.value}})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">İçerik</label>
                      <textarea
                        rows={10}
                        value={content.about.content}
                        onChange={(e) => setContent({...content, about: {...content.about, content: e.target.value}})}
                        className="w-full px-6 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 leading-relaxed resize-none transition-all focus:bg-white focus:border-primary-ocean shadow-inner"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "campaigns" && (
                  <div className="space-y-8">
                    <div className="flex justify-end">
                      <Button onClick={addCampaign} leftIcon={<Plus size={18} />}>Yeni Kampanya Ekle</Button>
                    </div>
                    {content.campaigns.items.map((campaign, index) => (
                      <div key={campaign.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 relative">
                        <Button 
                          variant="ghost" 
                          className="absolute top-4 right-4 text-rose-500 hover:text-rose-600" 
                          onClick={() => removeCampaign(campaign.id)}
                        >
                          <Trash2 size={20} />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-6">
                           <Input 
                            label="Etiket" 
                            value={campaign.badge} 
                            onChange={(e) => {
                              const items = [...content.campaigns.items];
                              items[index].badge = e.target.value;
                              setContent({...content, campaigns: {...content.campaigns, items}});
                            }}
                          />
                          <Input 
                            label="Başlık" 
                            value={campaign.title} 
                            onChange={(e) => {
                              const items = [...content.campaigns.items];
                              items[index].title = e.target.value;
                              setContent({...content, campaigns: {...content.campaigns, items}});
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="grid gap-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-800">Telefon Numaraları</label>
                        {content.contact.phone.map((num, idx) => (
                          <div key={idx} className="flex gap-2">
                             <Input 
                              value={num} 
                              onChange={(e) => {
                                const phones = [...content.contact.phone];
                                phones[idx] = e.target.value;
                                setContent({...content, contact: {...content.contact, phone: phones}});
                              }} 
                              placeholder="0212..."
                            />
                            {content.contact.phone.length > 1 && (
                              <Button variant="danger" size="sm" onClick={() => {
                                const phones = content.contact.phone.filter((_, i) => i !== idx);
                                setContent({...content, contact: {...content.contact, phone: phones}});
                              }}>
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => {
                          setContent({...content, contact: {...content.contact, phone: [...content.contact.phone, ""]}});
                        }}>+ Numara Ekle</Button>
                      </div>
                      <Input 
                        label="WhatsApp" 
                        value={content.contact.whatsapp} 
                        onChange={(e) => setContent({...content, contact: {...content.contact, whatsapp: e.target.value}})} 
                      />
                    </div>
                  </div>
                )}

                {activeTab === "raw" && (
                  <div className="h-full">
                    <textarea
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          setContent(JSON.parse(e.target.value));
                        } catch (err) {}
                      }}
                      className="w-full h-[600px] p-8 rounded-[2.5rem] bg-slate-900 text-turquoise font-mono text-sm border-none outline-none shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />
    </div>
  );
}
